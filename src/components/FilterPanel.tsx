import { Filter, X, Shield, Layers, Building2, Plug, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { LicenseFilters, LicenseType, LicenseMode, LicenseOption } from '@/types'
import { LICENSE_TYPE_LABELS, LICENSE_MODE_LABELS, CONNECTORS, LICENSE_OPTIONS, BRANDS } from '@/types'

interface FilterPanelProps {
  filters: LicenseFilters
  onFiltersChange: (filters: LicenseFilters) => void
  isOpen: boolean
  onToggle: () => void
}

const defaultFilters: LicenseFilters = {
  brand: null,
  mode: null,
  type: null,
  connector: null,
  options: [],
}

export function FilterPanel({ filters, onFiltersChange, isOpen, onToggle }: FilterPanelProps) {
  const activeFiltersCount = [
    filters.brand !== null,
    filters.mode !== null,
    filters.type !== null,
    filters.connector !== null,
    filters.options.length > 0,
  ].filter(Boolean).length

  const resetFilters = () => {
    onFiltersChange(defaultFilters)
  }

  const toggleOption = (option: LicenseOption) => {
    const newOptions = filters.options.includes(option)
      ? filters.options.filter((o) => o !== option)
      : [...filters.options, option]
    onFiltersChange({ ...filters, options: newOptions })
  }

  return (
    <div className="relative">
      {/* Filter toggle button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className={`rounded-xl border-violet-200 hover:bg-violet-50 hover:border-violet-300 transition-all ${
          activeFiltersCount > 0 ? 'bg-violet-50 border-violet-300' : ''
        }`}
      >
        <Filter className="h-4 w-4 mr-2" />
        Filtres
        {activeFiltersCount > 0 && (
          <span className="ml-2 px-1.5 py-0.5 rounded-full bg-violet-500 text-white text-xs font-bold">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      {/* Filter panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 p-4 rounded-xl bg-white shadow-xl border border-violet-100 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Filter className="h-4 w-4 text-violet-500" />
              Filtres
            </h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-violet-600 hover:text-violet-800 font-medium flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Réinitialiser
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Marque */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                <Shield className="h-3.5 w-3.5" />
                Marque
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onFiltersChange({ ...filters, brand: null })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filters.brand === null
                      ? 'bg-violet-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Toutes
                </button>
                {BRANDS.map((brand) => (
                  <button
                    key={brand.value}
                    onClick={() => onFiltersChange({ ...filters, brand: brand.value })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filters.brand === brand.value
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {brand.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                <Layers className="h-3.5 w-3.5" />
                Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => onFiltersChange({ ...filters, mode: null })}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filters.mode === null
                      ? 'bg-violet-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tous
                </button>
                {(Object.entries(LICENSE_MODE_LABELS) as [LicenseMode, string][]).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => onFiltersChange({ ...filters, mode: value })}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filters.mode === value
                        ? value === 'full'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                <Building2 className="h-3.5 w-3.5" />
                Type d'établissement
              </label>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onFiltersChange({ ...filters, type: null })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filters.type === null
                      ? 'bg-violet-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tous
                </button>
                {(Object.entries(LICENSE_TYPE_LABELS) as [LicenseType, string][]).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => onFiltersChange({ ...filters, type: value })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left ${
                      filters.type === value
                        ? 'bg-violet-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Connector */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                <Plug className="h-3.5 w-3.5" />
                Connecteur
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onFiltersChange({ ...filters, connector: null })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filters.connector === null
                      ? 'bg-violet-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tous
                </button>
                {CONNECTORS.map((c) => (
                  <button
                    key={c.value ?? 'none'}
                    onClick={() => onFiltersChange({ ...filters, connector: c.value })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filters.connector === c.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                <Zap className="h-3.5 w-3.5" />
                Options
              </label>
              <div className="flex flex-wrap gap-2">
                {LICENSE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => toggleOption(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filters.options.includes(opt.value)
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {filters.options.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  Affiche les licences avec au moins une de ces options
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export { defaultFilters }
