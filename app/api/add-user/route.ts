import getSession from "@/lib/jwt";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getCurrentUTCFromIST } from "@/lib/date-time";
import { uploadFile } from "@/lib/uploadFile";
import logger from "@/lib/logs";

export async function POST(req: Request) {
  const userId = await getSession();

  if (!userId) return NextResponse.json({ message: "Unauth" }, { status: 401 });

  const Id = userId?.id;

  try {
    const data = await req.formData();

    const imageFile = data.get("image") as Blob | null;

    let imagePath = "";

    if (imageFile) {
      imagePath = await uploadFile(imageFile);
    }

    const body = {
      roleId: data.get("roleId") as string,
      name: data.get("name") as string,
      password: data.get("password") as string,
      email: data.get("email") as string,
      userName: data.get("userName") as string,
      mobile_no: data.get("mobile_no") as string,
      status: data.get("status") as string,
      emailTriggerOption: data.get("emailTriggerOption") as string,
      domain: data.get("domains"),
      joining_date: data.get("joining_date") as string,


    };

    const { roleId, name, password, email, userName, mobile_no, status, domain, joining_date, emailTriggerOption } = body;

    if (!roleId || !name || !password || !email || !userName || !mobile_no || !domain || !joining_date) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const exists = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username: userName },
        ],
      },
    });

    if (exists) return NextResponse.json({ message: "User already exists!" }, { status: 400 });

    const hash = crypto.createHash("md5").update(password).digest("hex");

    const user = await prisma.user.create({
      data: {
        role_id: Number(roleId),
        name,
        password: hash,
        show_password: password,
        email,
        username: userName,
        mobile_no,
        user_image: imagePath,
        status,
        added_on: getCurrentUTCFromIST(),
        added_by: String(Id),
        type: "AdminUser",
        joining_date: new Date(joining_date),
        domain: Number(domain),
        emailTriggerOption: emailTriggerOption,
      }
    });

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });

  } catch (error: any) {
    logger.error(error.message, "Something went wrong when creating the main user");
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}


export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        domain: true,
        status: true,
        added_on: true,
        inquiryDomain: {
          select: {
            id: true,
            domainName: true,
          },
        },
      },
      orderBy: { added_on: "desc" },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("an error occurred", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function PATCH(req: Request) {

  try {
    const body = await req.json();
    const { ids, status } = body;

    if (Array.isArray(ids) && ids.length === 0) {
      return NextResponse.json({ error: "Ids must be an array and not null" }, { status: 400 })
    }

    if (!["Active", "Blocked"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    await prisma.user.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        status
      }
    });

    return NextResponse.json({ message: "Status updated successfully" }, { status: 200 })

  } catch (error) {
    console.error("Error while updating user status");
    return NextResponse.json({ error: error }, { status: 500 })
  }

}