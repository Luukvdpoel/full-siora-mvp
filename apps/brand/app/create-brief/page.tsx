"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormState {
  goal: string;
  customGoal: string;
  product: string;
  niche: string;
  tone: string;
  timeline: string;
  budget: string;
}

interface BriefPreview {
  html: string;
}

async function generatePreview(form: FormState): Promise<BriefPreview> {
  // Mocked preview for MVP
  const html = `
    <h2 class='text-xl font-semibold mb-2'>Campaign Brief</h2>
    <p><strong>Goal:</strong> ${form.goal || form.customGoal}</p>
    <p><strong>Product:</strong> ${form.product}</p>
    <p><strong>Ideal Creator:</strong> ${form.niche} creators with a ${form.tone} tone</p>
    <p><strong>Timeline:</strong> ${form.timeline}</p>
    <p><strong>Budget:</strong> ${form.budget}</p>
  `;
  return { html };
}

export default function CreateBriefPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<BriefPreview | null>(null);
  const [form, setForm] = useState<FormState>({
    goal: "",
    customGoal: "",
    product: "",
    niche: "",
    tone: "",
    timeline: "",
    budget: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const next = async () => {
    if (step === 4) {
      setLoading(true);
      const p = await generatePreview(form);
      setPreview(p);
      setLoading(false);
      setStep(5);
    } else {
      setStep((s) => s + 1);
    }
  };

  const prev = () => setStep((s) => Math.max(0, s - 1));

  const save = async () => {
    if (!preview) return;
    setLoading(true);
    try {
      await fetch("/api/briefs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.goal || form.customGoal,
          goals: form.goal,
          productInfo: form.product,
          idealCreators: `${form.niche} / ${form.tone}`,
          budget: form.budget,
          summary: { mission: preview.html, creatorTraits: [], platformFormat: "", pitch: "" },
        }),
      });
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-3">
            <select
              name="goal"
              value={form.goal}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border"
            >
              <option value="">Select goal</option>
              <option value="Awareness">Brand Awareness</option>
              <option value="Launch">Product Launch</option>
              <option value="Sales">Increase Sales</option>
              <option value="Other">Other</option>
            </select>
            {form.goal === "Other" && (
              <input
                name="customGoal"
                value={form.customGoal}
                onChange={handleChange}
                placeholder="Describe your goal"
                className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border"
              />
            )}
          </div>
        );
      case 1:
        return (
          <textarea
            name="product"
            value={form.product}
            onChange={handleChange}
            placeholder="Product description"
            className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border"
          />
        );
      case 2:
        return (
          <div className="space-y-3">
            <input
              name="niche"
              value={form.niche}
              onChange={handleChange}
              placeholder="Creator niche"
              className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border"
            />
            <input
              name="tone"
              value={form.tone}
              onChange={handleChange}
              placeholder="Tone"
              className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border"
            />
          </div>
        );
      case 3:
        return (
          <input
            name="timeline"
            value={form.timeline}
            onChange={handleChange}
            placeholder="Timeline"
            className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border"
          />
        );
      case 4:
        return (
          <input
            name="budget"
            value={form.budget}
            onChange={handleChange}
            placeholder="Budget range"
            className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border"
          />
        );
      case 5:
        return (
          preview && (
            <div className="space-y-4">
              <div
                className="prose prose-invert bg-Siora-mid p-4 rounded"
                dangerouslySetInnerHTML={{ __html: preview.html }}
              />
              <div className="flex gap-2">
                <button
                  onClick={save}
                  className="px-4 py-2 bg-Siora-accent rounded disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Brief"}
                </button>
                <button
                  onClick={() => setStep(0)}
                  className="px-4 py-2 bg-gray-600 rounded"
                >
                  Edit
                </button>
              </div>
            </div>
          )
        );
    }
  };

  return (
    <main className="bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light min-h-screen p-6 text-white flex justify-center">
      <div className="bg-Siora-mid p-6 rounded-lg w-full max-w-lg space-y-4">
        {renderStep()}
        {step < 5 && (
          <div className="flex justify-between pt-4">
            {step > 0 && (
              <button onClick={prev} className="px-4 py-2 bg-gray-600 rounded">
                Back
              </button>
            )}
            <button
              onClick={next}
              className="ml-auto px-4 py-2 bg-Siora-accent rounded disabled:opacity-50"
              disabled={loading}
            >
              {step === 4 ? (loading ? "Generating..." : "Generate") : "Next"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
