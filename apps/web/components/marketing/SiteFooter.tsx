import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-zinc-800 py-10 text-sm text-zinc-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <p>© {new Date().getFullYear()} Siora</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-indigo-500 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-indigo-500 transition-colors">Terms</Link>
          <Link href="/contact" className="hover:text-indigo-500 transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
