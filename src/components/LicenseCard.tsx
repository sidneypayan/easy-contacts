import { useState } from 'react'
import {
  Building2,
  MapPin,
  Pencil,
  Trash2,
  UserPlus,
  ChevronDown,
  Users,
  FileText,
  Plug,
  Shield,
  Zap,
  MessageSquare,
  Layers,
  Calendar,
  Globe,
  Network,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import type { License, Contact } from '@/types'
import { LICENSE_TYPE_LABELS, LICENSE_MODE_LABELS, CONNECTOR_LABELS, LICENSE_OPTIONS, PLANNING_LABELS, PORTAL_LABELS } from '@/types'
import { LicenseForm } from './LicenseForm'
import { ContactForm } from './ContactForm'
import { ContactCard } from './ContactCard'

interface LicenseCardProps {
  license: License
  expanded: boolean
  onToggleExpanded: () => void
  onUpdate: (data: Partial<Omit<License, 'id' | 'contacts' | 'createdAt'>>) => void
  onDelete: () => void
  onAddContact: (contact: Omit<Contact, 'id'>) => void
  onUpdateContact: (contactId: string, data: Partial<Omit<Contact, 'id'>>) => void
  onDeleteContact: (contactId: string) => void
}

const cardGradients = [
  'from-violet-500 to-purple-500',
  'from-fuchsia-500 to-pink-500',
  'from-cyan-500 to-blue-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
]

export function LicenseCard({
  license,
  expanded,
  onToggleExpanded,
  onUpdate,
  onDelete,
  onAddContact,
  onUpdateContact,
  onDeleteContact,
}: LicenseCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [addContactOpen, setAddContactOpen] = useState(false)

  const optionLabels = license.options
    ?.map((opt) => LICENSE_OPTIONS.find((o) => o.value === opt)?.label)
    .filter(Boolean)

  // Gradient basé sur le hash de l'ID
  const gradientIndex = license.id.charCodeAt(0) % cardGradients.length
  const gradient = cardGradients[gradientIndex]

  return (
    <>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm group">
        <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg shrink-0`}>
                <Building2 className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-lg text-gray-800">{license.name}</h3>
                  {license.isFitCenter && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 text-white text-xs font-bold shadow-sm">
                      <Shield className="h-3 w-3" />
                      FIT
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r ${gradient} bg-opacity-10 text-xs font-semibold`}>
                    <FileText className="h-3 w-3" />
                    {license.licenseNumber}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                    license.mode === 'full'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    <Layers className="h-3 w-3" />
                    {LICENSE_MODE_LABELS[license.mode]}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {LICENSE_TYPE_LABELS[license.type]}
                  </span>
                </div>
                {(license.address || license.postalCode || license.city) && (
                  <p className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-violet-400" />
                    <span className="truncate">
                      {[license.address, [license.postalCode, license.city].filter(Boolean).join(' ')].filter(Boolean).join(', ')}
                    </span>
                  </p>
                )}

                {/* Connecteur */}
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold shadow-sm">
                    <Plug className="h-3 w-3" />
                    {CONNECTOR_LABELS[license.connector]}
                  </span>
                </div>

                {/* Portail */}
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-teal-500 to-green-500 text-white text-xs font-semibold shadow-sm">
                    <Globe className="h-3 w-3" />
                    {PORTAL_LABELS[license.portal]}
                  </span>
                </div>

                {/* Planification */}
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold shadow-sm">
                    <Calendar className="h-3 w-3" />
                    {PLANNING_LABELS[license.planning]}
                  </span>
                </div>

                {/* Requêtes webservice */}
                {license.hasWebserviceRequests && (
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold shadow-sm">
                      <Network className="h-3 w-3" />
                      Webservice
                    </span>
                  </div>
                )}

                {/* Options */}
                {optionLabels && optionLabels.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {optionLabels.map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium"
                      >
                        <Zap className="h-2.5 w-2.5 text-amber-500" />
                        {label}
                      </span>
                    ))}
                  </div>
                )}

                {/* Remarques */}
                {license.notes && (
                  <div className="mt-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                      <p className="text-xs text-amber-800 whitespace-pre-wrap">{license.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-violet-100 hover:text-violet-600"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-red-100 hover:text-red-600"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="border-t border-dashed border-gray-200 pt-3">
            <button
              onClick={onToggleExpanded}
              className="flex items-center justify-between w-full text-sm font-semibold text-gray-500 hover:text-violet-600 transition-colors"
            >
              <span className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-violet-100">
                  <Users className="h-3.5 w-3.5 text-violet-600" />
                </div>
                {license.contacts.length} contact{license.contacts.length !== 1 ? 's' : ''}
              </span>
              <div className={`p-1 rounded-lg bg-gray-100 transition-transform ${expanded ? 'rotate-180' : ''}`}>
                <ChevronDown className="h-4 w-4" />
              </div>
            </button>
            {expanded && (
              <div className="mt-3 space-y-2">
                {license.contacts.length === 0 ? (
                  <div className="text-center py-6 px-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-200">
                    <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400 font-medium">
                      Aucun contact pour cette licence
                    </p>
                  </div>
                ) : (
                  license.contacts.map((contact) => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      onUpdate={(data) => onUpdateContact(contact.id, data)}
                      onDelete={() => onDeleteContact(contact.id)}
                    />
                  ))
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 rounded-xl border-dashed border-violet-300 text-violet-600 hover:bg-violet-50 hover:border-violet-400 transition-all"
                  onClick={() => setAddContactOpen(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter un contact
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
              Êtes-vous sûr de vouloir supprimer <span className="font-semibold text-gray-700">"{license.name}"</span> et tous ses contacts associés ?
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
