import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);


export async function GET(req: Request) {
    try {


        const today = dayjs();

        const pendingData = await prisma.followup.findMany({
            where: {
                inquiry: {
                    status: 1,
                },
            },
            distinct: ["inquiryID"],
            orderBy: {
                createdAt: "desc"
            },

            select: {
                date: true,
                time: true,
                remarks: true,
                followUpStatus: true,
                createdAt: true,
                assignToName: true,

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
                        phone: true,
                        companyName: true,
                        createdAt: true,
                        domain : {
                            select : {
                                id : true,
                                domainName : true,
                                 
                            }
                        }
                    },
                },
            },
        });

        const pending = pendingData.filter((item: any) => {
            if (!item.date) return false;

            const itemDate = dayjs(item.date, "DD-MM-YYYY");

            if (!itemDate.isValid()) return false;

            return itemDate.isBefore(today, "day");

        });

        

        return NextResponse.json(pending, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message })
    }
}