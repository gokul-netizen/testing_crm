/*
  Warnings:

  - You are about to drop the column `service` on the `InquiryDomain` table. All the data in the column will be lost.

*/
 

-- CreateTable
CREATE TABLE "Designation" (
    "id" SERIAL NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Designation_pkey" PRIMARY KEY ("id")
);
