'use server'
import { cookies } from 'next/headers'

export default async function getSession() {
  const cookieStore = await cookies();
  const theme = cookieStore.get('token');
  if(theme){
    return true;
  }
}


export async function deleteSession(){
  const cookieStore = await cookies();
  cookieStore.delete("authtoken");
}