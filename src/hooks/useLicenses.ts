import { useCallback } from 'react'
import { toast } from 'sonner'
import type { License, Contact } from '@/types'
import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY = 'medical-contacts-licenses'

export function useLicenses() {
  const [licenses, setLicenses] = useLocalStorage<License[]>(STORAGE_KEY, [], (data) => {
    // Migration: ajouter les champs mode, planning, portal, connector et hasWebserviceRequests si absents
    // Migration: convertir les anciens champs téléphone en tableau phones[]
    // Migration: ajouter emails comme tableau vide pour les contacts existants
    return data.map((license) => ({
      ...license,
      mode: license.mode ?? 'full',
      planning: license.planning ?? 'easydoct',
      portal: license.portal ?? 'easydoct',
      connector: license.connector ?? 'xplore',
      hasWebserviceRequests: license.hasWebserviceRequests ?? false,
      contacts: license.contacts.map((contact: any) => {
        // Migration des anciens champs téléphone vers phones[]
        const phones = []

        // Convertir phoneFixed
        if (contact.phoneFixed) {
          phones.push({ number: contact.phoneFixed, type: 'pro' as const })
        }

        // Convertir phoneMobilePro ou phoneMobile
        const mobilePro = contact.phoneMobilePro ?? contact.phoneMobile
        if (mobilePro) {
          phones.push({ number: mobilePro, type: 'pro' as const })
        }

        // Convertir phoneMobilePerso
        if (contact.phoneMobilePerso) {
          phones.push({ number: contact.phoneMobilePerso, type: 'perso' as const })
        }

        // Si déjà phones[], le garder, sinon utiliser le résultat de la migration
        return {
          ...contact,
          phones: contact.phones ?? (phones.length > 0 ? phones : [{ number: '', type: 'pro' as const }]),
          emails: contact.emails ?? [],
          notes: contact.notes ?? undefined,
          // Nettoyer les anciens champs
          phoneFixed: undefined,
          phoneMobile: undefined,
          phoneMobilePro: undefined,
          phoneMobilePerso: undefined,
        }
      }),
    }))
  })

  const addLicense = useCallback(
    (license: Omit<License, 'id' | 'contacts' | 'createdAt' | 'updatedAt'>) => {
      const newLicense: License = {
        ...license,
        id: crypto.randomUUID(),
        contacts: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setLicenses((prev) => [...prev, newLicense])
      toast.success('Licence ajoutée avec succès')
      return newLicense
    },
    [setLicenses]
  )

  const updateLicense = useCallback(
    (id: string, updates: Partial<Omit<License, 'id' | 'contacts' | 'createdAt'>>) => {
      setLicenses((prev) =>
        prev.map((license) =>
          license.id === id
            ? { ...license, ...updates, updatedAt: new Date().toISOString() }
            : license
        )
      )
      toast.success('Licence modifiée avec succès')
    },
    [setLicenses]
  )

  const deleteLicense = useCallback(
    (id: string) => {
      setLicenses((prev) => prev.filter((license) => license.id !== id))
      toast.success('Licence supprimée avec succès')
    },
    [setLicenses]
  )

  const addContact = useCallback(
    (licenseId: string, contact: Omit<Contact, 'id'>) => {
      const newContact: Contact = {
        ...contact,
        id: crypto.randomUUID(),
      }
      setLicenses((prev) =>
        prev.map((license) =>
          license.id === licenseId
            ? {
                ...license,
                contacts: [...license.contacts, newContact],
                updatedAt: new Date().toISOString(),
              }
            : license
        )
      )
      toast.success('Contact ajouté avec succès')
      return newContact
    },
    [setLicenses]
  )

  const updateContact = useCallback(
    (licenseId: string, contactId: string, updates: Partial<Omit<Contact, 'id'>>) => {
      setLicenses((prev) =>
        prev.map((license) =>
          license.id === licenseId
            ? {
                ...license,
                contacts: license.contacts.map((contact) =>
                  contact.id === contactId ? { ...contact, ...updates } : contact
                ),
                updatedAt: new Date().toISOString(),
              }
            : license
        )
      )
      toast.success('Contact modifié avec succès')
    },
    [setLicenses]
  )

  const deleteContact = useCallback(
    (licenseId: string, contactId: string) => {
      setLicenses((prev) =>
        prev.map((license) =>
          license.id === licenseId
            ? {
                ...license,
                contacts: license.contacts.filter((contact) => contact.id !== contactId),
                updatedAt: new Date().toISOString(),
              }
            : license
        )
      )
      toast.success('Contact supprimé avec succès')
    },
    [setLicenses]
  )

  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(licenses, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `medical-contacts-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('Données exportées avec succès')
  }, [licenses])

  const importData = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string) as License[]
          if (!Array.isArray(importedData)) {
            throw new Error('Format invalide')
          }
          setLicenses((prev) => {
            const existingIds = new Set(prev.map((l) => l.id))
            const newLicenses = importedData.filter((l) => !existingIds.has(l.id))
            return [...prev, ...newLicenses]
          })
          toast.success(`${importedData.length} licence(s) importée(s) avec succès`)
        } catch {
          toast.error("Erreur lors de l'import des données")
        }
      }
      reader.readAsText(file)
    },
    [setLicenses]
  )

  return {
    licenses,
    addLicense,
    updateLicense,
    deleteLicense,
    addContact,
    updateContact,
    deleteContact,
    exportData,
    importData,
  }
}
