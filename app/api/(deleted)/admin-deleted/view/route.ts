import { getCurrentUTCFromIST } from "@/lib/date-time";
import getSession from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await prisma.domainResponse.findMany({
      where: {
        status: 0,
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


export async function PATCH(req: Request) {
  try {

    const userId = await getSession();
    if (!userId) return NextResponse.json({ message: "Unauth" }, { status: 401 });

    const Id = userId?.id;

    const body = await req.json();
    const { ids } = body;

    if (Array.isArray(ids) && ids.length === 0) {
      return NextResponse.json({ error: "Ids must be an array and not null" })
    }

    await prisma.domainResponse.updateMany({
      where: {
        id: { in: ids }
      },
      data: {

        status: 0,
        isDeletedBy: String(Id),
        isDeletedOn: getCurrentUTCFromIST()
      }
    })

    return NextResponse.json({ message: "deled successfully" }, { status: 200 })
  } catch (error) {

    return NextResponse.json({ error: error }, { status: 500 })
  }
}

