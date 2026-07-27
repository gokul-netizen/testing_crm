/*
  Warnings:

  - You are about to drop the column `isDeleted_by` on the `DomainResponse` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted_on` on the `DomainResponse` table. All the data in the column will be lost.
  - The `isDeleted` column on the `DomainResponse` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `is_deleted` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted_by` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted_on` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DomainResponse" DROP COLUMN "isDeleted_by",
DROP COLUMN "isDeleted_on",
ADD COLUMN     "isDeletedBy" TEXT,
ADD COLUMN     "isDeletedOn" TIMESTAMP(3),
DROP COLUMN "isDeleted",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "is_deleted",
DROP COLUMN "is_deleted_by",
DROP COLUMN "is_deleted_on",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDeletedBy" TEXT,
ADD COLUMN     "isDeletedOn" TIMESTAMP(3);
