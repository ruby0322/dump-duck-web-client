import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse<{ success: boolean } | { error: string }>> {
    try {
        const id = parseInt((await params).id);
        const db = getRequestContext().env.DB;

        // TODO: 檢查用戶身份

        try {
            const result = await db.prepare('DELETE FROM documents WHERE id = ?').bind(id).run();
            
            if (result.success) {
              return NextResponse.json({ success: true });
            } else {
              return NextResponse.json(
                { error: 'Document not found' },
                { status: 404 }
              );
            }
          } catch (err) {
            throw err;
          }
    } catch (e) {
          return NextResponse.json(
            { error: `Internal server error: ${(e as Error).message}` },
            { status: 500 }
          );
        }
      }
