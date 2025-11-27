import { useState } from 'react'
import { Building2, MapPin, FileText, Plug, Settings, Shield, MessageSquare, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import type { License, LicenseType, LicenseMode, ConnectorType, LicenseOption } from '@/types'
import { LICENSE_TYPE_LABELS, LICENSE_MODE_LABELS, CONNECTORS, LICENSE_OPTIONS } from '@/types'

interface LicenseFormData {
  licenseNumber: string
  name: string
  type: LicenseType
  mode: LicenseMode
  address?: string
  postalCode?: string
  city?: string
  connector?: ConnectorType
  options: LicenseOption[]
  isFitCenter: boolean
  notes?: string
}

interface LicenseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: LicenseFormData) => void
  initialData?: License
}

export function LicenseForm({ open, onOpenChange, onSubmit, initialData }: LicenseFormProps) {
  const [licenseNumber, setLicenseNumber] = useState(initialData?.licenseNumber ?? '')
  const [name, setName] = useState(initialData?.name ?? '')
  const [type, setType] = useState<LicenseType>(initialData?.type ?? 'imagerie')
  const [mode, setMode] = useState<LicenseMode>(initialData?.mode ?? 'full')
  const [address, setAddress] = useState(initialData?.address ?? '')
  const [postalCode, setPostalCode] = useState(initialData?.postalCode ?? '')
  const [city, setCity] = useState(initialData?.city ?? '')
  const [connector, setConnector] = useState<ConnectorType>(initialData?.connector ?? null)
  const [options, setOptions] = useState<LicenseOption[]>(initialData?.options ?? [])
  const [isFitCenter, setIsFitCenter] = useState(initialData?.isFitCenter ?? false)
  const [notes, setNotes] = useState(initialData?.notes ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!licenseNumber.trim() || !name.trim()) return
    onSubmit({
      licenseNumber: licenseNumber.trim(),
      name: name.trim(),
      type,
      mode,
      address: address.trim() || undefined,
      postalCode: postalCode.trim() || undefined,
      city: city.trim() || undefined,
      connector,
      options,
      isFitCenter,
      notes: notes.trim() || undefined,
    })
    if (!initialData) {
      setLicenseNumber('')
      setName('')
      setType('imagerie')
      setMode('full')
      setAddress('')
      setPostalCode('')
      setCity('')
      setConnector(null)
      setOptions([])
      setIsFitCenter(false)
      setNotes('')
    }
    onOpenChange(false)
  }

  const resetForm = () => {
    setLicenseNumber(initialData?.licenseNumber ?? '')
    setName(initialData?.name ?? '')
    setType(initialData?.type ?? 'imagerie')
    setMode(initialData?.mode ?? 'full')
    setAddress(initialData?.address ?? '')
    setPostalCode(initialData?.postalCode ?? '')
    setCity(initialData?.city ?? '')
    setConnector(initialData?.connector ?? null)
    setOptions(initialData?.options ?? [])
    setIsFitCenter(initialData?.isFitCenter ?? false)
    setNotes(initialData?.notes ?? '')
  }

  const toggleOption = (option: LicenseOption) => {
    setOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm()
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {initialData ? 'Modifier la licence' : 'Nouvelle licence'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Numéro de licence *
            </label>
            <Input
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder="Ex: LIC-2024-001"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom de l'établissement *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Centre d'Imagerie du Parc"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Type d'établissement *</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(LICENSE_TYPE_LABELS) as [LicenseType, string][]).map(
                ([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setType(value)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      type === value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50 hover:bg-muted'
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              Mode de licence *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(LICENSE_MODE_LABELS) as [LicenseMode, string][]).map(
                ([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setMode(value)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      mode === value
                        ? value === 'full'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                          : 'border-amber-500 bg-amber-500/10 text-amber-600'
                        : 'border-border hover:border-primary/50 hover:bg-muted'
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Adresse
            </label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex: 123 Avenue de la Santé"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Code postal</label>
              <Input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Ex: 75001"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ville</label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: Paris"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Plug className="h-4 w-4 text-muted-foreground" />
              Connecteur
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CONNECTORS.map((c) => (
                <button
                  key={c.value ?? 'none'}
                  type="button"
                  onClick={() => setConnector(c.value)}
                  className={`p-2 rounded-lg border text-sm font-medium transition-all ${
                    connector === c.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 hover:bg-muted'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              Options
            </label>
            <div className="grid grid-cols-2 gap-2">
              {LICENSE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleOption(opt.value)}
                  className={`p-2 rounded-lg border text-sm font-medium transition-all text-left ${
                    options.includes(opt.value)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 hover:bg-muted'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        options.includes(opt.value)
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'border-muted-foreground'
                      }`}
                    >
                      {options.includes(opt.value) && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setIsFitCenter(!isFitCenter)}
              className={`w-full p-3 rounded-lg border text-sm font-medium transition-all flex items-center gap-3 ${
                isFitCenter
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50 hover:bg-muted'
              }`}
            >
              <Shield className={`h-5 w-5 ${isFitCenter ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="flex-1 text-left">
                <div className="font-medium">Centre FIT</div>
                <div className="text-xs text-muted-foreground">
                  Cochez si cet établissement est un centre de dépistage FIT
                </div>
              </div>
              <span
                className={`w-5 h-5 rounded border flex items-center justify-center ${
                  isFitCenter
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-muted-foreground'
                }`}
              >
                {isFitCenter && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              Remarques
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez des remarques ou notes sur cette licence..."
              className="w-full min-h-[80px] px-3 py-2 rounded-lg border border-border bg-background text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">{initialData ? 'Enregistrer' : 'Ajouter'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
