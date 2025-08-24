import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <header className="py-20 text-center">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
        Smarter, fairer brand deals.
      </h1>
      <p className="mt-4 mx-auto max-w-2xl text-base text-white/70 sm:text-lg">
        Siora pairs brands with creators who share values—not just audience stats.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild variant="outline" size="lg">
          <a href="#waitlist">Brand</a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="#waitlist">Creator</a>
        </Button>
      </div>
    </header>
  );
};

export default Hero;
