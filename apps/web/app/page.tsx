
"use client";

import Hero from "@/components/marketing/Hero";
import Features from "@/components/marketing/Features";
import WaitlistForm from "@/components/marketing/WaitlistForm";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <>
      <Toaster position="top-right" />
      <Hero />
      <Features />
      <WaitlistForm />
    </>
  );
}

