import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    try {

        const isDeletedDomains = await prisma.inquiryDomain.findMany({
            where: {
                isDeleted: true
            },
            select : {
                id: true,
                domainName : true,
                accessToken : true,
                isDeletedOn : true,
                isDeletedBy : true
            }
        });

        return NextResponse.json({ data: isDeletedDomains }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error || "Something went wrong..!" }, { status: 500 })
    }
}


export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { ids } = body;

        if (Array.isArray(ids) && ids.length === 0) {
            return NextResponse.json({ error: "Ids must be array and not null" })
        }

        const result = await prisma.inquiryDomain.updateMany({
            where: {
                id: { in: ids },
            },
            data: {
                isDeleted: false,
                isDeletedBy: null,
                isDeletedOn: null
            },
        });

        return NextResponse.json({ message: "Revoked Successfully", count: ids.length }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Somethig went wrong" }, { status: 500 })
    }
}   