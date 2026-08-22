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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauth" }, { status: 401 });
    }

    const userId = session.id;
    const { id } = await params;
    const domainId = Number(id);

    const body = await req.json();
    const { ids } = body;


    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "ids must be a non-empty array" },
        { status: 400 }
      );
    }

    const result = await prisma.domainResponse.updateMany({
      where: {
        id: { in: ids.map(Number) },
        domain_id: domainId,
      },
      data: {
        status: 0,
        isDeletedBy: String(userId),
        isDeletedOn: getCurrentUTCFromIST(),
      },
    });

    return NextResponse.json({
      message: "Records deleted successfully",
      deletedCount: result.count,
    });
  } catch (error: any) {
    console.error("DELETE error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
