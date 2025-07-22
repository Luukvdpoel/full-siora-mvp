'use client'
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Disclosure } from '@headlessui/react'
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
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold tracking-tight"
        >
          Forge Fair Brand Partnerships
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-zinc-300 max-w-xl mx-auto"
        >
          Siora matches authentic creators and brands using AI-driven personas.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <a
            href="/explorer"
            className="px-6 py-3 rounded-md bg-Siora-accent hover:bg-Siora-hover transition shadow-Siora-hover"
          >
            Explore creators
          </a>
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
          Fair partnerships. Smarter matches. Built for real creators.
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
            <p>Build your profile</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-2"
          >
            <span className="text-5xl font-bold text-Siora-accent">2</span>
            <p>Discover matches</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-2"
          >
            <span className="text-5xl font-bold text-Siora-accent">3</span>
            <p>Collaborate with aligned brands</p>
          </motion.div>
        </div>
      </section>

      {/* Value props */}
      <section className="px-6 py-24 bg-Siora-mid">
        <h2 className="text-3xl font-bold text-center mb-12">Why Siora?</h2>
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Creators</h3>
            <ul className="space-y-2 list-disc list-inside text-zinc-300">
              <li>No affiliate-only offers</li>
              <li>Get paid your worth</li>
              <li>Automated persona &amp; pitch</li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4">Brands</h3>
            <ul className="space-y-2 list-disc list-inside text-zinc-300">
              <li>Smarter discovery</li>
              <li>Fair matching</li>
              <li>Campaign-ready brief tools</li>
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
          {[
            {
              q: 'Is Siora free to use?',
              a: 'Yes, creators can join for free. Brands pay per campaign.'
            },
            {
              q: 'How do matches work?',
              a: 'Our AI reviews each profile to suggest partners that share your values.'
            },
            { q: 'Can I change my role later?', a: 'Absolutely, contact support anytime.' }
          ].map((item, i) => (
            <Disclosure key={i} as="div" className="border-b border-Siora-border pb-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between w-full text-left font-medium py-2">
                    <span>{item.q}</span>
                    <ChevronUp className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                  </Disclosure.Button>
                  <Disclosure.Panel className="mt-2 text-zinc-300">{item.a}</Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
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
          Start creating fairer brand deals today
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
    </main>
  )
}
