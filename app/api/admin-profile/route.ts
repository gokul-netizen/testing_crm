import getSession from "@/lib/jwt";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/uploadFile";
import { NextResponse } from "next/server";




export async function GET(req: Request) {

    try {

        const session = await getSession();
        const admindId = session?.id;

        if (!admindId) {
            logger.warn({ message: "Admin token expried" });
            return NextResponse.json({ message: "No token" }, { status: 401 });
        }

        const admin = await prisma.admin.findUnique({
            where: {
                id: Number(admindId)
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                phoneNumber: true,
                user_image: true,
                last_login: true,
                createdAt: true,
                status: true,

            }
        });

        return NextResponse.json({ message: "Successfully fetched admin profile", data: admin }, { status: 200 });


    } catch (error: any) {

        logger.error({
            message: "Error occurred on admin profile api",
            error: error.message,
        });

        return NextResponse.json({ message: "Internal server error" }, { status: 500 });

    }

}


export async function PATCH(req: Request) {
    try {
        const session = await getSession();
        const adminId = session?.id;

        if (!adminId) {
            logger.warn({
                message: "Admin token expired",
            });

            return NextResponse.json(
                { message: "No token" },
                { status: 401 }
            );
        }

        const formData = await req.formData();

        const name = formData.get("name") as string | null;
        const username = formData.get("username") as string | null;
        const email = formData.get("email") as string | null;
        const phoneNumber = formData.get("phoneNumber") as string | null;
        const userImageInput = formData.get("user_image") as File | null;

        const updateData: any = {};

        if (name) {
            updateData.name = name;
        }

        if (username) {
            updateData.username = username;
        }

        if (email) {
            updateData.email = email;
        }

        if (phoneNumber) {
            updateData.phoneNumber = phoneNumber;
        }

        if (userImageInput && userImageInput.size > 0) {
            updateData.user_image = await uploadFile(userImageInput);
        }

        
        if (Object.keys(updateData).length > 0) {
            await prisma.admin.update({
                where: {
                    id: Number(adminId),
                },
                data: updateData,
            });
        }

        return NextResponse.json(
            {
                message: "Profile updated successfully",
            },
            {
                status: 200,
            }
        );
    } catch (error: any) {
        logger.error({
            message: "Error occurred while updating admin profile",
            error: error.message,
        });

        return NextResponse.json(
            {
                message: "Internal server error",
            },
            {
                status: 500,
            }
        );
    }
}