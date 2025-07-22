import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface Application {
  id: string;
  userId: string;
  campaignId: string;
  pitch?: string;
  personaSummary?: string;
  status: string;
  timestamp: string;
}

const appsPath = path.join(process.cwd(), '..', '..', 'db', 'campaign_applications.json');
const campaignsPath = path.join(process.cwd(), '..', '..', 'db', 'campaigns.json');

async function readApps(): Promise<Application[]> {
  try {
    const file = await fs.readFile(appsPath, 'utf8');
    const data = JSON.parse(file);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function readCampaigns(): Promise<any[]> {
  try {
    const file = await fs.readFile(campaignsPath, 'utf8');
    const data = JSON.parse(file);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get('brandId');
    const campaignId = searchParams.get('campaignId');
    let apps = await readApps();

    if (brandId) {
      const campaigns = await readCampaigns();
      const brandCampaignIds = campaigns
        .map((c, i) => ({ id: (i + 1).toString(), ...c }))
        .filter((c) => c.brandId === brandId)
        .map((c) => c.id);
      apps = apps.filter((a) => brandCampaignIds.includes(a.campaignId));
    }

    if (campaignId) {
      apps = apps.filter((a) => a.campaignId === campaignId);
    }

    return NextResponse.json(apps);
  } catch (err) {
    console.error('brand applications GET error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const apps = await readApps();
    const idx = apps.findIndex((a) => a.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    apps[idx].status = status;
    await fs.writeFile(appsPath, JSON.stringify(apps, null, 2));
    return NextResponse.json(apps[idx]);
  } catch (err) {
    console.error('brand applications PATCH error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

