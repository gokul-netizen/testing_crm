-- AlterTable
ALTER TABLE "DomainResponse" ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'Default',
ALTER COLUMN "addedBy" DROP DEFAULT;
