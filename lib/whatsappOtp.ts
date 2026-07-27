import { writeOtpLog } from "./otp";



interface whatsAppOtpProps {
    phoneNumber: string;
    otp: number;
    username: string;

}


export async function whatsAppOtp({ phoneNumber, otp, username }: whatsAppOtpProps) {

    const dateandtime = new Date();

    try {

        const message = `${otp}`;

        const url = `https://webhook.arenainnovations.com/webhook/69b121bf02e28c7ee4e7fb81?number=${encodeURIComponent(
            phoneNumber
        )}&message=${encodeURIComponent(message)}`;


        const response = await fetch(url);
        
        const result = await response.json();


        if (!result.accepted) {

            const logMessage =
             `------------------------------new----------------------------- \n`+
                `OTP sending failed\n` +
                `Time: ${dateandtime.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}\n` +
                `Username: ${username}\n` +
                `Phone: ${phoneNumber}\n` +
                `OTP: ${otp}\n` +
                `Error: ${JSON.stringify(result) ||   "Unknown error"}`

            writeOtpLog(logMessage);

            return false;

        }

        const logMessage =
         `------------------------------new----------------------------- \n`+
            `OTP successfully sent \n` +
            `Time: ${dateandtime.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}\n` +
            `Username: ${username}\n` +
            `Phone: ${phoneNumber}\n` +
            `OTP: ${otp}\n` +
            `Success: ${JSON.stringify(result) }`

        writeOtpLog(logMessage);

        return true;


    } catch (error: any) {

        const logMessage =
            `OTP sending failed\n` +
            `Time: ${dateandtime.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}\n` +
            `Username: ${username}\n` +
            `Phone: ${phoneNumber}\n` +
            `OTP: ${otp}\n` +
            `Error: ${error.message || error.data || "Unknown error" }`;

        writeOtpLog(logMessage);
        return false

    }

}