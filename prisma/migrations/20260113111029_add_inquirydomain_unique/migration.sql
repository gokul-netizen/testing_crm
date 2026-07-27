/*
  Warnings:

  - A unique constraint covering the columns `[accessToken]` on the table `InquiryDomain` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "InquiryDomain_accessToken_key" ON "InquiryDomain"("accessToken");
