import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    try {
        const activeDomain = await prisma.user.findMany({
            where: {
                status: "Active",
                isDeleted : false,
                type : "AdminUser"
                 
            },
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                domain: true,
                added_on : true,
                inquiryDomain : {
                    select : {
                        domainName : true
                    }
                }
            },
            orderBy: {
                added_on: "desc",
            },
        });

        return NextResponse.json(activeDomain, { status: 200 });

    } catch (error: any) {
       logger.error({
            message: "Fail to fetch active admin user domain ",
            file: "api/admin/dashboard/active-admin-user/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}