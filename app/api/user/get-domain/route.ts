import { userSession } from "@/lib/jwt";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {


        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.usertype;



        const domainIdAndName = await prisma.user.findUnique({
            where: {
                id: Number(userId),
            },
            select: {
                id: true,
                name: true,
                inquiryDomain: {
                    select: {
                        id: true,
                        domainName: true,
                    }
                }
            }
        });


        if (!domainIdAndName) {
            return NextResponse.json({ message: "Not found" }, { status: 200 });
        }

        return NextResponse.json(domainIdAndName);

    } catch (error) {
        
        logger.error({

            message: "Fail to get domain ",
            file: "api/user/get-domain/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });

        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}