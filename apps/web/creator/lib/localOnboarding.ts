const STORAGE_KEY = 'onboardingProgress';

export function saveOnboardingDraft(progress: Record<string, any>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save onboarding draft', err);
  }
}

export function loadOnboardingDraft(): Record<string, any> | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as Record<string, any>;
  } catch (err) {
    console.error('Failed to load onboarding draft', err);
  }
  return null;
}
