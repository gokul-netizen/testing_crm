import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { whatsappMessage, whatsappMessageToAdmin } from "@/lib/whatsapp_template";

dayjs.extend(utc);
dayjs.extend(timezone);


export async function GET(req: Request) {


    const currentDateTime = dayjs().tz("Asia/Kolkata");
    const currentMinuteStr = currentDateTime.format("YYYY-MM-DD HH:mm");
    const targetStart = dayjs.utc(`${currentMinuteStr}:00`).toDate();
    const targetEnd = dayjs.utc(`${currentMinuteStr}:59`).toDate();

    try {

        const followups = await prisma.followup.findMany({
            where: {
                followUpStatus: "Follow Up",
                contact_mode: "Visit",
                reminder: {
                    gte: targetStart,
                    lte: targetEnd
                }
            },
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

        if (followups.length === 0) {
            logger.info({
                message: "No follow-ups found to trigger reminder.",
                currentTime: currentMinuteStr,
            });

            return NextResponse.json({ message: `No Follow ups at this time ${currentMinuteStr}`, }, { status: 400 });
        }

        for (const follow of followups) {

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

        return NextResponse.json({ message: "Success", }, { status: 200 });


    } catch (error: any) {

        logger.error({

            message: "Fail to send visit reminder",
            file: "api/whatsapp/visit-reminder/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });

        return NextResponse.json({ message: error.message }, { status: 500 });

    }
}