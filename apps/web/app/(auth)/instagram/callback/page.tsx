import CallbackClient from '@/components/instagram/CallbackClient';

export default function InstagramCallbackPage({ searchParams }: { searchParams: { code?: string } }) {
  const code = searchParams.code ?? '';
  return <CallbackClient code={code} />;
}
