import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import logger from "@/lib/logs";
import { GenerateToken, GenerateTokenUser } from "@/lib/tokenJwt";
import { getCurrentUTCFromIST } from "@/lib/date-time";
import { headers } from "next/headers";


interface ParamsPros {
    params: Promise<{ phonenumber: string }>;
}


export async function POST(req: Request, { params }: ParamsPros) {
    try {

        const body = await req.json();
        const { code } = body;

        const { phonenumber } = await params;

        const headerList = await headers();

        const ip = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

        if (!code) {
            return NextResponse.json({ message: "code can not be empty" }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: {
                mobile_no: phonenumber
            }
        });

        if (!user) {
            return NextResponse.json({ message: "Can't find this user" }, { status: 400 })
        }


        const otp = crypto.createHash("md5").update(code).digest("hex");

        if (otp !== user.otp) {
            return NextResponse.json({ message: "Invalid Code" }, { status: 401 });
        }

        const token = await GenerateTokenUser({ id: user.id, username: user.username, userType: user.type, image: user.user_image });

        const response = NextResponse.json(
            {
                message: "OTP Verified",
                username: user.username,
                type: user.type,
                userId: user.id

            },
            { status: 200 }
        );


        await prisma.user.update({
            where: { id: user.id },
            data: {
                last_login: getCurrentUTCFromIST(),
                last_loginip: ip,
                otp: null
            },
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 30 * 24 * 60 * 60,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return response;


    } catch (error: any) {

        logger.error("Error verifying  otp :", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });

    }
}