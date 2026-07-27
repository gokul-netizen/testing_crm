/*
  Warnings:

  - A unique constraint covering the columns `[jobTitle]` on the table `Designation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Designation_jobTitle_key" ON "Designation"("jobTitle");
