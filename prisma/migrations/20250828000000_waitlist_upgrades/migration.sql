ALTER TABLE "WaitlistSignup"
  ADD COLUMN "confirmToken" TEXT,
  ADD COLUMN "confirmExpires" TIMESTAMP,
  ADD COLUMN "confirmedAt" TIMESTAMP;
