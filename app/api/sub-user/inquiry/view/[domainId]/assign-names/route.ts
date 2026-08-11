import { userSession } from "@/lib/jwt";
import logger from "@/lib/logs";
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
       


        logger.error({
            
            message: "Fail to get the assign names",
            file: "api/sub-user/inquiry/view/[domainId]/assign-names/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}