import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Siora',
  description: 'Learn how Siora collects and uses your data.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white px-6 py-12">
      <div className="prose prose-invert max-w-3xl mx-auto">
        <h1>Privacy Policy</h1>
        <p>Siora collects information you choose to share with us such as your Instagram details and account preferences. We also gather usage data so we can improve matchmaking between creators and brands.</p>
        <p>We use this information only to operate and enhance the Siora platform. Your profile data helps us surface better creator matches and personalize your experience.</p>
        <p>We never sell your personal data. Limited information is shared with trusted partners like Stripe for payment processing. These partners only receive the details required to provide their services.</p>
        <p>You have full control over your information. You may request deletion of your data or update your preferences at any time by contacting us.</p>
      </div>
    </main>
  );
}
