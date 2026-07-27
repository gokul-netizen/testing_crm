import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface ParamsPros {
    params: Promise<{ id: string }>;
}


export async function GET(req: Request, { params }: ParamsPros) {

    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: "ID is required" },
                { status: 400 }
            );
        }

        const data = await prisma.designation.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!data) {
            return NextResponse.json(
                { error: "Not Found" },
                { status: 404 }
            );
        }

        return NextResponse.json(data, { status: 200 });

    } catch (error: any) {

        logger.error("error when getting Title by id", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function PUT(req : Request , {params} : ParamsPros) {
    try {
        const { id } = await params;

        const body = await req.json();
        const  {title , status} = body;


         if (!id) {
            return NextResponse.json(
                { error: "ID is required" },
                { status: 400 }
            );
        }

        await prisma.designation.update({
            where: {
                id: Number(id)
            },
            data : {
                jobTitle : title,
                status : status
            }
        });

        return NextResponse.json("Successfully Updated", { status: 200 });

    } catch (error:any) {
        logger.error("error when updating designation by id", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}