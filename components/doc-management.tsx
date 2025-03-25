"use client"

import { DocFilters } from "@/components/doc-filters"
import { DocumentPreview } from "@/components/doc-preview"
import { DocSearch } from "@/components/doc-search"
import { DocTabs } from "@/components/doc-tabs"
import type { Document, DocumentType } from "@/types/document"
import axios from "axios"
import { useEffect, useState } from "react"

export function DocManagement() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [showFavorites, setShowFavorites] = useState(false)
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | DocumentType>("all")

  // Get all unique labels from documents
  const allLabels = Array.from(new Set(documents.flatMap((doc) => doc.labels))).sort()

  // Handle toggling favorite status
  const toggleFavorite = (id: number) => {
    const updatedDocs = documents.map((doc) => (doc.id === id ? { ...doc, favorite: !doc.favorite } : doc))
    setDocuments(updatedDocs)
  }

  // Fetch documents from API
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const userId = "1" // 暫時寫死，之後可以從 auth context 獲取
        const response = await axios.get(`/api/documents/user/${userId}`)
        const { documents } = response.data
        console.log(documents);
        setDocuments(documents)
        setFilteredDocuments(documents)
      } catch (error) {
        console.error("Error fetching documents:", error)
        // 可以在這裡加入錯誤處理，例如顯示錯誤訊息
      }
    }

    fetchDocuments()
  }, [])

  // Filter documents based on current filters
  useEffect(() => {

    let filtered = [...documents]

    // Filter by search query (simulating semantic search)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (doc) => doc.title.toLowerCase().includes(query) || doc.description?.toLowerCase().includes(query),
      )
    }

    // Filter by selected labels
    if (selectedLabels.length > 0) {
      filtered = filtered.filter(
        (doc) => selectedLabels.every(
          (label) => doc.labels?.map(l => (l.name === label))
        )
      )
    }

    // Filter by active tab (document type)
    if (activeTab !== "all") {
      filtered = filtered.filter((doc) => doc.type === activeTab)
    }

    // Filter favorites
    if (showFavorites) {
      filtered = filtered.filter((doc) => doc.favorite)
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })

    setFilteredDocuments(filtered)
  }, [documents, searchQuery, selectedLabels, sortOrder, showFavorites, activeTab])

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">檔管鴨鴨</h1>

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
          onDocumentClick={setPreviewDocument}
          onToggleFavorite={toggleFavorite}
        />
      </div>

      {/* Document Preview Dialog */}
      {previewDocument && (
        <DocumentPreview
          document={previewDocument}
          onClose={() => setPreviewDocument(null)}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  )
}

