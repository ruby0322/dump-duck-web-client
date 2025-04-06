import { Document, DocumentsResponse, DocumentType, Label, User } from "@/types/document";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<DocumentsResponse>> {
  const { id } = await params;
  
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
      WHERE d.creator_id = ?
      GROUP BY d.id, d.title, d.description, d.type, d.favorite,
               d.created_at, d.updated_at, dc.content,
               df.storage_path, df.filename, df.file_type,
               u.id, u.username, u.email, u.display_name,
               u.created_at, u.updated_at
      ORDER BY d.created_at DESC
    `).bind(parseInt(id));
    
    const results = await stmt.all();
    
    if (!results.results || results.results.length === 0) {
      return NextResponse.json<DocumentsResponse>({ documents: [] });
    }
    
    const documents = results.results.map((doc): Document => ({
      id: doc.id as number,
      title: doc.title as string,
      description: doc.description as string,
      type: doc.type as DocumentType,
      favorite: doc.favorite as boolean,
      created_at: doc.created_at as string,
      updated_at: doc.updated_at as string,
      creator_id: doc.creator_id as number,
      content: doc.content as string,
      storage_path: doc.storage_path as string,
      filename: doc.filename as string,
      file_type: doc.file_type as string,
      labels: (doc.labels ? JSON.parse(doc.labels as string) : []) as Label[],
      creator: JSON.parse(doc.creator as string) as User
    })) as Document[];
    // console.log(documents);

    return NextResponse.json<DocumentsResponse>({
      documents: documents as Document[]
    });
    // return NextResponse.json<DocumentsResponse>({ documents: [] });
  } catch (e) {
    return NextResponse.json(
      { documents: [], error: (e as Error).message } as const, 
      { status: 200 }
    );
  }
}
