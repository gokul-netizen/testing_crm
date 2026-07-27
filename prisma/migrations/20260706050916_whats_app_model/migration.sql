-- CreateTable
CREATE TABLE "WhatssappLogs" (
    "id" SERIAL NOT NULL,
    "sentTo" INTEGER NOT NULL,
    "smsTemplate" TEXT NOT NULL,
    "erroInfo" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "smsUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatssappLogs_pkey" PRIMARY KEY ("id")
);
