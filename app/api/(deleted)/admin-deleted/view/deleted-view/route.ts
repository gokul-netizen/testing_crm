import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";



// inquiry/delete-view --- page
export async function PATCH(req: Request) {
  try {

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

        status: 1,
        isDeletedBy: null,
        isDeletedOn: null
      }
    })

    return NextResponse.json({ message: "revoked successfully" }, { status: 200 })
  } catch (error) {
    
    return NextResponse.json({ error: error }, { status: 500 })
  }
}