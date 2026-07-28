import { getCurrentUTCFromIST } from "@/lib/date-time";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { UAParser } from "ua-parser-js"
import getSession, { userSession } from "@/lib/jwt";

dayjs.extend(utc);
dayjs.extend(timezone);

interface ParamsPros {
    params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: ParamsPros) {
    try {

        const session = await getSession();
        if (!session) return NextResponse.json({ message: "Unauth" }, { status: 401 });
        const adminName = session?.username;
        const adminId = session?.id;


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

        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
        const device = req.headers.get("user-agent") || "unknown";
        const parser = new UAParser(device);
        const resultDevice = parser.getResult();
        const deviceType = resultDevice.device.type || 'Desktop';

        const formattedBody = [
            ...Object.entries(rawBody).map(([key, value]) => ({
                key: key,
                value: String(value),
            })),
            { key: "IP Address", value: ip },
            { key: "Device Type", value: deviceType },
            { key: "Added By", value: adminName },
            { key: "Added On", value: dayjs().tz("Asia/Kolkata").format("DD-MM-YYYY  hh:mm:ss A") },
        ];

        const { name, email, phone, source, followup, date, time, remarks } = normalizedData;

        const isFollowUP = Array.isArray(followup) ? followup.includes("Follow Up") : followup === "Follow Up";


        const result = await prisma.domainResponse.create({
            data: {
                domain_id: domain.id,
                name: name || null,
                email: email || null,
                phone: phone || null,
                addedBy: String(adminId),
                source: source.join(", "),
                followUpStatus: followup.join(", "),
                response: {
                    body: formattedBody,
                    Domain_Name: domain.domainName,
                },
                createdAt: getCurrentUTCFromIST(),
                followups: isFollowUP ? {
                    create: {
                        date: date,
                        time: time,
                        remarks: remarks,
                        followUpStatus: followup.join(", "),
                        createdAt: getCurrentUTCFromIST()
                    }

                } : undefined

            },
        });

        logger.info({ id: result.id }, "Inquiry saved with normalization");

        return NextResponse.json({ message: "Created successfully" }, { status: 200 });
    } catch (error: any) {
        logger.error(error, "Error processing inquiry");
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: ParamsPros) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ message: "Unauth" }, { status: 401 });
        const adminName = session?.username;
        const { id } = await params;
        const rawBody = await req.json();
        const normalizedData: Record<string, any> = {};

        Object.entries(rawBody).forEach(([key, value]) => {
            const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
            normalizedData[cleanKey] = value;
        });

        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
        const parser = new UAParser(req.headers.get("user-agent") || "");
        const resultDevice = parser.getResult();
        const deviceType = resultDevice.device.type || 'Desktop';

        const formattedBody = [
            ...Object.entries(rawBody).map(([key, value]) => ({
                key: key,
                value: String(value),
            })),
        ];

        const oldData = await prisma.domainResponse.findUnique({
            where: {
                id: Number(id)
            }
        })

        const { name, email, phone, addedBy, source } = normalizedData;

        const result = await prisma.domainResponse.update({
            where: {
                id: Number(id)
            },
            data: {

                name: name || null,
                email: email || null,
                phone: phone || null,
                addedBy: addedBy,
                updatedBy: adminName,
                source: source,
                updatedOn: getCurrentUTCFromIST(),
                oldData: oldData,
                response: {
                    body: formattedBody,
                },
            },
        });

        logger.info({ id: result.id }, "Inquiry updated ");

        return NextResponse.json({ message: "updated successfully" }, { status: 200 });
    } catch (error) {
        logger.error(error, "Error processing inquiry");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request, { params }: ParamsPros) {
    try {
        const { id } = await params;
        const detail = await prisma.domainResponse.findUnique({
            where: { id: Number(id) },
            select: { response: true },
        });
        return NextResponse.json(detail, { status: 200 });
    } catch (error) {
        console.error("Error when getting inquiry details", error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}




// patch method is used in both user and sub-user in upating follow up status

export async function PATCH(req: Request, { params }: ParamsPros) {
    try {
        const { id } = await params;
        const domainId = Number(id);

        const rawData = await req.json();

        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.userType;


        const normalizedData: Record<string, any> = {};
        Object.entries(rawData).forEach(([key, value]) => {
            const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
            normalizedData[cleanKey] = value;
        });

        const { followup, date, time, remarks, incentive, assignid, assignname, assigntype, ispublic, reminder, contactmode, address } = normalizedData;

     

        let assignId = null;
        let assignName = null;
        let assignType = null;

        if (assignid && assignname && assigntype) {
            assignId = assignid;
            assignName = assignname;
            assignType = assigntype;
        }

        const isFollowAction = Array.isArray(followup)
            ? followup.includes("Follow Up")
            : false;

        const notInterested = Array.isArray(followup)
            ? followup.includes("Not Interested") && typeof incentive === "string"
            : false;

        const onlyNotInterest = Array.isArray(followup)
            ? followup.includes("Not Interested")
            : false;

        const isAssignTo = Array.isArray(followup)
            ? followup.includes("Assign To")
            : false;

        const isClosed = Array.isArray(followup)
            ? followup.includes("Closed")
            : false;

        const existing = await prisma.domainResponse.findUnique({
            where: { id: domainId },
        });

        if (!existing) throw new Error("Record not found");

        const oldBody = existing.response?.body || [];

        let body: any[] = [];

        if (isFollowAction) {
            body = oldBody.map((item: { key: string; value: any }) => {
                if (item.key === "Follow Up") return { ...item, value: followup[0] };
                if (item.key === "Date") return { ...item, value: date };
                if (item.key === "Time") return { ...item, value: time };
                if (item.key === "Remarks") return { ...item, value: remarks };
                if (item.key === "Assign") return null;
                return item;
            }).filter(Boolean);



            if (!body.some((item) => item.key === "Time")) {
                body.push({ key: "Time", value: time });
            }

            if (!body.some((item) => item.key === "Date")) {
                body.push({ key: "Date", value: date });
            }
        } else if (isAssignTo) {

            body = oldBody.map((item: { key: string; value: any }) => {
                if (item.key === "Follow Up") return { ...item, value: followup[0] };
                if (item.key === "Assign") return { ...item, value: assignName };
                if (item.key === "Date") return { ...item, value: date };
                if (item.key === "Time") return { ...item, value: time };
                if (item.key === "Remarks") return { ...item, value: remarks };
                return item;
            }).filter(Boolean);

            if (!body.some((item) => item.key === "Assign")) { body.push({ key: "Assign", value: assignName }); }
            if (!body.some((item) => item.key === "Date")) { body.push({ key: "Date", value: date }); }
            if (!body.some((item) => item.key === "Time")) { body.push({ key: "Time", value: time }); }

        } else if (notInterested) {
            body = oldBody
                .map((item: { key: string; value: any }) => {
                    if (item.key === "Follow Up") return { ...item, value: followup[0] };
                    if (item.key === "Remarks") return { ...item, value: remarks };
                    if (item.key === "Incentive") return { ...item, value: incentive };
                    if (item.key === "Assign") return null;
                    if (item.key === "Time") return null;
                    if (item.key === "Date") return null;
                    return item;
                }).filter(Boolean);

            if (!body.some((item) => item.key === "Incentive")) { body.push({ key: "Incentive", value: incentive }); }

        } else if (onlyNotInterest) {
            body = oldBody
                .map((item: { key: string; value: any }) => {
                    if (item.key === "Follow Up") return { ...item, value: followup[0] };
                    if (item.key === "Remarks") return { ...item, value: remarks };
                    if (item.key === "Time") return null;
                    if (item.key === "Date") return null;
                    return item;
                }).filter(Boolean);

        } else if (isClosed) {
            body = oldBody
                .map((item: { key: string; value: any }) => {
                    if (item.key === "Follow Up") return { ...item, value: followup[0] };
                    if (item.key === "Remarks") return { ...item, value: remarks };
                    if (item.key === "Time") return null;
                    if (item.key === "Date") return null;
                    return item;
                }).filter(Boolean);

        }

        await prisma.$transaction(async (tx: any) => {

            await tx.domainResponse.update({
                where: { id: domainId },
                data: {
                    followUpStatus: followup.join(","),
                    response: { body },

                    ...(assignId && {
                        assignId: assignId,
                    }),

                    ...(isFollowAction && {
                        followups: {
                            create: {
                                date,
                                time,
                                addedBy: userId,
                                remarks,
                                reminder,
                                address,
                                contact_mode: contactmode,
                                isPublic: ispublic,
                                followUpStatus: followup.join(", "),
                                createdAt: getCurrentUTCFromIST(),
                            },
                        },
                    }),

                    ...(isClosed && {
                        followups: {
                            create: {
                                remarks,
                                addedBy: userId,
                                isPublic: ispublic,
                                followUpStatus: followup.join(", "),
                                createdAt: getCurrentUTCFromIST(),
                            },
                        },

                    }),

                    ...(onlyNotInterest && {
                        followups: {
                            create: {
                                remarks,
                                addedBy: userId,
                                isPublic: ispublic,
                                followUpStatus: followup.join(", "),
                                createdAt: getCurrentUTCFromIST(),
                            },
                        },

                    }),
                    ...(notInterested && {
                        followups: {
                            create: {
                                remarks,
                                addedBy: userId,
                                isPublic: ispublic,
                                followUpStatus: followup.join(", "),
                                createdAt: getCurrentUTCFromIST(),
                            },
                        },
                    }),

                    ...(isAssignTo && {
                        followups: {
                            create: {
                                date,
                                time,
                                remarks,
                                followUpStatus: followup.join(", "),
                                addedBy: userId,
                                type: assignType,
                                assignFrom: userId,
                                assignTo: assignId,
                                assignToName: assignName,
                                isPublic: ispublic,
                                reminder,
                                address,
                                contact_mode: contactmode,

                                createdAt: getCurrentUTCFromIST(),
                            }
                        },
                    }),
                },
            });

            if (notInterested && incentive && incentive.trim() !== "") {
                const exist = await tx.incentive.findFirst({
                    where: {
                        inquiryId: Number(domainId)
                    }
                });

                if (exist) {
                    await tx.incentive.update({
                        where: {
                            id: exist.id
                        },
                        data: {
                            incentive: incentive
                        }
                    })
                } else {
                    await tx.incentive.create({
                        data: {
                            inquiryId: Number(domainId),
                            incentive: incentive,
                            createdAt: getCurrentUTCFromIST()
                        }
                    })
                }
            }
        });

        return NextResponse.json({ message: "Follow Up Updated" });
    } catch (error) {
        logger.error(error)
        return new Response("Error", { status: 500 });
    }
}