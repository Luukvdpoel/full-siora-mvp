import React from 'react';
"use client";
import { motion } from 'framer-motion';

export interface HeroProps {
  title: string;
  subtitle?: string;
  cta?: React.ReactNode;
  className?: string;
}

export function Hero({ title, subtitle, cta, className }: HeroProps) {
  return (
    <section className={`text-center py-20 space-y-6 ${className || ''}`}>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-zinc-400 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
      {cta && <div className="flex justify-center">{cta}</div>}
    </section>
  );
}

export default Hero;
