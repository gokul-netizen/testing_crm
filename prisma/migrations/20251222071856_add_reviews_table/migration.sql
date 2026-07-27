-- CreateTable
CREATE TABLE "Reviews" (
    "id" SERIAL NOT NULL,
    "domainId" INTEGER NOT NULL,
    "link" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "iso_date" TEXT NOT NULL,
    "iso_date_of_last_edit" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_link" TEXT NOT NULL,
    "user_contributor_id" TEXT NOT NULL,
    "user_thumbnail" TEXT NOT NULL,
    "snippet" TEXT NOT NULL,
    "extracted_snippet_original" TEXT NOT NULL,
    "response_iso_date" TEXT NOT NULL,
    "response_iso_date_of_last_edit" TEXT NOT NULL,
    "response_snippet" TEXT NOT NULL,
    "response_extracted_snippet_original" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
