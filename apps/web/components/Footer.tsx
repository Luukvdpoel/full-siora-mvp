import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-Siora-mid text-center text-sm py-6 space-x-4 mt-12">
      <a href="/about" className="underline hover:text-Siora-accent">About Us</a>
      <a href="/mission" className="underline hover:text-Siora-accent">Our Mission</a>
      <a href="/contact" className="underline hover:text-Siora-accent">Contact</a>
      <a href="/privacy" className="underline hover:text-Siora-accent">Privacy</a>
    </footer>
  );
}
