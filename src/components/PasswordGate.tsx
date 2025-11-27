import { useState } from 'react'
import { Lock, Eye, EyeOff, Stethoscope, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface PasswordGateProps {
  onSuccess: () => void
}

const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD || 'easycontacts2024'

export function PasswordGate({ onSuccess }: PasswordGateProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === APP_PASSWORD) {
      localStorage.setItem('app-authenticated', 'true')
      onSuccess()
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-cyan-50 flex items-center justify-center p-4">
      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      </div>

      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-violet-500/10 p-8 w-full max-w-md border border-violet-100">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl blur-lg opacity-50 animate-pulse" />
            <div className="relative p-4 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25">
              <Stethoscope className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent flex items-center gap-2">
            EasyContacts
            <Sparkles className="h-5 w-5 text-amber-400" />
          </h1>
          <p className="text-gray-500 text-sm mt-2">Entrez le mot de passe pour accéder</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className={`pl-11 pr-11 h-12 rounded-xl border-2 transition-all ${
                error
                  ? 'border-red-400 bg-red-50 animate-shake'
                  : 'border-violet-200 focus:border-violet-400'
              }`}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center font-medium">
              Mot de passe incorrect
            </p>
          )}

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30 text-base font-semibold"
          >
            Accéder
          </Button>
        </form>
      </div>
    </div>
  )
}
