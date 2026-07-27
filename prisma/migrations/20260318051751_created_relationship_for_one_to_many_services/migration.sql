 

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "domainId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "InquiryDomain"("id") ON DELETE CASCADE ON UPDATE CASCADE;
