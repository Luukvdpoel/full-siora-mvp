import { z } from "zod";

export const CampaignSchema = z.object({
  title: z.string().min(3, "Title is too short").max(120),
  brief: z
    .string()
    .min(20, "Brief should explain the goal")
    .max(5000),
  niche: z.string().optional().default(""),
  targetTone: z
    .enum(["Playful", "Serious", "Bold", "Aspirational", "Educational"])
    .optional()
    .or(z.literal(""))
    .default(""),
  budgetEUR: z.coerce.number().int().nonnegative().optional(),
});

export type CampaignInput = z.infer<typeof CampaignSchema>;

