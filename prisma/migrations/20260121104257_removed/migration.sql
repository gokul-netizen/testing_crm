/*
  Warnings:

  - You are about to drop the column `added_by` on the `DomainResponse` table. All the data in the column will be lost.
  - You are about to drop the column `added_on` on the `DomainResponse` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DomainResponse" DROP COLUMN "added_by",
DROP COLUMN "added_on";
