/*
  Warnings:

  - You are about to drop the `_InquiryDomainToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[domain]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_InquiryDomainToUser" DROP CONSTRAINT "_InquiryDomainToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_InquiryDomainToUser" DROP CONSTRAINT "_InquiryDomainToUser_B_fkey";

-- DropTable
DROP TABLE "_InquiryDomainToUser";

-- CreateIndex
CREATE UNIQUE INDEX "User_domain_key" ON "User"("domain");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_domain_fkey" FOREIGN KEY ("domain") REFERENCES "InquiryDomain"("id") ON DELETE SET NULL ON UPDATE CASCADE;
