import { useState } from 'react'
import { Database, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import type { RISEntity } from '@/types'

interface RISFormData {
  name: string
  notes?: string
}

interface RISFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: RISFormData) => void
  initialData?: RISEntity
}

export function RISForm({ open, onOpenChange, onSubmit, initialData }: RISFormProps) {
  const [name, setName] = useState(initialData?.name ?? '')
  const [notes, setNotes] = useState(initialData?.notes ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({
      name: name.trim(),
      notes: notes.trim() || undefined,
    })
    if (!initialData) {
      setName('')
      setNotes('')
    }
    onOpenChange(false)
  }

  const resetForm = () => {
    setName(initialData?.name ?? '')
    setNotes(initialData?.notes ?? '')
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm()
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            {initialData ? 'Modifier le RIS' : 'Nouveau RIS'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom du RIS *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Xplore, GxD5, Evolucare..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez des notes sur ce RIS..."
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
