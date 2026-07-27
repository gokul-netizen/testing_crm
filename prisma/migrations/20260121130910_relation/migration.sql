-- AddForeignKey
ALTER TABLE "DomainResponse" ADD CONSTRAINT "DomainResponse_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "InquiryDomain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
