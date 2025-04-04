"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import type { Document } from "@/types/document"
import { Download, File, FileText, ImageIcon, Star } from "lucide-react"
import Image from "next/image"

interface DocumentPreviewProps {
  document: Document
  onClose: () => void
  onToggleFavorite: (id: string) => void
}

export function DocumentPreview({ document, onClose, onToggleFavorite }: DocumentPreviewProps) {
  // Get initials from uploader name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Format date to Chinese format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }

  // Render preview content based on document type
  const renderPreviewContent = () => {
    switch (document.type) {
      case "text":
        return (
          <div className="border rounded-md p-4 bg-muted/30 max-h-[400px] overflow-y-auto">
            <p>{document.content || "文本内容预览"}</p>
          </div>
        )
      case "image":
        return (
          <div className="flex justify-center">
            <Image
              src={document.url || "/placeholder.svg?height=400&width=600&text=图片预览"}
              alt={document.title}
              width={600}
              height={400}
              className="rounded-md max-h-[400px] w-auto object-contain"
            />
          </div>
        )
      case "file":
        return (
          <div className="flex flex-col items-center justify-center p-8 border rounded-md bg-muted/30">
            <File className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{document.filename || "document.pdf"}</p>
            <p className="text-xs text-muted-foreground">{document.filesize || "2.4 MB"}</p>
          </div>
        )
      default:
        return <div>無法預覽</div>
    }
  }

  // Get icon based on document type
  const getDocumentIcon = () => {
    switch (document.type) {
      case "text":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "image":
        return <ImageIcon className="h-5 w-5 text-green-500" />
      case "file":
        return <File className="h-5 w-5 text-amber-500" />
      default:
        return <File className="h-5 w-5" />
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {getDocumentIcon()}
            <DialogTitle>{document.title}</DialogTitle>
          </div>
          <DialogDescription>{document.description}</DialogDescription>
        </DialogHeader>

        <div className="py-4">{renderPreviewContent()}</div>

        <div className="flex flex-wrap gap-2 mb-4">
          {document.labels.map((label) => (
            <Badge key={label} variant="secondary">
              {label}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{getInitials(document.uploader)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{document.uploader}</p>
              <p className="text-xs text-muted-foreground">上傳於 {formatDate(document.uploadDate)}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between gap-2">
          <Button variant="outline" size="icon" onClick={() => onToggleFavorite(document.id)}>
            <Star className={`h-4 w-4 ${document.favorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              下载
            </Button>
            <Button onClick={onClose}>關閉</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

