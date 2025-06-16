export type PersonaProfile = {
  name: string
  personality: string
  interests: string[]
  summary: string
  postingFrequency?: string
  toneConfidence?: number
  brandFit?: string
  growthSuggestions?: string
}

export interface FullPersona extends PersonaProfile {
  vibe?: string;
  tone?: string;
  goals?: string[];
  platforms?: string[];
}
