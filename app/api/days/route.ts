import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await prisma.$queryRaw<
      {
        id: number;
        domainName: string;
        logo : string;
        count: number;
      }[]
    >`
  SELECT 
    d.id,
    d."domainName",
    d."logo",
    COUNT(r.id)::INT AS count
  FROM "InquiryDomain" d
  LEFT JOIN "DomainResponse" r
    ON r.domain_id = d.id
   AND r.status = 1
   WHERE d."isDeleted" = false
  GROUP BY d.id, d."domainName"
  ORDER BY d.id;
`;

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "fail", error: String(error) },
      { status: 500 }
    );
  }
}
