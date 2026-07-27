'use server'

import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

interface SessionUser {
  id: string
  username: string
  image : string;
  userType : string;
}


export default async function getUserSession(): Promise<{ user: SessionUser } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value 

  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as SessionUser

    return {
      user: {
        id: decoded.id,
        username: decoded.username,
        image : decoded.image,
        userType : decoded.userType
      },
    }
  } catch {
    return null
  }
}

export  async function getSubUserSession(): Promise<{ user: SessionUser } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('subUserToken')?.value 

  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as SessionUser

    return {
      user: {
        id: decoded.id,
        username: decoded.username,
        image : decoded.image,
        userType : decoded.userType
      },
    }
  } catch {
    return null
  }
}

export  async function getAdminSession(): Promise<{ user: SessionUser } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('authtoken')?.value 

  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as SessionUser

    return {
      user: {
        id: decoded.id,
        username: decoded.username,
        image : decoded.image,
        userType : decoded.userType
      },
    }
  } catch {
    return null
  }
}
