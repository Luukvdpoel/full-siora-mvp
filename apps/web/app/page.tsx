import type { Metadata } from 'next';
import SiteNav from '@/components/marketing/SiteNav';
import Hero from '@/components/marketing/Hero';
import FeatureGrid from '@/components/marketing/FeatureGrid';
import Testimonials from '@/components/marketing/Testimonials';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'Siora – Smarter, fairer brand deals',
  description: 'AI-powered brand-creator partnerships that value fit and fairness.',
  openGraph: {
    title: 'Siora – Smarter, fairer brand deals',
    description: 'AI-powered brand-creator partnerships that value fit and fairness.',
    images: [{ url: '/og.svg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Siora – Smarter, fairer brand deals',
    description: 'AI-powered brand-creator partnerships that value fit and fairness.',
    images: ['/og.svg'],
  },
};

export default function Page() {
  return (
    <div className="bg-[#0B0B0C] text-[#F5F7FB]">
      <SiteNav />
      <main>
        <Hero />
        <FeatureGrid />
        <Testimonials />
      </main>
      <SiteFooter />
    </div>
  );
}
