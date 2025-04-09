"use client"

import { DocFilters } from "@/components/doc-filters"
import { DocumentPreview } from "@/components/doc-preview"
import { DocSearch } from "@/components/doc-search"
import { DocTabs } from "@/components/doc-tabs"
import type { Document, DocumentType } from "@/types/document"
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export function DocManagement() {
  // 提升 userId 為 component 常數
  const userId = 1; // 暫時寫死，之後可以從 auth context 獲取

  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [showFavorites, setShowFavorites] = useState(false)
  const [previewDocumentId, setPreviewDocumentId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | DocumentType>("all")

  const allLabels = Array.from(new Set(documents.flatMap((doc) => doc.labels))).sort()

  const toggleFavorite = async (id: number) => {
    const updatedDocs = documents.map((doc) => (doc.id === id ? { ...doc, favorite: !doc.favorite } : doc))
    const updatedFilteredDocs = filteredDocuments.map((doc) => (doc.id === id ? { ...doc, favorite: !doc.favorite } : doc))
    setDocuments(updatedDocs);
    setFilteredDocuments(updatedFilteredDocs);

    const doc = updatedDocs.find((doc) => doc.id === id);
    const res = await axios.post(`/api/documents/${id}/favorite`, { user_id: userId });
    if (res.status === 200) {
      if (doc?.favorite) {
        toast("💖 小鴨已經收藏這個文件了！");
      } else {
        toast("💔 總有一天你會明白，愛從來不是永恆。");
      }
    } else {
      toast.error("收藏失敗，請稍後再試");
    }
  }

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(`/api/documents/user/${userId}`)
        const { documents } = response.data
        console.log(documents);
        setDocuments(documents)
        setFilteredDocuments(documents)
      } catch (error) {
        console.error("Error fetching documents:", error)
      }
    }

    fetchDocuments()
  }, [])

  useEffect(() => {

    let filtered = [...documents]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (doc) => doc.title.toLowerCase().includes(query) || doc.description?.toLowerCase().includes(query),
      )
    }

    if (selectedLabels.length > 0) {
      filtered = filtered.filter(
        (doc) => selectedLabels.some(
          (label) => doc.labels?.some(l => l.name === label)
        )
      )
    }

    if (activeTab !== "all") {
      filtered = filtered.filter((doc) => doc.type === activeTab)
    }

    if (showFavorites) {
      filtered = filtered.filter((doc) => doc.favorite)
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })

    setFilteredDocuments(filtered)
  }, [documents, searchQuery, selectedLabels, sortOrder, showFavorites, activeTab])

  // 添加刪除文件的處理函式
  const handleDeleteDocument = async (id: number) => {
    try {
      const response = await axios.delete(`/api/documents/${id}`, {
        data: { user_id: userId }
      });
      
      if (response.data.success) {
        setDocuments(documents.filter(doc => doc.id !== id));
        setFilteredDocuments(filteredDocuments.filter(doc => doc.id !== id));
        setPreviewDocumentId(null);
        toast("🗑️ 已經刪除的文件就像是從未存在過");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex gap-4 items-center mb-8">
        <Avatar className="w-12 h-12">
          <AvatarImage src="/dump-duck.webp" alt="鴨鴨" />
          <AvatarFallback>鴨鴨</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold">檔管鴨鴨</h1>
      </div>

      <div className="grid gap-6">
        <DocSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <DocFilters
          allLabels={allLabels.filter((label) => !!label)}
          selectedLabels={selectedLabels}
          setSelectedLabels={setSelectedLabels}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
        />

        <DocTabs
          documents={documents}
          filteredDocuments={filteredDocuments}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onDocumentClick={setPreviewDocumentId}
          onToggleFavorite={toggleFavorite}
        />
      </div>

      {previewDocumentId && (
        <DocumentPreview
          document={documents.filter(doc => doc.id === previewDocumentId)[0]}
          onClose={() => setPreviewDocumentId(null)}
          onToggleFavorite={toggleFavorite}
          onDelete={handleDeleteDocument}
        />
      )}
    </div>
  )
}

