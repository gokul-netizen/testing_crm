-- CreateTable
CREATE TABLE "DomainResponse" (
    "id" SERIAL NOT NULL,
    "domain_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DomainResponse_pkey" PRIMARY KEY ("id")
);
