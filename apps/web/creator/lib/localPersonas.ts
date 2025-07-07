export interface StoredPersona {
  persona: import("@creator/types/persona").PersonaProfile;
  timestamp: string;
}

export function savePersonaToLocal(persona: import("@creator/types/persona").PersonaProfile) {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem("savedPersonas");
    let list: StoredPersona[] = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(list)) list = [];
    list.unshift({ persona, timestamp: new Date().toISOString() });
    localStorage.setItem("savedPersonas", JSON.stringify(list));
  } catch (err) {
    console.error("Failed to save persona locally", err);
  }
}

export function loadPersonasFromLocal(): StoredPersona[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("savedPersonas");
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) return parsed as StoredPersona[];
  } catch (err) {
    console.error("Failed to load personas from localStorage", err);
  }
  return [];
}
