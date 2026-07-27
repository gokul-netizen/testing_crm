/*
  Warnings:

  - You are about to drop the column `executed_query` on the `query_logs` table. All the data in the column will be lost.
  - Added the required column `query` to the `query_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "query_logs" DROP COLUMN "executed_query",
ADD COLUMN     "count" INTEGER,
ADD COLUMN     "details" TEXT,
ADD COLUMN     "domainId" INTEGER,
ADD COLUMN     "query" TEXT NOT NULL;
