"use client";

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';
import ReactMarkdown from "react-markdown";


export default function Home() {
  const [step, setStep] = useState(0);
  const [handle, setHandle] = useState('');
  const [niche, setNiche] = useState('');
  const [audience, setAudience] = useState('');
  const [goal, setGoal] = useState('');
  const [tone, setTone] = useState('');
  const [platforms, setPlatforms] = useState('');
  const [persona, setPersona] = useState<string | null>(null);
  const [storedPersona, setStoredPersona] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [struggles, setStruggles] = useState('');
  const [dreamBrands, setDreamBrands] = useState('');
  const [favFormats, setFavFormats] = useState('');
  const resultRef = useRef<HTMLDivElement | null>(null);



  const questions = [
    { label: "What's your Instagram handle?", value: handle, setter: setHandle, placeholder: '@yourhandle' },
    { label: 'What niche are you in?', value: niche, setter: setNiche, placeholder: 'fashion, tech, beauty...' },
    { label: 'Describe your audience in 3 words', value: audience, setter: setAudience, placeholder: 'creative curious visual' },
    { label: 'What’s your brand or creator goal?', value: goal, setter: setGoal, placeholder: 'grow audience, get brand deals' },
    { label: 'What is your tone or vibe?', value: tone, setter: setTone, placeholder: 'fun, elegant, bold' },
    { label: 'What platforms are you focused on?', value: platforms, setter: setPlatforms, placeholder: 'Instagram, TikTok, YouTube' },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setPersona(null); // Optional: clear last result while loading
  
    const payload = {
      handle,
      vibe: tone,
      goal,
      audience,
      contentPreference: niche,
      platform: platforms,
      struggles,
      dreamBrands,
      favFormats,
    };
    
  
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
      setPersona(data.result);
    } catch (error) {
      console.error(error);
      setPersona("Oops, something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!persona) return;
    try {
      await fetch("/api/personas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: handle || "Persona", persona }),
      });
    } catch (err) {
      console.error("Failed to save persona", err);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("lastPersona");
    if (saved) setStoredPersona(saved);
  }, []);

  useEffect(() => {
    if (!persona) return;
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
    try {
      localStorage.setItem("lastPersona", persona);
      setStoredPersona(persona);
    } catch (err) {
      console.error("Failed to persist persona", err);
    }
  }, [persona]);
  
  const advancedFields = !advancedMode ? (
    <button
      type="button"
      className="text-sm underline text-zinc-400 hover:text-white mt-4"
      onClick={() => setAdvancedMode(true)}
    >
      Want to go deeper?
    </button>
  ) : (
    <div className="mt-6 space-y-4">
      <div>
        <label className={styles.label}>What do you struggle with most as a creator?</label>
        <textarea
          className="w-full p-2 rounded-md bg-zinc-800 text-white"
          rows={3}
          value={struggles}
          onChange={(e) => setStruggles(e.target.value)}
          placeholder="E.g. staying consistent, finding my niche, pitching to brands..."
        />
      </div>
      <div>
        <label className={styles.label}>What brands would you love to work with?</label>
        <input
          type="text"
          className="w-full p-2 rounded-md bg-zinc-800 text-white"
          value={dreamBrands}
          onChange={(e) => setDreamBrands(e.target.value)}
          placeholder="E.g. Nike, Glossier, Patagonia"
        />
      </div>
      <div>
        <label className={styles.label}>What kind of content do you enjoy making most?</label>
        <input
          type="text"
          className="w-full p-2 rounded-md bg-zinc-800 text-white"
          value={favFormats}
          onChange={(e) => setFavFormats(e.target.value)}
          placeholder="E.g. Vlogs, educational reels, storytelling, memes"
        />
      </div>
    </div>
  );
  

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoWrapper}>
        <Image src="/Siora-logo.png" alt="Siora logo" width={140} height={140} className={styles.logo} />
        <h1 className={styles.title}>Your identity, illuminated.</h1>
        <p className={styles.subtitle}>
          Siora helps creators shine online with AI-powered tools to discover, express, and grow their digital identity.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.formBox}>
        <label className={styles.label}>{questions[step].label}</label>
        <input
          type="text"
          className={styles.input}
          placeholder={questions[step].placeholder}
          value={questions[step].value}
          onChange={(e) => questions[step].setter(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (step < questions.length - 1) setStep(step + 1);
            }
          }}
          required
        />

        <div className={styles.controls}>
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)} className={styles.navButton}>
              Back
            </button>
          )}
          {step < questions.length - 1 ? (
  <button type="button" onClick={() => setStep(step + 1)} className="bg-zinc-700 text-white px-4 py-2 rounded-md">
    Next
  </button>
) : (
  <button
    type="submit"
    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
    disabled={
      !handle || !niche || !audience || !goal || !tone || !platforms || isLoading ||
      (advancedMode && (!struggles || !dreamBrands || !favFormats))
    }    
  >
    {isLoading ? (
      <span className="flex items-center gap-2">
        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        Crafting your identity…
      </span>
    ) : (
      "Generate My Persona"
    )}
  </button>
)}
</div>


        <div className={styles.progressBarWrapper}>
          <div className={styles.progressBar} style={{ width: `${((step + 1) / questions.length) * 100}%` }}></div>
        </div>

          <p className={styles.stepIndicator}>Step {step + 1} of {questions.length}</p>
          {advancedFields}
        </form>

      {storedPersona && !persona && (
        <button
          type="button"
          onClick={() => setPersona(storedPersona)}
          className="mt-4 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 px-4 rounded-md"
        >
          View My Saved Persona
        </button>
      )}

      {isLoading && (
        <div className="flex items-center justify-center gap-2 mt-4 text-zinc-300">
          <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span>Crafting your identity…</span>
        </div>
      )}

      {persona && (
  <div ref={resultRef} className="prose prose-invert max-w-3xl mx-auto mt-12 flex flex-col items-center gap-4">
    <ReactMarkdown>{persona}</ReactMarkdown>
    <button
      type="button"
      onClick={handleSave}
      className="bg-green-600 hover:bg-green-700 transition text-white font-semibold py-2 px-4 rounded-md"
    >
      Save Persona
    </button>
  </div>
)}
    </div>
  );
}

