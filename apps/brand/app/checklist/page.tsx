"use client";
import { useState } from "react";

export default function ChecklistPage() {
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description })
      });
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data.checklist) ? data.checklist : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold">Campaign Checklist</h1>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your campaign in 1–2 lines"
          className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border focus:outline-none"
        />
        <button
          onClick={generate}
          disabled={loading}
          className="px-4 py-2 bg-Siora-accent rounded text-white disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Checklist"}
        </button>
        {items.length > 0 && (
          <ul className="list-disc pl-5 space-y-1">
            {items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
