/*
  Warnings:

  - Added the required column `followUpStatus` to the `Followup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Followup" ADD COLUMN   "followUpStatus" TEXT NOT NULL;
