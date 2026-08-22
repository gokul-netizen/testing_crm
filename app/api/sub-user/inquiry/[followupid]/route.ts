import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";




interface UserId {
    followupid: string;
}

export async function GET(req: Request, { params }: { params: Promise<UserId> }) {
    try {

 
        const { followupid } = await params;

        const data = await prisma.followup.findUnique({
            where : {
                id : Number(followupid)
            }
        });

        return NextResponse.json({ message : "Fetched successfully" , data }, { status: 200 });

    } catch (error) {

        logger.error({

            message: "Fail to get follow up data",
            file: "api/sub-user/inquiry/[followupid]/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });

        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });

    }

}


