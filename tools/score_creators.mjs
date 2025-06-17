import { rankCreators } from 'shared-utils';
import creators from '../apps/brand/app/data/mock_creators_200.json' assert { type: 'json' };

const brand = {
  tone: 'Inspirational',
  platforms: ['TikTok', 'Instagram'],
  targetNiches: ['Food', 'Fitness']
};

const results = rankCreators(creators, brand);

results.forEach((r, idx) => {
  const c = r.creator;
  console.log(`${idx + 1}. ${c.name} (@${c.handle}) - score ${r.score}`);
  console.log('   ' + r.reasons.join('; '));
});
