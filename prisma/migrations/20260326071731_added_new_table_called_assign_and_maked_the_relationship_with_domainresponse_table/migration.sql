-- CreateTable
CREATE TABLE "Assign" (
    "id" SERIAL NOT NULL,
    "inquiryId" INTEGER NOT NULL,
    "assignTo" INTEGER NOT NULL,
    "assignDate" TIMESTAMP(3) NOT NULL,
    "assignTime" TIMESTAMP(3) NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assign_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Assign" ADD CONSTRAINT "Assign_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "DomainResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
