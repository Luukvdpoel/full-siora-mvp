"use client";
import { useState } from "react";

export default function GeneratePersonaPage() {
  const [step, setStep] = useState(0);
  const [niche, setNiche] = useState("");
  const [tone, setTone] = useState("");
  const [audience, setAudience] = useState("");
  const [values, setValues] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const questions = [
    { label: "What niche are you in?", value: niche, setter: setNiche, placeholder: "fashion, tech..." },
    { label: "Describe your tone", value: tone, setter: setTone, placeholder: "fun, professional..." },
    { label: "Audience size", value: audience, setter: setAudience, placeholder: "10k, 100k..." },
    { label: "Core values", value: values, setter: setValues, placeholder: "authentic, bold..." },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle: "creator",
          vibe: tone,
          goal: "grow audience",
          audience,
          contentPreference: niche,
          platform: "social",
          struggles: values,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setResult(data.result as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await fetch("/api/personas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Persona", persona: result }),
      });
      alert("Saved!");
    } catch (err) {
      alert("Error saving persona");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Generate Persona</h1>
      <form onSubmit={handleSubmit} className="space-y-4 border border-white/10 p-4 rounded-md">
        <label className="block mb-1">{questions[step].label}</label>
        <input
          className="w-full p-2 rounded-md bg-zinc-800 text-white"
          placeholder={questions[step].placeholder}
          value={questions[step].value}
          onChange={(e) => questions[step].setter(e.target.value)}
          required
        />

        <div className="flex justify-between items-center">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="bg-zinc-700 hover:bg-zinc-600 transition-colors duration-200 text-white px-4 py-2 rounded-md"
            >
              Back
            </button>
          )}
          {step < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => step < questions.length - 1 && questions[step].value && setStep(step + 1)}
              disabled={!questions[step].value}
              className="bg-zinc-700 hover:bg-zinc-600 transition-colors duration-200 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md disabled:opacity-50"
              disabled={loading || !questions[step].value}
            >
              {loading ? "Generating..." : "Generate My Persona"}
            </button>
          )}
        </div>

        <div className="h-2 bg-zinc-700 rounded">
          <div className="h-full bg-indigo-500" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>

      {result && (
        <div className="space-y-4">
          <div
            className="prose prose-invert border border-white/10 p-4 rounded-md"
            dangerouslySetInnerHTML={{ __html: result }}
          />
          <button
            type="button"
            onClick={handleSave}
            className="text-indigo-400 underline"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save to DB"}
          </button>
        </div>
      )}
    </main>
  );
}
