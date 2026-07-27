/*
  Warnings:

  - You are about to drop the `UserDomain` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserDomain" DROP CONSTRAINT "UserDomain_domainId_fkey";

-- DropForeignKey
ALTER TABLE "UserDomain" DROP CONSTRAINT "UserDomain_userId_fkey";

-- DropTable
DROP TABLE "UserDomain";
