import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions, prisma } from '@/lib/auth';
import { matchScore } from 'shared-utils';

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/signin');
  }

  const campaigns = await prisma.campaign.findMany({
    where: { brandId: session!.user!.id },
    include: {
      applications: true,
      matches: {
        include: {
          creator: {
            include: { creatorProfiles: true },
          },
        },
      },
    },
  });

  const metrics = await Promise.all(
    campaigns.map(async (c) => {
      const applicationCount = c.applications.length;
      const matchScores = await Promise.all(
        c.matches.map(async (m) => {
          const profile = m.creator.creatorProfiles[0];
          if (!profile) return 0;
          const creatorPersona = {
            tone: profile.tone,
            niches: [profile.niche],
            platforms: [],
            formats: profile.contentType ? [profile.contentType] : undefined,
            vibe: Array.isArray(profile.values) ? profile.values.join(' ') : undefined,
          };
          const brandProfile = {
            niches: [c.niche],
            desiredFormats: c.deliverables.split(',').map((d) => d.trim()).filter(Boolean),
          } as any;
          const { score } = await matchScore(creatorPersona, { ...brandProfile, platforms: [c.platform] });
          return score;
        })
      );
      const avgScore =
        matchScores.length > 0
          ? Math.round(matchScores.reduce((a, b) => a + b, 0) / matchScores.length)
          : 0;
      const messageCount = await prisma.message.count({
        where: { conversationId: { in: c.matches.map((m) => m.id) } },
      });
      const feedback = await prisma.feedback.aggregate({
        _avg: { rating: true },
        where: { userId: { in: c.matches.map((m) => m.creatorId) } },
      });
      return {
        id: c.id,
        title: c.title,
        applications: applicationCount,
        score: avgScore,
        messages: messageCount,
        rating: feedback._avg.rating ?? 0,
      };
    })
  );

  const maxApps = Math.max(...metrics.map((m) => m.applications), 1);
  const maxScore = Math.max(...metrics.map((m) => m.score), 1);
  const maxMsg = Math.max(...metrics.map((m) => m.messages), 1);
  const maxRating = 5;

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-extrabold">Campaign Analytics</h1>
        {metrics.length === 0 ? (
          <p className="text-center text-zinc-400">No campaigns found.</p>
        ) : (
          metrics.map((m) => (
            <div key={m.id} className="bg-Siora-mid border border-Siora-border rounded-xl p-6 space-y-4 shadow-Siora-hover">
              <h2 className="text-xl font-semibold">{m.title}</h2>
              <Metric label="Applications" value={m.applications} max={maxApps} color="bg-Siora-accent" />
              <Metric label="Avg Match Score" value={m.score} max={maxScore} color="bg-green-400" />
              <Metric label="Messages" value={m.messages} max={maxMsg} color="bg-blue-400" />
              <Metric label="Avg Rating" value={m.rating} max={maxRating} color="bg-purple-400" />
            </div>
          ))
        )}
      </div>
    </main>
  );
}

function Metric({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}: {value}</span>
      </div>
      <div className="w-full h-2 bg-zinc-700/50 rounded">
        <div className={`${color} h-2 rounded`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
