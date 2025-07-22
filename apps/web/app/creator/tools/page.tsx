"use client";

import { useState, useEffect } from "react";
import type { LeadMagnetIdea } from "@creator/types/leadMagnet";
import {
  saveLeadMagnetIdea,
  loadLeadMagnetIdea,
} from "@creator/lib/localLeadMagnet";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414L9 13.414l4.707-4.707z"
        clipRule="evenodd"
      />
    </svg>
  );
}
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";

const tabs = [
  { id: "hook", label: "Hook Generator" },
  { id: "rewrite", label: "Caption Rewriter" },
  { id: "ideas", label: "Content Brainstormer" },
  { id: "magnet", label: "Lead Magnet Idea" },
];

export default function ToolsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.plan === "free") {
      router.replace("/subscribe");
    }
  }, [status, session, router]);

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
  const toneOptions = ["Confident", "Playful", "Professional", "Witty"];
  const [rewriteTone, setRewriteTone] = useState(toneOptions[0]);

  // Content Ideas state
  const [ideaTopic, setIdeaTopic] = useState("");
  const [ideas, setIdeas] = useState<string[]>([]);
  const [ideaLoading, setIdeaLoading] = useState(false);
  const [ideaError, setIdeaError] = useState("");

  // Lead Magnet Idea state
  const [magnetNiche, setMagnetNiche] = useState("");
  const [magnetPersona, setMagnetPersona] = useState("");
  const [magnetIdea, setMagnetIdea] = useState<LeadMagnetIdea | null>(null);
  const [magnetLoading, setMagnetLoading] = useState(false);
  const [magnetError, setMagnetError] = useState("");

  useEffect(() => {
    const stored = loadLeadMagnetIdea();
    if (stored) setMagnetIdea(stored);
  }, []);

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
        body: JSON.stringify({ caption: captionInput, tone: rewriteTone }),
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

  const runLeadMagnet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!magnetNiche.trim() || !magnetPersona.trim()) return;
    setMagnetLoading(true);
    setMagnetIdea(null);
    setMagnetError("");
    try {
      const res = await fetch("/api/leadMagnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche: magnetNiche, audience: magnetPersona }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setMagnetIdea(data as LeadMagnetIdea);
      saveLeadMagnetIdea(data as LeadMagnetIdea);
    } catch (err) {
      setMagnetError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setMagnetLoading(false);
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
      <div>
        <label className="block text-sm font-semibold mb-1">Tone</label>
        <select
          className="w-full p-2 rounded-md bg-zinc-800 text-white"
          value={rewriteTone}
          onChange={(e) => setRewriteTone(e.target.value)}
        >
          {toneOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
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

  const renderLeadMagnet = () => (
    <form onSubmit={runLeadMagnet} className="space-y-4 max-w-md w-full">
      <input
        type="text"
        className="w-full p-2 rounded-md bg-zinc-800 text-white"
        placeholder="Your niche"
        value={magnetNiche}
        onChange={(e) => setMagnetNiche(e.target.value)}
      />
      <input
        type="text"
        className="w-full p-2 rounded-md bg-zinc-800 text-white"
        placeholder="Describe your persona"
        value={magnetPersona}
        onChange={(e) => setMagnetPersona(e.target.value)}
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-md disabled:opacity-50"
        disabled={magnetLoading || !magnetNiche.trim() || !magnetPersona.trim()}
      >
        {magnetLoading ? "Generating..." : "Generate idea"}
      </button>
      {magnetError && <p className="text-red-500 text-sm">{magnetError}</p>}
      {magnetIdea && (
        <div className="text-sm text-zinc-300 border-t border-white/10 pt-2 space-y-2">
          <p className="font-semibold text-base text-foreground">{magnetIdea.title}</p>
          <ul className="space-y-1">
            <li className="flex items-start gap-2">
              <CheckIcon className="w-3 h-3 text-indigo-600 dark:text-indigo-400 mt-0.5" />
              <span className="text-foreground/80">{magnetIdea.description}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon className="w-3 h-3 text-indigo-600 dark:text-indigo-400 mt-0.5" />
              <span className="text-foreground/80">Benefit: {magnetIdea.benefit}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon className="w-3 h-3 text-indigo-600 dark:text-indigo-400 mt-0.5" />
              <span className="font-semibold">CTA: {magnetIdea.cta}</span>
            </li>
          </ul>
        </div>
      )}
    </form>
  );

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6">
      <Tabs value={active} onValueChange={setActive}>
        <TabsList>
          {tabs.map((t) => (
            <TabsTrigger key={t.id} value={t.id}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="mt-4">
          <TabsContent value="hook">{renderHookGen()}</TabsContent>
          <TabsContent value="rewrite">{renderRewrite()}</TabsContent>
          <TabsContent value="ideas">{renderIdeas()}</TabsContent>
          <TabsContent value="magnet">{renderLeadMagnet()}</TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
