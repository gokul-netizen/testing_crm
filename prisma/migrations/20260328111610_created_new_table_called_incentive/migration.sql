-- CreateTable
CREATE TABLE "Incentive" (
    "id" SERIAL NOT NULL,
    "inquiryId" INTEGER NOT NULL,
    "incentive" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Incentive_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Incentive" ADD CONSTRAINT "Incentive_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "DomainResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
