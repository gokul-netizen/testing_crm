import fs from "fs/promises";
import path from "path";

export const writeLog = async (
    toEmail: string,
    messageText: string
) => {

    const logsDir = path.join(process.cwd(), "logs");

    await fs.mkdir(logsDir, { recursive: true });

    const filePath = path.join(logsDir, "email_logs.txt");

     const dateandtime = new Date();

    const message =
        `Email Log triggered at ${dateandtime.toLocaleString("en-IN", {timeZone: "Asia/kolkata"})} `  + 
        `To Email: ${toEmail} ` +
        `Message: ${messageText}\n`;

    try {
        await fs.appendFile(filePath, message, "utf8");
    } catch (err) {
        console.error("CRITICAL: Failed to write to log file:", err);
    }
};