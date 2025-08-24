interface Props {
  count: number;
  goal?: number;
}

export default function ReferralProgress({ count, goal = 5 }: Props) {
  const pct = Math.min(100, (count / goal) * 100);
  return (
    <div className="w-full space-y-2">
      <p className="text-sm text-white/70">
        {count} of {goal} referrals → unlock early access
      </p>
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div
          className="bg-indigo-500 h-2 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
