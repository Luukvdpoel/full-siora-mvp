import CampaignForm from "../shared/CampaignForm";
import { createCampaign } from "../actions";

export default function NewCampaignPage() {
  return (
    <section className="mx-auto max-w-3xl py-10">
      <h1 className="text-2xl font-semibold">New Campaign</h1>
      <p className="mt-1 text-white/60">
        Describe your product and what kind of creators you want.
      </p>

      <div className="mt-6">
        {/* @ts-expect-error Server Action passed to client form */}
        <CampaignForm action={createCampaign} />
      </div>
    </section>
  );
}
