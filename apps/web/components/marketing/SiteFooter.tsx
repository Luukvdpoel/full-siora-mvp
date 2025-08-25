export default function SiteFooter() {
  return (
    <footer className="py-12 text-center text-sm text-white/60">
      <div className="flex justify-center gap-6">
        <a href="/privacy" className="hover:text-white">Privacy</a>
        <a href="/terms" className="hover:text-white">Terms</a>
        <a href="mailto:hello@usesiora.com" className="hover:text-white">Contact</a>
      </div>
    </footer>
  );
}
