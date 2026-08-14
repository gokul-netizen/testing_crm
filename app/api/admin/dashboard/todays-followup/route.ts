import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {

        const today = dayjs().format("DD-MM-YYYY");
        const allLatestFollowups = await prisma.followup.findMany({
            where: {
                inquiry: {
                    status: 1
                }
            },
            orderBy: {
                createdAt: "desc",
            },
            distinct: ["inquiryID"],
            select: {
                id: true,
                date: true,
                time: true,
                remarks: true,
                followUpStatus :true,
                assignToName :true,
                createdAt : true,

             addedByUser : {
                    select : {
                        id : true,
                        name : true,
                    }
                },
                
                inquiry: {
                    select: {
                        id: true,
                        name: true,
                        companyName: true,
                        phone: true,
                        domain : {
                            select : {
                                id : true,
                                domainName : true,
                                 
                            }
                        }
                    }
                },
            },
        });



        const todaysInquiry = allLatestFollowups.filter((f : any) => f.date === today);

        return NextResponse.json(todaysInquiry)

    } catch (error: any) {
       logger.error({
            message: "Fail to fetch todays inquirie ",
            file: "api/admin/dashboard/todays-followup/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
}