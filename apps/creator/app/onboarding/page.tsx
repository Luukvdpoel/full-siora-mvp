"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import styles from "../styles.module.css";

interface OnboardData {
  handle: string;
  platforms: string;
  niche: string;
  audience: string;
  goal: string;
  tone: string;
  persona?: string;
  visibility: "public" | "private";
  allowDMs: boolean;
}

export default function CreatorOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardData>({
    handle: "",
    platforms: "",
    niche: "",
    audience: "",
    goal: "",
    tone: "",
    persona: undefined,
    visibility: "public",
    allowDMs: true,
  });

  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("creatorOnboarding");
      if (stored) {
        const parsed = JSON.parse(stored) as OnboardData & { step?: number };
        setData((prev) => ({ ...prev, ...parsed }));
        if (typeof parsed.step === "number") setStep(parsed.step);
      }
    } catch (err) {
      console.error("Failed to load onboarding data", err);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        "creatorOnboarding",
        JSON.stringify({ ...data, step }),
      );
    } catch (err) {
      console.error("Failed to store onboarding data", err);
    }
  }, [data, step]);

  const next = () => setStep((s) => Math.min(4, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));
  const skip = () => next();
  const finish = () => router.push("/dashboard");

  async function generatePersona() {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle: data.handle,
          vibe: data.tone,
          goal: data.goal,
          audience: data.audience,
          contentPreference: data.niche,
          platform: data.platforms,
        }),
      });
      if (res.ok) {
        const { result } = await res.json();
        setData((d) => ({ ...d, persona: result }));
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={styles.formBox}
          >
            <h1 className={styles.title}>Welcome to Siora</h1>
            <p className={styles.subtitle}>Let's get your creator profile set up.</p>
            <div className={styles.controls}>
              <button className={styles.submitButton} onClick={next}>Get Started</button>
              <button className={styles.navButton} onClick={finish}>Skip for now</button>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={styles.formBox}
          >
            <h2 className={styles.title}>Basic Info</h2>
          <input
            className={styles.input}
            placeholder="Handle"
            value={data.handle}
            onChange={(e) => setData({ ...data, handle: e.target.value })}
          />
          <input
            className={styles.input}
            placeholder="Platforms"
            value={data.platforms}
            onChange={(e) => setData({ ...data, platforms: e.target.value })}
          />
          <input
            className={styles.input}
            placeholder="Niche"
            value={data.niche}
            onChange={(e) => setData({ ...data, niche: e.target.value })}
          />
          <input
            className={styles.input}
            placeholder="Audience"
            value={data.audience}
            onChange={(e) => setData({ ...data, audience: e.target.value })}
          />
          <div className={styles.controls}>
            <button className={styles.navButton} onClick={prev}>Back</button>
            <div className="flex gap-2">
              <button className={styles.navButton} onClick={skip}>Skip</button>
              <button className={styles.submitButton} onClick={next}>Next</button>
            </div>
          </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={styles.formBox}
          >
            <h2 className={styles.title}>Persona Generator</h2>
          <input
            className={styles.input}
            placeholder="Creator goal"
            value={data.goal}
            onChange={(e) => setData({ ...data, goal: e.target.value })}
          />
          <input
            className={styles.input}
            placeholder="Tone or vibe"
            value={data.tone}
            onChange={(e) => setData({ ...data, tone: e.target.value })}
          />
          {data.persona ? (
            <div ref={resultRef} className="prose prose-invert my-4">
              <ReactMarkdown>{data.persona}</ReactMarkdown>
            </div>
          ) : null}
          <div className={styles.controls}>
            <button className={styles.navButton} onClick={prev}>Back</button>
            <button className={styles.navButton} onClick={skip}>Skip</button>
            {data.persona ? (
              <button className={styles.submitButton} onClick={next}>Next</button>
            ) : (
              <button
                className={styles.submitButton}
                onClick={generatePersona}
                disabled={loading || !data.handle || !data.tone || !data.goal}
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            )}
          </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={styles.formBox}
          >
            <h2 className={styles.title}>Visibility Settings</h2>
          <div className="space-y-2 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={data.visibility === "public"}
                onChange={() => setData({ ...data, visibility: "public" })}
              />
              Public Profile
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={data.visibility === "private"}
                onChange={() => setData({ ...data, visibility: "private" })}
              />
              Private Profile
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.allowDMs}
                onChange={(e) => setData({ ...data, allowDMs: e.target.checked })}
              />
              Allow brand DMs
            </label>
          </div>
          <div className={styles.controls}>
            <button className={styles.navButton} onClick={prev}>Back</button>
            <button className={styles.navButton} onClick={skip}>Skip</button>
            <button className={styles.submitButton} onClick={next}>Next</button>
          </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={styles.formBox}
          >
            <h2 className={styles.title}>Review & Confirm</h2>
          <div className="text-sm space-y-2 mb-4">
            <p><strong>Handle:</strong> {data.handle || "-"}</p>
            <p><strong>Platforms:</strong> {data.platforms || "-"}</p>
            <p><strong>Niche:</strong> {data.niche || "-"}</p>
            <p><strong>Audience:</strong> {data.audience || "-"}</p>
            <p><strong>Goal:</strong> {data.goal || "-"}</p>
            <p><strong>Tone:</strong> {data.tone || "-"}</p>
            <p><strong>Visibility:</strong> {data.visibility}</p>
            <p><strong>Allow DMs:</strong> {data.allowDMs ? "Yes" : "No"}</p>
            {data.persona && (
              <div>
                <strong>Persona:</strong>
                <div className="prose prose-invert mt-2">
                  <ReactMarkdown>{data.persona}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
          <div className={styles.controls}>
            <button className={styles.navButton} onClick={prev}>Back</button>
            <button className={styles.submitButton} onClick={finish}>Confirm</button>
            <button className={styles.navButton} onClick={finish}>Save for later</button>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

