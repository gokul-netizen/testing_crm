import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { userSession } from "@/lib/jwt";
dayjs.extend(customParseFormat);

 
export async function GET(
    req: Request,
  
) {
    try {


       const decoded = await userSession();
           const userId = decoded?.id;
           const userType = decoded?.userType;

        const today = dayjs();

        const domainId = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                domain: true,
            },
        });


        // const followups = await prisma.user.findUnique({
        //     where: {
        //         id: userID,
        //         status: "Active"
        //     },
        //     select: {
        //         id: true,
        //         domain: true,
        //         inquiryDomain: {
        //             where: {
        //                 status: "Active"
        //             },
        //             select: {
        //                 id: true,
        //                 domainName: true,
        //                 domainResponse: {
        //                     where: {
        //                         status: 1,
        //                         OR: [
        //                             { assignId: Number(user_id) },
        //                             {
        //                                 AND: [
        //                                     { assignId: null },
        //                                     { addedBy: String(user_id) }
        //                                 ]
        //                             }
        //                         ],
        //                         orderBy: {
        //                             createdAt: "desc"
        //                         },
        //                         distinct: ["inquiryID"],


        //                     },
        //                     select: {
        //                         date: true,
        //                         time: true,
        //                         remarks: true,
        //                         followUpStatus: true,
        //                         createdAt: true,
        //                         assignToName: true,

        //                         inquiry: {
        //                             select: {
        //                                 id: true,
        //                                 name: true,
        //                                 email: true,
        //                                 phone: true,
        //                                 createdAt: true,
        //                             },
        //                         },
        //                     },
        //                 }
        //             }


        //         }
        //     },




        // });

        // console.log(followups);

        if (!domainId) {
            throw new Error("Not Found");
        }


        const inquiryIds = await prisma.domainResponse.findMany({
            where: {
                status: 1,
                domain_id: domainId.domain,
                OR: [
                    { assignId: Number(userId) },
                    {
                        AND: [
                            { assignId: null },
                            { addedBy: String(userId) }
                        ]
                    }
                ]
            },
            select: { id: true },
        });

        const followInquiryIds = inquiryIds.map((item: any) => item.id);


        const notificationData = await prisma.followup.findMany({
            where: {

                inquiryID: { in: followInquiryIds },

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

                inquiry: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        createdAt: true,
                    },
                },
            },
        });


        const pending = notificationData.filter((item: any) => {

            if (!item.date) return false;

            const itemDate = dayjs(item.date, "DD-MM-YYYY");

            if (!itemDate.isValid()) return false;

            return itemDate.isBefore(today, "day");
        });

        const todayFollowup = notificationData.filter((f: any) => f.date && dayjs(f.date, "DD-MM-YYYY").isSame(today, "day"));

        const data = [...pending, ...todayFollowup];



        return NextResponse.json({ data: data, message: "Successfully fetched notification data of user" }, { status: 200 });

    } catch (error: any) {

        logger.error({ error: error.message }, "Error getting notification data of user");
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });

    }
}