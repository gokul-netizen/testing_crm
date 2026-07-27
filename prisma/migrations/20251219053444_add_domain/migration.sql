-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Active', 'Blocked');

-- CreateTable
CREATE TABLE "Domain" (
    "id" SERIAL NOT NULL,
    "domain" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Domain_domain_key" ON "Domain"("domain");
