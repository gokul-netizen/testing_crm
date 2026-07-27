import { EmailFunction } from "@/lib/email-function";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);


export async function GET(req: Request) {
    try {

        const today = dayjs().startOf("day");

        const user = await prisma.user.findMany({
            where: {
                emailTriggerOption: "Yes",
                type: "AdminUser"
            },
            include: {
                inquiryDomain: {
                    select: {
                        id: true,
                        domainName: true
                    }
                }
            }
        });

        for (const item of user) {

            const inquiryIds = await prisma.domainResponse.findMany({
                where: {
                    domain_id: item.inquiryDomain.id,
                    status: 1,
                },
                select: { id: true },
            });

            const ids = inquiryIds.map((item: any) => item.id);

            const totalInquiry = ids.length;

            const followups = await prisma.followup.findMany({
                where: {
                    inquiryID: { in: ids },
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

            const [notInterested, closed] = await Promise.all([

                prisma.DomainResponse.count({
                    where: { id: { in: ids }, followUpStatus: "Not Interested" }
                }),
                prisma.DomainResponse.count({
                    where: { id: { in: ids }, followUpStatus: "Closed" }
                })
            ]);

            await EmailFunction(item.email, item.name, totalInquiry, todayFollowup, pending, upComing, notInterested, closed);
        }

        return NextResponse.json({ message: "Email sent to admin user" }, { status: 200 });

    } catch (error:any) {
        logger.error({error : error.message},"Failed to send email's to admin user");
        return NextResponse.json({ message: "failed to send email's to admin user" }, { status: 500 })
    }
}