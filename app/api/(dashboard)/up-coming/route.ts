import dayjs from "dayjs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import customParseFormat from "dayjs/plugin/customParseFormat";


dayjs.extend(customParseFormat);

export async function GET() {
    try {
        const today = dayjs();


        const data = await prisma.followup.findMany({

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
                        companyName: true,
                        phone: true,
                        createdAt: true,
                        domain : {
                            select : {
                                id : true,
                                domainName : true,
                                 
                            }
                        }


                    }
                }
            }
        });


        const upcoming = data
    .filter((item: any) => {
        if (!item.date) return false;

        const itemDate = dayjs(item.date, "DD-MM-YYYY");

        if (!itemDate.isValid()) return false;

        return itemDate.isAfter(today, "day");
    })
    .sort((a: any, b: any) => {
        return (
            dayjs(a.date, "DD-MM-YYYY").valueOf() -
            dayjs(b.date, "DD-MM-YYYY").valueOf()
        );
    });
        
        return NextResponse.json(upcoming);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}