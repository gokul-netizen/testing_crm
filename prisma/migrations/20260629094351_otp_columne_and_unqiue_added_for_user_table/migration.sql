/*
  Warnings:

  - A unique constraint covering the columns `[mobile_no]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otp" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_no_key" ON "User"("mobile_no");
