export type DocumentType = 'text' | 'image' | 'file';

export interface Label {
  id: number;
  name: string;
  color: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: number;
  title: string;
  description: string | null;
  type: DocumentType;
  favorite: boolean;
  created_at: string;
  updated_at: string;
  creator_id: number;
  content: string | null;
  storage_path: string | null;
  filename: string | null;
  file_type: string | null;
  labels: Label[];
  creator: User;
}

export interface DocumentsResponse {
  documents: Document[];
}

export function isDocument(obj: unknown): obj is Document {
  if (!obj || typeof obj !== 'object') return false;
  
  const doc = obj as Record<string, unknown>;
  return (
    typeof doc.id === 'number' &&
    typeof doc.title === 'string' &&
    (doc.description === null || typeof doc.description === 'string') &&
    ['text', 'image', 'file'].includes(doc.type as string) &&
    typeof doc.favorite === 'boolean' &&
    typeof doc.created_at === 'string' &&
    typeof doc.updated_at === 'string'
  );
}
