-- CreateTable
CREATE TABLE "Log_records" (
    "id" SERIAL NOT NULL,
    "query" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT,

    CONSTRAINT "Log_records_pkey" PRIMARY KEY ("id")
);
