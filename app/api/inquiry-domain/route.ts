import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { getCurrentUTCFromIST } from "@/lib/date-time";
import getSession from "@/lib/jwt";
import { uploadFile } from "@/lib/uploadFile";


function generateAccessToken(): string {
    return crypto.randomBytes(8).toString("hex");
}

export async function POST(req: Request) {

    const userId = await getSession();
     if (!userId) return NextResponse.json({ message: "Unauth" }, { status: 401 }); 
     const Id = userId?.id; 


    try {
        const formData = await req.formData();

        const domainName = formData.get("domainName") as string;
        const status = formData.get("status") as string;
        const image = formData.get("logo") as File | null;

        if (!domainName) {
            return NextResponse.json(
                { message: "Domain is required" },
                { status: 400 }
            );
        }

        const domainExists = await prisma.inquiryDomain.findUnique({
            where: { domainName }
        });


        if (domainExists) return NextResponse.json({ message: "Domain already exists" }, { status: 400 });


        let accessToken: string;
        do {
            accessToken = generateAccessToken();
        } while (
            await prisma.inquiryDomain.findUnique({ where: { accessToken } })
        );

        let logoPath: string | null = null;
        if (image && image.size > 0) {
            logoPath = await uploadFile(image, "domains");
        }

        const domain = await prisma.inquiryDomain.create({
            data: {
                domainName,
                status,
                accessToken,
                logo: logoPath,
                addedOn: getCurrentUTCFromIST(),
                addedBy : Number(Id)

            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Domain created successfully",
                data: domain,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error creating domain:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}





