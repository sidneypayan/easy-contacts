import { useState, useMemo } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { useLicenses } from '@/hooks/useLicenses'
import { useRISAgenda } from '@/hooks/useRISAgenda'
import { Header, type ViewMode, type AppView } from '@/components/Header'
import { LicenseCard } from '@/components/LicenseCard'
import { LicenseListItem } from '@/components/LicenseListItem'
import { LicenseForm } from '@/components/LicenseForm'
import { EmptyState } from '@/components/EmptyState'
import { PasswordGate } from '@/components/PasswordGate'
import { defaultFilters } from '@/components/FilterPanel'
import { RISAgenda } from '@/components/RISAgenda'
import { RISForm } from '@/components/RISForm'
import type { LicenseFilters } from '@/types'

function AuthenticatedApp() {
  const {
    licenses,
    addLicense,
    updateLicense,
    deleteLicense,
    addContact,
    updateContact,
    deleteContact,
    exportData,
    importData,
  } = useLicenses()

  const {
    risEntities,
    addRIS,
    updateRIS,
    deleteRIS,
    addContact: addRISContact,
    updateContact: updateRISContact,
    deleteContact: deleteRISContact,
  } = useRISAgenda()

  const [searchQuery, setSearchQuery] = useState('')
  const [addLicenseOpen, setAddLicenseOpen] = useState(false)
  const [addRISOpen, setAddRISOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})
  const [filters, setFilters] = useState<LicenseFilters>(defaultFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [appView, setAppView] = useState<AppView>('licenses')

  const isCardExpanded = (licenseId: string) => {
    if (expandedCards[licenseId] !== undefined) {
      return expandedCards[licenseId]
    }
    // Par défaut: cartes ouvertes, liste fermée
    return viewMode === 'cards'
  }

  const toggleCardExpanded = (licenseId: string) => {
    const currentState = expandedCards[licenseId] !== undefined
      ? expandedCards[licenseId]
      : viewMode === 'cards'
    setExpandedCards((prev) => ({
      ...prev,
      [licenseId]: !currentState,
    }))
  }

  const filteredLicenses = useMemo(() => {
    return licenses.filter((license) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesLicense =
          license.name.toLowerCase().includes(query) ||
          license.licenseNumber.toLowerCase().includes(query) ||
          license.address?.toLowerCase().includes(query) ||
          license.city?.toLowerCase().includes(query) ||
          license.postalCode?.includes(query)

        const matchesContact = license.contacts.some(
          (contact) =>
            contact.firstName.toLowerCase().includes(query) ||
            contact.lastName.toLowerCase().includes(query) ||
            contact.role.toLowerCase().includes(query) ||
            contact.phones.some(phone => phone.number.includes(query)) ||
            contact.emails.some(email => email.toLowerCase().includes(query)) ||
            contact.notes?.toLowerCase().includes(query)
        )

        if (!matchesLicense && !matchesContact) return false
      }

      // Brand filter
      if (filters.brand !== null && license.brand !== filters.brand) {
        return false
      }

      // Mode filter
      if (filters.mode !== null && license.mode !== filters.mode) {
        return false
      }

      // Type filter
      if (filters.type !== null && license.type !== filters.type) {
        return false
      }

      // Connector filter
      if (filters.connector !== null && license.connector !== filters.connector) {
        return false
      }

      // Options filter (at least one of the selected options)
      if (filters.options.length > 0) {
        const hasAnyOption = filters.options.some((opt) => license.options.includes(opt))
        if (!hasAnyOption) return false
      }

      return true
    })
  }, [licenses, searchQuery, filters])

  const totalContacts = licenses.reduce((sum, license) => sum + license.contacts.length, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-cyan-50">
      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      </div>

      <div className="relative">
        <Toaster position="top-right" richColors />
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddLicense={() => setAddLicenseOpen(true)}
          onAddRIS={() => setAddRISOpen(true)}
          onExport={exportData}
          onImport={importData}
          totalLicenses={licenses.length}
          totalContacts={totalContacts}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          filters={filters}
          onFiltersChange={setFilters}
          filtersOpen={filtersOpen}
          onFiltersToggle={() => setFiltersOpen(!filtersOpen)}
          appView={appView}
          onAppViewChange={setAppView}
        />
        <main className="container mx-auto px-4 py-8">
          {appView === 'ris-agenda' ? (
            <RISAgenda
              risEntities={risEntities}
              onUpdateRIS={updateRIS}
              onDeleteRIS={deleteRIS}
              onAddContact={addRISContact}
              onUpdateContact={updateRISContact}
              onDeleteContact={deleteRISContact}
              searchQuery={searchQuery}
              viewMode={viewMode}
            />
          ) : licenses.length === 0 ? (
            <EmptyState onAddLicense={() => setAddLicenseOpen(true)} />
          ) : filteredLicenses.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <p className="text-gray-500 font-medium">
                {searchQuery.trim()
                  ? `Aucun résultat pour "${searchQuery}"`
                  : 'Aucune licence ne correspond aux filtres sélectionnés'}
              </p>
            </div>
          ) : viewMode === 'cards' ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 items-start">
              {filteredLicenses.map((license) => (
                <LicenseCard
                  key={license.id}
                  license={license}
                  expanded={isCardExpanded(license.id)}
                  onToggleExpanded={() => toggleCardExpanded(license.id)}
                  onUpdate={(data) => updateLicense(license.id, data)}
                  onDelete={() => deleteLicense(license.id)}
                  onAddContact={(contact) => addContact(license.id, contact)}
                  onUpdateContact={(contactId, data) => updateContact(license.id, contactId, data)}
                  onDeleteContact={(contactId) => deleteContact(license.id, contactId)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLicenses.map((license) => (
                <LicenseListItem
                  key={license.id}
                  license={license}
                  expanded={isCardExpanded(license.id)}
                  onToggleExpanded={() => toggleCardExpanded(license.id)}
                  onUpdate={(data) => updateLicense(license.id, data)}
                  onDelete={() => deleteLicense(license.id)}
                  onAddContact={(contact) => addContact(license.id, contact)}
                  onUpdateContact={(contactId, data) => updateContact(license.id, contactId, data)}
                  onDeleteContact={(contactId) => deleteContact(license.id, contactId)}
                />
              ))}
            </div>
          )}
        </main>
        <LicenseForm
          open={addLicenseOpen}
          onOpenChange={setAddLicenseOpen}
          onSubmit={addLicense}
        />
        <RISForm
          open={addRISOpen}
          onOpenChange={setAddRISOpen}
          onSubmit={addRIS}
        />
      </div>
    </div>
  )
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('app-authenticated') === 'true'
  })

  if (!isAuthenticated) {
    return <PasswordGate onSuccess={() => setIsAuthenticated(true)} />
  }

  return <AuthenticatedApp />
}

export default App
