import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <header className="py-20 text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-Siora-accent/50 bg-Siora-accent/10 px-3 py-1 text-xs text-Siora-accent">
        <Sparkles className="size-3" /> Early access
      </span>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
        Siora — where creators and brands connect, collaborate, and grow
      </h1>
      <p className="mt-4 mx-auto max-w-2xl text-base text-white/70 sm:text-lg">
        Build authentic partnerships without the inbox chaos. Streamlined briefs, discovery, and performance insights in one shared workspace.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button asChild variant="brand" size="lg">
          <a href="#waitlist">Join the waitlist</a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="#features">See how it works</a>
        </Button>
      </div>
      <div className="mt-12">
        <figure className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-Siora-border bg-gray-900/50">
          <img
            src="https://placehold.co/1200x600/png"
            alt="Siora collaborative workspace connecting creators and brands"
            loading="lazy"
            className="h-auto w-full object-cover"
          />
        </figure>
      </div>
    </header>
  );
};

export default Hero;
