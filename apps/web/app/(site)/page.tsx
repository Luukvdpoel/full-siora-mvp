import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Hero from "@/components/marketing/Hero";
import FeatureGrid from "@/components/marketing/FeatureGrid";
import Testimonials from "@/components/marketing/Testimonials";
import SiteFooter from "@/components/marketing/SiteFooter";
import { WaitlistCount } from "../(marketing)/_components/WaitlistCount";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Siora – Smarter, fairer brand deals",
  description: "AI-powered brand-creator partnerships that value fit and fairness.",
  openGraph: {
    title: "Siora – Smarter, fairer brand deals",
    description: "AI-powered brand-creator partnerships that value fit and fairness.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Siora – Smarter, fairer brand deals",
    description: "AI-powered brand-creator partnerships that value fit and fairness.",
    images: ["/og.png"],
  },
};

export default function HomePage() {
  return (
    <>
      <Toaster position="top-right" />
      <Hero />
      <div className="py-12 text-center text-white/80">
        Join <WaitlistCount />+ creators &amp; brands
      </div>
      <FeatureGrid />
      <Testimonials />
      <SiteFooter />
    </>
  );
}
