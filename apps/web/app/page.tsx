import Link from "next/link";
import { Hero } from "shared-ui";

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white">
      <Hero
        title="Welcome to Siora"
        subtitle="AI-powered marketplace connecting creators and brands"
        cta={
          <div className="flex justify-center gap-4">
            <Link
              href="/brand"
              className="px-6 py-3 rounded-md bg-white text-black font-semibold transition-all duration-300 hover:bg-zinc-200"
            >
              I'm a Brand
            </Link>
            <Link
              href="/creator"
              className="px-6 py-3 rounded-md bg-white text-black font-semibold transition-all duration-300 hover:bg-zinc-200"
            >
              I'm a Creator
            </Link>
          </div>
        }
      />
    </main>
  );
}
