import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export default async function getSession() {
  const cookieStore = await cookies();  
  const token = cookieStore.get("authtoken")?.value;
  if (!token) return null;

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");

  const secret = new TextEncoder().encode(JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload;  
}

export  async function subUserSession() {
  const cookieStore = await cookies();  
  const token = cookieStore.get("subUserToken")?.value;
  if (!token) return null;

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");

  const secret = new TextEncoder().encode(JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload;  
}


export  async function userSession() {
  const cookieStore = await cookies();  
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");

  const secret = new TextEncoder().encode(JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload;  
}