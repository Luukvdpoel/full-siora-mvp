"use client";

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import PersonaCard from "@/components/PersonaCard";
import InsightsSidebar from "@/components/InsightsSidebar";
import type { PersonaProfile } from "@/types/persona";
import { savePersonaToLocal } from "@/lib/localPersonas";

type Persona = PersonaProfile;

export default function AnalyzePage() {
  const [captions, setCaptions] = useState("");
  const [result, setResult] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  // Load caption history from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("captionHistory");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed as string[]);
        }
      }
    } catch (err) {
      console.error("Failed to load caption history", err);
    }
  }, []);

  const updateHistory = (newCaptions: string) => {
    try {
      const stored = localStorage.getItem("captionHistory");
      let arr: string[] = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(arr)) arr = [];
      arr = arr.filter((c) => c !== newCaptions);
      arr.unshift(newCaptions);
      if (arr.length > 5) arr = arr.slice(0, 5);
      localStorage.setItem("captionHistory", JSON.stringify(arr));
      setHistory(arr);
    } catch (err) {
      console.error("Failed to save caption history", err);
    }
  };

  const computeBrandFit = (interests: string[]): string => {
    const lower = interests.map((i) => i.toLowerCase());
    const fitness = ["fitness", "workout", "health", "wellness"];
    const fashion = ["fashion", "style", "beauty", "clothing"];
    if (lower.some((i) => fitness.some((k) => i.includes(k)))) return "fitness";
    if (lower.some((i) => fashion.some((k) => i.includes(k)))) return "fashion";
    return "business";
  };

  const computePostingFrequency = (fit: string): string => {
    switch (fit) {
      case "fitness":
        return "5 posts/week";
      case "fashion":
        return "3 posts/week";
      case "business":
        return "2 posts/week";
      default:
        return "3 posts/week";
    }
  };

  const computeGrowthSuggestions = (fit: string): string => {
    switch (fit) {
      case "fitness":
        return "Share workout tips daily and track progress with before/after posts.";
      case "fashion":
        return "Post seasonal lookbooks and tag the brands you wear.";
      case "business":
        return "Publish case studies and network on LinkedIn.";
      default:
        return "Collaborate with peers and experiment with short-form video.";
    }
  };

  const computeToneConfidence = (caps: string[], personality: string): number => {
    const text = caps.join(" ").toLowerCase();
    const words = personality.toLowerCase().split(/\W+/);
    const matches = words.filter((w) => w && text.includes(w)).length;
    return Math.min(100, 50 + matches * 10);
  };

  const analyzeCaptions = async (capStr: string) => {
    const list = capStr
      .split(/\n+/)
      .map((c) => c.trim())
      .filter((c) => c.length > 0)
      .slice(0, 5);
    if (list.length === 0) return;

    setLoading(true);
    setResult(null);
    setError("");

    updateHistory(capStr);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ captions: list }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      const fit = computeBrandFit(data.interests ?? []);
      const enhanced: Persona = {
        ...data,
        brandFit: fit,
        postingFrequency: computePostingFrequency(fit),
        toneConfidence: computeToneConfidence(list, data.personality ?? ""),
        growthSuggestions: computeGrowthSuggestions(fit),
      };

      setResult(enhanced);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    savePersonaToLocal(result);
    try {
      await fetch("/api/personas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: result.name, persona: result }),
      });
    } catch (err) {
      console.error("Failed to save persona", err);
    }
  };

  const handleDownloadPdf = () => {
    if (!result) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(result.name, 10, 20);
    doc.setFontSize(12);
    doc.text(result.personality, 10, 30);
    doc.text(`Interests: ${result.interests.join(", ")}`, 10, 40);
    const summaryLines = doc.splitTextToSize(result.summary, 180);
    doc.text(summaryLines, 10, 50);
    doc.text(`Posting: ${result.postingFrequency ?? "-"}`, 10, 70);
    doc.text(`Tone Confidence: ${result.toneConfidence ?? "-"}%`, 10, 80);
    doc.text(`Brand Fit: ${result.brandFit ?? "-"}`, 10, 90);
    const growth = doc.splitTextToSize(result.growthSuggestions ?? "", 180);
    doc.text(growth, 10, 100);
    doc.save(`${result.name || "persona"}.pdf`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    analyzeCaptions(captions);
  };

  const handleReanalyze = (capStr: string) => {
    setCaptions(capStr);
    analyzeCaptions(capStr);
  };

  const captionList = captions
    .split(/\n+/)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-800 to-black text-white flex flex-col items-center justify-center p-6 space-y-6">
      {history.length > 0 && (
        <div className="w-full max-w-md space-y-2">
          <h3 className="text-sm font-semibold">Recent Caption Sets</h3>
          <ul className="space-y-2">
            {history.map((item, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => handleReanalyze(item)}
                  className="w-full text-left bg-white/10 hover:bg-white/20 p-2 rounded-md"
                >
                  {item.split("\n")[0]}
                  {item.split("\n").length > 1 ? " ..." : ""}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-lg p-6 space-y-4 backdrop-blur"
      >
        <label className="block text-sm font-semibold">Paste up to 5 captions</label>
        <textarea
          className="w-full h-40 p-3 rounded-md bg-zinc-800 text-white resize-none placeholder-zinc-400"
          rows={5}
          value={captions}
          onChange={(e) => setCaptions(e.target.value)}
          placeholder={"First caption\nSecond caption"}
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold py-2 rounded-md disabled:opacity-50"
          disabled={loading || captionList.length === 0}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            "Analyze"
          )}
        </button>
      </form>

      {error && (
        <p className="text-red-500">Error analyzing captions: {error}</p>
      )}

      {result && (
        <div className="space-y-4 flex flex-col items-center md:flex-row md:space-x-6 md:space-y-0">
          <PersonaCard profile={result} />
          <InsightsSidebar profile={result} />
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 transition text-white font-semibold py-2 px-4 rounded-md"
            >
              Save Persona
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 px-4 rounded-md"
            >
              Download as PDF
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
