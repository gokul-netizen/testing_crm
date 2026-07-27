import { userSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {


        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.usertype;



        const domainIdAndName = await prisma.user.findUnique({
            where: {
                id: Number(userId),
            },
            select: {
                id: true,
                name: true,
                inquiryDomain: {
                    select: {
                        id: true,
                        domainName: true,
                    }
                }
            }
        });


        if (!domainIdAndName) {
            return NextResponse.json({ message: "Not found" }, { status: 200 });
        }

        return NextResponse.json(domainIdAndName);

    } catch (error) {
        console.error("GET_DOMAIN_IDS_ERROR:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}