import { NextResponse } from 'next/server'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({
    followers: 12000,
    engagementRate: 5.2,
    avgLikes: 620,
    avgComments: 45,
    monthlyGrowth: 8.1,
    topFormats: ['Reels', 'Carousels', 'Skits']
  })
}
