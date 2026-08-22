import { getCurrentUTCFromIST } from "@/lib/date-time";
import getSession from "@/lib/jwt";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface ParamsPros {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: ParamsPros) {
  try {
    const { id } = await params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ message: "Valid ID is required" }, { status: 400 });
    }

    const details = await prisma.domainResponse.findMany({
      where: {
        domain_id: Number(id),
        status: 1,
      },
      select: {
        id: true,
        domain_id: true,
        name: true,
        email: true,
        phone: true,
        followUpStatus : true,
        response : true,
        createdAt: true,
        domain: {
          select: {
            logo: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

     

    return NextResponse.json({ data: details }, { status: 200 });
  } catch (error : any) {
    logger.error("Error fetching domain response:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to retrieve domain responses." },
      { status: 500 }
    );
  }
}




 
