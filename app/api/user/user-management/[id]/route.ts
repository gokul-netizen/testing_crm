import { getCurrentUTCFromIST } from "@/lib/date-time";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/uploadFile";
import { NextResponse } from "next/server";



interface ParamsProps {
    params: Promise<{ id: string }>
}


export async function GET(req: Request, { params }: ParamsProps) {
    try {
        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                inquiryDomain: {
                    select: {
                        domainName: true
                    }
                }
            }
        });

        return NextResponse.json(user, { status: 200 })
    } catch (error: any) {
        logger.error("Error when getting detail", error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}

export async function PUT(req: Request, { params }: ParamsProps) {
 
    try {

        const { id } = await params;

        const formData = await req.formData();
        const roldId = formData.get('roldId') as string;
        const name = formData.get('name') as string;
        const username = formData.get('username') as string;
        const email = formData.get('email') as string;
        const emailTriggerOption = formData.get("emailTriggerOption") as string;
        const mobile_no = formData.get('mobile_no') as string;
        const joining_date = formData.get('joining_date') as string;
        const status = formData.get('status') as string;
        const domains = formData.getAll('domains') as string[];
        const userImage = formData.get("user_image") as File | null;

        let imagePath;
        if (userImage && userImage?.size > 0) {
            imagePath = await uploadFile(userImage)
        }


        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: {

                role_id: Number(roldId),
                name: name,
                username: username, 
                email: email,
                mobile_no: mobile_no,
                joining_date: new Date(joining_date),
                status: status,
                user_image: imagePath,
                updated_by: String(id),
                updated_on: getCurrentUTCFromIST(),
                emailTriggerOption : emailTriggerOption,

            }
        })
        
        return NextResponse.json(updatedUser, { status: 200 })

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error });
    }
}
