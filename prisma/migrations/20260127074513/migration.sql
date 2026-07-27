/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "InquiryDomain" DROP CONSTRAINT "InquiryDomain_addedBy_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");
