/*
  Warnings:

  - Added the required column `added_on` to the `DomainResponse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DomainResponse" ADD COLUMN     "added_by" TEXT,
ADD COLUMN     "added_on" TIMESTAMP(3) NOT NULL;
