/*
  Warnings:

  - You are about to drop the column `is_deleted` on the `DomainResponse` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted_by` on the `DomainResponse` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted_on` on the `DomainResponse` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DomainResponse" DROP COLUMN "is_deleted",
DROP COLUMN "is_deleted_by",
DROP COLUMN "is_deleted_on",
ADD COLUMN     "isDeleted" TEXT,
ADD COLUMN     "isDeleted_by" TEXT,
ADD COLUMN     "isDeleted_on" TIMESTAMP(3);
