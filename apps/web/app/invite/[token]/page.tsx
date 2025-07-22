import { prisma } from '@/lib/auth';
import InviteForm from './invite-form';

export default async function InvitePage({ params }: { params: { token: string } }) {
  const invite = await prisma.invite.findUnique({
    where: { token: params.token },
  });

  if (!invite || invite.used) {
    return <main className="min-h-screen flex items-center justify-center">Invite not found or already used.</main>;
  }

  return <InviteForm email={invite.email} role={invite.role} />;
}
