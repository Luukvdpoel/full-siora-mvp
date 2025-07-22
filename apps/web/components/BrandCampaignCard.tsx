"use client";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui";

interface Props {
  brief: { id: string; name: string; summary: { mission: string } };
}

export default function BrandCampaignCard({ brief }: Props) {
  return (
    <Card className="space-y-2">
      <CardHeader>
        <CardTitle>{brief.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="prose prose-invert text-sm"
          dangerouslySetInnerHTML={{ __html: brief.summary.mission }}
        />
      </CardContent>
      <CardFooter>
        <Link href="/shortlist" className="px-3 py-1 bg-Siora-accent rounded text-white">
          Match me with creators
        </Link>
      </CardFooter>
    </Card>
  );
}
