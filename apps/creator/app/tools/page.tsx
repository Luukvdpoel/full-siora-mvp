"use client";

import { useState } from "react";

const tabs = [
  { id: "hook", label: "Hook Generator" },
  { id: "rewrite", label: "Caption Rewriter" },
  { id: "ideas", label: "Content Brainstormer" },
];

export default function ToolsPage() {
  const [active, setActive] = useState("hook");

  // Hook Generator state
  const [hookTopic, setHookTopic] = useState("");
  const [hooks, setHooks] = useState<string[]>([]);
  const [hookLoading, setHookLoading] = useState(false);
  const [hookError, setHookError] = useState("");

  // Caption Rewriter state
  const [captionInput, setCaptionInput] = useState("");
  const [captionResult, setCaptionResult] = useState("");
  const [rewriteLoading, setRewriteLoading] = useState(false);
  const [rewriteError, setRewriteError] = useState("");

  // Content Ideas state
  const [ideaTopic, setIdeaTopic] = useState("");
  const [ideas, setIdeas] = useState<string[]>([]);
  const [ideaLoading, setIdeaLoading] = useState(false);
  const [ideaError, setIdeaError] = useState("");

  const runHookGen = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hookTopic.trim()) return;
    setHookLoading(true);
    setHooks([]);
    setHookError("");
    try {
      const res = await fetch("/api/hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: hookTopic }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setHooks(data.hooks as string[]);
    } catch (err) {
      setHookError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setHookLoading(false);
    }
  };

  const runRewrite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!captionInput.trim()) return;
    setRewriteLoading(true);
    setCaptionResult("");
    setRewriteError("");
    try {
      const res = await fetch("/api/rewriteCaption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: captionInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setCaptionResult(data.caption as string);
    } catch (err) {
      setRewriteError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setRewriteLoading(false);
    }
  };

  const runIdeas = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ideaTopic.trim()) return;
    setIdeaLoading(true);
    setIdeas([]);
    setIdeaError("");
    try {
      const res = await fetch("/api/contentIdeas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: ideaTopic }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setIdeas(data.ideas as string[]);
    } catch (err) {
      setIdeaError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIdeaLoading(false);
    }
  };

  const renderHookGen = () => (
    <form onSubmit={runHookGen} className="space-y-4 max-w-md w-full">
      <input
        type="text"
        className="w-full p-2 rounded-md bg-zinc-800 text-white"
        placeholder="Topic or product"
        value={hookTopic}
        onChange={(e) => setHookTopic(e.target.value)}
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-md disabled:opacity-50"
        disabled={hookLoading || !hookTopic.trim()}
      >
        {hookLoading ? "Generating..." : "Generate hooks"}
      </button>
      {hookError && <p className="text-red-500 text-sm">{hookError}</p>}
      {hooks.length > 0 && (
        <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
          {hooks.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}
    </form>
  );

  const renderRewrite = () => (
    <form onSubmit={runRewrite} className="space-y-4 max-w-md w-full">
      <textarea
        className="w-full p-2 rounded-md bg-zinc-800 text-white h-32 resize-none"
        value={captionInput}
        onChange={(e) => setCaptionInput(e.target.value)}
        placeholder="Original caption"
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-md disabled:opacity-50"
        disabled={rewriteLoading || !captionInput.trim()}
      >
        {rewriteLoading ? "Rewriting..." : "Rewrite"}
      </button>
      {rewriteError && <p className="text-red-500 text-sm">{rewriteError}</p>}
      {captionResult && (
        <p className="text-sm text-zinc-300 border-t border-white/10 pt-2">{captionResult}</p>
      )}
    </form>
  );

  const renderIdeas = () => (
    <form onSubmit={runIdeas} className="space-y-4 max-w-md w-full">
      <input
        type="text"
        className="w-full p-2 rounded-md bg-zinc-800 text-white"
        placeholder="Topic or niche"
        value={ideaTopic}
        onChange={(e) => setIdeaTopic(e.target.value)}
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-md disabled:opacity-50"
        disabled={ideaLoading || !ideaTopic.trim()}
      >
        {ideaLoading ? "Brainstorming..." : "Get ideas"}
      </button>
      {ideaError && <p className="text-red-500 text-sm">{ideaError}</p>}
      {ideas.length > 0 && (
        <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
          {ideas.map((idea, i) => (
            <li key={i}>{idea}</li>
          ))}
        </ul>
      )}
    </form>
  );

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6">
      <div className="flex gap-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-3 py-1 rounded-md border transition-colors ${
              active === t.id
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white/5 text-foreground border-white/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {active === "hook" && renderHookGen()}
        {active === "rewrite" && renderRewrite()}
        {active === "ideas" && renderIdeas()}
      </div>
    </main>
  );
}
