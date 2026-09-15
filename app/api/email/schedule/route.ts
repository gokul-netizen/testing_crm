import { schduleEmail } from "@/lib/email-function";
import logger from "@/lib/logs";
import { NextResponse } from "next/server";




export async function POST(req :  Request){
    try {

        const body = await req.json();
        const {name , domain , phoneNumber , message } = body;

        if(!name || !domain || !phoneNumber || !message){
            return NextResponse.json({message : "All fileds are required...!"}, {status : 400});
        }

        const result = await schduleEmail(name , domain , phoneNumber , message);

 

        if(!result.success){
            return NextResponse.json({message : "Server side issue try after sometime..!"} , {status : 500})
        }


        return NextResponse.json({message : "Demo request email sent successfully"} , {status : 200});


    } catch (error) {


        logger.error({
            message: "Fail to send email",
            file: "app/api/email/schedule/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });


        return NextResponse.json({message : "Fail to send email"} , {status : 500})
        
    }
}