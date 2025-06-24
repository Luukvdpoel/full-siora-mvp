"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import type { BrandOnboardResult } from "@/types/onboard";
import {
  campaignTemplates,
  type CampaignTemplate,
} from "@/app/data/campaignTemplates";

export default function BrandOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null);
  const [form, setForm] = useState({
    name: "",
    goals: "",
    product: "",
    creators: "",
    budget: "",
  });
  const [summary, setSummary] = useState<BrandOnboardResult | null>(null);
  const [loading, setLoading] = useState(false);

  const applyTemplate = (template: CampaignTemplate) => {
    setSelectedTemplate(template);
    setForm({
      name: template.name,
      goals: template.goals,
      product: template.product,
      creators: template.creators,
      budget: template.budget,
    });
    setStep(1);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const generateBrief = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/brand-onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          goals: form.goals,
          productInfo: form.product,
          idealCreators: form.creators,
          budget: form.budget,
        }),
      });
      const data = await res.json();
      setSummary(data);
      setStep(6);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveBrief = async () => {
    if (!summary) return;
    setLoading(true);
    try {
      await fetch("/api/campaign-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          goals: form.goals,
          productInfo: form.product,
          idealCreators: form.creators,
          budget: form.budget,
          summary,
        }),
      });
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if (step === 5) {
      generateBrief();
    } else {
      setStep((s) => s + 1);
    }
  };

  const prev = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-xl mx-auto bg-Siora-mid p-6 rounded-2xl space-y-4">
        <h1 className="text-2xl font-bold mb-2">Brand Onboarding</h1>
        <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {campaignTemplates.map((t) => (
              <button
                key={t.id}
                onClick={() => applyTemplate(t)}
                className="w-full text-left p-3 rounded-lg bg-Siora-light hover:bg-Siora-accent/20 border border-Siora-border"
              >
                <h3 className="font-semibold">{t.label}</h3>
                <p className="text-sm opacity-80">{t.goals}</p>
              </button>
            ))}
            <button
              onClick={() => setStep(1)}
              className="w-full p-3 rounded-lg bg-gray-700 border border-Siora-border"
            >
              Start from Scratch
            </button>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Brand name"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
          <textarea
            name="goals"
            value={form.goals}
            onChange={handleChange}
            placeholder="Campaign goals"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          </motion.div>
        )}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
          <textarea
            name="product"
            value={form.product}
            onChange={handleChange}
            placeholder="Product information"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          </motion.div>
        )}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
          <input
            name="creators"
            value={form.creators}
            onChange={handleChange}
            placeholder="Ideal creator type"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          </motion.div>
        )}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
          <input
            name="budget"
            value={form.budget}
            onChange={handleChange}
            placeholder="Budget range"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          </motion.div>
        )}
        {step === 6 && summary && (
          <motion.div
            key="step6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <textarea
              value={summary.mission}
              onChange={(e) => setSummary({ ...summary, mission: e.target.value })}
              className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border"
            />
            <input
              value={summary.creatorTraits.join(", ")}
              onChange={(e) =>
                setSummary({
                  ...summary,
                  creatorTraits: e.target.value.split(/,|\n/).map((s) => s.trim()).filter(Boolean),
                })
              }
              className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border"
            />
            <input
              value={summary.platformFormat}
              onChange={(e) => setSummary({ ...summary, platformFormat: e.target.value })}
              className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border"
            />
            <textarea
              value={summary.pitch}
              onChange={(e) => setSummary({ ...summary, pitch: e.target.value })}
              className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border"
            />
          </motion.div>
        )}
        </AnimatePresence>
        <div className="flex justify-between pt-4">
          {step > 0 && step < 6 && (
            <button onClick={prev} className="px-4 py-2 bg-gray-700 rounded">
              Back
            </button>
          )}
          {step < 6 && (
            <button
              onClick={next}
              disabled={loading}
              className="ml-auto px-4 py-2 bg-Siora-accent rounded disabled:opacity-50"
            >
              {step === 5 ? (loading ? "Generating..." : "Generate Brief") : "Next"}
            </button>
          )}
          {step === 6 && (
            <button
              onClick={saveBrief}
              disabled={loading}
              className="ml-auto px-4 py-2 bg-Siora-accent rounded disabled:opacity-50"
            >
              {loading ? "Saving..." : "Confirm & Save"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
