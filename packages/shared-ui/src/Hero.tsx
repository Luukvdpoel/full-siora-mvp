import React from 'react';
"use client";
import { motion } from 'framer-motion';

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function Hero({ title, subtitle, ctaLabel, ctaHref }: HeroProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 py-24 text-center space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl font-extrabold tracking-tight"
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-zinc-300 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
      {ctaLabel && ctaHref && (
        <motion.a
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          href={ctaHref}
          className="inline-block px-6 py-3 rounded-md bg-Siora-accent text-white hover:bg-Siora-hover transition-all duration-300 ease-in-out"
        >
          {ctaLabel}
        </motion.a>
      )}
    </section>
  );
}
