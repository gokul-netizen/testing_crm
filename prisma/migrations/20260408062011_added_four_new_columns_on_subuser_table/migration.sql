/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `SubUser` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "SubUser" ADD COLUMN     "email" TEXT,
ADD COLUMN     "joining_date" TIMESTAMP(3),
ADD COLUMN     "name" TEXT,
ADD COLUMN     "role_id" INTEGER NOT NULL DEFAULT 12;

-- CreateIndex
CREATE UNIQUE INDEX "SubUser_email_key" ON "SubUser"("email");
