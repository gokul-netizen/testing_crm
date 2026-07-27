/*
  Warnings:

  - You are about to drop the column `domains` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "domains",
ADD COLUMN     "domain" INTEGER;
