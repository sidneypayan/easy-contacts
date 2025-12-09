import { useState, useMemo } from 'react'
import { Database, Search } from 'lucide-react'
import type { RISEntity, Contact } from '@/types'
import type { ViewMode } from './Header'
import { RISCard } from './RISCard'
import { RISListItem } from './RISListItem'

interface RISAgendaProps {
  risEntities: RISEntity[]
  onUpdateRIS: (id: string, data: { name?: string; notes?: string }) => void
  onDeleteRIS: (id: string) => void
  onAddContact: (risId: string, contact: Omit<Contact, 'id'>) => void
  onUpdateContact: (risId: string, contactId: string, data: Partial<Omit<Contact, 'id'>>) => void
  onDeleteContact: (risId: string, contactId: string) => void
  searchQuery?: string
  viewMode?: ViewMode
}

const cardGradients = [
  'from-blue-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-purple-500 to-fuchsia-500',
  'from-rose-500 to-pink-500',
  'from-cyan-500 to-sky-500',
]

export function RISAgenda({
  risEntities,
  onUpdateRIS,
  onDeleteRIS,
  onAddContact,
  onUpdateContact,
  onDeleteContact,
  searchQuery = '',
  viewMode = 'cards',
}: RISAgendaProps) {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})

  const toggleCard = (risId: string) => {
    setExpandedCards((prev) => ({ ...prev, [risId]: !prev[risId] }))
  }

  const isCardExpanded = (risId: string) => {
    if (expandedCards[risId] !== undefined) {
      return expandedCards[risId]
    }
    // Par défaut: cartes ouvertes, liste fermée
    return viewMode === 'cards'
  }

  // Filtrer les RIS et contacts selon la recherche
  const filteredRISEntities = useMemo(() => {
    if (!searchQuery.trim()) {
      return risEntities
    }
    const query = searchQuery.toLowerCase()
    return risEntities
      .map((ris) => {
        // Filtrer les contacts qui correspondent à la recherche
        const filteredContacts = ris.contacts.filter(
          (contact) =>
            contact.firstName.toLowerCase().includes(query) ||
            contact.lastName.toLowerCase().includes(query) ||
            contact.role.toLowerCase().includes(query) ||
            contact.phones?.some((p) => p.number.includes(query)) ||
            contact.emails?.some((e) => e.toLowerCase().includes(query)) ||
            contact.notes?.toLowerCase().includes(query)
        )
        // Inclure le RIS si son nom correspond ou s'il a des contacts correspondants
        if (ris.name.toLowerCase().includes(query) || filteredContacts.length > 0) {
          return { ...ris, contacts: filteredContacts.length > 0 ? filteredContacts : ris.contacts }
        }
        return null
      })
      .filter((ris): ris is RISEntity => ris !== null)
  }, [risEntities, searchQuery])

  return (
    <div className="space-y-4">
      {risEntities.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg mb-4">
            <Database className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Aucun RIS configuré</p>
          <p className="text-gray-400 text-sm mt-1">
            Cliquez sur "Nouveau RIS" pour ajouter votre premier RIS
          </p>
        </div>
      ) : filteredRISEntities.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">
            Aucun résultat pour "{searchQuery}"
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Essayez avec un autre terme de recherche
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 items-start">
          {filteredRISEntities.map((ris, index) => {
            const gradient = cardGradients[index % cardGradients.length]

            return (
              <RISCard
                key={ris.id}
                ris={ris}
                expanded={isCardExpanded(ris.id)}
                onToggleExpanded={() => toggleCard(ris.id)}
                onUpdate={(data) => onUpdateRIS(ris.id, data)}
                onDelete={() => onDeleteRIS(ris.id)}
                onAddContact={(contact) => onAddContact(ris.id, contact)}
                onUpdateContact={(contactId, data) => onUpdateContact(ris.id, contactId, data)}
                onDeleteContact={(contactId) => onDeleteContact(ris.id, contactId)}
                gradient={gradient}
              />
            )
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRISEntities.map((ris, index) => {
            const gradient = cardGradients[index % cardGradients.length]

            return (
              <RISListItem
                key={ris.id}
                ris={ris}
                expanded={isCardExpanded(ris.id)}
                onToggleExpanded={() => toggleCard(ris.id)}
                onUpdate={(data) => onUpdateRIS(ris.id, data)}
                onDelete={() => onDeleteRIS(ris.id)}
                onAddContact={(contact) => onAddContact(ris.id, contact)}
                onUpdateContact={(contactId, data) => onUpdateContact(ris.id, contactId, data)}
                onDeleteContact={(contactId) => onDeleteContact(ris.id, contactId)}
                gradient={gradient}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
