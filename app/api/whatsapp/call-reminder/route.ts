import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { whatsappMessage, whatsappMessageToAdmin } from "@/lib/whatsapp_template";

dayjs.extend(customParseFormat);


export async function GET(req: Request) {

    const today = dayjs();

    try {

        const followups = await prisma.followup.findMany({
            where: {
                followUpStatus: "Follow Up",
                contact_mode: "Call",
            },
            distinct: ["inquiryID"],

            orderBy: [

                {
                    createdAt: "desc",
                },
            ],

            select: {
                id: true,
                inquiryID: true,
                followUpStatus: true,
                date: true,
                time: true,
                remarks: true,
                reminder: true,
                addedByUser: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        mobile_no: true,
                    }
                },
                inquiry: {
                    select: {
                        id: true,
                        companyName: true,
                        name: true,
                        email: true,
                        phone: true,

                    }
                }
            }
        });


        for (const follow of followups) {

            const date = follow.date;
            const time = follow.time;

            const DateTime = `${date} ${time}`;
            const followUpDate = dayjs(DateTime, "DD-MM-YYYY h:mm A");
            const reminderTime = followUpDate.subtract(10, 'minutes');

            const shouldTriggerEmail = today.isAfter(reminderTime) && today.isBefore(reminderTime.add(1, "minute"));

            if (shouldTriggerEmail) {

                await whatsappMessage({

                    userPhoneNumber: follow.addedByUser?.mobile_no,
                    userName: follow.addedByUser.name,
                    clientName: follow.inquiry.name,
                    companyName: follow.inquiry.companyName,
                    followupDate: follow.date,
                    followupTime: follow.time,
                    clientPhoneNumber: follow.inquiry.phone,
                    remarks: follow.remarks,
                    userId: follow.addedByUser.id,
                    inquiryId: follow.inquiry.id

                });

                await whatsappMessageToAdmin({

                    userPhoneNumber: follow.addedByUser?.mobile_no,
                    userName: follow.addedByUser.name,
                    clientName: follow.inquiry.name,
                    companyName: follow.inquiry.companyName,
                    followupDate: follow.date,
                    followupTime: follow.time,
                    clientPhoneNumber: follow.inquiry.phone,
                    remarks: follow.remarks,
                    userId: follow.addedByUser.id,
                    inquiryId: follow.inquiry.id

                });

            }
        }

        return NextResponse.json({ message: "Success", }, { status: 200 });


    } catch (error: any) {

        logger.error({
            message: "Error occured while triggering one hour before follow up whatsapp message:",
            error: error.message
        });

        return NextResponse.json({ message: error.message }, { status: 500 });

    }
}