import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import getSession from "@/lib/jwt";
import { getCurrentUTCFromIST } from "@/lib/date-time";


dayjs.extend(utc);
dayjs.extend(customParseFormat);

interface ParamsPros {
  params: Promise<{ id: string; date: string }>;
}

export async function GET(req: Request, { params }: ParamsPros) {
  try {

    const { id, date } = await params;
    if (!id || !date) {
      return NextResponse.json(
        { message: "id and date are required" },
        { status: 400 }
      );
    }


    const parsedDate = dayjs.utc(date, "DD-MM-YYYY");

    if (!parsedDate.isValid()) {
      return NextResponse.json(
        { message: "Invalid date format. Please use DD-MM-YYYY" },
        { status: 400 }
      );
    }

    const startDate = parsedDate.startOf("day").toDate();
    const endDate = parsedDate.endOf("day").toDate();


    const responses = await prisma.domainResponse.findMany({
      where: {
        domain_id: Number(id),
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: responses }, { status: 200 });
  } catch (error) {
    console.error("Error fetching responses:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}





export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; date: string }> }) {
  try {

    const userId = await getSession();
    if (!userId) return NextResponse.json({ message: "Unauth" }, { status: 401 });

    const Id = userId?.id;
    const { id, date } = await params;
    const domainId = date;

    if (!id || !date) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deleted = await prisma.domainResponse.update({
      where: { id: Number(id), domain_id: Number(domainId) },
      data: {
        status: 0,
        isDeletedBy: String(Id),
        isDeletedOn: getCurrentUTCFromIST()
      }
    });

    return NextResponse.json({
      message: "Record deleted successfully",
      deletedId: deleted.id,
    });
  } catch (error: any) {
    console.error("DELETE error:", error);


    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}