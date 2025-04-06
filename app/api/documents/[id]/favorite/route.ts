import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse<{ success: boolean } | { error: string }>> {
  try {
    const { user_id }: { user_id: number } = await request.json();
    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    const id = parseInt((await params).id);
    const db = getRequestContext().env.DB;

    // 檢查文件所有者
    const document = await db.prepare(
      'SELECT creator_id, favorite FROM documents WHERE id = ?'
    ).bind(id).first();
    
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    if (document.creator_id !== user_id) {
      return NextResponse.json(
        { error: 'Not authorized to modify this document' },
        { status: 403 }
      );
    }

    const result = await db.prepare(`
      UPDATE documents 
      SET 
        favorite = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(!document.favorite, id).run();
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Document not found or not authorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: `Internal server error: ${(e as Error).message}` },
      { status: 500 }
    );
  }
}