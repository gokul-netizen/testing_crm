-- CreateTable
CREATE TABLE "ReferenceDomain" (
    "id" SERIAL NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "domains" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferenceDomain_pkey" PRIMARY KEY ("id")
);
