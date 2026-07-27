import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);




export async function GET(req: Request) {
    try {
        const today = dayjs().format("DD-MM-YYYY");

        const todaysDate = dayjs();


        const [activeCount, blockCount, deleteCount, sourceCount, activeUser, blockUser, deleteUser, activeInquiry, deletedInquiry, todaysfollowup, notInterested, closed, followupInquiries, adminUser] = await Promise.all([

            await prisma.InquiryDomain.count({
                where: {
                    status: "Active"
                }
            }),

            await prisma.InquiryDomain.count({
                where: {
                    status: "Blocked"
                }
            }),

            await prisma.InquiryDomain.count({
                where: {
                    isDeleted: true
                }
            }),

            await prisma.Source.count({}),

            await prisma.User.count({
                where: {
                    status: "Active",
                    isDeleted: false,
                    type: "User"
                }
            }),

            await prisma.User.count({
                where: {
                    status: "Blocked"
                }
            }),

            await prisma.User.count({
                where: {
                    isDeleted: true
                }
            }),

            await prisma.DomainResponse.count({
                where: {
                    status: 1
                }
            }),

            await prisma.DomainResponse.count({
                where: {
                    status: 0
                }
            }),

            await prisma.followup.findMany({
                where: {
                    date: today,
                },
                
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                        id: true,
                        inquiryID: true,
                        createdAt: true,
                        remarks : true
                    },
            }),

            await prisma.DomainResponse.count({
                where: {
                    followUpStatus: "Not Interested"
                }
            }),

            await prisma.DomainResponse.count({
                where: {
                    followUpStatus: "Closed"
                }
            }),

            await prisma.followup.findMany({
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
                },
            }),

            await prisma.User.count({
                where: {
                    type: "AdminUser",
                    status: "Active",
                    isDeleted: false
                }
            }),


        ]);

        const pendingData = followupInquiries.filter((item: any) => {

            if (!item.date) return false;
            const itemDate = dayjs(item.date, "DD-MM-YYYY");
            if (!itemDate.isValid()) return false;
            return itemDate.isBefore(todaysDate, "day");

        });


        const UpcomingData = followupInquiries.filter((item: any) => {

            if (!item.date) return false;
            const itemDate = dayjs(item.date, "DD-MM-YYYY");
            if (!itemDate.isValid()) return false;
            return itemDate.isAfter(todaysDate, "day");

        });

        const pendingCount = pendingData.length;
        const upcomingCount = UpcomingData.length;

        const todaysFollowUp = todaysfollowup.length;


        return NextResponse.json({ activeCount, blockCount, deleteCount, sourceCount, activeUser, blockUser, deleteUser, activeInquiry, deletedInquiry, todaysFollowUp, upcomingCount, notInterested, closed, pendingCount, adminUser }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}