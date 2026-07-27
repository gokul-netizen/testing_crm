import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import getSession from "@/lib/jwt";
import { getCurrentUTCFromIST } from "@/lib/date-time";
import { uploadFile } from "@/lib/uploadFile";



export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {

        const userId = await getSession();

        if (!userId) return NextResponse.json({ message: "Unauth" }, { status: 401 });

        const Id = userId?.id;
        const { id } = await params;
        const formData = await req.formData();
        const domainName = formData.get("domainName") as string;
        const accessToken = formData.get("accessToken") as string;
        const subscription = formData.get("subscription") as string;
        const status = formData.get("status") as string;
        const logo  = formData.get("logo")as File | null;

        let logoPath;
        if(logo && logo.size > 0){
            logoPath = await uploadFile(logo)
        }


        const exist = await prisma.inquiryDomain.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!exist) {
            return NextResponse.json({ message: "Domain not exist" }, { status: 400 });
        }

        const updated = await prisma.inquiryDomain.update({
            where: { id: Number(id) },
            data: {
                domainName,
                accessToken,
                logo : logoPath,
                status,
                subscription : Number(subscription),
                updatedBy: String(Id),
                updatedOn: getCurrentUTCFromIST()
            }
        });

        return NextResponse.json({ message: "updated successful", data: updated }, { status: 200 });

    } catch (error) {
        console.error("Error occurred while updating domain", error);
        return NextResponse.json({ message: (error as Error).message }, { status: 500 });
    }
}


export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {

    const userId = await getSession();
    if (!userId) return NextResponse.json({ message: "Unauth" }, { status: 401 });
    const Id = userId?.id;

    try {
        const { id } = await params;

        await prisma.inquiryDomain.update({
            where: {
                id: Number(id),
            },
            data: {
                isDeleted: true,
                isDeletedBy: String(Id),
                isDeletedOn: getCurrentUTCFromIST(),
            },
        });

        return NextResponse.json({ message: "Domain and related reviews deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error occurred while deleting domain", error);
        return NextResponse.json({ message: (error as Error).message }, { status: 500 });
    }
}

