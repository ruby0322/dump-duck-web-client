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
import { cn } from "@/lib/utils"
import type { Document } from "@/types/document"
import { Check, Copy, Download, File, FileText, ImageIcon, Star, Trash2 } from "lucide-react"
import Markdown from 'markdown-to-jsx'
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"

interface DocumentPreviewProps {
  document: Document
  onClose: () => void
  onToggleFavorite: (id: number) => void
  onDelete: (id: number) => void
}

function removeMarkdown(input: string): string {
  // 移除標題
  input = input.replace(/^(#{1,6})\s+/g, '');

  // 移除粗體和斜體
  input = input.replace(/(\*\*|__)(.*?)\1/g, '$2'); // **粗體** 或 __粗體__
  input = input.replace(/(\*|_)(.*?)\1/g, '$2');    // *斜體* 或 _斜體_

  // 移除鏈接
  input = input.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1'); // [文本](鏈接)

  // 移除圖片
  input = input.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1'); // ![圖片](鏈接)

  // 移除區塊引用
  input = input.replace(/^>\s+/gm, '');

  // 移除代碼區塊
  input = input.replace(/```[\s\S]*?```/g, ''); // 多行代碼區塊
  input = input.replace(/`([^`]+)`/g, '$1');     // 單行代碼

  // 移除水平線
  input = input.replace(/^-{3,}|\*{3,}|_{3,}/g, '');

  return input;
}


export function DocumentPreview({ document, onClose, onToggleFavorite, onDelete }: DocumentPreviewProps) {
  // Get initials from uploader name
  const getInitials = (name: string) => {
    return name[0];
  }

  // Format date to Chinese format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (document.content) {
      await navigator.clipboard.writeText(removeMarkdown(document.content));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast("📝 已將內容複製到剪貼簿");
    }
  };

  // Render preview content based on document type
  const renderPreviewContent = () => {
    switch (document.type) {
      case "text":
        return (
          <div className="border rounded-md p-4 bg-muted/30 relative">
            <div className="max-h-[375px] overflow-y-auto">
              <Markdown options={{
                overrides: {
                  h1: {
                    component: (props) => <h1 {...props} className="text-gray-800 text-3xl font-semibold mb-6 mt-8 leading-tight" />,
                  },
                  h2: {
                    component: (props) => <h2 {...props} className="text-gray-800 text-2xl font-semibold mb-4 mt-8 leading-tight" />,
                  },
                  h3: {
                    component: (props) => <h3 {...props} className="text-gray-800 text-xl font-semibold mb-3 mt-6 leading-tight" />,
                  },
                  p: {
                    component: (props) => <p {...props} className="text-gray-700 text-base leading-relaxed mb-4" />,
                  },
                  li: {
                    component: (props) => <li {...props} className="text-gray-700 text-base leading-relaxed mb-1" />,
                  },
                  a: {
                    component: (props) => (
                      <a
                        {...props}
                        target="_blank"
                        className="text-sky-600 hover:text-sky-800 transition-colors duration-200 border-b border-sky-200 hover:border-sky-600"
                      />
                    ),
                  },
                  code: {
                    component: (props) => (
                      <code {...props} className="bg-gray-50 text-gray-800 px-1.5 py-0.5 rounded font-mono text-sm" />
                    ),
                  },
                  blockquote: {
                    component: (props) => (
                      <blockquote {...props} className="border-l-4 border-gray-200 pl-4 py-1 my-4 text-gray-600 italic" />
                    ),
                  },
                  img: {
                    component: (props) => (
                      <Image
                        {...props}
                        className="w-full max-w-80 object-contain self-center"
                        alt={props.alt || "Image"}
                        width={1200}
                        height={1200}
                      />
                    ),
                  },
                  ul: {
                    component: (props) => <ul {...props} className="list-disc pl-6 mb-4 space-y-1" />,
                  },
                  ol: {
                    component: (props) => <ol {...props} className="list-decimal pl-6 mb-4 space-y-1" />,
                  },
                  strong: {
                    component: (props) => <strong {...props} className="font-semibold text-gray-900" />,
                  },
                  table: {
                    component: (props) => (
                      <div className="overflow-x-auto my-6">
                        <table {...props} className="min-w-full border-collapse border border-gray-200 rounded-sm" />
                      </div>
                    ),
                  },
                  // Adding additional table-related elements for completeness
                  th: {
                    component: (props) => (
                      <th
                        {...props}
                        className="bg-gray-50 border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-700"
                      />
                    ),
                  },
                  td: {
                    component: (props) => <td {...props} className="border border-gray-200 px-4 py-2 text-sm text-gray-700" />,
                  },
                  hr: {
                    component: (props) => <hr {...props} className="my-8 border-t border-gray-200" />,
                  },
                },
              }} className="text-wrap break-all">
                {document.content ? document.content : "這個文件沒有內容鴨..."}
              </Markdown>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="backdrop-invert-5 hover:bg-transparent cursor-pointer absolute bottom-2 right-2"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="text-green-500 text-bold h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        )
      case "image":
        return (
          <div className="flex justify-center">
            <Image
              src={"/placeholder.svg?height=400&width=600&text=图片预览"}
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

        <div className="py-0">{renderPreviewContent()}</div>

        <div className="flex flex-wrap gap-2 mb-4">
          {document.labels?.map((label) => (
            <Badge key={label.id} variant="secondary">
              {label.name}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{getInitials(document.creator.username)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{document.creator.display_name}</p>
              <p className="text-xs text-muted-foreground">上傳於 {formatDate(document.created_at)}</p>
            </div>  
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-between gap-2">
          <div className="w-full">
            <Button className="cursor-pointer" variant="outline" size="icon" onClick={() => onToggleFavorite(document.id)}>
              <Star
                className={
                  cn('h-4 w-4', document.favorite && "fill-yellow-400 text-yellow-400")
                }
                />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button className="cursor-pointer" variant="outline">
              <Download className="h-4 w-4 mr-1" />
              下載
            </Button>
            <Button className="cursor-pointer" variant="destructive" onClick={() => onDelete(document.id)}>
              <Trash2 className="h-4 w-4 mr-1" />
              刪除
            </Button>
            <Button className="cursor-pointer" onClick={onClose}>關閉</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};

