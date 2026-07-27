-- AlterTable
ALTER TABLE "DomainResponse" ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "phoneSecondary" TEXT,
ADD COLUMN     "service" TEXT DEFAULT 'Default',
ADD COLUMN     "website" TEXT;
