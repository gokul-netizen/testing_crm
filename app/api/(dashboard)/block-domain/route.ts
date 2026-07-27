import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    try {
        const activeDomain = await prisma.InquiryDomain.findMany({
            where: {
                status: "Blocked"
            },
            select: {
                id: true,
                domainName: true,
                accessToken: true,
                status: true,
                addedOn: true
            },
             orderBy: {
                addedOn: "desc",
            },
        });

        return NextResponse.json(activeDomain, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}