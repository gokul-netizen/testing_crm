import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { getCurrentUTCFromIST } from "@/lib/date-time";
import { userSession } from "@/lib/jwt";
import logger from "@/lib/logs";
import { uploadFile } from "@/lib/uploadFile";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid username " }, { status: 401 });
        }

        const hashedPassword = crypto.createHash("md5").update(password).digest("hex");

        if (hashedPassword !== user.password) {
            return new Response(JSON.stringify({ error: "Invalid  password" }), { status: 401 });
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

        const secret = new TextEncoder().encode(JWT_SECRET);

        const token = await new SignJWT({ id: user.id, username: user.username })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("7h")
            .setSubject(user.id.toString())
            .sign(secret);


        await prisma.user.update({
            where: { id: user.id },
            data: {
                last_login: getCurrentUTCFromIST(),
                last_loginip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1"
            },
        });


        const response = NextResponse.json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username,
            },
        }, { status: 200 });

        response.cookies.set("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return response;

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {

        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.usertype;

        const profile = await prisma.User.findUnique({
            where: {
                id: Number(userId)
            },
            select : {
                id : true,
                user_image : true,
                username : true,
                added_on : true,
                name : true,
                email : true,
                status : true,
                mobile_no : true,
                last_login : true,
            }
        });
        return NextResponse.json(profile, { status: 200 })
    } catch (error: any) {
        logger.error("Error when getting user profile", error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}


export async function PUT(req: Request) {

    const decoded = await userSession();
    const userId = decoded?.id;
    const userType = decoded?.usertype;

    try {
        const formData = await req.formData();
        const roleIdInput = formData.get('roldId') as string | null;
        const nameInput = formData.get('name') as string | null;
        const usernameInput = formData.get('username') as string | null;
        const emailInput = formData.get('email') as string | null;
        const mobileNoInput = formData.get('mobile_no') as string | null;
        const joiningDateInput = formData.get('joining_date') as string | null;
        const statusInput = formData.get('status') as string | null;
        const domainsInput = formData.getAll('domains') as string[];
        const userImageInput = formData.get("user_image") as File | null;

        const existingUser = await prisma.user.findUnique({
            where: { id: Number(userId) }
        });

        if (!existingUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const updatedData: any = {
            role_id: roleIdInput ? Number(roleIdInput) : existingUser.role_id,
            name: nameInput || existingUser.name,
            username: usernameInput || existingUser.username,
            email: emailInput || existingUser.email,
            mobile_no: mobileNoInput || existingUser.mobile_no,
            joining_date: joiningDateInput ? new Date(joiningDateInput) : existingUser.joining_date,
            status: statusInput || existingUser.status,
            domains: domainsInput.length ? domainsInput : existingUser.domains,
            updated_by: String(userId),
            updated_on: getCurrentUTCFromIST(),
        };

        if (userImageInput && userImageInput.size > 0) {
            updatedData.user_image = await uploadFile(userImageInput);
        } else {
            updatedData.user_image = existingUser.user_image;
        }

        const updatedUser = await prisma.user.update({
            where: { id: Number(userId) },
            data: updatedData
        });

        return NextResponse.json(updatedUser, { status: 200 });

    } catch (error) {
        logger.error(error);
        return NextResponse.json({ error: error });
    }
}

