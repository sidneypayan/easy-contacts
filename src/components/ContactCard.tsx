import { useState } from 'react'
import { Pencil, Trash2, Phone, Smartphone, User, MessageSquare, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import type { Contact } from '@/types'
import { ContactForm } from './ContactForm'

interface ContactCardProps {
  contact: Contact
  onUpdate: (data: Partial<Omit<Contact, 'id'>>) => void
  onDelete: () => void
  /** Props pour personnaliser le formulaire d'édition */
  formProps?: {
    enableRoleSuggestions?: boolean
    roleLabel?: string
    rolePlaceholder?: string
  }
}

const avatarGradients = [
  'from-violet-400 to-purple-500',
  'from-pink-400 to-rose-500',
  'from-cyan-400 to-blue-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
  'from-fuchsia-400 to-pink-500',
]

export function ContactCard({ contact, onUpdate, onDelete, formProps }: ContactCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const initials = `${contact.firstName[0]}${contact.lastName[0]}`.toUpperCase()
  const gradientIndex = (contact.firstName.charCodeAt(0) + contact.lastName.charCodeAt(0)) % avatarGradients.length
  const gradient = avatarGradients[gradientIndex]

  return (
    <>
      <div className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-violet-200 hover:shadow-md hover:shadow-violet-500/5 transition-all">
        <Avatar className="h-11 w-11 shrink-0 ring-2 ring-white shadow-md">
          <AvatarFallback className={`bg-gradient-to-br ${gradient} text-white text-sm font-bold`}>
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-gray-800 truncate">
              {contact.firstName} {contact.lastName}
            </span>
          </div>
          <p className="text-xs text-gray-500 truncate font-medium">{contact.role}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {contact.phones && contact.phones.map((phone, phoneIndex) => (
              phone.number && (
                <a
                  key={phoneIndex}
                  href={`tel:${phone.number}`}
                  className={`flex items-center gap-1.5 text-xs text-gray-400 transition-colors group/phone ${
                    phone.type === 'pro' ? 'hover:text-fuchsia-600' : 'hover:text-cyan-600'
                  }`}
                  title={`Téléphone ${phone.type === 'pro' ? 'professionnel' : 'personnel'}`}
                >
                  <div className={`p-1 rounded-md bg-gray-100 transition-colors ${
                    phone.type === 'pro' ? 'group-hover/phone:bg-fuchsia-100' : 'group-hover/phone:bg-cyan-100'
                  }`}>
                    {phone.type === 'pro' ? (
                      <Smartphone className="h-3 w-3" />
                    ) : (
                      <Phone className="h-3 w-3" />
                    )}
                  </div>
                  <span className="font-medium">{phone.type === 'pro' ? 'Pro:' : 'Perso:'}</span> {phone.number}
                </a>
              )
            ))}
          </div>
          {contact.emails && contact.emails.length > 0 && (
            <div className="flex items-start gap-1.5 mt-1.5 flex-wrap">
              {contact.emails.map((email, index) => (
                <a
                  key={index}
                  href={`mailto:${email}`}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 transition-colors group/email"
                  title={email}
                >
                  <div className="p-1 rounded-md bg-gray-100 group-hover/email:bg-blue-100 transition-colors">
                    <Mail className="h-3 w-3" />
                  </div>
                  <span className="truncate max-w-[150px]">{email}</span>
                </a>
              ))}
            </div>
          )}
          {contact.notes && (
            <div className="flex items-start gap-1.5 mt-1.5">
              <MessageSquare className="h-3 w-3 text-gray-400 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-500 italic line-clamp-2">{contact.notes}</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-violet-100 hover:text-violet-600"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-red-100 hover:text-red-600"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <ContactForm
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={onUpdate}
        initialData={contact}
        enableRoleSuggestions={formProps?.enableRoleSuggestions}
        roleLabel={formProps?.roleLabel}
        rolePlaceholder={formProps?.rolePlaceholder}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <div className="p-2 rounded-xl bg-red-100">
                <User className="h-5 w-5" />
              </div>
              Supprimer le contact
            </DialogTitle>
            <DialogDescription className="pt-2">
              Êtes-vous sûr de vouloir supprimer <span className="font-semibold text-gray-700">{contact.firstName} {contact.lastName}</span> ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} className="rounded-xl">
              Annuler
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl bg-gradient-to-r from-red-500 to-rose-500"
              onClick={() => {
                onDelete()
                setDeleteOpen(false)
              }}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
