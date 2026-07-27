-- DropIndex
DROP INDEX "Designation_jobTitle_key";

-- AlterTable
ALTER TABLE "Designation" ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Designation" ADD CONSTRAINT "Designation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
