export interface ProfileSettings {
  bio: string
  tone: string
  formats: string[]
  collabTypes: string[]
}

const STORAGE_KEY = 'profileSettings'

export function saveProfileSettings(data: ProfileSettings) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (err) {
    console.error('Failed to save profile settings', err)
  }
}

export function loadProfileSettings(): ProfileSettings | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as ProfileSettings
  } catch (err) {
    console.error('Failed to load profile settings', err)
  }
  return null
}
