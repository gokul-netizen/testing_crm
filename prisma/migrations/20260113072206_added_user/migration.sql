-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "show_password" TEXT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "mobile_no" TEXT,
    "user_image" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "added_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "added_by" TEXT,
    "updated_on" TIMESTAMP(3),
    "updated_by" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted_on" TIMESTAMP(3),
    "is_deleted_by" TEXT,
    "last_login" TIMESTAMP(3),
    "last_loginip" TEXT,
    "joining_date" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
