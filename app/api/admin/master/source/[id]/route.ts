import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";



interface ParamsProps {
    params : Promise<{id : string}>
}

export async function GET(req:Request , {params} : ParamsProps) {
    try {
        const { id } = await params;
        
        if(!id){
            return NextResponse.json({message : "Id is required"} , {status : 400});
        }

        const data = await prisma.source.findUnique({
            where : {
                id : Number(id)
            }
        });

        if(!data){
             return NextResponse.json({message : "Data not found"},{status : 404})
        }

        return NextResponse.json(data , {status : 200});

    } catch (error:any) {
        logger.error({
            error : error.stack,
            message : error.message
        },"Error When getting source by id");

        return NextResponse.json({error : "something went wrong"} , {status : 500});
        
    }
}


export async function PUT(req:Request, {params} : ParamsProps) {
    try {

        const {id} = await params;
        const body = await req.json();
        const {source , status} = body;

        if(!id){
            return NextResponse.json({message : "Id is required"} , {status : 400});
        }

        if(!source || !status){
            return NextResponse.json({message : "source and status are required"} , {status : 400});
        }

          await prisma.source.update({
            where : {
                id : Number(id)
            },
            data : {
                source : source,
                status : status
            }
        });

        return  NextResponse.json({message : "Updated Successfully"}, {status : 200})

    } catch (error : any) {

        logger.error({
            error : error.stack,
            message : error.message
        },"Error when updating source by id");

        return NextResponse.json({error: "Something went wrong"}, {status : 500});
        
    }
}