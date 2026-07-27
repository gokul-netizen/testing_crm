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
         
        return NextResponse.json({error : error }, {status : 500})
    }
}

export async function PATCH(req : Request){
    try {
        const body = await req.json();
        const {ids } = body;

        if(Array.isArray(ids) && ids.length === 0){
            return NextResponse.json({error : "Ids must be an array and not null"})
        }

        await prisma.user.updateMany({
            where : {
                id : {in :ids}
            },
            data : {
                isDeleted : false,
                isDeletedBy : null,
                isDeletedOn : null
            }
        })

        return NextResponse.json({message : "Revoked successfully"}, {status : 200})
    } catch (error) {
         
        return NextResponse.json({error : error} , {status : 500})
    }
}