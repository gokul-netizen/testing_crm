-- DropForeignKey
ALTER TABLE "SubUser" DROP CONSTRAINT "SubUser_user_admin_id_fkey";

-- AddForeignKey
ALTER TABLE "SubUser" ADD CONSTRAINT "SubUser_user_admin_id_fkey" FOREIGN KEY ("user_admin_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
