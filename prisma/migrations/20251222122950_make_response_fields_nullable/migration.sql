-- AlterTable
ALTER TABLE "Reviews" ALTER COLUMN "response_iso_date" DROP NOT NULL,
ALTER COLUMN "response_iso_date_of_last_edit" DROP NOT NULL,
ALTER COLUMN "response_snippet" DROP NOT NULL,
ALTER COLUMN "response_extracted_snippet_original" DROP NOT NULL;
