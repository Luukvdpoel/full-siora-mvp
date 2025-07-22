import React from 'react';
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import styles from "../styles.module.css";

interface OnboardData {
  name: string;
  handle: string;
  followers: number;
  niche: string;
  tone: string;
  values: string[];
  contentType: string;
  brandPersona: string;
}

const toneOptions = ["Casual", "Professional", "Playful", "Bold"];
const valueOptions = ["Authenticity", "Community", "Innovation", "Sustainability"];

export default function CreatorOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardData>({
    name: "",
    handle: "",
    followers: 0,
    niche: "",
    tone: "",
    values: [],
    contentType: "",
    brandPersona: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("creatorOnboarding");
      if (stored) setData(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("creatorOnboarding", JSON.stringify(data));
    } catch {}
  }, [data]);

  const next = () => setStep((s) => Math.min(5, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  async function handleConfirm() {
    try {
      // TODO: send data to API
      localStorage.removeItem("creatorOnboarding");
      setStep(6);
    } catch (err) {
      console.error(err);
    }
  }

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <div className={styles.formBox}>
            <h1 className={styles.title}>Welcome to Siora</h1>
            <p className={styles.subtitle}>Let's set up your creator profile.</p>
            <div className={styles.controls}>
              <button className={styles.submitButton} onClick={next}>Get Started</button>
            </div>
          </div>
        );
      case 1:
        return (
          <div className={styles.formBox}>
            <h2 className={styles.title}>Profile Basics</h2>
            <input
              className={styles.input}
              placeholder="Name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
            <input
              className={styles.input}
              placeholder="Handle"
              value={data.handle}
              onChange={(e) => setData({ ...data, handle: e.target.value })}
            />
            <input
              className={styles.input}
              placeholder="Follower count"
              type="number"
              value={data.followers || ""}
              onChange={(e) => setData({ ...data, followers: Number(e.target.value) })}
            />
            <input
              className={styles.input}
              placeholder="Niche"
              value={data.niche}
              onChange={(e) => setData({ ...data, niche: e.target.value })}
            />
            <div className={styles.controls}>
              <button className={styles.navButton} onClick={prev}>Back</button>
              <button className={styles.submitButton} onClick={next}>Next</button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className={styles.formBox}>
            <h2 className={styles.title}>Choose Your Tone</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {toneOptions.map((t) => (
                <button
                  key={t}
                  className={`${styles.navButton} ${data.tone === t ? styles.submitButton : ""}`}
                  onClick={() => setData({ ...data, tone: t })}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className={styles.controls}>
              <button className={styles.navButton} onClick={prev}>Back</button>
              <button className={styles.submitButton} onClick={next} disabled={!data.tone}>Next</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className={styles.formBox}>
            <h2 className={styles.title}>Values & Content</h2>
            <div className="space-y-2 mb-4">
              {valueOptions.map((v) => (
                <label key={v} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={data.values.includes(v)}
                    onChange={(e) => {
                      setData((d) => ({
                        ...d,
                        values: e.target.checked ? [...d.values, v] : d.values.filter((val) => val !== v),
                      }));
                    }}
                  />
                  {v}
                </label>
              ))}
            </div>
            <input
              className={styles.input}
              placeholder="Primary content type"
              value={data.contentType}
              onChange={(e) => setData({ ...data, contentType: e.target.value })}
            />
            <div className={styles.controls}>
              <button className={styles.navButton} onClick={prev}>Back</button>
              <button className={styles.submitButton} onClick={next}>Next</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className={styles.formBox}>
            <h2 className={styles.title}>Brand Persona</h2>
            <textarea
              className={styles.input}
              rows={4}
              placeholder="Describe your brand persona"
              value={data.brandPersona}
              onChange={(e) => setData({ ...data, brandPersona: e.target.value })}
            />
            <div className={styles.controls}>
              <button className={styles.navButton} onClick={prev}>Back</button>
              <button className={styles.submitButton} onClick={next} disabled={!data.brandPersona}>Next</button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className={styles.formBox}>
            <h2 className={styles.title}>Review & Confirm</h2>
            <div className="text-sm space-y-2 mb-4">
              <p><strong>Name:</strong> {data.name}</p>
              <p><strong>Handle:</strong> {data.handle}</p>
              <p><strong>Followers:</strong> {data.followers}</p>
              <p><strong>Niche:</strong> {data.niche}</p>
              <p><strong>Tone:</strong> {data.tone}</p>
              <p><strong>Values:</strong> {data.values.join(', ') || '-'}</p>
              <p><strong>Content Type:</strong> {data.contentType}</p>
              <p><strong>Brand Persona:</strong> {data.brandPersona}</p>
            </div>
            <div className={styles.controls}>
              <button className={styles.navButton} onClick={prev}>Back</button>
              <button className={styles.submitButton} onClick={handleConfirm}>Confirm</button>
            </div>
          </div>
        );
      case 6:
        return (
          <div className={styles.formBox}>
            <h2 className={styles.title}>All set!</h2>
            <p className={styles.subtitle}>Your profile has been saved.</p>
            <button className={styles.submitButton} onClick={() => router.push('/dashboard')}>
              Start Dashboard
            </button>
          </div>
        );
    }
  }

  return (
    <div className={styles.wrapper}>
      <Tabs value={step.toString()} onValueChange={(v) => setStep(Number(v))}>
        <TabsList className="mb-4 grid grid-cols-6 gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <TabsTrigger key={i} value={i.toString()}>{i + 1}</TabsTrigger>
          ))}
        </TabsList>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value={step.toString()}>{renderStep()}</TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
