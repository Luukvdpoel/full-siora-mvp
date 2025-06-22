"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { loadPersonasFromLocal, StoredPersona } from "@/lib/localPersonas";
import type { PersonaProfile } from "@/types/persona";
import type { GrowthPlan } from "@/types/growth";

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M12 1.5a4.5 4.5 0 00-4.5 4.5v3H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1.5v-3A4.5 4.5 0 0012 1.5zm-3 4.5a3 3 0 116 0v3h-6v-3z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function GrowthPlanPage() {
  const { data: session, status } = useSession();
  const [personas, setPersonas] = useState<StoredPersona[]>([]);

  useEffect(() => {
    setPersonas(loadPersonasFromLocal());
  }, []);

  const computeBrandFit = (interests: string[]): string => {
    const lower = interests.map((i) => i.toLowerCase());
    const fitness = ["fitness", "workout", "health", "wellness"];
    const fashion = ["fashion", "style", "beauty", "clothing"];
    if (lower.some((i) => fitness.some((k) => i.includes(k)))) return "fitness";
    if (lower.some((i) => fashion.some((k) => i.includes(k)))) return "fashion";
    return "business";
  };

  const computeGrowthPlan = (fit: string): GrowthPlan => {
    const milestones = [
      "Define goals & voice",
      "Optimize profile",
      "Plan 4-week calendar",
      "Launch weekly series",
      "Engage daily",
      "Collaborate with a peer",
      "Try new format",
      "Review metrics",
      "Partner with micro-influencer",
      "Run giveaway or challenge",
      "Pitch a brand",
      "Recap & plan next quarter",
    ];

    const contentMap: Record<string, string[]> = {
      fitness: [
        "Intro your fitness journey",
        "Share workout schedule",
        "Post progress photos",
        "Quick workout tips",
        "Nutrition highlights",
        "Collaborative workout",
        "Motivational quotes",
        "Live training session",
        "Form demonstration",
        "7-day challenge",
        "Personal achievement",
        "Transformation recap",
      ],
      fashion: [
        "Moodboard intro",
        "Outfit of the day",
        "Closet staples",
        "Lookbook collage",
        "Accessory focus",
        "Stylist collab",
        "Trend experiment",
        "Styling Q&A",
        "Seasonal collection",
        "Mini giveaway",
        "Brand wishlist",
        "Style evolution recap",
      ],
      business: [
        "Expertise introduction",
        "Productivity tips",
        "Case study",
        "Industry news",
        "Workflow insights",
        "Community collaboration",
        "Live Q&A",
        "Success story",
        "Networking insights",
        "Host webinar",
        "Partnership idea",
        "Quarter recap",
      ],
    };

    const goals = [
      "Select main platform",
      "Update bio & links",
      "Post 3x/week",
      "Engage 10 new accounts",
      "Use stories/reels",
      "Grow followers 10%",
      "Reach out to collaborators",
      "Analyze engagement",
      "Target 20% engagement",
      "Promote content",
      "DM a brand",
      "Review results",
    ];

    const content = contentMap[fit] ?? contentMap.business;
    const plan: GrowthPlan = milestones.map((m, i) => ({
      week: i + 1,
      milestone: m,
      content: content[i] || "Create engaging content",
      platformGoal: goals[i] || "Stay consistent",
    }));
    return plan;
  };

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
        <p>Loading...</p>
      </main>
    );
  }

  if (!session || session.user?.plan !== "pro") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
        <LockIcon className="w-8 h-8 mb-4" />
        <p className="mb-4">Alleen beschikbaar voor Pro-gebruikers.</p>
        <a href="/subscribe" className="text-indigo-600 underline">
          Upgrade naar Pro
        </a>
      </main>
    );
  }

  if (personas.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
        <p>No saved personas found. Generate one first.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-8">
      <h1 className="text-2xl font-bold">Growth Plan</h1>
      {personas.map((item, idx) => {
        const persona = item.persona as PersonaProfile;
        const fit = computeBrandFit(persona.interests ?? []);
        const plan = computeGrowthPlan(fit);
        return (
          <div key={idx} className="space-y-2">
            <h2 className="text-xl font-semibold">{persona.name}</h2>
            <table className="min-w-full text-sm border-collapse border border-white/10">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="p-2 border border-white/10">Week</th>
                  <th className="p-2 border border-white/10">Milestone</th>
                  <th className="p-2 border border-white/10">Content</th>
                  <th className="p-2 border border-white/10">Platform Goal</th>
                </tr>
              </thead>
              <tbody>
                {plan.map((w) => (
                  <tr key={w.week} className="odd:bg-zinc-900">
                    <td className="p-2 border border-white/10">{w.week}</td>
                    <td className="p-2 border border-white/10">{w.milestone}</td>
                    <td className="p-2 border border-white/10">{w.content}</td>
                    <td className="p-2 border border-white/10">{w.platformGoal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </main>
  );
}
