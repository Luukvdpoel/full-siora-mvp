'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { generateInstagramAuthUrl } from '@/lib/instagram'

export default function LoginPage() {
  const [mode, setMode] = useState<'brand' | 'creator'>('brand')

  const handleGoogle = () => {
    signIn('google', { callbackUrl: '/select-role' })
  }

  const handleInstagram = () => {
    window.location.href = generateInstagramAuthUrl()
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-Siora-dark text-white p-6">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setMode('brand')}
          className={`px-4 py-2 rounded-md border ${mode === 'brand' ? 'bg-Siora-accent text-white' : 'bg-transparent text-white'}`}
        >
          Login as Brand
        </button>
        <button
          onClick={() => setMode('creator')}
          className={`px-4 py-2 rounded-md border ${mode === 'creator' ? 'bg-Siora-accent text-white' : 'bg-transparent text-white'}`}
        >
          Login with Instagram
        </button>
      </div>
      {mode === 'brand' ? (
        <button onClick={handleGoogle} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md">
          Continue with Google
        </button>
      ) : (
        <button onClick={handleInstagram} className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-md">
          Connect Instagram
        </button>
      )}
    </main>
  )
}
