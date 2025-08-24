-- Create authId on User table
ALTER TABLE "User" ADD COLUMN "authId" TEXT;
CREATE UNIQUE INDEX "User_authId_key" ON "User"("authId");
