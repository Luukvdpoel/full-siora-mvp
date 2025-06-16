"use client";

import { useState } from "react";
import styles from "../styles.module.css";

interface Persona {
  name: string;
  personality: string;
  interests: string[];
  summary: string;
}

export default function AnalyzePage() {
  const [captions, setCaptions] = useState("");
  const [result, setResult] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const captionList = captions
    .split(/\n+/)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("/api/generatePersona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ captions: captionList }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.formBox}>
        <label className={styles.label}>
          Paste several recent Instagram captions (one per line):
        </label>
        <textarea
          className={`${styles.input} h-40 resize-none`}
          value={captions}
          onChange={(e) => setCaptions(e.target.value)}
          placeholder={"First caption\nSecond caption"}
        />
        <button
          type="submit"
          className={`${styles.submitButton} ${loading ? styles.disabled : ""}`}
          disabled={loading || captionList.length === 0}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {result && (
        <div className="mt-8 space-y-4 max-w-xl text-center">
          <h2 className="text-2xl font-bold">{result.name}</h2>
          <p>
            <strong>Personality:</strong> {result.personality}
          </p>
          <p>
            <strong>Interests:</strong> {result.interests.join(", ")}
          </p>
          <p className="text-zinc-300">{result.summary}</p>
        </div>
      )}
    </div>
  );
}
