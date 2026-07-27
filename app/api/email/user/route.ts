
import { EmailFunction } from "@/lib/email-function";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { NextResponse } from "next/server";

dayjs.extend(customParseFormat);



export async function GET(req: Request) {
    try {

        const today = dayjs();

        const domains = await prisma.user.findMany({
            where: { emailTriggerOption: "Yes", type: "User" },
            include: {
                inquiryDomain: {
                    select: {
                        id: true,
                        domainName: true
                    }
                }
            }
        });



        for (const item of domains) {

            const domainResponses = await prisma.domainResponse.findMany({
                where: {
                    domain_id: item.inquiryDomain.id,
                    status: 1,

                    OR: [
                        { assignId: Number(item.id) },
                        {
                            AND: [
                                { assignId: null },
                                { addedBy: String(item.id) }
                            ]
                        }
                    ],
                },

                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            });


            const followInquiryIds = domainResponses.map((d: any) => d.id);


            const followups = await prisma.followup.findMany({
                where: {
                    inquiryID: { in: followInquiryIds },
                },
                orderBy: {
                    createdAt: "desc"
                },
                distinct: ["inquiryID"],
                select: { date: true, followUpStatus: true, inquiryID: true }
            });


            const todayFollowup = followups.filter((f: any) => f.date && dayjs(f.date, "DD-MM-YYYY").isSame(today, "day")).length;
            const upComing = followups.filter((f: any) => f.date && dayjs(f.date, "DD-MM-YYYY").isAfter(today, "day")).length;
            const pending = followups.filter((f: any) => f.date && dayjs(f.date, "DD-MM-YYYY").isBefore(today, "day")).length;



            const [notInterested, closed, totalInquiries] = await Promise.all([

                

                prisma.DomainResponse.count({
                    where: {
                        domain_id: item.inquiryDomain.id,
                        followUpStatus: "Not Interested",
                        status: 1,
                        OR: [
                            { assignId: Number(item.id) },
                            { addedBy: String(item.id) }
                        ]
                    }
                }),

                prisma.DomainResponse.count({
                    where: {
                        domain_id: item.inquiryDomain.id,
                        followUpStatus: "Closed",
                        status: 1,
                        OR: [
                            { assignId: Number(item.id) },
                            { addedBy: String(item.id) }
                        ]
                    }
                }),

                 prisma.domainResponse.count({
                    where: {
                        domain_id: item.inquiryDomain.id,
                        status: 1,

                        OR: [
                            { assignId: Number(item.id) },
                            { addedBy: String(item.id) }
                        ]
                    },
                }),

            ]);

            await EmailFunction(item.email, item.name, totalInquiries, todayFollowup, pending, upComing, notInterested, closed);

            

        };


        return NextResponse.json("Successfully email sent to users");

    } catch (error: any) {
        logger.error(error.message);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}