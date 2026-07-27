import { userSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getCurrentUTCFromIST } from "@/lib/date-time";
import { uploadFile } from "@/lib/uploadFile";
import logger from "@/lib/logs";

dayjs.extend(utc);
dayjs.extend(timezone);



export async function POST(req: Request) {
    try {

        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.userType;

        const formData = await req.formData();

        const role_id = parseInt(formData.get("roleId") as string || "12", 10);
        const name = (formData.get("name") as string)?.trim() || "";
        const username = (formData.get("username") as string)?.trim() || "";
        const email = (formData.get("email") as string)?.trim() || "";
        const password = formData.get("password") as string || "";
        const status = (formData.get("status") as string) || "Active";
        const emailTriggerOption = (formData.get("emailTriggerOption") as string || "Yes");
        const mobile_no = (formData.get("mobile_no") as string)?.trim() || "";
        const joining_date_str = formData.get("joining_date") as string || "";
        const joining_date = joining_date_str ? new Date(joining_date_str) : null;

        const domains = JSON.parse(formData.get("domains") as string || "[]") as number[];
        const imageFile = formData.get("image") as Blob | null;


        if (!username || !password || !domains || !name || !email) {
            return NextResponse.json(
                { message: "Please fill all required fields Name, Username, Email, Password, Domains" },
                { status: 400 }
            );
        }


        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) return NextResponse.json({ message: "Username already exists" }, { status: 400 });

        if (email) {
            const existingEmail = await prisma.user.findUnique({ where: { email } });
            if (existingEmail) return NextResponse.json({ message: "Email already exists" }, { status: 400 });
        }


        let imagePath = "";
        if (imageFile && (imageFile as any).size > 0) {
            imagePath = await uploadFile(imageFile);
        }

        const hash = crypto.createHash("md5").update(password).digest("hex");

        await prisma.user.create({
            data: {
                role_id,
                name,
                password: hash,
                show_password: password,
                email,
                username,
                mobile_no: mobile_no,
                user_image: imagePath || null,
                status,
                added_on: getCurrentUTCFromIST(),
                added_by: String(userId),
                type: "User",
                joining_date,
                domain: Number(domains),
                emailTriggerOption: emailTriggerOption
            },
        });

        return NextResponse.json({ message: "Sub-user created successfully" }, { status: 201 });

    } catch (error: any) {
        logger.error({
            message: error.message,
            error: error.message,
        }, "CREATE_SUBUSER_ERROR");
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {

        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.userType;



        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            include: {
                inquiryDomain: {
                    where: {
                        isDeleted: false
                    },
                    select: {
                        domainName: true,
                        subscription: true,
                        status: true
                    }
                }
            }
        });

        const totalSubscriptions = user.inquiryDomain?.subscription ?? 0;

        const subUsers = await prisma.user.findMany({
            where: { added_by: String(userId), type: "User" },
            orderBy: { id: "desc" },
        });

        const canCreateSubuser = totalSubscriptions > subUsers.length;

        return NextResponse.json({ subUsers, canCreateSubuser }, { status: 200 });

    } catch (error: any) {

        logger.error({
            message: error?.message,
            stack: error?.stack,
            error,
        }, "Error occured when fetching subuser ");
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}