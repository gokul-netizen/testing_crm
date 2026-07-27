/*
  Warnings:

  - The `addedBy` column on the `InquiryDomain` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "InquiryDomain" DROP COLUMN "addedBy",
ADD COLUMN     "addedBy" INTEGER;

-- AddForeignKey
ALTER TABLE "InquiryDomain" ADD CONSTRAINT "InquiryDomain_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
