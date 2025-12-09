import { useCallback } from 'react'
import { toast } from 'sonner'
import type { RISEntity, Contact } from '@/types'
import { DEFAULT_RIS_NAMES } from '@/types'
import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY = 'ris-agenda-entities'

// Créer les RIS par défaut
function createDefaultRIS(): RISEntity[] {
  const now = new Date().toISOString()
  return DEFAULT_RIS_NAMES.map((name) => ({
    id: crypto.randomUUID(),
    name,
    contacts: [],
    createdAt: now,
    updatedAt: now,
  }))
}

export function useRISAgenda() {
  const [risEntities, setRISEntities] = useLocalStorage<RISEntity[]>(
    STORAGE_KEY,
    createDefaultRIS(),
    (data) => {
      // Migration: ajouter les champs manquants aux contacts existants
      return data.map((ris: any) => ({
        ...ris,
        contacts: ris.contacts.map((contact: any) => ({
          ...contact,
          phones: contact.phones ?? [{ number: '', type: 'pro' as const }],
          emails: contact.emails ?? [],
        })),
      }))
    }
  )

  const addRIS = useCallback(
    (ris: Omit<RISEntity, 'id' | 'contacts' | 'createdAt' | 'updatedAt'>) => {
      const newRIS: RISEntity = {
        ...ris,
        id: crypto.randomUUID(),
        contacts: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setRISEntities((prev) => [...prev, newRIS])
      toast.success('RIS ajouté avec succès')
      return newRIS
    },
    [setRISEntities]
  )

  const updateRIS = useCallback(
    (id: string, updates: Partial<Omit<RISEntity, 'id' | 'contacts' | 'createdAt'>>) => {
      setRISEntities((prev) =>
        prev.map((ris) =>
          ris.id === id
            ? { ...ris, ...updates, updatedAt: new Date().toISOString() }
            : ris
        )
      )
      toast.success('RIS modifié avec succès')
    },
    [setRISEntities]
  )

  const deleteRIS = useCallback(
    (id: string) => {
      setRISEntities((prev) => prev.filter((ris) => ris.id !== id))
      toast.success('RIS supprimé avec succès')
    },
    [setRISEntities]
  )

  const addContact = useCallback(
    (risId: string, contact: Omit<Contact, 'id'>) => {
      const newContact: Contact = {
        ...contact,
        id: crypto.randomUUID(),
      }
      setRISEntities((prev) =>
        prev.map((ris) =>
          ris.id === risId
            ? {
                ...ris,
                contacts: [...ris.contacts, newContact],
                updatedAt: new Date().toISOString(),
              }
            : ris
        )
      )
      toast.success('Contact ajouté avec succès')
      return newContact
    },
    [setRISEntities]
  )

  const updateContact = useCallback(
    (risId: string, contactId: string, updates: Partial<Omit<Contact, 'id'>>) => {
      setRISEntities((prev) =>
        prev.map((ris) =>
          ris.id === risId
            ? {
                ...ris,
                contacts: ris.contacts.map((contact) =>
                  contact.id === contactId ? { ...contact, ...updates } : contact
                ),
                updatedAt: new Date().toISOString(),
              }
            : ris
        )
      )
      toast.success('Contact modifié avec succès')
    },
    [setRISEntities]
  )

  const deleteContact = useCallback(
    (risId: string, contactId: string) => {
      setRISEntities((prev) =>
        prev.map((ris) =>
          ris.id === risId
            ? {
                ...ris,
                contacts: ris.contacts.filter((contact) => contact.id !== contactId),
                updatedAt: new Date().toISOString(),
              }
            : ris
        )
      )
      toast.success('Contact supprimé avec succès')
    },
    [setRISEntities]
  )

  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(risEntities, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ris-contacts-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('Données RIS exportées avec succès')
  }, [risEntities])

  const importData = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string) as RISEntity[]
          if (!Array.isArray(importedData)) {
            throw new Error('Format invalide')
          }
          setRISEntities((prev) => {
            const existingIds = new Set(prev.map((r) => r.id))
            const newRIS = importedData.filter((r) => !existingIds.has(r.id))
            return [...prev, ...newRIS]
          })
          toast.success(`${importedData.length} RIS importé(s) avec succès`)
        } catch {
          toast.error("Erreur lors de l'import des données")
        }
      }
      reader.readAsText(file)
    },
    [setRISEntities]
  )

  return {
    risEntities,
    addRIS,
    updateRIS,
    deleteRIS,
    addContact,
    updateContact,
    deleteContact,
    exportData,
    importData,
  }
}
