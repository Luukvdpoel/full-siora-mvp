'use client'
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ChevronUp } from 'lucide-react'

export default function Page() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status !== 'authenticated') return
    const role = (session?.user as { role?: string })?.role
    if (role === 'brand') router.replace('/dashboard')
    if (role === 'creator') router.replace('/explorer')
  }, [status, session, router])

  if (status === 'loading') return null

  return (
    <main className="min-h-screen bg-Siora-dark text-white font-sans">
      {/* Hero */}
      <section className="px-6 py-24 text-center max-w-5xl mx-auto space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold tracking-tight"
        >
          Smarter, fairer brand deals.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-zinc-300 max-w-xl mx-auto"
        >
          AI-powered brand-creator partnerships. Built for creators who value their worth.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <a
            href="/signup?role=creator"
            className="px-6 py-3 rounded-md bg-Siora-accent hover:bg-Siora-hover transition shadow-Siora-hover"
          >
            Join as Creator
          </a>
          <a
            href="/signup?role=brand"
            className="px-6 py-3 rounded-md border border-white hover:bg-white hover:text-Siora-dark transition"
          >
            Join as Brand
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

      {/* Value props */}
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
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is Siora free to use?</AccordionTrigger>
              <AccordionContent>
                Yes, creators can join for free. Brands pay per campaign.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How do matches work?</AccordionTrigger>
              <AccordionContent>
                Our AI reviews each profile to suggest partners that share your values.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I change my role later?</AccordionTrigger>
              <AccordionContent>
                Absolutely, contact support anytime.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How long does onboarding take?</AccordionTrigger>
              <AccordionContent>
                Most users create a profile and start matching in under two minutes.
              </AccordionContent>
            </AccordionItem>
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
            Join as Creator
          </a>
          <a
            href="/signup?role=brand"
            className="px-6 py-3 rounded-md border border-white hover:bg-white hover:text-Siora-dark transition"
          >
            Join as Brand
          </a>
        </motion.div>
      </section>
      <footer className="bg-Siora-mid text-center text-sm py-6 space-x-4">
        <a href="/privacy" className="underline hover:text-Siora-accent">Privacy Policy</a>
        <a href="/terms" className="underline hover:text-Siora-accent">Terms of Service</a>
        <p className="mt-2 text-zinc-400">© {new Date().getFullYear()} Siora</p>
      </footer>
    </main>
  )
}
