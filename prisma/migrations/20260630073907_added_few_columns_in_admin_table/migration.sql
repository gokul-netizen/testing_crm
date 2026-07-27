-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDeletedBy" TEXT,
ADD COLUMN     "isDeletedOn" TIMESTAMP(3),
ADD COLUMN     "last_login" TIMESTAMP(3),
ADD COLUMN     "last_loginip" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Active',
ADD COLUMN     "updated_by" TEXT,
ADD COLUMN     "updated_on" TIMESTAMP(3),
ADD COLUMN     "user_image" TEXT;
