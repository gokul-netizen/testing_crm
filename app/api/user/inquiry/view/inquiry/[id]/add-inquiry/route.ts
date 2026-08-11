import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import logger from "@/lib/logs";
import { getCurrentUTCFromIST } from "@/lib/date-time";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { UAParser } from "ua-parser-js";
import { userSession } from "@/lib/jwt";


dayjs.extend(utc);
dayjs.extend(timezone);




interface ParamsProps {
    params: Promise<{ id: string, }>;
}



export async function POST(req: Request, { params }: ParamsProps) {

    try {

        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.userType;
        const username = decoded?.username;

   
        const { id } = await params;
        const domainId = Number(id);

        const domain = await prisma.inquiryDomain.findUnique({
            where: { id: domainId },
        });

        if (!domain) {
            return NextResponse.json({ error: "Domain not found" }, { status: 404 });
        }

        const rawBody = await req.json();

        const normalizedData: Record<string, any> = {};
        Object.entries(rawBody).forEach(([key, value]) => {
            const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
            normalizedData[cleanKey] = value;
        });

        const { companyname, name, email, website, phone, secondaryphonenumber, source, service, followup, date, time, remarks, ispublic, assignid, assignname, assigntype } = normalizedData;

        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
        const device = req.headers.get("user-agent") || "unknown";
        const parser = new UAParser(device);
        const resultDevice = parser.getResult();
        const deviceType = resultDevice.device.type || 'Desktop';

        const isFollowUp = followup.includes("Follow Up") || followup.includes("Not Interested") || followup.includes("Closed") || followup.includes("Assign To");

        let assignToName = null;
        let assignId: number | null = null;
        let assignType = null;
        let assignFrom = null;


        if (assignid && assignname && assigntype) {
            assignId = assignid;
            assignToName = assignname;
            assignType = assigntype;
            assignFrom = userId;
        }


        const formattedBody = [
            ...Object.entries(rawBody).map(([key, value]) => {
                if (["AssignId", "AssignType"].includes(key)) { return null; }

                if (key === "Assign") {
                    return {
                        key,
                        value: assignToName || String(value),
                    };
                }

                return {
                    key,
                    value: String(value),
                };
            }).filter(Boolean),
            { key: "IP Address", value: ip },
            { key: "Device Type", value: deviceType },
            { key: "Added By", value: username },
            { key: "Added On", value: dayjs().tz("Asia/Kolkata").format("DD-MM-YYYY hh:mm:ss A") }
        ];


        await prisma.domainResponse.create({
            data: {
                domain_id: domain.id,
                companyName: companyname,
                website: website,
                name: name || null,
                email: email || null,
                phone: phone || null,
                phoneSecondary: secondaryphonenumber || null,
                addedBy: String(userId),
                source: source.join(", "),
                service: service.join(", "),
                followUpStatus: followup.join(", "),
                assignId: assignId,
                addedType: "User",
                response: {
                    body: formattedBody,
                    Domain_Name: domain.domainName,
                },
                createdAt: getCurrentUTCFromIST(),
                followups: isFollowUp
                    ? {
                        create: {
                            date,
                            time,
                            remarks,
                            followUpStatus: followup.join(", "),
                            addedBy: userId,
                            type: assignType,
                            isPublic: ispublic,
                            assignFrom: assignFrom,
                            assignTo: assignId,
                            assignToName: assignToName,
                            createdAt: getCurrentUTCFromIST(),
                        },
                    }
                    : undefined,
            },
        });

        return NextResponse.json({ message: "Created successfully" }, { status: 200 });
    } catch (error: any) {

         logger.error({

            message: "Fail to add inquiry",
            file: "api/user/inquiry/view/inquiry/[id]/add-inquiry/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
