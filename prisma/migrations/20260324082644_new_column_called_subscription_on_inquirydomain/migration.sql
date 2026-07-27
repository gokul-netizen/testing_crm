/*
  Warnings:

  - You are about to drop the column `service` on the `InquiryDomain` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InquiryDomain" 
DROP COLUMN IF EXISTS "service",

ADD COLUMN     "subscription" INTEGER NOT NULL DEFAULT 0;
