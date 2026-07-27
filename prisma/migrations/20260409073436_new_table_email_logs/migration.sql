-- CreateTable
CREATE TABLE "EmailLogs" (
    "id" SERIAL NOT NULL,
    "to" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "error" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailLogs_pkey" PRIMARY KEY ("id")
);
