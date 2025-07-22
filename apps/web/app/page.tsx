"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Hero } from "shared-ui";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;
    const role = (session?.user as { role?: string })?.role;
    if (role === "brand") router.replace("/brand/dashboard");
    if (role === "creator") router.replace("/creator/dashboard");
  }, [status, session, router]);

  if (status === "loading") return null;

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white">
      <Hero
        title="Welcome to Siora"
        subtitle="An AI-powered marketplace connecting brands and creators."
        ctaLabel="Get Started"
        ctaHref="/signup"
      />
    </main>
  );
}
