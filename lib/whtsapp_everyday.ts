import { getCurrentUTCFromIST } from "./date-time";
import logger from "./logs";
import { prisma } from "./prisma";


interface FollowUpCountProps {

    totalInquiries: number;
    pending: number;
    upcoming: number;
    todays: number;
    phoneNumber: string | number;
    notInterested: number;
    closed: number;
    personName: string;
    domainName: string;

}

export async function whatsappEveryday({ totalInquiries, pending, upcoming, todays, phoneNumber, notInterested, closed, personName, domainName }: FollowUpCountProps) {


    const url =
        `https://webhook.arenainnovations.com/webhook/6a465cc16f1a8bf9dd85c72e` +
        `?number=${phoneNumber}` +
        `&message=${encodeURIComponent(personName)}` +
        `&message=${encodeURIComponent(totalInquiries)}` +
        `&message=${encodeURIComponent(todays)}` +
        `&message=${encodeURIComponent(upcoming)}` +
        `&message=${encodeURIComponent(pending)}` +
        `&message=${encodeURIComponent(notInterested)}` +
        `&message=${encodeURIComponent(closed)}` +
        `&message=${encodeURIComponent(domainName)}`;

    const smsTemplate = `
        Person Name: ${personName}
        Domain: ${domainName}
        Total Inquiries: ${totalInquiries}
        Today's Follow-ups: ${todays}
        Upcoming Follow-ups: ${upcoming}
        Pending Follow-ups: ${pending}
        Not Interested: ${notInterested}
        Closed: ${closed}
        `.trim();

    try {

        const response = await fetch(url);

        const smsUrl = response.url;

        const responseText = await response.text();

        await prisma.whatsappLogs.create({
            data: {
                sentTo: String(phoneNumber),
                smsTemplate: smsTemplate,
                response: responseText,
                smsUrl: smsUrl,
                status: response.ok ? "SUCCESS" : "FAILED",
                createdAt: getCurrentUTCFromIST()
            }
        });

        return {
            success: response.ok,
            status: response.status,

        };

    } catch (error: any) {

        logger.error({
            message: "Error at everyday WhatsApp message",
            error: error.message,
             
        });

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        await prisma.whatsappLogs.create({
            data: {
                sentTo: String(phoneNumber),
                smsTemplate: smsTemplate,
                erroInfo: errorMessage,
                response: " ",
                smsUrl: " ",
                status: "FAILED",
                createdAt: getCurrentUTCFromIST(),
            },
        });

        return {
            success: false,
            status: 500,
            error: errorMessage,
        };

    }
}


export async function whatsappEverydayToAdmin({ totalInquiries, pending, upcoming, todays, phoneNumber, notInterested, closed, personName, domainName }: FollowUpCountProps) {


    const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;

    const url =
        `https://webhook.arenainnovations.com/webhook/6a465cc16f1a8bf9dd85c72e` +
        `?number=${adminNumber}` +
        `&message=${encodeURIComponent(personName)}` +
        `&message=${encodeURIComponent(totalInquiries)}` +
        `&message=${encodeURIComponent(todays)}` +
        `&message=${encodeURIComponent(upcoming)}` +
        `&message=${encodeURIComponent(pending)}` +
        `&message=${encodeURIComponent(notInterested)}` +
        `&message=${encodeURIComponent(closed)}` +
        `&message=${encodeURIComponent(domainName)}`;

    const smsTemplate = `
        Person Name: ${personName}
        Domain: ${domainName}
        Total Inquiries: ${totalInquiries}
        Today's Follow-ups: ${todays}
        Upcoming Follow-ups: ${upcoming}
        Pending Follow-ups: ${pending}
        Not Interested: ${notInterested}
        Closed: ${closed}
        `.trim();

    try {

        const response = await fetch(url);

        const smsUrl = response.url;

        const responseText = await response.text();

        await prisma.whatsappLogs.create({
            data: {
                sentTo: String(adminNumber),
                smsTemplate: smsTemplate,
                response: responseText,
                smsUrl: smsUrl,
                status: response.ok ? "SUCCESS" : "FAILED",
                createdAt: getCurrentUTCFromIST()
            }
        });

        return {
            success: response.ok,
            status: response.status,

        };



    } catch (error: any) {

        logger.error({
            message: "Error at everyday WhatsApp message",
            error: error.message,

        });

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        await prisma.whatsappLogs.create({
            data: {
                sentTo: String(phoneNumber),
                smsTemplate: smsTemplate,
                erroInfo: errorMessage,
                response: " ",
                smsUrl: " ",
                status: "FAILED",
                createdAt: getCurrentUTCFromIST(),
            },
        });

        return {
            success: false,
            status: 500,
            error: errorMessage,
        };

    }
}