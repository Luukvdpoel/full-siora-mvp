"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BrandSignup() {
  const [form, setForm] = useState({
    companyName: "",
    industry: "",
    creatorTone: "",
    platformInterest: "",
    collabGoals: "",
  });
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("brandSignup", JSON.stringify(form));
    }
    setSaved(true);
    router.push("/onboarding");
  };

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-Siora-mid p-6 rounded-2xl space-y-4 w-full max-w-md">
        <h1 className="text-2xl font-bold">Brand Sign Up</h1>
        <input
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
          placeholder="Company Name"
          className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
        />
        <input
          name="industry"
          value={form.industry}
          onChange={handleChange}
          placeholder="Industry"
          className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
        />
        <input
          name="creatorTone"
          value={form.creatorTone}
          onChange={handleChange}
          placeholder="Preferred Creator Tone"
          className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
        />
        <input
          name="platformInterest"
          value={form.platformInterest}
          onChange={handleChange}
          placeholder="Platform Interest"
          className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
        />
        <textarea
          name="collabGoals"
          value={form.collabGoals}
          onChange={handleChange}
          placeholder="Collab Goals"
          className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
        />
        <button type="submit" className="bg-Siora-accent hover:bg-Siora-accent-soft text-white px-4 py-2 rounded-lg font-semibold w-full">
          Save Details
        </button>
        {saved && (
          <p className="text-sm text-center text-zinc-300">Your info has been saved in memory.</p>
        )}
      </form>
    </main>
  );
}
