-- CreateTable
CREATE TABLE "UserDomain" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "domainId" INTEGER NOT NULL,

    CONSTRAINT "UserDomain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDomain_userId_domainId_key" ON "UserDomain"("userId", "domainId");

-- AddForeignKey
ALTER TABLE "UserDomain" ADD CONSTRAINT "UserDomain_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDomain" ADD CONSTRAINT "UserDomain_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "InquiryDomain"("id") ON DELETE CASCADE ON UPDATE CASCADE;
