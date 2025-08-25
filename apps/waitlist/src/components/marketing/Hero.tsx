import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=1770&q=80";

const Hero = () => {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty("--mouse-x", `${x}%`);
      document.documentElement.style.setProperty("--mouse-y", `${y}%`);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[image:var(--gradient-hero)] bg-[length:200%_200%] animate-gradient-pan" />
      <div className="aurora-bg -z-10" />

      <div className="container mx-auto px-6 pt-20 pb-10 md:pt-28 md:pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--brand)/0.25)] bg-[hsl(var(--brand)/0.06)] px-3 py-1 text-xs text-[hsl(var(--brand))]">
            <Sparkles className="size-3" /> Early access
          </span>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Siora — where creators and brands connect, collaborate, and grow
          </h1>
          <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
            Build authentic partnerships without the inbox chaos. Streamlined briefs, discovery, and performance insights in one shared workspace.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="hero" size="xl">
              <a href="#waitlist">Join the waitlist</a>
            </Button>
            <Button asChild variant="glow" size="xl">
              <a href="#features">See how it works</a>
            </Button>
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <figure className="relative mx-auto max-w-5xl overflow-hidden rounded-xl border border-[hsl(var(--brand)/0.2)] bg-card/60 shadow-sm backdrop-blur">
            <img
              src={HERO_IMAGE_URL}
              alt="Siora collaborative workspace connecting creators and brands"
              loading="lazy"
              className="h-auto w-full object-cover will-change-transform md:hover:scale-[1.01] transition-transform duration-700"
            />
          </figure>
        </div>
      </div>
    </header>
  );
};

export default Hero;
