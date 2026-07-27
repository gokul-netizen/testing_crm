 
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { ids, status } = body;

    
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "ids must be a non-empty array" },
        { status: 400 }
      );
    }

    if (!["Active", "Blocked"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

   
    const result = await prisma.inquiryDomain.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        status,
        
      },
    });

    
    return NextResponse.json({
      message: "Status updated successfully",
      updatedCount: result.count,
    });
  } catch (error) {
    console.error(" error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
