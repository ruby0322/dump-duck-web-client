"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Document } from "@/types/document"
import { File, FileText, Star } from "lucide-react"
import Image from "next/image"

interface DocumentCardProps {
  document: Document
  onClick: () => void
  onToggleFavorite: (id: number) => void
}

export function DocumentCard({ document, onClick, onToggleFavorite }: DocumentCardProps) {
  // Render preview content based on document type
  console.log('document.labels', document.labels);
  const renderPreviewContent = () => {
    switch (document.type) {
      case "text":
        return (
          <div className="h-40 px-4 bg-muted/30 rounded-t-md overflow-hidden relative">
            <div className="absolute top-2 right-2">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-sm line-clamp-6 text-muted-foreground">{document.content || "預覽"}</p>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent" />
          </div>
        )
      case "image":
        return (
          <div className="h-40 relative rounded-t-md overflow-hidden">
            <Image
              src={"/placeholder.svg?height=160&width=320&text=图片预览"}
              alt={document.title}
              fill
              className="object-cover"
            />
          </div>
        )
      case "file":
        return (
          <div className="h-40 flex flex-col items-center justify-center bg-muted/30 rounded-t-md">
            <File className="h-16 w-16 text-amber-500 mb-2" />
            <p className="text-sm font-medium">{document.filename || "document.pdf"}</p>
          </div>
        )
    }
  }

  return (
    <Card className="overflow-hidden shadow-none hover:shadow-md transition-shadow cursor-pointer">
      <div onClick={onClick}>{renderPreviewContent()}</div>

      <CardFooter className="px-4 flex flex-col items-start gap-2">
        <div className="flex justify-between w-full">
          <h3 className="font-medium text-sm line-clamp-1">{document.title}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 -mr-1 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite(document.id)
            }}
          >
            <Star
              className={cn('h-4 w-4', document.favorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")}
            />
          </Button>
        </div>

        <div className="flex flex-wrap gap-1 mt-1">
          {document.labels?.slice(0, 3).map((label) => (
            <Badge key={label.id} variant="outline" className="text-xs px-1.5 py-0">
              {label.name}
            </Badge>
          ))}
          {document.labels?.length && document.labels?.length > 3 && (
            <Badge variant="outline" className="text-xs px-1.5 py-0">
              +{document.labels.length - 3}
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

