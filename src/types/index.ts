export interface Phone {
  number: string
  type: 'pro' | 'perso'
}

export interface Contact {
  id: string
  firstName: string
  lastName: string
  role: string
  phones: Phone[]
  emails: string[]
  notes?: string
}

export type ConnectorType = 'xplore' | 'gxd5' | 'venus' | 'onemanager' | 'evolucare'

export type LicenseMode = 'full' | 'light'

export type PlanningType = 'easydoct' | 'momentum' | 'swappy' | 'genesis'

export type PortalType = 'easydoct' | 'vidi'

export type LicenseOption =
  | 'allodoct'
  | 'courrier_postal'
  | 'diffusion_cr'
  | 'scanner'
  | 'demandes_rdv'

export interface License {
  id: string
  licenseNumber: string
  name: string
  type: 'imagerie' | 'maison_sante'
  mode: LicenseMode
  address?: string
  postalCode?: string
  city?: string
  portal: PortalType
  connector: ConnectorType
  hasWebserviceRequests: boolean
  planning: PlanningType
  options: LicenseOption[]
  isFitCenter: boolean
  notes?: string
  contacts: Contact[]
  createdAt: string
  updatedAt: string
}

export type LicenseType = License['type']

export const LICENSE_TYPE_LABELS: Record<LicenseType, string> = {
  imagerie: "Centre d'imagerie médicale",
  maison_sante: 'Maison de santé',
}

export const CONNECTOR_LABELS: Record<ConnectorType, string> = {
  xplore: 'Xplore',
  gxd5: 'GxD5',
  venus: 'Venus',
  onemanager: 'Onemanager',
  evolucare: 'Evolucare',
}

export const LICENSE_MODE_LABELS: Record<LicenseMode, string> = {
  full: 'Full',
  light: 'Light',
}

export const PORTAL_LABELS: Record<PortalType, string> = {
  easydoct: 'Easydoct',
  vidi: 'VIDI',
}

export const PORTALS: { value: PortalType; label: string }[] = [
  { value: 'easydoct', label: 'Easydoct' },
  { value: 'vidi', label: 'VIDI' },
]

export const PLANNING_LABELS: Record<PlanningType, string> = {
  easydoct: 'Easydoct',
  momentum: 'Momentum',
  swappy: 'Swappy',
  genesis: 'Genesis',
}

export const PLANNINGS: { value: PlanningType; label: string }[] = [
  { value: 'easydoct', label: 'Easydoct' },
  { value: 'momentum', label: 'Momentum' },
  { value: 'swappy', label: 'Swappy' },
  { value: 'genesis', label: 'Genesis' },
]

export const CONNECTORS: { value: ConnectorType; label: string }[] = [
  { value: 'xplore', label: 'Xplore' },
  { value: 'gxd5', label: 'GxD5' },
  { value: 'venus', label: 'Venus' },
  { value: 'onemanager', label: 'Onemanager' },
  { value: 'evolucare', label: 'Evolucare' },
]

export const LICENSE_OPTIONS: { value: LicenseOption; label: string }[] = [
  { value: 'allodoct', label: 'Allodoct' },
  { value: 'courrier_postal', label: 'Courrier postal' },
  { value: 'diffusion_cr', label: 'Diffusion des comptes rendus' },
  { value: 'scanner', label: 'Scanner' },
  { value: 'demandes_rdv', label: 'Demandes de rendez-vous' },
]

export const ROLE_SUGGESTIONS = [
  'Médecin radiologue',
  'Manipulateur radio',
  'Secrétaire médicale',
  'Directeur',
  'Technicien',
  'Responsable administratif',
  'Médecin généraliste',
  'Coordinateur',
]

export interface LicenseFilters {
  isFitCenter: boolean | null
  mode: LicenseMode | null
  type: LicenseType | null
  connector: ConnectorType | 'any' | null
  options: LicenseOption[]
}
