-- CreateTable
CREATE TABLE "query_logs" (
    "id" SERIAL NOT NULL,
    "executed_query" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "query_logs_pkey" PRIMARY KEY ("id")
);
