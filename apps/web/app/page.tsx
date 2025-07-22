"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Hero } from "shared-ui";

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "loading" && session?.user) {
      const role = (session.user as { role?: string }).role;
      if (role === "creator") router.replace("/creator/dashboard");
      else if (role === "brand") router.replace("/dashboard");
    }
  }, [session, status, router]);

  if (session && status === "authenticated") {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Redirecting...
      </main>
    );
  }

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
