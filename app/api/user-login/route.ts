import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { getCurrentUTCFromIST } from "@/lib/date-time";
import { headers } from "next/headers";
import { GenerateTokenUser } from "@/lib/tokenJwt";
import logger from "@/lib/logs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, password } = body;

         if (!username || !password) {
            return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
        }


        const headerList = await headers();
        const ip = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

       

        let user = await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                type: true,
                user_image: true,
                password: true,
            }
        });

        const userType = user?.type;
        const userImage = user?.user_image;

        if (!user) {
            return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
        }

        const hashedPassword = crypto.createHash("md5").update(password).digest("hex");

        if (hashedPassword !== user.password) {
            return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
        }

        const token = await GenerateTokenUser({ id: user.id, username: user.username, userType: user.type, image: user.user_image });

        const response = NextResponse.json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username,
                userType,
                image: userImage || null,
            },
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
        });


        await prisma.user.update({
            where: { id: user.id },
            data: {
                last_login: getCurrentUTCFromIST(),
                last_loginip: ip,
            },
        });

        return response;

    } catch (error: any) {

        logger.error({
            message: "User login failed",
            file: "api/user-login/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });

        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}