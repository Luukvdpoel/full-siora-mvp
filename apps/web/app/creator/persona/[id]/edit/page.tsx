"use client";
import React from 'react';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@creator/components/Toast';
import { useParams } from 'next/navigation';
import ReactMarkdown from "react-markdown";
import { saveProfileSettings } from "@creator/lib/profileSettings";
import styles from '../../../styles.module.css';

export default function EditPersonaPage() {
  const params = useParams();
  const idParam = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  const [step, setStep] = useState(0);
  const [handle, setHandle] = useState('');
  const [niche, setNiche] = useState('');
  const [audience, setAudience] = useState('');
  const [goal, setGoal] = useState('');
  const [tone, setTone] = useState('');
  const [platforms, setPlatforms] = useState('');
  const [persona, setPersona] = useState<string | null>(null);
  const [tagline, setTagline] = useState('');
  const [taglineLoading, setTaglineLoading] = useState(false);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [showSlowMessage, setShowSlowMessage] = useState(false);
  const slowTimer = useRef<NodeJS.Timeout | null>(null);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [struggles, setStruggles] = useState('');
  const [dreamBrands, setDreamBrands] = useState('');
  const [favFormats, setFavFormats] = useState('');
  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !idParam) return;
    try {
      const stored = localStorage.getItem(`inputs-${idParam}`);
      if (stored) {
        const data = JSON.parse(stored);
        setHandle(data.handle || '');
        setNiche(data.niche || '');
        setAudience(data.audience || '');
        setGoal(data.goal || '');
        setTone(data.tone || '');
        setPlatforms(data.platforms || '');
        setStruggles(data.struggles || '');
        setDreamBrands(data.dreamBrands || '');
        setFavFormats(data.favFormats || '');
      }
    } catch (err) {
      console.error('Failed to load inputs', err);
    }
  }, [idParam]);

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
    setLimitReached(false);
    setPersona(null);

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
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.status === 429) {
        setLimitReached(true);
        setPersona(null);
      } else {
        const data = await res.json();
        setPersona(data.result);
        saveProfileSettings({
          bio: data.result,
          tone,
          formats: favFormats.split(',').map(f => f.trim()).filter(Boolean),
          collabTypes: dreamBrands.split(',').map(b => b.trim()).filter(Boolean)
        });
      }
    } catch (error) {
      console.error(error);
      setPersona('Oops, something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!persona || !idParam) return;
    try {
      const res = await fetch(`/api/personas/${idParam}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: handle || 'Persona', persona }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      localStorage.setItem(`inputs-${idParam}`, JSON.stringify({ handle, niche, audience, goal, tone, platforms, struggles, dreamBrands, favFormats }));
      toast('Persona opgeslagen');
    } catch (err) {
      console.error('Failed to save persona', err);
      toast('Fout bij opslaan');
    }
  };

  const handleTagline = async () => {
    if (!persona) return;
    setTagline('');
    setTaglineLoading(true);
    try {
      const res = await fetch('/api/tagline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona }),
      });
      if (res.ok) {
        const data = await res.json();
        setTagline(data.tagline ?? '');
      }
    } catch (err) {
      console.error('Failed to generate tagline', err);
    } finally {
      setTaglineLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) {
      slowTimer.current = setTimeout(() => setShowSlowMessage(true), 30000);
    } else {
      setShowSlowMessage(false);
      if (slowTimer.current) {
        clearTimeout(slowTimer.current);
        slowTimer.current = null;
      }
    }
    return () => {
      if (slowTimer.current) {
        clearTimeout(slowTimer.current);
        slowTimer.current = null;
      }
    };
  }, [isLoading]);

  const advancedFields = !advancedMode ? (
    <button type="button" className="text-sm underline text-zinc-400 hover:text-white mt-4" onClick={() => setAdvancedMode(true)}>
      Want to go deeper?
    </button>
  ) : (
    <div className="mt-6 space-y-4">
      <div>
        <label className={styles.label}>What do you struggle with most as a creator?</label>
        <textarea className="w-full p-2 rounded-md bg-zinc-800 text-white" rows={3} value={struggles} onChange={(e) => setStruggles(e.target.value)} placeholder="E.g. staying consistent, finding my niche, pitching to brands..." />
      </div>
      <div>
        <label className={styles.label}>What brands would you love to work with?</label>
        <input type="text" className="w-full p-2 rounded-md bg-zinc-800 text-white" value={dreamBrands} onChange={(e) => setDreamBrands(e.target.value)} placeholder="E.g. Nike, Glossier, Patagonia" />
      </div>
      <div>
        <label className={styles.label}>What kind of content do you enjoy making most?</label>
        <input type="text" className="w-full p-2 rounded-md bg-zinc-800 text-white" value={favFormats} onChange={(e) => setFavFormats(e.target.value)} placeholder="E.g. Vlogs, educational reels, storytelling, memes" />
      </div>
    </div>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoWrapper}>
        <Image src="/siora-logo.svg" alt="Siora logo" width={140} height={140} className={styles.logo} />
        <h1 className={styles.title}>Edit your persona</h1>
      </div>

      {limitReached && (
        <div className="mb-4 rounded-md bg-red-600 text-white p-3 text-center">
          Limit reached. Upgrade for unlimited personas.
        </div>
      )}

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
            <button type="button" onClick={() => setStep(step + 1)} className="bg-zinc-700 hover:bg-zinc-600 transition-colors duration-200 text-white px-4 py-2 rounded-md">
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md disabled:opacity-50"
              disabled={!handle || !niche || !audience || !goal || !tone || !platforms || isLoading || (advancedMode && (!struggles || !dreamBrands || !favFormats))}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Updating…
                </span>
              ) : (
                'Regenerate Persona'
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

      {persona && (
        <div ref={resultRef} className="prose prose-invert max-w-3xl mx-auto mt-12 flex flex-col items-center gap-4 border border-white/10 bg-background p-6 sm:p-8 rounded-xl">
          <ReactMarkdown>{persona}</ReactMarkdown>
          <button type="button" onClick={handleSave} className="bg-green-600 hover:bg-green-500 transition-colors duration-200 text-white font-semibold py-2 px-4 rounded-md">
            Save Persona
          </button>
          <button
            type="button"
            onClick={handleTagline}
            disabled={taglineLoading}
            className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50"
          >
            {taglineLoading ? 'Generating...' : 'Generate sharp tagline'}
          </button>
          {tagline && <p className="italic text-center">{tagline}</p>}
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70">
          <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          {showSlowMessage && <p className="mt-4 text-sm text-white">Still cooking up your persona...</p>}
        </div>
      )}
    </div>
  );
}
