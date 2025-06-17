"use client";

import { useState } from "react";
import { creators } from "@/app/data/creators";
import CreatorCard from "@/components/CreatorCard";
import ReactMarkdown from "react-markdown";
import { AnimatePresence, motion } from "framer-motion";

export default function InboxPage() {
  const [selected, setSelected] = useState<typeof creators[0] | null>(null);
  const [tab, setTab] = useState<"persona" | "performance" | "pitch">("persona");

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Inbox</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.slice(0, 9).map((c) => (
            <CreatorCard key={c.id} creator={c}>
              <button
                className="mt-4 text-sm text-Siora-accent underline"
                onClick={() => {
                  setSelected(c);
                  setTab("persona");
                }}
              >
                View Profile
              </button>
            </CreatorCard>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 w-full sm:w-96 h-full bg-Siora-mid text-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 border-b border-Siora-border">
              <h2 className="text-xl font-semibold">{selected.name}</h2>
              <button onClick={() => setSelected(null)} className="text-sm underline">
                Close
              </button>
            </div>
            <div className="border-b border-Siora-border flex">
              {[
                ["persona", "Persona"],
                ["performance", "Performance"],
                ["pitch", "Pitch"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTab(key as any)}
                  className={`flex-1 p-3 text-sm border-b-2 ${
                    tab === key ? "border-Siora-accent text-white" : "border-transparent text-zinc-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="p-4 text-sm space-y-4">
              {tab === "persona" && (
                <ReactMarkdown className="prose prose-invert max-w-none">
                  {selected.markdown || "No persona available."}
                </ReactMarkdown>
              )}
              {tab === "performance" && (
                <ul className="space-y-2">
                  <li>Reach: {selected.followers.toLocaleString()}</li>
                  <li>Engagement Rate: {selected.engagementRate}%</li>
                  <li>Follower Growth: 5% MoM</li>
                </ul>
              )}
              {tab === "pitch" && (
                <p>
                  Hi {selected.name}, we think your style aligns perfectly with our brand. Let's discuss a potential collaboration!
                </p>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </main>
  );
}
