export type DocumentType = "text" | "image" | "file"

export interface Document {
  id: string
  title: string
  description: string
  type: DocumentType
  labels: string[]
  uploader: string
  uploadDate: string
  favorite: boolean
  url?: string
  content?: string
  filename?: string
  filesize?: string
}

