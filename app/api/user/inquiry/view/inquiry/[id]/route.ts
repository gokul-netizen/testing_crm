import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import logger from "@/lib/logs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";


dayjs.extend(utc);
dayjs.extend(timezone);


interface ParamsProps {
    params: Promise<{ id: string, }>;
}

export async function GET(req: Request, { params }: ParamsProps) {
    try {

        const { id } = await params;
        const inquiryId = id;


        const info = await prisma.DomainResponse.findUnique({
            where: {
                id: Number(inquiryId),
            },

            select: {
                response: true
            }
        });

        return NextResponse.json(info)
    } catch (error: any) {
        logger.error({

            message: "Fail to get inquiry",
            file: "api/user/inquiry/view/inquiry/[id]/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });

        return NextResponse.json("error")

    }

}



