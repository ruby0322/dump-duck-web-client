import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse<{ success: boolean } | { error: string }>> {
    try {
        const id = parseInt((await params).id);
        const db = getRequestContext().env.DB;

        // 檢查用戶身份
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = parseInt(authHeader.split(' ')[1]);

        // 檢查文件所有權
        const document = await db.prepare('SELECT creator_id FROM documents WHERE id = ?').bind(id).first();
        if (!document) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }
        if (document.creator_id !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 開始事務
        await db.prepare('BEGIN').run();
  
        try {
            // 刪除文件標籤關聯
            await db.prepare('DELETE FROM document_labels WHERE document_id = ?').bind(id).run();
            
            // 刪除文件內容
            await db.prepare('DELETE FROM document_contents WHERE document_id = ?').bind(id).run();
            
            // 刪除文件檔案
            await db.prepare('DELETE FROM document_files WHERE document_id = ?').bind(id).run();
            
            // 刪除文件本身
            const result = await db.prepare('DELETE FROM documents WHERE id = ?').bind(id).run();
            
            // 提交事務
            await db.prepare('COMMIT').run();
      
            if (result.success) {
              return NextResponse.json({ success: true });
            } else {
              return NextResponse.json(
                { error: 'Document not found' },
                { status: 404 }
              );
            }
          } catch (err) {
            // 如果出錯，回滾事務
            await db.prepare('ROLLBACK').run();
            throw err;
          }
        } catch (e) {
          return NextResponse.json(
            { error: `Internal server error: ${(e as Error).message}` },
            { status: 500 }
          );
        }
      }
