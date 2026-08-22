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
