-- AlterTable
ALTER TABLE "DomainResponse" ALTER COLUMN "service" DROP DEFAULT;

-- AlterTable
ALTER TABLE "InquiryDomain" ADD COLUMN  "service" INTEGER[];
