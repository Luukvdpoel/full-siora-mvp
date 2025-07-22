"use client";
import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PersonaPDF from '../../../../components/pdf/PersonaPDF';

export default function GeneratePersonaPage() {
  const [handle, setHandle] = useState('');
  const [niche, setNiche] = useState('');
  const [audience, setAudience] = useState('');
  const [goal, setGoal] = useState('');
  const [tone, setTone] = useState('');
  const [platforms, setPlatforms] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const stripHtml = (html: string) => html.replace(/<[^>]+>/g, '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handle,
          vibe: tone,
          goal,
          audience,
          contentPreference: niche,
          platform: platforms,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setResult(data.result as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Generate Persona</h1>
      <form onSubmit={handleSubmit} className="space-y-4 border border-white/10 p-4 rounded-md">
        <input className="w-full p-2 rounded-md bg-zinc-800 text-white" placeholder="@handle" value={handle} onChange={e => setHandle(e.target.value)} required />
        <input className="w-full p-2 rounded-md bg-zinc-800 text-white" placeholder="Niche" value={niche} onChange={e => setNiche(e.target.value)} required />
        <input className="w-full p-2 rounded-md bg-zinc-800 text-white" placeholder="Audience" value={audience} onChange={e => setAudience(e.target.value)} required />
        <input className="w-full p-2 rounded-md bg-zinc-800 text-white" placeholder="Goal" value={goal} onChange={e => setGoal(e.target.value)} required />
        <input className="w-full p-2 rounded-md bg-zinc-800 text-white" placeholder="Tone" value={tone} onChange={e => setTone(e.target.value)} required />
        <input className="w-full p-2 rounded-md bg-zinc-800 text-white" placeholder="Platforms" value={platforms} onChange={e => setPlatforms(e.target.value)} required />
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md disabled:opacity-50" disabled={loading}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
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
                  niche,
                  highlights: goal,
                  handle,
                }}
              />
            }
            fileName={`${handle || 'persona'}.pdf`}
          >
            {({ loading: pdfLoading }) => (
              <button
                type="button"
                className="mt-4 bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md disabled:opacity-50"
                disabled={pdfLoading}
              >
                {pdfLoading ? 'Preparing...' : 'Download PDF'}
              </button>
            )}
          </PDFDownloadLink>
        </>
      )}
    </main>
  );
}
