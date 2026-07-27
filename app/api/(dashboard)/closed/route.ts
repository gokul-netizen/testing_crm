import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";



export async function GET(req: Request) {
    try {
         const closed = await prisma.followup.findMany({
                    where: {
                        inquiry: {
                            status: 1,
                        },
                        followUpStatus :  "Closed",
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

        return NextResponse.json(closed, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message })
    }
}