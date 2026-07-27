import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { whatsappEveryday, whatsappEverydayToAdmin } from "@/lib/whtsapp_everyday";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);


export async function GET(req: Request) {

    const today = dayjs();
    let data = null;

    try {

        const adminUsers = await prisma.user.findMany({
            where: {
                emailTriggerOption: "Yes",
                status: "Active",
                type: "AdminUser"
            },
            select: {
                id: true,
                username: true,
                name: true,
                mobile_no: true,
                inquiryDomain: {
                    select: {
                        id: true,
                        domainName: true,

                    }
                }
            },
        });


        const users = await prisma.user.findMany({
            where: {
                emailTriggerOption: "Yes",
                status: "Active",
                type: "User"
            },
            select: {
                id: true,
                username: true,
                name: true,
                mobile_no: true,
                inquiryDomain: {
                    select: {
                        id: true,
                        domainName: true,
                    }
                }
            },
        });


        for (const user of adminUsers) {

            let todayFollowup = 0;
            let upComing = 0;
            let pending = 0;

            let notInterested = 0;
            let closed = 0;

            const inquiries = await prisma.DomainResponse.findMany({
                where: { domain_id: user.inquiryDomain.id, status: 1 },
                select:
                {
                    id: true,
                    followups: {

                        distinct: ["inquiryID"],
                        orderBy: {
                            createdAt: "desc"
                        },

                        select: {

                            id: true,
                            date: true,
                            time: true,
                            followUpStatus: true
                        }
                    }
                }
            });


            for (const inquiry of inquiries) {

                for (const followup of inquiry.followups) {

                    if (followup.followUpStatus === "Not Interested") {
                        notInterested++;
                    }

                    if (followup.followUpStatus === "Closed") {
                        closed++;
                    }

                    if (!followup.date) continue;

                    const date = dayjs(followup.date, "DD-MM-YYYY");

                    if (date.isSame(today, "day")) {
                        todayFollowup++;
                    } else if (date.isAfter(today, "day")) {
                        upComing++;
                    } else if (date.isBefore(today, "day")) {
                        pending++;
                    }
                }
            }

            await whatsappEveryday({
                phoneNumber: user.mobile_no,
                totalInquiries: inquiries.length,
                pending: pending,
                upcoming: upComing,
                todays: todayFollowup,
                personName: user.name,
                notInterested: notInterested,
                closed: closed,
                domainName: user.inquiryDomain.domainName

            });

            await whatsappEverydayToAdmin({
                phoneNumber: user.mobile_no,
                totalInquiries: inquiries.length,
                pending: pending,
                upcoming: upComing,
                todays: todayFollowup,
                personName: user.name,
                notInterested: notInterested,
                closed: closed,
                domainName: user.inquiryDomain.domainName

            });

        }


        for (const user of users) {

            let todayFollowup = 0;
            let upComing = 0;
            let pending = 0;
            let notInterested = 0;
            let closed = 0;

            const inquiries = await prisma.DomainResponse.findMany({
                where: {

                    domain_id: user.inquiryDomain.id,
                    status: 1,
                    OR: [
                        { assignId: Number(user.id) },
                        {
                            AND: [
                                { assignId: null },
                                { addedBy: String(user.id) }
                            ]
                        }
                    ]
                },

                select: {

                    id: true,
                    followups: {

                        distinct: ["inquiryID"],
                        orderBy: {
                            createdAt: "desc"
                        },

                        select: {

                            id: true,
                            date: true,
                            time: true,
                            followUpStatus: true
                        }
                    }
                }
            });

            for (const inquiry of inquiries) {

                for (const followup of inquiry.followups) {

                    if (followup.followUpStatus === "Not Interested") {
                        notInterested++;
                    }

                    if (followup.followUpStatus === "Closed") {
                        closed++;
                    }

                    if (!followup.date) continue;

                    const date = dayjs(followup.date, "DD-MM-YYYY");

                    if (date.isSame(today, "day")) {
                        todayFollowup++;
                    } else if (date.isAfter(today, "day")) {
                        upComing++;
                    } else if (date.isBefore(today, "day")) {
                        pending++;
                    }
                }
            }


            await whatsappEveryday({
                phoneNumber: user.mobile_no,
                totalInquiries: inquiries.length,
                pending: pending,
                upcoming: upComing,
                todays: todayFollowup,
                personName: user.name,
                notInterested: notInterested,
                closed: closed,
                domainName: user.inquiryDomain.domainName

            });

            await whatsappEverydayToAdmin({
                phoneNumber: user.mobile_no,
                totalInquiries: inquiries.length,
                pending: pending,
                upcoming: upComing,
                todays: todayFollowup,
                personName: user.name,
                notInterested: notInterested,
                closed: closed,
                domainName: user.inquiryDomain.domainName

            });


        }

        return NextResponse.json({ message: "Success", data: data }, { status: 200 });


    } catch (error: any) {

        logger.error("Error occured while triggering every day 9 o clock whatsapp message:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });

    }

}