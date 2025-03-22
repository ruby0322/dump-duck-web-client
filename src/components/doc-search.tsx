"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface DocumentSearchProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function DocSearch({ searchQuery, setSearchQuery }: DocumentSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder="鴨鴨我想找..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}

