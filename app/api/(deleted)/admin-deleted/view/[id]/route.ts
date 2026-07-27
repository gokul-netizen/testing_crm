import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


type Params = Promise<{ id: string }>

export async function GET(req: Request, { params }: { params: Params }) {
    try {
        const { id } = await params;
        const deletedViews = await prisma.domainResponse.findMany({
            where: {
                domain_id: Number(id),
                status: 1
            },
            select: {
                id: true,
                domain_id: true,
                name: true,
                email: true,
                phone: true,
                 
                
                createdAt: true
            }
        });

        return NextResponse.json({ data: deletedViews }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error || "Something went wrong" }, { status: 500 })
    }
}

export async function PUT(req: Request, { params }: { params: Params }) {
    try {
        const { id } = await params;
        if (!id) return NextResponse.json({ error: "Id is required" }, { status: 400 });
        const revoke = await prisma.domainResponse.update({
            where: {
                id: Number(id)
            },
            data: {
                status: 1,
                isDeletedBy: null,
                isDeletedOn: null
            }
        });

        return NextResponse.json({ message: "Data revoked" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error || "something went wrong" }, { status: 500 })
    }
}