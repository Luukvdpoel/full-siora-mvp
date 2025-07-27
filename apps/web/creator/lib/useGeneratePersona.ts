'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { PersonaProfile } from '@creator/types/persona';
import { generatePersonaData, PersonaInput } from './generatePersonaData';

export function useGeneratePersona() {
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState<PersonaProfile | null>(null);

  const generate = async (input: PersonaInput) => {
    setLoading(true);
    try {
      const result = await generatePersonaData(input);
      if (!result) {
        toast.error('Failed to generate persona');
        return null;
      }
      setPersona(result);
      return result;
    } catch (err) {
      toast.error('Error generating persona');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, persona, setPersona };
}
