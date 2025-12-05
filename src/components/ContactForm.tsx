import { useState } from 'react'
import { UserPlus, Phone, Smartphone, Briefcase, MessageSquare, Mail, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import type { Contact, Phone as PhoneType } from '@/types'
import { ROLE_SUGGESTIONS } from '@/types'

interface ContactFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<Contact, 'id'>) => void
  initialData?: Contact
}

export function ContactForm({ open, onOpenChange, onSubmit, initialData }: ContactFormProps) {
  const [firstName, setFirstName] = useState(initialData?.firstName ?? '')
  const [lastName, setLastName] = useState(initialData?.lastName ?? '')
  const [role, setRole] = useState(initialData?.role ?? '')
  const [phones, setPhones] = useState<PhoneType[]>(initialData?.phones ?? [{ number: '', type: 'pro' }])
  const [emails, setEmails] = useState<string[]>(initialData?.emails ?? [''])
  const [notes, setNotes] = useState(initialData?.notes ?? '')
  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim() || !role.trim()) return
    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      role: role.trim(),
      phones: phones.filter(phone => phone.number.trim() !== ''),
      emails: emails.filter(email => email.trim() !== ''),
      notes: notes.trim() || undefined,
    })
    if (!initialData) {
      setFirstName('')
      setLastName('')
      setRole('')
      setPhones([{ number: '', type: 'pro' }])
      setEmails([''])
      setNotes('')
    }
    onOpenChange(false)
  }

  const resetForm = () => {
    setFirstName(initialData?.firstName ?? '')
    setLastName(initialData?.lastName ?? '')
    setRole(initialData?.role ?? '')
    setPhones(initialData?.phones ?? [{ number: '', type: 'pro' }])
    setEmails(initialData?.emails ?? [''])
    setNotes(initialData?.notes ?? '')
  }

  const addPhone = () => {
    setPhones([...phones, { number: '', type: 'pro' }])
  }

  const removePhone = (index: number) => {
    if (phones.length > 1) {
      setPhones(phones.filter((_, i) => i !== index))
    }
  }

  const updatePhone = (index: number, field: 'number' | 'type', value: string) => {
    const newPhones = [...phones]
    if (field === 'type' && (value === 'pro' || value === 'perso')) {
      newPhones[index].type = value
    } else if (field === 'number') {
      newPhones[index].number = value
    }
    setPhones(newPhones)
  }

  const addEmail = () => {
    setEmails([...emails, ''])
  }

  const removeEmail = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index))
    }
  }

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails]
    newEmails[index] = value
    setEmails(newEmails)
  }

  const filteredSuggestions = ROLE_SUGGESTIONS.filter((s) =>
    s.toLowerCase().includes(role.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm()
      onOpenChange(isOpen)
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            {initialData ? 'Modifier le contact' : 'Nouveau contact'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Prénom *</label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jean"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom *</label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Dupont"
                required
              />
            </div>
          </div>
          <div className="space-y-2 relative">
            <label className="text-sm font-medium flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              Rôle / Fonction *
            </label>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              onFocus={() => setShowRoleSuggestions(true)}
              onBlur={() => setTimeout(() => setShowRoleSuggestions(false), 200)}
              placeholder="Ex: Médecin radiologue"
              required
            />
            {showRoleSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                    onMouseDown={() => {
                      setRole(suggestion)
                      setShowRoleSuggestions(false)
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Téléphone(s)
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addPhone}
                className="h-7 px-2 text-xs hover:bg-primary/10 hover:text-primary"
              >
                <Plus className="h-3 w-3 mr-1" />
                Ajouter
              </Button>
            </div>
            <div className="space-y-2">
              {phones.map((phone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={phone.type}
                    onChange={(e) => updatePhone(index, 'type', e.target.value)}
                    className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    <option value="pro">Pro</option>
                    <option value="perso">Perso</option>
                  </select>
                  <Input
                    value={phone.number}
                    onChange={(e) => updatePhone(index, 'number', e.target.value)}
                    placeholder="01 23 45 67 89"
                    type="tel"
                    className="flex-1"
                  />
                  {phones.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePhone(index)}
                      className="h-10 w-10 shrink-0 hover:bg-red-100 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Adresse(s) email
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addEmail}
                className="h-7 px-2 text-xs hover:bg-primary/10 hover:text-primary"
              >
                <Plus className="h-3 w-3 mr-1" />
                Ajouter
              </Button>
            </div>
            <div className="space-y-2">
              {emails.map((email, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    placeholder="exemple@email.com"
                    type="email"
                    className="flex-1"
                  />
                  {emails.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEmail(index)}
                      className="h-10 w-10 shrink-0 hover:bg-red-100 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              Remarques
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez des remarques ou notes sur ce contact..."
              className="w-full min-h-[80px] px-3 py-2 rounded-lg border border-border bg-background text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {initialData ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
