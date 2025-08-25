import { serve } from "inngest/next";
import { inngest, bulkAnalyze } from "@/lib/inngest";

export const { GET, POST, OPTIONS } = serve({
  client: inngest,
  functions: [bulkAnalyze],
});
