import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../lib/auth';
import { promises as fs } from 'fs';
import path from 'path';

interface Persona {
  id: string | number;
  userId: string;
  title: string;
  handle: string;
  tone: string;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/signin');
  }

  const file = await fs.readFile(
    path.join(process.cwd(), '..', '..', 'data', 'personas.json'),
    'utf8'
  );
  const data = JSON.parse(file) as Persona[];
  const list = data.filter((p) => p.userId === session!.user!.id);
  return (
    <main className="min-h-screen bg-white text-gray-900 p-6 space-y-6">
      <h1 className="text-3xl font-bold">Personas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((p) => (
          <div key={p.id} className="border rounded-lg p-4 shadow">
            <h2 className="text-xl font-semibold">{p.title}</h2>
            <p className="text-gray-500">{p.handle}</p>
            <p className="text-sm text-gray-700 mb-4">{p.tone}</p>
            <Link
              href={`/creator/${encodeURIComponent(p.handle.replace(/^@/, ''))}`}
              className="inline-block px-4 py-2 bg-indigo-600 text-white rounded"
            >
              View
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
