import { prisma } from "@/lib/prisma";
import { subscribe } from "diagnostics_channel";
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
        console.error("Something occured while fetching domain data" , error);
        return NextResponse.json({message : "fail" ,  error: error instanceof Error ? error.message : "Unknown error"},{ status: 500 })
    }
}