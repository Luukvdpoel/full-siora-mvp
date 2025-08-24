export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 py-12 text-center text-sm text-white/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 md:flex-row md:justify-between">
        <p>&copy; {new Date().getFullYear()} Siora</p>
        <div className="flex gap-6">
          <a href="/privacy" className="hover:text-white">Privacy</a>
          <a href="/terms" className="hover:text-white">Terms</a>
          <a href="mailto:hello@usesiora.com" className="hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  );
}
