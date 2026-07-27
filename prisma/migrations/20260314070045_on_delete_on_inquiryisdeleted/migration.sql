-- DropForeignKey
ALTER TABLE "Followup" DROP CONSTRAINT "Followup_inquiryID_fkey";

-- AddForeignKey
ALTER TABLE "Followup" ADD CONSTRAINT "Followup_inquiryID_fkey" FOREIGN KEY ("inquiryID") REFERENCES "DomainResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
