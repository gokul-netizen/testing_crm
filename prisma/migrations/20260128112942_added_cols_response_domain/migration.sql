-- AlterTable
ALTER TABLE "DomainResponse" ADD COLUMN     "is_deleted" TEXT,
ADD COLUMN     "is_deleted_by" TEXT,
ADD COLUMN     "is_deleted_on" TIMESTAMP(3),
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 1;
