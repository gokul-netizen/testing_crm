import { userSession } from "@/lib/jwt";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";





export async function GET(req: Request) {
    try {

        

        const createdUsers = await prisma.user.findMany({
            where: {
                isDeleted : false,
                status : "Active"
            },
            select: {
                id: true,
                username: true,
            },
        });

        const formattedSubUsers = createdUsers.map((user: { id: number, username: string }) => ({
            id: user.id,
            username: user.username,
            type: "SUB" as const
        }));


        return NextResponse.json(formattedSubUsers);

    } catch (error : any) {
        
        logger.error({

            message: "Fail to get users ",
            file: "api/admin/get-users/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });
        
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}