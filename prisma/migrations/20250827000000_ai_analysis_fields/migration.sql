-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Creator analysis fields
ALTER TABLE "Creator" ADD COLUMN IF NOT EXISTS "analysisAt" TIMESTAMP(3);
ALTER TABLE "Creator" ADD COLUMN IF NOT EXISTS "keywords" TEXT[];
ALTER TABLE "Creator" ADD COLUMN IF NOT EXISTS "embedding" vector(1536);

-- Campaign analysis fields
ALTER TABLE "Campaign" ADD COLUMN IF NOT EXISTS "desiredValues" TEXT[];
ALTER TABLE "Campaign" ADD COLUMN IF NOT EXISTS "desiredKeywords" TEXT[];
ALTER TABLE "Campaign" ADD COLUMN IF NOT EXISTS "analyzedAt" TIMESTAMP(3);
ALTER TABLE "Campaign" ADD COLUMN IF NOT EXISTS "embedding" vector(1536);

-- Optional helper indexes
CREATE INDEX IF NOT EXISTS creator_embedding_idx ON "Creator" USING ivfflat ("embedding" vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS campaign_embedding_idx ON "Campaign" USING ivfflat ("embedding" vector_cosine_ops) WITH (lists = 100);
