import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUTCFromIST } from "@/lib/date-time";
import { userSession } from "@/lib/jwt";
import logger from "@/lib/logs";
import { uploadFile } from "@/lib/uploadFile";


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
        logger.error({

            message: "Fail to get  user profile ",
            file: "api/user/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });
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
        logger.error({

            message: "Fail to get update user profile ",
            file: "api/user/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });

        return NextResponse.json({ error: error });
    }
}

