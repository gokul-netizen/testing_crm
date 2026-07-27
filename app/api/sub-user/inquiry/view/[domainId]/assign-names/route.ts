import { userSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface ParamsProps {
    params: Promise<{ domainId: string }>;
}

export async function GET(req: Request, { params }: ParamsProps) {
    try {
        
        const {  domainId } = await params;


        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.userType;
      

        const userList = await prisma.user.findMany({
            where: {
                id: { not: userId },
                domain: Number(domainId),
            },
            select: {
                added_by: true,
                id: true,
                name: true,
                type: true,
                domain: true,
                inquiryDomain: {
                    select: {
                        domainName: true,
                    }
                }
            }
        });


        return NextResponse.json(
            { members: userList },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching inquiries:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}