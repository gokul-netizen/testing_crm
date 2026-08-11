import { getCurrentUTCFromIST } from "@/lib/date-time";
import { userSession } from "@/lib/jwt";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {

        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.usertype;

        const body = await req.json();
        const { title, status } = body;

        if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

        await prisma.designation.create({
            data: {
                jobTitle: title,
                status,
                userId: Number(userId),
                createdAt: getCurrentUTCFromIST()
            }
        });

        return NextResponse.json({ message: "Added Title" }, { status: 200 });

    } catch (error: any) {
       logger.error({
            message : "Error on addign new designation data app/api/user/designation",
            error : error.message
        });
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}


export async function GET(req: Request) {
    try {

        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.usertype;

        const titles = await prisma.Designation.findMany({
            where : {
                 userId: Number(userId),
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(titles, { status: 200 });

    } catch (error: any) {
        
        
        logger.error({

            message: "Fail to get designation ",
            file: "api/user/designation/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });

        return NextResponse.json({ error: error }, { status: 500 })
    }
}