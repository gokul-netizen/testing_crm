import { getCurrentUTCFromIST } from "@/lib/date-time";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {

    logger.info({ action: "POST_INQUIRY" }, "Process started");

    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      logger.warn("Request rejected: Missing or invalid Authorization header");
      return NextResponse.json({ error: "Access Token is required" }, { status: 400 });
    }

    const accessToken = authHeader.split(" ")[1];

    if (!accessToken) {
      logger.error("access token is required");
      return NextResponse.json({ error: "Access Token is required" }, { status: 400 });
    }

    const match = await prisma.inquiryDomain.findUnique({ where: { accessToken } });

    if (!match) {
      logger.error("Unauthorized: Invalid access token attempted");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const normalizedData: Record<string, any> = {};

    body.forEach((item: { key: string; value: any }) => {
      const cleanKey = item.key.toLowerCase().replace(/[^a-z0-9]/g, "");
      normalizedData[cleanKey] = item.value;
    });

    const { name, email, phone } = normalizedData;

    const result = await prisma.domainResponse.create({
      data: {
        domain_id: match.id,
        name: name || null,
        email: email || null,
        phone: phone || null,
        response: {
          Domain_Name: match.domainName,
          body
        },

        createdAt: getCurrentUTCFromIST()
      }
    });

    logger.info({ name: result.name }, "Succesfully posted");

    return NextResponse.json({ message: "Created post successfully" });
  } catch (error) {
    logger.error({

      message: "Fail to create post",
      file: "api/create-post/route.ts",
      method: req.method,
      errorMessage: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,

    });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}