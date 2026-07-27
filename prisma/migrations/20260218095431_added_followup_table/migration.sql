-- AlterTable
ALTER TABLE "DomainResponse" ADD COLUMN     "followUpStatus" TEXT;

-- CreateTable
CREATE TABLE "Followup" (
    "id" SERIAL NOT NULL,
    "inquiryID" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,

    CONSTRAINT "Followup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Followup" ADD CONSTRAINT "Followup_inquiryID_fkey" FOREIGN KEY ("inquiryID") REFERENCES "DomainResponse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
