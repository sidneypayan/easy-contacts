import { useState } from 'react'
import {
  Building2,
  MapPin,
  Pencil,
  Trash2,
  UserPlus,
  ChevronRight,
  Users,
  FileText,
  Plug,
  Shield,
  Phone,
  Smartphone,
  MessageSquare,
  Layers,
  Calendar,
  Globe,
  Network,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { License, Contact } from '@/types'
import { LICENSE_TYPE_LABELS, LICENSE_MODE_LABELS, CONNECTOR_LABELS, PLANNING_LABELS, PORTAL_LABELS, BRAND_LABELS } from '@/types'
import { LicenseForm } from './LicenseForm'
import { ContactForm } from './ContactForm'

interface LicenseListItemProps {
  license: License
  expanded: boolean
  onToggleExpanded: () => void
  onUpdate: (data: Partial<Omit<License, 'id' | 'contacts' | 'createdAt'>>) => void
  onDelete: () => void
  onAddContact: (contact: Omit<Contact, 'id'>) => void
  onUpdateContact: (contactId: string, data: Partial<Omit<Contact, 'id'>>) => void
  onDeleteContact: (contactId: string) => void
}

const gradients = [
  'from-violet-500 to-purple-500',
  'from-fuchsia-500 to-pink-500',
  'from-cyan-500 to-blue-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
]

export function LicenseListItem({
  license,
  expanded,
  onToggleExpanded,
  onUpdate,
  onDelete,
  onAddContact,
  onUpdateContact,
  onDeleteContact,
}: LicenseListItemProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [addContactOpen, setAddContactOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null)

  const gradientIndex = license.id.charCodeAt(0) % gradients.length
  const gradient = gradients[gradientIndex]

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 hover:border-violet-200 hover:shadow-md transition-all overflow-hidden">
        {/* Main row */}
        <div
          className="flex items-center gap-4 p-4 cursor-pointer"
          onClick={onToggleExpanded}
        >
          {/* Icon */}
          <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} text-white shadow-md shrink-0`}>
            <Building2 className="h-4 w-4" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 items-center">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800 truncate">{license.name}</span>
                {license.brand && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 text-white text-[10px] font-bold">
                    <Shield className="h-2.5 w-2.5" />
                    {BRAND_LABELS[license.brand]}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500">{LICENSE_TYPE_LABELS[license.type]}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-gray-400" />
                <span className="font-medium">{license.licenseNumber}</span>
              </span>
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                license.mode === 'full'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                <Layers className="h-2.5 w-2.5" />
                {LICENSE_MODE_LABELS[license.mode]}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {license.connector && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-medium">
                  <Plug className="h-3 w-3" />
                  {CONNECTOR_LABELS[license.connector]}
                </span>
              )}
              {license.portals && license.portals.map((portal) => (
                <span key={portal} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-100 text-teal-700 text-xs font-medium">
                  <Globe className="h-3 w-3" />
                  {PORTAL_LABELS[portal]}
                </span>
              ))}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-xs font-medium">
                <Calendar className="h-3 w-3" />
                {PLANNING_LABELS[license.planning]}
              </span>
              {license.hasWebserviceRequests && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 text-xs font-medium">
                  <Network className="h-3 w-3" />
                  WS
                </span>
              )}
              {(license.address || license.postalCode || license.city) && (
                <span className="hidden lg:flex items-center gap-1 text-xs text-gray-400 truncate">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">
                    {[license.address, [license.postalCode, license.city].filter(Boolean).join(' ')].filter(Boolean).join(', ')}
                  </span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Users className="h-3.5 w-3.5" />
              <span>{license.contacts.length} contact{license.contacts.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-violet-100 hover:text-violet-600"
              onClick={(e) => {
                e.stopPropagation()
                setEditOpen(true)
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-red-100 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation()
                setDeleteOpen(true)
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            <div className={`p-1.5 rounded-lg bg-gray-100 transition-transform ${expanded ? 'rotate-90' : ''}`}>
              <ChevronRight className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Expanded contacts */}
        {expanded && (
          <div className="border-t border-dashed border-gray-200 bg-gray-50/50 p-4">
            {/* Remarques connecteur */}
            {license.connectorNotes && (
              <div className="mb-4 p-2.5 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-start gap-2">
                  <Plug className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-blue-700 mb-0.5">Remarques connecteur</p>
                    <p className="text-xs text-blue-800 whitespace-pre-wrap">{license.connectorNotes}</p>
                  </div>
                </div>
              </div>
            )}
            {/* Remarques */}
            {license.notes && (
              <div className="mb-4 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-800 whitespace-pre-wrap">{license.notes}</p>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contacts</span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs rounded-lg border-violet-300 text-violet-600 hover:bg-violet-50"
                onClick={() => setAddContactOpen(true)}
              >
                <UserPlus className="h-3 w-3 mr-1" />
                Ajouter
              </Button>
            </div>
            {license.contacts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Aucun contact</p>
            ) : (
              <div className="space-y-2">
                {license.contacts.map((contact) => {
                  const initials = `${contact.firstName[0]}${contact.lastName[0]}`.toUpperCase()
                  return (
                    <div
                      key={contact.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-white border border-gray-100 hover:border-violet-200 transition-colors group"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-violet-400 to-fuchsia-500 text-white text-xs font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div>
                          <span className="font-medium text-sm text-gray-800">
                            {contact.firstName} {contact.lastName}
                          </span>
                          <p className="text-xs text-gray-500">{contact.role}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          {contact.phones && contact.phones.map((phone, phoneIndex) => (
                            phone.number && (
                              <a
                                key={phoneIndex}
                                href={`tel:${phone.number}`}
                                className={`flex items-center gap-1 text-xs text-gray-500 ${
                                  phone.type === 'pro' ? 'hover:text-fuchsia-600' : 'hover:text-cyan-600'
                                }`}
                                title={`Téléphone ${phone.type === 'pro' ? 'professionnel' : 'personnel'}`}
                              >
                                {phone.type === 'pro' ? (
                                  <Smartphone className="h-3 w-3" />
                                ) : (
                                  <Phone className="h-3 w-3" />
                                )}
                                <span className="font-medium">{phone.type === 'pro' ? 'Pro:' : 'Perso:'}</span> {phone.number}
                              </a>
                            )
                          ))}
                        </div>
                        {contact.emails && contact.emails.length > 0 && (
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {contact.emails.map((email, index) => (
                              <a
                                key={index}
                                href={`mailto:${email}`}
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600"
                                title={email}
                              >
                                <Mail className="h-3 w-3" />
                                <span className="truncate max-w-[150px]">{email}</span>
                              </a>
                            ))}
                          </div>
                        )}
                        {contact.notes && (
                          <p className="text-xs text-gray-500 italic mt-1 line-clamp-1">{contact.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-lg hover:bg-violet-100 hover:text-violet-600"
                          onClick={() => setEditingContact(contact)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-lg hover:bg-red-100 hover:text-red-600"
                          onClick={() => setDeletingContact(contact)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <LicenseForm
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={onUpdate}
        initialData={license}
      />

      <ContactForm
        open={addContactOpen}
        onOpenChange={setAddContactOpen}
        onSubmit={onAddContact}
      />

      <ContactForm
        open={!!editingContact}
        onOpenChange={(open) => !open && setEditingContact(null)}
        onSubmit={(data) => {
          if (editingContact) {
            onUpdateContact(editingContact.id, data)
            setEditingContact(null)
          }
        }}
        initialData={editingContact ?? undefined}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <div className="p-2 rounded-xl bg-red-100">
                <Trash2 className="h-5 w-5" />
              </div>
              Supprimer la licence
            </DialogTitle>
            <DialogDescription className="pt-2">
              Supprimer <span className="font-semibold text-gray-700">"{license.name}"</span> et tous ses contacts ?
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

      <Dialog open={!!deletingContact} onOpenChange={(open) => !open && setDeletingContact(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <div className="p-2 rounded-xl bg-red-100">
                <Trash2 className="h-5 w-5" />
              </div>
              Supprimer le contact
            </DialogTitle>
            <DialogDescription className="pt-2">
              Supprimer <span className="font-semibold text-gray-700">{deletingContact?.firstName} {deletingContact?.lastName}</span> ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeletingContact(null)} className="rounded-xl">
              Annuler
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl bg-gradient-to-r from-red-500 to-rose-500"
              onClick={() => {
                if (deletingContact) {
                  onDeleteContact(deletingContact.id)
                  setDeletingContact(null)
                }
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
