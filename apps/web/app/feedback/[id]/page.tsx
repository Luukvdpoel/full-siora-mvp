"use client";
import { useState, useEffect } from "react";

interface FeedbackSummary {
  overallTone: string;
  collaborationHighlights: string;
  thingsToImprove: string;
}

interface FeedbackEntry {
  id: string;
  comments: string;
  rating: number;
  communication: number;
  reliability: number;
  summary?: FeedbackSummary;
}

export default function FeedbackPage({ params }: { params: { id: string } }) {
  const [rating, setRating] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [reliability, setReliability] = useState(5);
  const [comments, setComments] = useState("");
  const [existing, setExisting] = useState<FeedbackEntry[]>([]);

  useEffect(() => {
    fetch(`/api/feedback?forId=${params.id}`)
      .then((res) => res.json())
      .then((data) => (Array.isArray(data) ? setExisting(data) : []));
  }, [params.id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        forId: params.id,
        rating,
        communication,
        reliability,
        comments,
      }),
    });
    const entry: FeedbackEntry = await res.json();

    if (entry?.id && comments) {
      try {
        await fetch("/api/ai/feedback-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: entry.id, text: comments }),
        });
      } catch (err) {
        console.error("summary error", err);
      }
    }

    setComments("");
    const updated = await fetch(`/api/feedback?forId=${params.id}`);
    const data = await updated.json();
    setExisting(Array.isArray(data) ? data : []);
  };

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Feedback</h1>
      <form onSubmit={submit} className="space-y-3">
        <label className="block">
          Overall Rating (1-5)
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full p-2 rounded bg-Siora-light text-white"
          />
        </label>
        <label className="block">
          Communication (1-5)
          <input
            type="number"
            min="1"
            max="5"
            value={communication}
            onChange={(e) => setCommunication(Number(e.target.value))}
            className="w-full p-2 rounded bg-Siora-light text-white"
          />
        </label>
        <label className="block">
          Reliability (1-5)
          <input
            type="number"
            min="1"
            max="5"
            value={reliability}
            onChange={(e) => setReliability(Number(e.target.value))}
            className="w-full p-2 rounded bg-Siora-light text-white"
          />
        </label>
        <label className="block">
          Comments
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full p-2 rounded bg-Siora-light text-white"
          />
        </label>
        <button type="submit" className="px-4 py-2 bg-Siora-accent rounded">
          Submit
        </button>
      </form>
      {existing.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Previous Feedback</h2>
          <ul className="space-y-1 text-sm">
            {existing.map((f) => (
              <li key={f.id} className="border-b border-white/20 pb-1">
                {f.comments} - {f.rating}/5
                {f.summary && (
                  <div className="mt-1 space-y-0.5 text-xs">
                    <p>
                      <strong>Overall tone:</strong> {f.summary.overallTone}
                    </p>
                    <p>
                      <strong>Collaboration highlights:</strong> {f.summary.collaborationHighlights}
                    </p>
                    <p>
                      <strong>Things to improve:</strong> {f.summary.thingsToImprove}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
