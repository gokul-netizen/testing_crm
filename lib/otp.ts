
import fs from "fs/promises";
import path from "path";

export const writeOtpLog = async (
    message : string


) => {

    const logsDir = path.join(process.cwd(), "logs");

    await fs.mkdir(logsDir, { recursive: true });

    const filePath = path.join(logsDir, "otp.txt");
    

    try {
        await fs.appendFile(filePath, message, "utf8");
    } catch (err) {
        console.error("CRITICAL: Failed to write to log file:", err);
    }
};