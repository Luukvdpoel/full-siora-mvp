import { prisma } from "@/lib/prisma";
import CampaignForm from "../../shared/CampaignForm";
import { updateCampaign, deleteCampaign } from "../../actions";

export default async function EditCampaignPage({
  params,
}: {
  params: { id: string };
}) {
  const c = await prisma.campaign.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      title: true,
      brief: true,
      niche: true,
      targetTone: true,
      budgetEUR: true,
    },
  });
  if (!c) return <div className="p-8">Not found</div>;

  return (
    <section className="mx-auto max-w-3xl py-10">
      <h1 className="text-2xl font-semibold">Edit Campaign</h1>
      <div className="mt-6">
        {/* @ts-expect-error Server Action passed to client form */}
        <CampaignForm
          initial={c}
          action={(prev: any, fd: FormData) => updateCampaign(c.id, prev, fd)}
          dangerZone={<DeleteButton id={c.id} />}
        />
      </div>
    </section>
  );
}

function DeleteButton({ id }: { id: string }) {
  return (
    <form action={async () => deleteCampaign(id)} className="mt-6">
      <button
        className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200 hover:bg-red-500/20"
        type="submit"
      >
        Delete campaign
      </button>
    </form>
  );
}
