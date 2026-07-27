/*
  Warnings:

  - You are about to drop the `WhatssappLogs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "WhatssappLogs";

-- CreateTable
CREATE TABLE "WhatsappLogs" (
    "id" SERIAL NOT NULL,
    "sentTo" INTEGER NOT NULL,
    "smsTemplate" TEXT NOT NULL,
    "erroInfo" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "smsUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsappLogs_pkey" PRIMARY KEY ("id")
);
