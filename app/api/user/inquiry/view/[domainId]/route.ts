import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";



interface ParamsProps {
  params: Promise<{ domainId: string }>;
}


export async function GET(req: Request, { params }: ParamsProps) {
  try {

    const { domainId } = await params;

    const response = await prisma.domainResponse.findMany({
      where: {
        domain_id: Number(domainId),
        status: 1,
      },
      select: {
        id: true,
        name: true,
        companyName: true,
        phone: true,
        followUpStatus: true,
        createdAt: true,
        service: true,
        source: true,

        _count: {
          select: {
            followups: true,
          },
        },

        followups: {
          select: {
            date: true,
            time: true,
            createdAt: true,
            remarks: true,
            assignToName: true,
            followUpStatus: true,
          },
          orderBy: {
            createdAt: "desc"
          }
        },
        assigns: {
          select: {
            assignDate: true,
            assignTime: true,
            createdAt: true,
            remarks: true
          },
          orderBy: {
            createdAt: "desc"
          }
        }

      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(response);
  } catch (error) {
    logger.error({

      message: "Fail to get inquiry",
      file: "api/user/inquiry/view/[domainId]/route.ts",
      method: req.method,
      errorMessage: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,

    });

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


