import { userSession } from "@/lib/jwt";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";





export async function DELETE(req: Request) {
    try {

        const { ids } = await req.json();

        const decoded = await userSession();
        const userId = decoded?.id;


        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json(
                {

                    message: "IDs are required.",
                },
                { status: 400 }
            );
        }


        await prisma.domainResponse.updateMany({
            where: {
                id: {
                    in: ids,
                },
            },
            data: {
                status: 0,
                isDeletedOn: new Date(),
                isDeletedBy: String(userId)
            },
        });

        return NextResponse.json({
            message: "Inquiry deleted successfully.",
        }, { status: 201 });


    } catch (error: any) {

        logger.error({
            message: "Failed to soft delete inquiry.",
            errorMessage: error instanceof Error ? error.message : String(error),
            errorStack: error instanceof Error ? error.stack : undefined,
        });

        return NextResponse.json({ error: "Falied to delete the inquiry" }, { status: 500 });

    }


}