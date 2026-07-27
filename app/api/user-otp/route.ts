import { GenerateOtp } from "@/lib/generateOtp";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import logger from "@/lib/logs";
 
import { whatsAppOtp } from "@/lib/whatsappOtp";




export async function POST(req: Request) {
    try {

        const body = await req.json();

        const { phoneNumber } = body;

        if (!phoneNumber) {
            return NextResponse.json({ message: "Number can not be empty" }, { status: 400 });
        }

        const userExist = await prisma.user.findFirst({
            where: {
                mobile_no: phoneNumber
            }
        });

        if (!userExist) {
            return NextResponse.json({ message: "Can't find your phone number" }, { status: 400 })
        }

        const otp = GenerateOtp();

        const whatsappResponse = await   whatsAppOtp({phoneNumber , otp , username : userExist.username});

        if(!whatsappResponse){
            return NextResponse.json({message : "Error while sending OTP"},  { status: 500 })
        }
 

        const hashedOtp = crypto.createHash("md5").update(String(otp)).digest("hex");

        await prisma.user.update({
            where: {
                username: userExist.username
            },
            data: {
                otp: hashedOtp
            }
        });

        return NextResponse.json({message : "OTP sent to registered phone number" , username : userExist.username }, {status : 200});


    } catch (error : any) {

        logger.error("Error sending otp On user side :" , error);
        return NextResponse.json({message : error.message } , {status : 500});

    }
}






