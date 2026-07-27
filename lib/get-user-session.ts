import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function Session() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    try {
       
        const { payload } = await jwtVerify(token, JWT_SECRET);
        
       
        return payload; 
    } catch (error) {
        console.error("JWT Verification failed:", error);
        return null;
    }
}