import { getCurrentUTCFromIST } from "@/lib/date-time";
import getSession from "@/lib/jwt";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/uploadFile";
import { NextResponse } from "next/server";

type Params = Promise<{ id: string }>


export async function GET(req: Request, { params }: { params: Params }) {
    try {
        const { id } = await params;
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id)
            }
        });
        if (!user) return NextResponse.json({ message: "User Not Found In Data Base" }, { status: 400 });
        return NextResponse.json({ user: user }, { status: 200 });

    } catch (error) {

        logger.error({

            message: "Fail to get user admin detail ",
            file: "api/add-user/[id]/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });

        return NextResponse.json({ error: error })
    }
}



export async function PUT(req: Request, { params }: { params: Params }) {
    const userId = await getSession();

    if (!userId) return NextResponse.json({ message: "Unauth" }, { status: 401 });

    const Id = userId?.id;

    const { id } = await params;
    try {

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
                updated_by: String(Id),
                updated_on: getCurrentUTCFromIST(),
                emailTriggerOption : emailTriggerOption,

            }
        })
        
        return NextResponse.json(updatedUser, { status: 200 })

    } catch (error) {
        logger.error({

            message: "Fail to update user admin detail ",
            file: "api/add-user/[id]/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });
        return NextResponse.json({ error: error });
    }
}




