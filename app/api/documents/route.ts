import { Document, DocumentsResponse, Label, User } from "@/types/document";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";

export const runtime = 'edge'

export async function GET(): Promise<NextResponse<DocumentsResponse>> {
  
  try {
    const stmt = getRequestContext().env.DB.prepare(`
      SELECT 
        d.id,
        d.title,
        d.description,
        d.type,
        d.favorite,
        d.created_at,
        d.updated_at,
        d.creator_id,
        dc.content,
        df.storage_path,
        df.filename,
        df.file_type,
        JSON_OBJECT(
          'id', u.id,
          'username', u.username,
          'email', u.email,
          'display_name', u.display_name,
          'created_at', u.created_at,
          'updated_at', u.updated_at
        ) as creator,
        JSON_GROUP_ARRAY(
          JSON_OBJECT(
            'id', l.id,
            'name', l.name,
            'color', l.color
          )
        ) as labels
      FROM documents d
      LEFT JOIN document_contents dc ON d.id = dc.document_id
      LEFT JOIN document_files df ON d.id = df.document_id
      LEFT JOIN document_labels dl ON d.id = dl.document_id
      LEFT JOIN labels l ON dl.label_id = l.id
      LEFT JOIN users u ON d.creator_id = u.id
      GROUP BY d.id, d.title, d.description, d.type, d.favorite, 
               d.created_at, d.updated_at, dc.content,
               df.storage_path, df.filename, df.file_type,
               u.id, u.username, u.email, u.display_name, 
               u.created_at, u.updated_at
      ORDER BY d.created_at DESC
    `);
    
    const results = await stmt.all();
    
    if (!results.results || results.results.length === 0) {
      return NextResponse.json<DocumentsResponse>({ documents: [] });
    }

    const documents = results.results.map(doc => ({
      ...doc,
      labels: (doc.labels ? JSON.parse(doc.labels as string) : []) as Label[],
      creator: JSON.parse(doc.creator as string) as User
    }));

    return NextResponse.json<DocumentsResponse>({ 
      documents: documents as Document[] 
    });
  } catch {
    return NextResponse.json(
      { documents: [], error: 'Internal server error' } as const, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { 
      type, 
      title, 
      description, 
      content, 
      storage_path, 
      filename, 
      file_type,
      creator_id,
      labels = []  // 新增 labels 欄位，預設為空陣列
    }: { 
      type: string; 
      title: string; 
      description: string; 
      content?: string; 
      storage_path?: string; 
      filename?: string; 
      file_type?: string; 
      creator_id?: number;
      labels?: string[];
    } = await request.json();
    const db = getRequestContext().env.DB;
    
    // 插入基本文件資訊
    const insertDoc = db.prepare(`
      INSERT INTO documents (title, description, type, creator_id)
      VALUES (?, ?, ?, ?)
      RETURNING id
    `);
    
    const docResult = await insertDoc.bind(
      title,
      description,
      type,
      creator_id
    ).run();
    
    const documentId = docResult.results[0].id;
    
    // 處理標籤
    for (const labelName of labels) {
      // 檢查標籤是否存在
      const getLabelStmt = db.prepare(`
        SELECT id FROM labels 
        WHERE name = ? AND creator_id = ?
      `);
      
      const existingLabel = await getLabelStmt.bind(
        labelName,
        creator_id
      ).first();
      
      let labelId;
      
      if (existingLabel) {
        labelId = existingLabel.id;
      } else {
        // 建立新標籤
        const insertLabelStmt = db.prepare(`
          INSERT INTO labels (name, creator_id)
          VALUES (?, ?)
          RETURNING id
        `);
        
        const newLabel = await insertLabelStmt.bind(
          labelName,
          creator_id
        ).run();
        
        labelId = newLabel.results[0].id;
      }
      
      // 建立文件和標籤的關聯
      const insertDocLabelStmt = db.prepare(`
        INSERT INTO document_labels (document_id, label_id)
        VALUES (?, ?)
      `);
      
      await insertDocLabelStmt.bind(documentId, labelId).run();
    }

    // 根據類型插入對應內容
    if (type === 'text') {
      const insertContent = db.prepare(`
        INSERT INTO document_contents (document_id, content)
        VALUES (?, ?)
      `);
      await insertContent.bind(documentId, content).run();
    } else {
      const insertFile = db.prepare(`
        INSERT INTO document_files (document_id, storage_path, filename, file_type)
        VALUES (?, ?, ?, ?)
      `);
      await insertFile.bind(
        documentId,
        storage_path,
        filename,
        file_type
      ).run();
    }
    
    // 修改查詢以包含標籤資訊
    const getDoc = db.prepare(`
      SELECT 
        d.id,
        d.title,
        d.description,
        d.type,
        d.favorite,
        d.created_at,
        d.updated_at,
        d.creator_id,
        dc.content,
        df.storage_path,
        df.filename,
        df.file_type,
        JSON_OBJECT(
          'id', u.id,
          'username', u.username,
          'email', u.email,
          'display_name', u.display_name,
          'created_at', u.created_at,
          'updated_at', u.updated_at
        ) as creator,
        JSON_GROUP_ARRAY(
          JSON_OBJECT(
            'id', l.id,
            'name', l.name,
            'color', l.color
          )
        ) as labels
      FROM documents d
      LEFT JOIN document_contents dc ON d.id = dc.document_id
      LEFT JOIN document_files df ON d.id = df.document_id
      LEFT JOIN document_labels dl ON d.id = dl.document_id
      LEFT JOIN labels l ON dl.label_id = l.id
      LEFT JOIN users u ON d.creator_id = u.id
      WHERE d.id = ?
      GROUP BY d.id
    `);
    
    const result = await getDoc.bind(documentId).first();
    
    if (!result) {
      return NextResponse.json(
        { error: 'Failed to create document' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      document: {
        ...result,
        labels: JSON.parse(result.labels as string),
        creator: JSON.parse(result.creator as string)
      }
    });
    
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
