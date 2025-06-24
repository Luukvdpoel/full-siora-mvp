import data from '@/app/data/performanceMetrics.json';

export async function GET(
  _req: Request,
  ctx: any
) {
  const { params } = ctx as { params: { id: string } };
  const record = (data as Record<string, any>)[params.id];
  if (!record) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify(record), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
