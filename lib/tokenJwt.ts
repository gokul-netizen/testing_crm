'use server';

import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";


interface AdminProps {

    id: number | string;
    username: string;

}

interface UserProps {

    id: number | string;
    username: string;
    userType: string;
    image: string;

}

const JWT_SECRET = process.env.JWT_SECRET;
const secret = new TextEncoder().encode(JWT_SECRET);

export async function GenerateToken({ id, username }: AdminProps) {

    const token = await new SignJWT({ id: id, username: username }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("30d").sign(secret);

    return token;

}

export async function GenerateTokenUser({ id, username, userType, image }: UserProps) {

    const token = await new SignJWT({ id: id, username: username, userType: userType, image: image }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("30d").sign(secret);

    return token;

}


export async function VerifyAdminToken() {

    try {

        const cookieStore = await cookies();
        const token = cookieStore.get('authtoken')?.value;

        if (!token) {
            throw new Error("User is not authenticated");
        }

       const decoded = await jwtVerify(token, secret);
        return decoded;

    } catch (error) {

        console.log(error);

    }
}


export async function deleteUserSession(){
  const cookieStore = await cookies();
  cookieStore.delete("token");
}






