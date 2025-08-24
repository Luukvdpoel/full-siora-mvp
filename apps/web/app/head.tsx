export default function Head() {
  return (
    <>
      <title>Siora — Collaborations for people and brands | usesiora.com</title>
      <meta
        name="description"
        content="Siora connects creators and brands to collaborate with clarity. Join the early access waitlist for usesiora.com."
      />
      <link rel="canonical" href="https://usesiora.com/" />
      <meta
        property="og:title"
        content="Siora — Collaborations for people and brands"
      />
      <meta
        property="og:description"
        content="Join the early access waitlist for usesiora.com and help shape the platform."
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Siora',
            url: 'https://usesiora.com/',
            potentialAction: {
              '@type': 'SubscribeAction',
              target: 'https://usesiora.com/#waitlist',
              name: 'Join the Siora waitlist'
            }
          }),
        }}
      />
    </>
  );
}
