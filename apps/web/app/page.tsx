'use client'
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Hero } from 'shared-ui'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ChevronUp, Search, Gauge, Handshake } from 'lucide-react'

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
      <header className="sticky top-0 z-50 bg-black/70 backdrop-blur px-6 sm:px-12 py-4 flex justify-between items-center">
        <span className="font-bold text-lg">Siora</span>
        <nav className="flex items-center gap-6 text-sm">
          <a href="/signin" className="px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">Login</a>
          <a href="#how" className="hover:text-indigo-400 transition-colors">How it works</a>
          <a href="/creator" className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors">Start</a>
        </nav>
      </header>
      {/* Hero */}
      <Hero
        title="Siora connects brands with creators that match their values — not just follower counts."
        subtitle=""
        className="max-w-5xl"
        fullHeight
      />
      <div className="flex justify-center gap-4 -mt-8">
        <a
          href="/brand"
          className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-all hover:scale-[1.02]"
        >
          Start as Brand
        </a>
        <a
          href="/creator"
          className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-all hover:scale-[1.02]"
        >
          Start as Creator
        </a>
      </div>

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
      <section id="how" className="px-6 py-24 max-w-4xl mx-auto space-y-12">
        <h2 className="text-3xl font-bold text-center mb-6 border-b border-indigo-500 w-fit mx-auto">How it works</h2>
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
        <h2 className="text-3xl font-bold text-center mb-12 border-b border-indigo-500 w-fit mx-auto">Why Siora?</h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="space-y-3 text-center">
            <Search className="w-10 h-10 mx-auto text-Siora-accent" />
            <h3 className="text-xl font-semibold">Find creators who match your tone.</h3>
            <p className="text-zinc-400 text-sm">Our AI analyses style and values so you connect with personalities that truly resonate.</p>
          </div>
          <div className="space-y-3 text-center">
            <Gauge className="w-10 h-10 mx-auto text-Siora-accent" />
            <h3 className="text-xl font-semibold">AI-powered campaign scoring.</h3>
            <p className="text-zinc-400 text-sm">See at a glance how each creator aligns with your brief for efficient outreach.</p>
          </div>
          <div className="space-y-3 text-center">
            <Handshake className="w-10 h-10 mx-auto text-Siora-accent" />
            <h3 className="text-xl font-semibold">Respect creators’ value.</h3>
            <p className="text-zinc-400 text-sm">Transparent offers ensure fair deals that build lasting relationships.</p>
          </div>
        </div>
      </section>

      {/* Testimonials placeholder */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-3xl font-bold mb-6 border-b border-indigo-500 w-fit mx-auto">Testimonials</h2>
        <p className="text-zinc-400">Real stories from our users coming soon.</p>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24 bg-Siora-mid">
        <h2 className="text-3xl font-bold text-center mb-8 border-b border-indigo-500 w-fit mx-auto">FAQ</h2>
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
            href="/creator"
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-all hover:scale-[1.02]"
          >
            Start as Creator
          </a>
          <a
            href="/brand"
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-all hover:scale-[1.02]"
          >
            Start as Brand
          </a>
        </motion.div>
      </section>
      <footer className="bg-Siora-mid text-center text-sm py-6 space-x-4">
        <a href="/privacy" className="underline hover:text-Siora-accent">Privacy</a>
        <a href="/terms" className="underline hover:text-Siora-accent">Terms</a>
        <a href="/signin" className="underline hover:text-Siora-accent">Login</a>
        <p className="mt-2 text-zinc-400">© {new Date().getFullYear()} Siora</p>
      </footer>
    </main>
  )
}
