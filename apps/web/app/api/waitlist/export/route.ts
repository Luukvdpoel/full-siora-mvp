import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (process.env.ADMIN_TOKEN && auth !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const signups = await prisma.waitlistSignup.findMany({ orderBy: { createdAt: "desc" } });
  const counts = await Promise.all(
    signups.map((s) => prisma.waitlistSignup.count({ where: { referredBy: s.referralCode } }))
  );
  const header = [
    "email",
    "role",
    "igHandle",
    "createdAt",
    "referrals",
    "confirmedAt",
    "utmSource",
    "utmMedium",
    "utmCampaign",
  ];
  const rows = signups.map((s, i) => [
    s.email,
    s.role,
    s.igHandle || "",
    s.createdAt.toISOString(),
    String(counts[i]),
    s.confirmedAt ? s.confirmedAt.toISOString() : "",
    s.utmSource || "",
    s.utmMedium || "",
    s.utmCampaign || "",
  ]);
  const csv = [header.join(","), ...rows.map((r) => r.map((x) => `"${x}"`).join(","))].join("\n");
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=waitlist.csv",
    },
  });
}
