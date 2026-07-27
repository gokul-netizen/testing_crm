/*
  Warnings:

  - A unique constraint covering the columns `[source]` on the table `Source` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Source_source_key" ON "Source"("source");
