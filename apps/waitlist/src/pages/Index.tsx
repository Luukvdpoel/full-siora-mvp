import Hero from "@/components/marketing/Hero";
import Features from "@/components/marketing/Features";
import WaitlistForm from "@/components/marketing/WaitlistForm";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Siora — Collaborations for people and brands | usesiora.com</title>
        <meta name="description" content="Siora connects creators and brands to collaborate with clarity. Join the early access waitlist for usesiora.com." />
        <link rel="canonical" href="https://usesiora.com/" />
        <meta property="og:title" content="Siora — Collaborations for people and brands" />
        <meta property="og:description" content="Join the early access waitlist for usesiora.com and help shape the platform." />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Siora',
          url: 'https://usesiora.com/',
          potentialAction: {
            '@type': 'SubscribeAction',
            target: 'https://usesiora.com/#waitlist',
            name: 'Join the Siora waitlist'
          }
        })}</script>
      </Helmet>

      <main>
        <Hero />
        <Features />
        <WaitlistForm />
      </main>

      <footer className="border-t">
        <div className="container mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Siora. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Index;
