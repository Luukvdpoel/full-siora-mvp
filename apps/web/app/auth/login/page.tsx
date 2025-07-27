'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from 'shared-ui';

export default function LoginPage() {
  const [tab, setTab] = useState('brand');
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-bold">Login</h1>
      <Tabs value={tab} onValueChange={setTab} className="w-80">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="brand">Login as Brand</TabsTrigger>
          <TabsTrigger value="creator">Login with Instagram</TabsTrigger>
        </TabsList>
        <TabsContent value="brand" className="mt-4 flex justify-center">
          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="px-4 py-2 bg-Siora-accent text-white rounded"
          >
            Sign in with Google
          </button>
        </TabsContent>
        <TabsContent value="creator" className="mt-4 flex justify-center">
          <button
            onClick={() => (window.location.href = '/instagram/login')}
            className="px-4 py-2 bg-Siora-accent text-white rounded"
          >
            Connect Instagram
          </button>
        </TabsContent>
      </Tabs>
    </main>
  );
}
