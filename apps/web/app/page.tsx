import SiteNav from '@/components/marketing/SiteNav';
import Hero from '@/components/marketing/Hero';
import FeatureGrid from '@/components/marketing/FeatureGrid';
import Testimonials from '@/components/marketing/Testimonials';
import SiteFooter from '@/components/marketing/SiteFooter';
import { WaitlistCount } from './(marketing)/_components/WaitlistCount';
import { Toaster } from 'react-hot-toast';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Siora – Smarter, fairer brand deals',
  description:
    'AI-powered brand-creator partnerships that value fit and fairness.',
  openGraph: {
    title: 'Siora – Smarter, fairer brand deals',
    description:
      'AI-powered brand-creator partnerships that value fit and fairness.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Siora – Smarter, fairer brand deals',
    description:
      'AI-powered brand-creator partnerships that value fit and fairness.',
    images: ['/og.png'],
  },
};

export default async function Home() {
  const count = await WaitlistCount();
  return (
    <>
      <Toaster position="top-right" />
      <SiteNav />
      <Hero />
      <section className="mt-12 text-center text-zinc-400">
        Join {count}+ creators &amp; brands
      </section>
      <FeatureGrid />
      <Testimonials />
      <SiteFooter />
    </>
  );
}
