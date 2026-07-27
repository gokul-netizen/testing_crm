import { GenerateOtp } from "@/lib/generateOtp";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import logger from "@/lib/logs";
import { whatsAppOtp } from "@/lib/whatsappOtp";
 
 


export async function POST(req : Request){
    try {

    const body = await req.json();
    const {phone} = body;

    if(!phone){
        return NextResponse.json({message : "Phone can not be null"} , {status : 400});
    }

    const isExist = await prisma.admin.findUnique({
        where : {
            phoneNumber : phone
        }
    });

    if(!isExist){
        return NextResponse.json({message : "Can't find your phone number"}, {status : 400})
    }

    const otp = GenerateOtp();

    const whatsappResponse = whatsAppOtp({phoneNumber : phone , otp , username : isExist.username});

    if(!whatsappResponse){
        return NextResponse.json({message : "Error while sending OTP"},  { status: 500 })
    }

    
    const hashedOtp = crypto.createHash("md5").update(String(otp)).digest("hex");

    await prisma.admin.update({
        where : {
             phoneNumber : phone
        },
        data : {
            otp : hashedOtp
        }
    });

    return NextResponse.json({message : "OTP sent to registered phone number" , username : isExist.username }, {status : 200});

        
    } catch (error : any) {

        logger.error("Error sending otp :" , error);
        return NextResponse.json({message : error.message } , {status : 500});

    }
}