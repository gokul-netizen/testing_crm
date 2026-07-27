'use server';
import { cookies } from 'next/headers'

export async function deleteAdminSession(){
  const cookieStore = await cookies();
  cookieStore.delete("authtoken");
}




 
