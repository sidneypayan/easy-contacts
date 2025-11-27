import { useRef } from 'react'
import { Stethoscope, Plus, Download, Upload, Search, Sparkles, LayoutGrid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FilterPanel } from './FilterPanel'
import type { LicenseFilters } from '@/types'

export type ViewMode = 'cards' | 'list'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddLicense: () => void
  onExport: () => void
  onImport: (file: File) => void
  totalLicenses: number
  totalContacts: number
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  filters: LicenseFilters
  onFiltersChange: (filters: LicenseFilters) => void
  filtersOpen: boolean
  onFiltersToggle: () => void
}

export function Header({
  searchQuery,
  onSearchChange,
  onAddLicense,
  onExport,
  onImport,
  totalLicenses,
  totalContacts,
  viewMode,
  onViewModeChange,
  filters,
  onFiltersChange,
  filtersOpen,
  onFiltersToggle,
}: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImport(file)
      e.target.value = ''
    }
  }

  return (
    <header className="sticky top-0 z-10 border-b bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl blur-lg opacity-50 animate-pulse" />
              <div className="relative p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25">
                <Stethoscope className="h-7 w-7" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent flex items-center gap-2">
                EasyContacts
                <Sparkles className="h-5 w-5 text-amber-400" />
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
                  {totalLicenses} licence{totalLicenses !== 1 ? 's' : ''}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-fuchsia-100 text-fuchsia-700">
                  {totalContacts} contact{totalContacts !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Rechercher..."
                className="pl-10 w-full sm:w-72 rounded-xl border-violet-200 focus:border-violet-400 bg-white/80 backdrop-blur-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              {/* Filters */}
              <FilterPanel
                filters={filters}
                onFiltersChange={onFiltersChange}
                isOpen={filtersOpen}
                onToggle={onFiltersToggle}
              />

              {/* View mode toggle */}
              <div className="flex items-center rounded-xl border border-violet-200 bg-white/80 p-1">
                <button
                  onClick={() => onViewModeChange('cards')}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'cards'
                      ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-sm'
                      : 'text-gray-500 hover:text-violet-600 hover:bg-violet-50'
                  }`}
                  title="Vue cartes"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onViewModeChange('list')}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-sm'
                      : 'text-gray-500 hover:text-violet-600 hover:bg-violet-50'
                  }`}
                  title="Vue liste"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={onExport}
                title="Exporter les données"
                className="rounded-xl border-violet-200 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-600 transition-all"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleImportClick}
                title="Importer des données"
                className="rounded-xl border-violet-200 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-600 transition-all"
              >
                <Upload className="h-4 w-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                onClick={onAddLicense}
                className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30 hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle licence
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
