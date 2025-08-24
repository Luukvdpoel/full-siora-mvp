export default function SiteNav() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-zinc-800 bg-black/60 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="/" className="text-xl font-semibold text-white">Siora</a>
        <div className="hidden gap-6 text-sm text-white/80 md:flex">
          <a href="#how" className="hover:text-white">How it works</a>
          <a href="#creators" className="hover:text-white">Creators</a>
          <a href="#brands" className="hover:text-white">Brands</a>
          <a href="/sign-in" className="hover:text-white">Login</a>
        </div>
      </div>
    </nav>
  );
}
