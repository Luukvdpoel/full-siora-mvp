import { Hero } from "shared-ui";

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white">
      <Hero
        title="Welcome to Siora"
        subtitle="An AI-powered marketplace connecting brands and creators."
        ctaLabel="Get Started"
        ctaHref="/signup"
      />
    </main>
  );
}
