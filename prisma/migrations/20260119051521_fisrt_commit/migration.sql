/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Domain` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Response` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reviews` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_domainId_fkey";

-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_domainId_fkey";

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "Domain";

-- DropTable
DROP TABLE "Log";

-- DropTable
DROP TABLE "Response";

-- DropTable
DROP TABLE "Reviews";
