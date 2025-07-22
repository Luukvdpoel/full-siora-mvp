"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import styles from "../styles.module.css";
import { saveOnboardingDraft, loadOnboardingDraft } from "@/lib/localOnboarding";

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
const steps = ["Start", "Basics", "Tone", "Values", "Persona", "Review"];

export default function CreatorOnboarding() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState("0");
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
    const local = loadOnboardingDraft();
    if (local) setData((d) => ({ ...d, ...local }));
    if (session?.user?.id) {
      fetch(`/api/onboarding-draft?userId=${session.user.id}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((res) => {
          if (res?.draft?.progress) {
            setData((d) => ({ ...d, ...res.draft.progress }));
          }
        })
        .catch(() => {});
    }
  }, [session]);

  useEffect(() => {
    saveOnboardingDraft(data);
    if (session?.user?.id) {
      fetch("/api/onboarding-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, progress: data }),
      }).catch(() => {});
    }
  }, [data, session]);

  const handleConfirm = async () => {
    const res = await fetch("/api/onboarding-complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ progress: data }),
    });
    if (res.ok) {
      localStorage.removeItem("onboardingProgress");
      router.push("/dashboard");
    }
  };

  return (
    <div className={styles.wrapper}>
      <Tabs value={step} onChange={setStep}>
        <TabsList className="mb-4">
          {steps.map((_, idx) => (
            <TabsTrigger
              key={idx}
              value={idx.toString()}
              current={step}
              onChange={setStep}
              className="flex-1"
            >
              {idx + 1}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="0" current={step}>
          <div className={styles.formBox}>
            <h1 className={styles.title}>Welcome to Siora</h1>
            <p className={styles.subtitle}>Let's set up your creator profile.</p>
            <div className={styles.controls}>
              <button className={styles.submitButton} onClick={() => setStep("1")}>Get Started</button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="1" current={step}>
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
              <button className={styles.navButton} onClick={() => setStep("0")}>Back</button>
              <button className={styles.submitButton} onClick={() => setStep("2")}>Next</button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="2" current={step}>
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
              <button className={styles.navButton} onClick={() => setStep("1")}>Back</button>
              <button className={styles.submitButton} onClick={() => setStep("3")} disabled={!data.tone}>Next</button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="3" current={step}>
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
              <button className={styles.navButton} onClick={() => setStep("2")}>Back</button>
              <button className={styles.submitButton} onClick={() => setStep("4")}>Next</button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="4" current={step}>
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
              <button className={styles.navButton} onClick={() => setStep("3")}>Back</button>
              <button className={styles.submitButton} onClick={() => setStep("5")} disabled={!data.brandPersona}>Next</button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="5" current={step}>
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
              <button className={styles.navButton} onClick={() => setStep("4")}>Back</button>
              <button className={styles.submitButton} onClick={handleConfirm}>Confirm</button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
