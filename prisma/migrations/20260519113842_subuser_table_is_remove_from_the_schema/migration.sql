/*
  Warnings:

  - You are about to drop the `SubUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DomainResponseToSubUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubUser" DROP CONSTRAINT "SubUser_user_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "_DomainResponseToSubUser" DROP CONSTRAINT "_DomainResponseToSubUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_DomainResponseToSubUser" DROP CONSTRAINT "_DomainResponseToSubUser_B_fkey";

-- DropTable
DROP TABLE "SubUser";

-- DropTable
DROP TABLE "_DomainResponseToSubUser";
