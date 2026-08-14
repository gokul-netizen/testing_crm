

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const result = await prisma.domainResponse.findMany({
            where: {
                status: 1,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                createdAt: true,
                domain: {
                    select: {
                        id: true,
                        domainName: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "fail", error: String(error) },
            { status: 500 }
        );
    }
}