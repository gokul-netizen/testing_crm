-- AlterTable
ALTER TABLE "Source" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDeletedBy" INTEGER,
ADD COLUMN     "isDeletedOn" TIMESTAMP(3),
ADD COLUMN     "isUpdateOn" TIMESTAMP(3),
ADD COLUMN     "isUpdatedBy" INTEGER;
