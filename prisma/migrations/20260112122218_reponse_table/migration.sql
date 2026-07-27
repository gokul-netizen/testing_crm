-- CreateTable
CREATE TABLE "Response" (
    "id" SERIAL NOT NULL,
    "domainId" INTEGER NOT NULL,
    "link" TEXT,
    "rating" TEXT,
    "date" TEXT,
    "iso_date" TEXT,
    "iso_date_of_last_edit" TEXT,
    "source" TEXT,
    "review_id" TEXT,
    "name" TEXT,
    "user_link" TEXT,
    "contributor_id" TEXT,
    "thumbnail" TEXT,
    "local_guide" TEXT,
    "reviews" TEXT,
    "photos" TEXT,
    "snippet" TEXT,
    "extracted_snippet" TEXT,
    "response_date" TEXT,
    "response_iso_date" TEXT,
    "response_iso_date_of_last_edit" TEXT,
    "response_snippet" TEXT,
    "response_extracted_snippet_original" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
