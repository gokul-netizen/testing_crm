import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
 
    const users = await prisma.user.findMany({
      select: { domain: true }
    });

    const assignedDomainNames = new Set(
      users.flatMap((user : {domain : number}) => user.domain)  
    );
   
    const allDomains = await prisma.inquiryDomain.findMany({
      where : {
        subscription : {
          gt : 0
        }
      },
      select: { id: true, domainName: true }
    });
 
    const unassignedDomains = allDomains.filter(
      (domain:any) => !assignedDomainNames.has(domain.id)
    );

    return NextResponse.json({ unassignedDomains }, { status: 200 });

  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch unassigned domains"
    }, { status: 500 });
  }
}