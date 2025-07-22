import fs from 'fs';
import path from 'path';
import Link from 'next/link';

function collect(dir: string, base = ''): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const routes: string[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith('_') || entry.name === 'components' || entry.name === 'lib') continue;
    const full = path.join(dir, entry.name);
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) {
      routes.push(...collect(full, rel));
    } else if (entry.name === 'page.tsx' || entry.name === 'page.jsx') {
      const route = '/' + base.replace(/\\index$/, '').replace(/\\/g, '/');
      routes.push(route === '' ? '/' : route);
    }
  }
  return routes;
}

export default function DebugPages() {
  const root = path.join(process.cwd(), 'app');
  const routes = collect(root).sort();
  return (
    <main className="min-h-screen p-6 space-y-4">
      <h1 className="text-2xl font-bold">All Routes</h1>
      <ul className="space-y-2 list-disc list-inside">
        {routes.map((r) => (
          <li key={r}>
            <Link href={r}>{r}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
