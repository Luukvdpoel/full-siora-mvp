import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Feedback - Siora',
  description: 'Share your feedback with the Siora team.'
}

export default function FeedbackPage() {
  return (
    <main className="min-h-screen p-6">
      <iframe
        src="https://tally.so/r/xyz123"
        className="w-full min-h-[80vh] rounded"
        allowFullScreen
      />
    </main>
  )
}
