/*
  Warnings:

  - A unique constraint covering the columns `[review_id]` on the table `Reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reviews_review_id_key" ON "Reviews"("review_id");
