import { getCurrentUTCFromIST } from "@/lib/date-time";
import { userSession } from "@/lib/jwt";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";

dayjs.extend(utc);
dayjs.extend(timezone);

interface UserId {
    domainId: string;
}

export async function GET(req: Request, { params }: { params: Promise<UserId> }) {
    try {

        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.userType;

        const { domainId } = await params;



        const inquiry = await prisma.DomainResponse.findMany({
            where: {
                domain_id: Number(domainId),
                status: 1,
                OR: [
                    { assignId: userId },
                    { addedBy: String(userId) }
                ]

            },
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                name: true,
                companyName: true,
                phone: true,
                service: true,
                createdAt: true,
                followUpStatus: true,
                domain_id: true,

                followups: {

                    orderBy: { createdAt: "desc" },
                    take: 1,
                    select: {
                        date: true,
                        time: true,
                        remarks: true,
                        createdAt: true,
                        assignToName: true,
                        followUpStatus: true,
                        isPublic: true,
                        addedBy: true,
                    }
                }
            },
        })

        return NextResponse.json(inquiry);
    } catch (error: any) {
         logger.error({
            
            message: "Fail to get inquiries",
            file: "api/sub-user/inquiry/view/[domainId]/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}


export async function POST(req: Request, { params }: { params: Promise<UserId> }) {

    try {

        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.userType;
        const username = decoded?.username;

        const { domainId } = await params;


        const domain = await prisma.inquiryDomain.findUnique({
            where: { id: Number(domainId) },
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

        const { companyname, name, email, website, phone, secondaryphonenumber, source, service, followup, date, time, remarks, assign, assigntype, assignname, ispublic, reminder, contactmode, address, clientaddress } = normalizedData;


        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
        const device = req.headers.get("user-agent") || "unknown";
        const parser = new UAParser(device);
        const resultDevice = parser.getResult();
        const deviceType = resultDevice.device.type || 'Desktop';


        const isFollowUp = followup.includes("Follow Up") || followup.includes("Not Interested") || followup.includes("Closed") || followup.includes("Assign To");

        let assignToName = null;
        let assignId = null;
        let assignType = null;
        let assignFrom = null;

        if (assign && assigntype && assignname) {
            assignId = Number(assign);
            assignToName = assignname;
            assignType = assigntype;
            assignFrom = Number(userId);
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
                address : clientaddress,
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
                            addedBy: Number(userId),
                            followUpStatus: followup.join(", "),
                            createdAt: getCurrentUTCFromIST(),
                            assignFrom: assignFrom,
                            assignTo: assignId,
                            assignToName: assignToName,
                            type: assignType,
                            isPublic: ispublic,
                            reminder: reminder,
                            contact_mode: contactmode,
                            address
                        },
                    }
                    : undefined,
            },
        });

        return NextResponse.json({ message: "Created successfully" }, { status: 200 });

    } catch (error: any) {
        logger.error({
            
            message: "Fail to add new inquiry",
            file: "api/sub-user/inquiry/view/[domainId]/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}