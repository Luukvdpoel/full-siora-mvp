-- Create WaitlistSignup table
CREATE TABLE "WaitlistSignup" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL,
  "role" TEXT,
  "igHandle" TEXT,
  "name" TEXT,
  "company" TEXT,
  "source" TEXT,
  "utmSource" TEXT,
  "utmMedium" TEXT,
  "utmCampaign" TEXT,
  "referrer" TEXT,
  "userAgent" TEXT,
  "ipHash" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "WaitlistSignup_email_idx" ON "WaitlistSignup"("email");
CREATE INDEX "WaitlistSignup_createdAt_idx" ON "WaitlistSignup"("createdAt");
