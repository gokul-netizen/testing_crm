import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, phone, phoneSecondary } = body;

        const inquiryExist = await prisma.domainResponse.findFirst({
            where: {
                OR: [
                    { email: email },
                    { phone: phone },
                    { phoneSecondary: phoneSecondary }
                ]
            },
            select: {

                id : true,
                createdAt: true,
                followUpStatus: true,
                
            }
        });

        if (inquiryExist) {
            return NextResponse.json({
                exist: true,
                message: "Inquiry already exists",
                data: {
                    createdAt: inquiryExist.createdAt,
                    FollowUpStatus: inquiryExist.followUpStatus
                }
            }, { status: 409 })
        }

        return NextResponse.json({ exist: false }, { status: 200})

    } catch (error) {
        return NextResponse.json({exist : false} , {status : 200})
    }
}