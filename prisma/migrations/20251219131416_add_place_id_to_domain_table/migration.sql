/*
  Warnings:

  - Added the required column `place_id` to the `Domain` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Domain" ADD COLUMN     "place_id" TEXT NOT NULL;
