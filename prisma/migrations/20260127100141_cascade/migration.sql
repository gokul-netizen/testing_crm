-- DropForeignKey
ALTER TABLE "DomainResponse" DROP CONSTRAINT "DomainResponse_domain_id_fkey";

-- AddForeignKey
ALTER TABLE "DomainResponse" ADD CONSTRAINT "DomainResponse_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "InquiryDomain"("id") ON DELETE CASCADE ON UPDATE CASCADE;
