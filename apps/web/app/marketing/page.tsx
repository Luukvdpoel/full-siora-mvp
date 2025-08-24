import Hero from '@/components/marketing/Hero'
import Features from '@/components/marketing/Features'
import WaitlistForm from '@/components/marketing/WaitlistForm'
import { Toaster } from 'react-hot-toast'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Siora — Collaborations for people and brands | usesiora.com',
  description:
    'Siora connects creators and brands to collaborate with clarity. Join the early access waitlist for usesiora.com.',
}

export default function MarketingPage() {
  return (
    <>
      <Toaster position="top-center" />
      <main>
        <Hero />
        <Features />
        <WaitlistForm />
      </main>
      <footer className="border-t">
        <div className="container mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Siora. All rights reserved.
        </div>
      </footer>
    </>
  )
}
