-- CreateTable
CREATE TABLE "_DomainResponseToSubUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DomainResponseToSubUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DomainResponseToSubUser_B_index" ON "_DomainResponseToSubUser"("B");

-- AddForeignKey
ALTER TABLE "_DomainResponseToSubUser" ADD CONSTRAINT "_DomainResponseToSubUser_A_fkey" FOREIGN KEY ("A") REFERENCES "DomainResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DomainResponseToSubUser" ADD CONSTRAINT "_DomainResponseToSubUser_B_fkey" FOREIGN KEY ("B") REFERENCES "SubUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
