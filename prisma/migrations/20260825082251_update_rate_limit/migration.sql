/*
  Warnings:

  - A unique constraint covering the columns `[phone,key]` on the table `RateLimit` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "RateLimit_key_key";

-- CreateIndex
CREATE INDEX "RateLimit_expiresAt_idx" ON "RateLimit"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "RateLimit_phone_key_key" ON "RateLimit"("phone", "key");
