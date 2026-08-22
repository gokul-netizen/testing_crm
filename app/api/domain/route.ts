import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req : Request){
    try {

        const domains = await prisma.inquiryDomain.findMany({
                where : {
                    isDeleted : false,
                     
                },
                select : {
                        id : true,
                        domainName : true,
                        accessToken : true,
                        addedOn : true,
                        status : true,
                        subscription : true
                },
             orderBy: { addedOn: "desc" },   
        });

        return NextResponse.json({message : "Successfull" , data : domains} , {status : 200} );
        
    } catch (error) {
       
        logger.error({
            message: "Fail to fetch domain inquiries",
            file: "api/admin/dashboard/active-inquiries/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });

        return NextResponse.json({message : "fail" ,  error: error instanceof Error ? error.message : "Unknown error"},{ status: 500 })
    }
}