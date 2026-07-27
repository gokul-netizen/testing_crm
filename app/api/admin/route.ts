import { prisma, globalForPrisma } from "@/lib/prisma";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { GenerateToken } from "@/lib/tokenJwt";
import { headers } from 'next/headers';
import { getCurrentUTCFromIST } from "@/lib/date-time";


export async function POST(req: Request) {
    try {


        const body = await req.json();
        const { username, password } = body;
        const headerStore = await headers();
        const forwardedFor = headerStore.get('x-forwarded-for');
        const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';


        if (!username || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const admin = await prisma.admin.findUnique({
            where: { username }
        });

        if (!admin) {
            return NextResponse.json({ error: "Invalid username " }, { status: 401 });
        }

        const hashedPassword = crypto.createHash("md5").update(password).digest("hex");

        if (hashedPassword !== admin.password) {
            return new Response(JSON.stringify({ error: "Invalid  password" }), { status: 401 });
        }


        const token = await GenerateToken({ id: admin.id, username: admin.username });

        const response = NextResponse.json({
            success: true,
            message: "Login successful",
            user: {
                id: admin.id,
                username: admin.username,
            },
        }, { status: 200 });

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
                last_login: getCurrentUTCFromIST()

            }
        });
        
        return response;

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}


