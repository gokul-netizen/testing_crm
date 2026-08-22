
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface ParamsProps {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(req: Request, { params }: ParamsProps) {
    try {

        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: {
                id: Number(id),
            },
            select: {

                name: true,
                email: true,
                mobile_no: true,
                emailTriggerOption: true,
                status: true,
                type: true,
                added_on: true,
                joining_date: true,
                inquiryDomain: {
                    select: {
                        domainName: true
                    }
                }
            },

        });

        return NextResponse.json({ data: user }, { status: 200 });

    } catch (error: any) {
        logger.error({
            message: "Fail to fetch user",
            file: "api/admin/dashboard/active-user/[id]/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: ParamsProps) {
    try {

        const { id } = await params;
 

        const body = await req.json();
        const { name, email, mobile_no, emailTriggerOption, status } = body;
        
        let data: Record<string, unknown> = {}

        if (name !== null) data.name = name;
        if (email !== null) data.email = email;
        if (mobile_no !== null) data.mobile_no = mobile_no;
        if (emailTriggerOption !== null) data.emailTriggerOption = emailTriggerOption;
        if (status !== null) data.status = status;

        await prisma.user.update({
            where: {
                id: Number(id)
            },
            data
        });

        return NextResponse.json({ message: "Updated the user" }, { status: 200 })


    } catch (error: any) {

        logger.error({
            message: "Fail to update user ",
            file: "api/admin/dashboard/active-user/[id]/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });

        return NextResponse.json({ message: error.message }, { status: 500 })
    }

}

