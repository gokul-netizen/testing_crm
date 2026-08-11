import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";

type Params = Promise<{id : string}>

export async function PUT(req:Request , {params} : {params:Params}){
    try {

        const {id} = await params;

        const revoke = await prisma.inquiryDomain.update({
            where : {
                id : Number(id)
            },
            data : {
                isDeleted : false,
                isDeletedBy : null,
                isDeletedOn : null
            }
         })
        
         return NextResponse.json({message : "Revoked Successfully"}, {status : 200});
    } catch (error) {
             return NextResponse.json({error : error  }, {status : 500});
    }
}