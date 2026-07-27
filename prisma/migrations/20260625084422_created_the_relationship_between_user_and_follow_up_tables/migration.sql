-- AddForeignKey
ALTER TABLE "Followup" ADD CONSTRAINT "Followup_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
