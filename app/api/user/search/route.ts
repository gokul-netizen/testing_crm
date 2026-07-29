import { userSession } from "@/lib/jwt";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.usertype;


        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized or invalid session" },
                { status: 401 }
            );
        }

        const branches = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                inquiryDomain: {
                    select: {
                        id: true,

                        domainResponse: {
                            take: 1,
                            select: {

                                companyName: true,
                                name: true,
                                email: true,
                                phone: true,
                                website: true,
                                status: true,
                                followUpStatus: true,

                            }
                        }
                    },
                },
            },
        });

        const data = branches.inquiryDomain.domainResponse;

        return NextResponse.json(data, { status: 200 });

    } catch (error: any) {
        logger.error({ error: error.message }, "error when adding service");
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}



