"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowDownAZ, ArrowUpAZ, Filter, Star } from "lucide-react"

interface DocumentFiltersProps {
  allLabels: string[]
  selectedLabels: string[]
  setSelectedLabels: (labels: string[]) => void
  sortOrder: "asc" | "desc"
  setSortOrder: (order: "asc" | "desc") => void
  showFavorites: boolean
  setShowFavorites: (show: boolean) => void
}

export function DocFilters({
  allLabels,
  selectedLabels,
  setSelectedLabels,
  sortOrder,
  setSortOrder,
  showFavorites,
  setShowFavorites,
}: DocumentFiltersProps) {
  // Toggle a label in the selected labels array
  const toggleLabel = (label: string) => {
    if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter((l) => l !== label))
    } else {
      setSelectedLabels([...selectedLabels, label])
    }
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Labels filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="h-4 w-4 mr-2" />
            標籤
            {selectedLabels.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {selectedLabels.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>按標籤篩選</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
            {allLabels.map((label) => (
              <DropdownMenuItem key={label} onSelect={(e) => e.preventDefault()}>
                <div className="flex items-center space-x-2 w-full" onClick={() => toggleLabel(label)}>
                  <Checkbox checked={selectedLabels.includes(label)} />
                  <span>{label}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sort order toggle */}
      <Button
        variant="outline"
        size="sm"
        className="h-9"
        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
      >
        {sortOrder === "asc" ? (
          <>
            <ArrowUpAZ className="h-4 w-4 mr-2" />
            最舊
          </>
        ) : (
          <>
            <ArrowDownAZ className="h-4 w-4 mr-2" />
            最新
          </>
        )}
      </Button>

      {/* Favorites toggle */}
      <Button
        variant={showFavorites ? "secondary" : "outline"}
        size="sm"
        className="h-9"
        onClick={() => setShowFavorites(!showFavorites)}
      >
        <Star className={`h-4 w-4 mr-2 ${showFavorites ? "fill-current" : ""}`} />
        收藏
      </Button>

      {/* Display active filters */}
      {(selectedLabels.length > 0 || showFavorites) && (
        <div className="flex flex-wrap gap-2 mt-2 w-full">
          {selectedLabels.map((label) => (
            <Badge key={label} variant="secondary" className="flex items-center gap-1">
              {label}
              <button className="ml-1 hover:bg-muted rounded-full" onClick={() => toggleLabel(label)}>
                ×
              </button>
            </Badge>
          ))}
          {showFavorites && (
            <Badge variant="secondary" className="flex items-center gap-1">
              收藏
              <button className="ml-1 hover:bg-muted rounded-full" onClick={() => setShowFavorites(false)}>
                ×
              </button>
            </Badge>
          )}
          {(selectedLabels.length > 0 || showFavorites) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2"
              onClick={() => {
                setSelectedLabels([])
                setShowFavorites(false)
              }}
            >
              清除全部
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

