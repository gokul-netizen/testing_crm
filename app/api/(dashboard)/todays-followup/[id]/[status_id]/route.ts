import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface ParamsPros {
    params: Promise<{ id: string, status_id: string }>;
}

export async function GET(req: Request, { params }: ParamsPros) {
    try {

        const { status_id } = await params;

        const status = await prisma.followup.findUnique({
            where: {
                id: Number(status_id),
            },

        });
        return NextResponse.json({ data: status, message: "Returned the data successfully" }, { status: 200 });

    } catch (error: any) {
        logger.error({ error: error.message }, "Error occured when retriving followup status");
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: ParamsPros) {
    try {

        const { status_id, id } = await params;

        const body = await req.json();
        const { status, date, time, remarks, assignId, assignName } = body;

         

        const existing = await prisma.domainResponse.findUnique({
            where: { id: Number(id) }
        });

        const updatedBody = existing?.response.body.map((item: any) => {
            if (item.key === "Date") {
                return { ...item, value: date };
            }

            if (item.key === "Time") {
                return { ...item, value: time };
            }

            if (item.key === "Remarks") {
                return { ...item, value: remarks };
            }

            if (item.key === "Follow Up") {
                return { ...item, value: status };
            }

            if (item.key === "AssignName") {
                return { ...item, value: assignName };
            }

            return item;

        });

        if (assignId & assignName) {

            await prisma.domainResponse.update({
                where: { id: Number(id) },
                data: {
                    assignId: assignId,
                    followUpStatus: status,
                    response: {
                        body: updatedBody
                    }
                }
            });

            await prisma.followup.update({
                where: { id: Number(status_id) },
                data: {
                    followUpStatus: status,
                    date: date,
                    time: time,
                    remarks: remarks,
                    assignTo: assignId,
                    assignToName: assignName,

                }
            });

        }

        await prisma.domainResponse.update({
            where: { id: Number(id) },
            data: {
                followUpStatus: status,
                response: {
                    body: updatedBody
                }
            }
        });

        await prisma.followup.update({
            where: { id: Number(status_id) },
            data: {
                followUpStatus: status,
                date: date,
                time: time,
                remarks: remarks,
            }
        });

        return NextResponse.json({ data: status, message: "Data updated successfully" }, { status: 200 });

    } catch (error: any) {
        logger.error({ error: error.message }, "Error occured when updating followup status");
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}