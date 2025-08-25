
"use client";

import Hero from "@/components/marketing/Hero";
import Features from "@/components/marketing/Features";
import WaitlistForm from "@/components/marketing/WaitlistForm";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { track } from "@/lib/analytics/track";

export default function Home() {
  useEffect(() => {
    track("landing_view");
  }, []);
  return (
    <>
      <Toaster position="top-right" />
      <Hero />
      <WaitlistForm />
      <Features />
    </>
  );
}

