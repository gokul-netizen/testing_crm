-- CreateTable
CREATE TABLE "_InquiryDomainToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_InquiryDomainToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_InquiryDomainToUser_B_index" ON "_InquiryDomainToUser"("B");

-- AddForeignKey
ALTER TABLE "_InquiryDomainToUser" ADD CONSTRAINT "_InquiryDomainToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "InquiryDomain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InquiryDomainToUser" ADD CONSTRAINT "_InquiryDomainToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
