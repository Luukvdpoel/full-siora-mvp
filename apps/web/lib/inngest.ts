import { Inngest } from "inngest";

export const inngest = new Inngest({ name: "Siora" });

export const bulkAnalyze = inngest.createFunction(
  { id: "bulk-analyze" },
  { event: "campaign/bulk.analyze" },
  async ({ event }) => {
    // process heavy jobs asynchronously
  },
);
