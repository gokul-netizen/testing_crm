import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import logger from "@/lib/logs";

import dotenv from "dotenv";
import { prisma } from "./prisma";
import { getCurrentUTCFromIST } from "./date-time";
import { NextResponse } from "next/server";
import { writeLog } from "./email_log";
dotenv.config();



const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export async function EmailFunction(
    email: string,
    username: string,
    totalinquiries: number,
    todayFollowup: number,
    pending: number,
    upComing: number,
    notInterested: number,
    closed: number
) {
    try {

        const mailGenerator = new Mailgen({
            theme: {
                path: process.cwd() + '/node_modules/mailgen/themes/default/index.html',
            },
            product: {
                name: "Mars Web Solutions",
                link: "https://www.marswebsolution.com/",
            },
        });

        const response = {
            body: {
                name: username,
                intro: "Here is your CRM inquiry summary for today:",
                table: {
                    data: [
                        { item: "Total Inquiries", description: totalinquiries },
                        { item: "Today's Follow-ups", description: todayFollowup },
                        { item: "Upcoming Follow-ups", description: upComing },
                        { item: "Pending Follow-ups", description: pending },
                        { item: "Not Interested", description: notInterested },
                        { item: "Closed", description: closed },
                    ],
                },
                outro: "Please review and take necessary actions. Let us know if you need any assistance.",
            },
        };

        const mail = mailGenerator.generate(response);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            bcc: process.env.BCC_EMAIL,
            subject: "CRM Inquiry Summary",
            html: mail
        });

        await prisma.emailLogs.create({
            data: {
                to: email,
                from: process.env.EMAIL_USER,
                status: "Sent",
                sentAt: getCurrentUTCFromIST(),
            }
        });

        writeLog(email, "email sent");

    } catch (error: any) {

        await prisma.emailLogs.create({
            data: {
                to: email,
                from: process.env.EMAIL_USER,
                status: "Fail",
                error: error.message,
                sentAt: getCurrentUTCFromIST(),
            }
        });

        writeLog(email, error.message);

        return NextResponse.json({ error: "Something went wrong..!" }, { status: 500 })
    }
}


export async function schduleEmail(
    name: string,
    domain: string,
    phoneNumber: number,
    message: string
) {
    try {
        const mailGenerator = new Mailgen({
            theme: {
                path:
                    process.cwd() +
                    "/node_modules/mailgen/themes/default/index.html",
            },
            product: {
                name: "Mars Web Solutions",
                link: "https://www.marswebsolution.com/",
            },
        });

        const response = {
            body: {
                title: "New CRM Demo Request",
                intro: "You have received a new CRM demo request.",

                table: {
                    data: [
                        {
                            label: "Name",
                            value: name,
                        },
                        {
                            label: "Domain",
                            value: domain,
                        },
                        {
                            label: "Phone Number",
                            value: phoneNumber,
                        },
                        {
                            label: "Message",
                            value: message,
                        },
                    ],
                    columns: {
                        customWidth: {
                            label: "150px",
                        },
                    },
                },

                outro:
                    "Please contact the customer and follow up regarding their CRM demo request.",
            },
        };

        const mail = mailGenerator.generate(response);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.BCC_EMAIL,
            subject: `New CRM Demo Request from ${name}`,
            html: mail,
        });

        return {
            success: true,
            message: "Demo request email sent successfully",
        };

    } catch (error) {
        
        logger.error({
            message: "Fail to send email",
            file: "lib/email-function.ts",
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });

        return {
            success: false,
            message: "Something went wrong while sending the email",
        };
    }
}