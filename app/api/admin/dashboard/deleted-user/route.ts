import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";




export async function GET(req:Request){
    try {
        const data = await prisma.user.findMany({
            where : {
                isDeleted : true,
            },
            select : {
                id : true,
                name : true,
                email : true,
                mobile_no : true,
                isDeletedBy : true,
                isDeletedOn : true
            }
        });
        return NextResponse.json({data : data}, {status : 200})
    } catch (error) {

        logger.error({
            message: "Fail to fetch deleted user ",
            file: "api/admin/dashboard/deleted-user/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });
         
        return NextResponse.json({error : error }, {status : 500})
    }
}