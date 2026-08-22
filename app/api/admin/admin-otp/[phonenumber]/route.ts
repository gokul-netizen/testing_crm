import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import logger from "@/lib/logs";
import { GenerateToken } from "@/lib/tokenJwt";
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

        const headerStore = await headers();
        const forwardedFor = headerStore.get('x-forwarded-for');
        const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

        if (!code) {
            return NextResponse.json({ message: "code can not be empty" }, { status: 400 });
        }

        const admin = await prisma.admin.findUnique({
            where: {
                phoneNumber : phonenumber
            }
        });

        if (!admin) {
            return NextResponse.json({ message: "Can't find this user" }, { status: 400 })
        }


        const otp = crypto.createHash("md5").update(code).digest("hex");

        if (otp !== admin.otp) {
            return NextResponse.json({ message: "Invalid Code" }, { status: 401 });
        }


        const token = await GenerateToken({ id: admin.id, username: admin.username });

        const response = NextResponse.json(
            {
                message: "OTP Verified",
                username: admin.username,
            },
            { status: 200 }
        );

        response.cookies.set("authtoken", token, {
            httpOnly: true,
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        await prisma.admin.update({
            where: {
                id: admin.id
            },

            data: {
                last_loginip: ip,
                last_login: getCurrentUTCFromIST(),
                otp: null

            }
        });

        return response;


    } catch (error: any) {

         logger.error({
            message: "Fail to validate the otp on admin side",
            file: "api/admin/admin-otp/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });
        
        return NextResponse.json({ message: error.message }, { status: 500 });

    }
}