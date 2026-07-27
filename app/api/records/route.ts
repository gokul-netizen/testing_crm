
import { getCurrentUTCFromIST } from "@/lib/date-time";
import getSession from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";



export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { domain, username, password, apiKey, status } = body;

    if (!domain || !username || !password || !apiKey) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    return NextResponse.json({ message: "Successful", }, { status: 200 });
  } catch (error) {
    console.error("Error occurred while posting domain", error);
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
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
    })
    return NextResponse.json({message : "Deleted successfully"}, {status : 200})
  } catch (error) {
      console.error("error while deleting domains",error);
      return NextResponse.json({error : error}, {status : 500})
  }
}