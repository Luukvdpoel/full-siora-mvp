'use client'
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import type { Metadata } from 'next'
import { motion } from 'framer-motion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion'

export const metadata: Metadata = {
  title: 'Siora – Smarter Brand-Creator Matches',
  description: 'AI-powered platform connecting creators and brands for fair collaborations.',
  openGraph: {
    title: 'Siora – Smarter Brand-Creator Matches',
    description:
      'AI-powered platform connecting creators and brands for fair collaborations.',
    images: ['/siora-logo.svg']
  }
}

export default function Page() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status !== 'authenticated') return
    const role = (session?.user as { role?: string })?.role
    if (role === 'brand') router.replace('/dashboard')
    if (role === 'creator') router.replace('/persona')
  }, [status, session, router])

  if (status === 'loading') return null

  return (
    <main className="min-h-screen bg-Siora-dark text-white font-sans">
      {/* Hero */}
      <section className="px-6 py-24 text-center max-w-5xl mx-auto space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold tracking-tight"
        >
          Smarter, fairer brand deals.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-zinc-300 max-w-xl mx-auto"
        >
          AI-powered brand-creator partnerships. Built for creators who value their worth.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <a
            href="/signup?role=brand"
            className="px-6 py-3 rounded-md bg-white text-Siora-dark hover:bg-zinc-200 transition"
          >
            Join as brand
          </a>
          <a
            href="/signup?role=creator"
            className="px-6 py-3 rounded-md border border-white hover:bg-white hover:text-Siora-dark transition"
          >
            Join as creator
          </a>
        </motion.div>
      </section>

      {/* Mission statement */}
      <section className="px-6 py-16 text-center bg-Siora-mid">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xl font-semibold"
        >
          Siora empowers creators to find aligned partnerships — and helps brands discover voices that truly fit.
        </motion.p>
      </section>

      {/* How it works */}
      <section className="px-6 py-24 max-w-4xl mx-auto space-y-12">
        <h2 className="text-3xl font-bold text-center mb-6">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <span className="text-5xl font-bold text-Siora-accent">1</span>
            <p>Build a persona or campaign brief</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-2"
          >
            <span className="text-5xl font-bold text-Siora-accent">2</span>
            <p>Discover fair matches</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-2"
          >
            <span className="text-5xl font-bold text-Siora-accent">3</span>
            <p>Collaborate and get paid</p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24 bg-Siora-mid">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Creators</h3>
            <ul className="space-y-2 list-disc list-inside text-zinc-300">
              <li>Smart persona builder</li>
              <li>Fairness layer</li>
              <li>Protect against affiliate-only offers</li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4">Brands</h3>
            <ul className="space-y-2 list-disc list-inside text-zinc-300">
              <li>GPT-powered briefs</li>
              <li>Intelligent match scoring</li>
              <li>Shortlist management</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials placeholder */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-3xl font-bold mb-6">Testimonials</h2>
        <p className="text-zinc-400">Real stories from our users coming soon.</p>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24 bg-Siora-mid">
        <h2 className="text-3xl font-bold text-center mb-8">FAQ</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          <Accordion type="single" collapsible className="space-y-2">
            {[
              {
                q: 'Is Siora free to use?',
                a: 'Yes, creators can join for free. Brands pay per campaign.'
              },
              {
                q: 'How do matches work?',
                a: 'Our AI reviews each profile to suggest partners that share your values.'
              },
              {
                q: 'Can I change my role later?',
                a: 'Absolutely, contact support anytime.'
              }
            ].map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-Siora-border"
              >
                <AccordionTrigger className="w-full text-left">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-zinc-300">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA footer */}
      <section className="px-6 py-24 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-6"
        >
          Get started in 2 minutes. No code. No spam.
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center gap-4"
        >
          <a
            href="/signup?role=creator"
            className="px-6 py-3 rounded-md bg-Siora-accent hover:bg-Siora-hover transition shadow-Siora-hover"
          >
            Join as creator
          </a>
          <a
            href="/signup?role=brand"
            className="px-6 py-3 rounded-md border border-white hover:bg-white hover:text-Siora-dark transition"
          >
            Join as brand
          </a>
        </motion.div>
      </section>
      <footer className="px-6 py-8 text-center text-sm text-zinc-400">
        <a href="/privacy" className="underline mr-4">Privacy Policy</a>
        <a href="/terms" className="underline">Terms of Service</a>
        <p className="mt-4">&copy; {new Date().getFullYear()} Siora</p>
      </footer>
    </main>
  )
}
