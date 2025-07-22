"use client";
import React from 'react';
import { useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import PersonaPDF from '../../../../components/pdf/PersonaPDF'

export default function GeneratePersonaPage() {
  const [step, setStep] = useState(0)
  const [niche, setNiche] = useState('')
  const [tone, setTone] = useState('')
  const [audience, setAudience] = useState('')
  const [values, setValues] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const stripHtml = (html: string) => html.replace(/<[^>]+>/g, '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handle: 'creator',
          vibe: tone,
          goal: 'grow',
          audience,
          contentPreference: niche,
          platform: 'instagram',
          values,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setResult(data.result as string)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)


  const handleSave = async () => {
    if (!result) return;
    try {
      await fetch("/api/personas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Persona", persona: result }),
      });
    } catch (err) {
      console.error(err);
    }
  }

  const questions = [
    { label: "What niche are you in?", value: niche, setter: setNiche, placeholder: "travel, tech..." },
    { label: "Choose a tone for your brand", value: tone, setter: setTone, placeholder: "friendly, bold..." },
    { label: "How big is your audience?", value: audience, setter: setAudience, placeholder: "10k followers" },
    { label: "List your core values", value: values, setter: setValues, placeholder: "authenticity, fun" },
  ] as const

    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Generate Persona</h1>
      <form onSubmit={handleSubmit} className="space-y-4 border border-white/10 p-4 rounded-md">
        <label className="block text-sm font-semibold mb-1">{questions[step].label}</label>
        <input
          className="w-full p-2 rounded-md bg-zinc-800 text-white"
          placeholder={questions[step].placeholder}
          value={questions[step].value}
          onChange={e => questions[step].setter(e.target.value)}
          required
        />
        <div className="flex justify-between items-center">
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)} className="px-3 py-1 rounded bg-zinc-700 text-white">
              Back
            </button>
          )}
          {step < questions.length - 1 ? (
            <button type="button" onClick={() => setStep(step + 1)} className="px-3 py-1 rounded bg-zinc-700 text-white">
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md disabled:opacity-50"
              disabled={loading || !niche || !tone || !audience || !values}
            >
              {loading ? 'Generating...' : 'Generate My Persona'}
            </button>
          )}
        </div>
        <div className="h-2 bg-zinc-800 rounded">
          <div className="h-full bg-indigo-600 rounded" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
        </div>
        <p className="text-center text-sm text-foreground/60">Step {step + 1} of {questions.length}</p>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
        {result && (
          <>
            <div
              className="prose prose-invert border border-white/10 p-4 rounded-md"
              dangerouslySetInnerHTML={{ __html: result }}
            />
            <PDFDownloadLink
              document={
                <PersonaPDF
                  data={{
                    persona: stripHtml(result),
                    tone,
                    date: new Date().toLocaleDateString(),
                  }}
                />
              }
              fileName={`persona.pdf`}
            >
              {({ loading: pdfLoading }) => (
                <button
                  type="button"
                  className="mt-4 bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md disabled:opacity-50"
                  disabled={pdfLoading}
                >
                  {pdfLoading ? 'Preparing...' : 'Download Persona PDF'}
                </button>
              )}
            </PDFDownloadLink>
            <button
              type="button"
              onClick={handleSave}
              className="mt-2 bg-green-600 hover:bg-green-500 transition-colors duration-200 text-white px-4 py-2 rounded-md"
            >
              Save to DB
            </button>
          </>
        )}
    </main>
  );
}
