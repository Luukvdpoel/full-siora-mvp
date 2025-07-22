import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Siora',
  description: 'The terms governing use of the Siora platform.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white px-6 py-12">
      <div className="prose prose-invert max-w-3xl mx-auto">
        <h1>Terms of Service</h1>
        <p>By using Siora you agree to use the service responsibly and comply with all applicable laws. You are responsible for maintaining the security of your account.</p>
        <p>All content on the platform is owned by Siora or its licensors. You may not copy or resell any part of the service without permission.</p>
        <p>Payments are handled through Stripe and are subject to Stripe's terms. We are not liable for issues arising from Stripe's processing.</p>
        <p>Siora is provided "as is" without warranties. We limit our liability to the fullest extent permitted by law.</p>
      </div>
    </main>
  );
}
