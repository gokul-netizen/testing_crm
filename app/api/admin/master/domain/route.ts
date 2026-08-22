import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { getCurrentUTCFromIST } from "@/lib/date-time";
import getSession from "@/lib/jwt";
import { uploadFile } from "@/lib/uploadFile";

function generateAccessToken(): string {
    return crypto.randomBytes(8).toString("hex");
}

export async function GET(req : Request){
    try {
       

        const domains = await prisma.inquiryDomain.findMany({
                where : {
                    isDeleted : false,
                     
                },
                select : {
                        id : true,
                        domainName : true,
                        accessToken : true,
                        addedOn : true,
                        status : true,
                        subscription : true
                },
                orderBy: { addedOn: "desc" },   
        });

        return NextResponse.json({message : "Fetched the domains successfully..!" , data : domains} , {status : 200} );
        
    } catch (error) {
        
       logger.error({
            message: "Fail to fetch domains",
            file: "api/admin/master/domain/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });

        return NextResponse.json({message : "fail" ,  error: error instanceof Error ? error.message : "Unknown error"},{ status: 500 })
    }
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

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { ids, status } = body;

    
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "ids must be a non-empty array" },
        { status: 400 }
      );
    }

    if (!["Active", "Blocked"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

   
    const result = await prisma.inquiryDomain.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        status,
      },
    });

    
    return NextResponse.json({
      message: "Status updated successfully",
      updatedCount: result.count,
    });
  } catch (error) {
    console.error(" error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {

  try {

    const userId = await getSession();
    if (!userId) return NextResponse.json({ message: "Unauth" }, { status: 401 });
    const Id = userId?.id;

    const body = await req.json();
    const { ids } = body;
    if (Array.isArray(ids) && ids.length === 0) {
      return NextResponse.json({ error: "ids must be an array and not null" }, { status: 400 })
    }

    await prisma.inquiryDomain.updateMany({
      where: {
        id: { in: ids }
      },
      data: {
        isDeleted: true,
        isDeletedBy: String(Id),
        isDeletedOn : getCurrentUTCFromIST()
      }
    });

    return NextResponse.json({message : "Deleted successfully"}, {status : 200});
    
  } catch (error) {
      console.error("error while deleting domains",error);
      return NextResponse.json({error : error}, {status : 500})
  }
}






