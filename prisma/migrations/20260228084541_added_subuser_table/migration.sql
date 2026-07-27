-- CreateTable
CREATE TABLE "SubUser" (
    "id" SERIAL NOT NULL,
    "user_admin_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "viewer" TEXT[],
    "domain" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubUser_username_key" ON "SubUser"("username");

-- AddForeignKey
ALTER TABLE "SubUser" ADD CONSTRAINT "SubUser_user_admin_id_fkey" FOREIGN KEY ("user_admin_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
