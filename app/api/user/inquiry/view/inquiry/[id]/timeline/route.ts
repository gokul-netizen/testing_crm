import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface ParamsPros {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: ParamsPros) {
  try {
    const { id } = await params;


    const history = await prisma.$queryRaw`
SELECT * FROM (

  -- Followup records
  SELECT 
    'followup' AS type,
    f.id,
    f."addedBy" AS "addedById",
    f.date,
    f.time,
    f."followUpStatus",
    f."isPublic",
    f."createdAt",
    f.remarks,
    f.address,     
    u.name AS "addedByName",
    u_assign.name AS "assignedToName"
  FROM "Followup" f
  LEFT JOIN "User" u 
    ON u.id = f."addedBy"
  LEFT JOIN "User" u_assign 
    ON u_assign.id = f."assignTo"
  WHERE f."inquiryID" = ${Number(id)}

  UNION ALL

  -- Assign records
  SELECT 
    'assign' AS type,
    a.id,
    a."addedBy" AS "addedById",
    a."assignDate" AS date,
    a."assignTime" AS time,
    NULL AS "followUpStatus",
    NULL AS "isPublic", -- or a."isPublic" if Assign table has this column
    a."createdAt",
    a.remarks,
      NULL AS address, 
    u_creator.name AS "addedByName",
    a."assingToName" AS "assignedToName"
  FROM "Assign" a
  LEFT JOIN "User" u_creator
    ON u_creator.id = a."addedBy"
    AND a.type != 'SUB'
  WHERE a."inquiryId" = ${Number(id)}

) AS combined_history
ORDER BY "createdAt" DESC;
`;


    const inquiryDetail = await prisma.domainResponse.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        companyName: true,
        name: true,
        email: true,
        phone: true,
        addedBy: true,
        createdAt: true,
        domain: {
          select: {
            id: true,
            domainName: true,
          }
        },

        followups: {

          where: {
            address: {
              not: null,
            },
          },
          select: {
            id: true,
            address: true,
          },
        }
      }
    });

    return NextResponse.json(
      { history, inquiryDetail },
      { status: 200 }
    );
  } catch (error: any) {
    logger.error({

      message: "Fail to get inquiry timeline",
      file: "api/user/inquiry/view/inquiry/[id]/timeline/route.ts",
      method: req.method,
      errorMessage: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,

    });

    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}