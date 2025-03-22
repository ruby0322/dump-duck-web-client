"use client"

import { DocumentCard } from "@/components/doc-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Document, DocumentType } from "@/types/document"
import { File, FileText, Image } from "lucide-react"

interface DocumentTabsProps {
  documents: Document[]
  activeTab: "all" | DocumentType
  setActiveTab: (tab: "all" | DocumentType) => void
  onDocumentClick: (document: Document) => void
  onToggleFavorite: (id: string) => void
}

export function DocTabs({
  documents,
  activeTab,
  setActiveTab,
  onDocumentClick,
  onToggleFavorite,
}: DocumentTabsProps) {
  // Count documents by type
  const counts = {
    all: documents.length,
    text: documents.filter((doc) => doc.type === "text").length,
    image: documents.filter((doc) => doc.type === "image").length,
    file: documents.filter((doc) => doc.type === "file").length,
  }

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | DocumentType)}>
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="all" className="flex items-center gap-2">
          全部
          <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">{counts.all}</span>
        </TabsTrigger>
        <TabsTrigger value="text" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          文字
          <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">{counts.text}</span>
        </TabsTrigger>
        <TabsTrigger value="image" className="flex items-center gap-2">
          <Image className="h-4 w-4" />
          照片
          <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">{counts.image}</span>
        </TabsTrigger>
        <TabsTrigger value="file" className="flex items-center gap-2">
          <File className="h-4 w-4" />
          文件
          <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">{counts.file}</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-0">
        {documents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">没有找到符合筛选条件的文档</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {documents.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onClick={() => onDocumentClick(document)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="text" className="mt-0">
        {counts.text === 0 ? (
          <div className="text-center py-12 text-muted-foreground">没有找到符合筛选条件的文本文档</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {documents
              .filter((doc) => doc.type === "text")
              .map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onClick={() => onDocumentClick(document)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="image" className="mt-0">
        {counts.image === 0 ? (
          <div className="text-center py-12 text-muted-foreground">没有找到符合筛选条件的图片文档</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {documents
              .filter((doc) => doc.type === "image")
              .map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onClick={() => onDocumentClick(document)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="file" className="mt-0">
        {counts.file === 0 ? (
          <div className="text-center py-12 text-muted-foreground">没有找到符合筛选条件的文件文档</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {documents
              .filter((doc) => doc.type === "file")
              .map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onClick={() => onDocumentClick(document)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}

