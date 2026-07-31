import { getCurrentUTCFromIST } from "./date-time";
import logger from "./logs";
import { prisma } from "./prisma";

interface WhatsappProps {
    userPhoneNumber: string | number;
    userName: string;
    clientName: string;
    companyName: string;
    followupDate: string;
    followupTime: string;
    clientPhoneNumber: string | number;
    remarks: string;
    userId: string | number;
    inquiryId: string | number
}

export async function whatsappMessage({
    userPhoneNumber,
    userName,
    clientName,
    companyName,
    followupDate,
    followupTime,
    clientPhoneNumber,
    remarks,
    userId,
    inquiryId
}: WhatsappProps) {


    const url = `https://webhook.arenainnovations.com/webhook/6a465ed06f1a8bf9dd85cb3a?number=${encodeURIComponent(
        String(userPhoneNumber)
    )}&message=${encodeURIComponent(
        userName
    )}&message=${encodeURIComponent(
        clientName
    )}&message=${encodeURIComponent(
        companyName
    )}&message=${encodeURIComponent(
        followupDate
    )}&message=${encodeURIComponent(
        followupTime
    )}&message=${encodeURIComponent(
        String(clientPhoneNumber)
    )}&message=${encodeURIComponent(
        remarks
    )}&message=${encodeURIComponent(
        `$/todays-followups/${inquiryId}`
    )}`;


    const smsTemplate = `
        Name: ${userName}
        Client Name: ${clientName}
        Company Name: ${companyName}
        Follow up date : ${followupDate}
        Follow up time: ${followupTime}
        Client Phone Number: ${clientPhoneNumber}
        Remarls: ${remarks} `.trim();


    try {

        const response = await fetch(url);

        const smsUrl = response.url;

        const responseText = await response.text();

        await prisma.whatsappLogs.create({
            data: {
                sentTo: String(userPhoneNumber),
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
                sentTo: String(userPhoneNumber),
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
export async function whatsappMessageToAdmin({
 
    userName,
    clientName,
    companyName,
    followupDate,
    followupTime,
    clientPhoneNumber,
    remarks,
    userId,
    inquiryId
}: WhatsappProps) {


    const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;

    const url = `https://webhook.arenainnovations.com/webhook/6a465ed06f1a8bf9dd85cb3a?number=${adminNumber}&message=${encodeURIComponent(
        userName
    )}&message=${encodeURIComponent(
        clientName
    )}&message=${encodeURIComponent(
        companyName
    )}&message=${encodeURIComponent(
        followupDate
    )}&message=${encodeURIComponent(
        followupTime
    )}&message=${encodeURIComponent(
        String(clientPhoneNumber)
    )}&message=${encodeURIComponent(
        remarks
    )}&message=${encodeURIComponent(
        `$/todays-followups/${inquiryId}`
    )}`;


    const smsTemplate = `
        Name: ${userName}
        Client Name: ${clientName}
        Company Name: ${companyName}
        Follow up date : ${followupDate}
        Follow up time: ${followupTime}
        Client Phone Number: ${clientPhoneNumber}
        Remarls: ${remarks} `.trim();


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

        logger.error({ message: "Error at everyday WhatsApp message", error: error.message });

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        await prisma.whatsappLogs.create({
            data: {
                sentTo: String(adminNumber),
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
            error: errorMessage
        };
    }
}