-- CreateTable
CREATE TABLE "InquiryDomain" (
    "id" SERIAL NOT NULL,
    "domainName" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'Active',
    "addedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addedBy" TEXT,
    "updatedOn" TIMESTAMP(3),
    "updatedBy" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isDeletedOn" TIMESTAMP(3),
    "isDeletedBy" TEXT,

    CONSTRAINT "InquiryDomain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InquiryDomain_domainName_key" ON "InquiryDomain"("domainName");
