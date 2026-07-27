import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;
  const adminToken = request.cookies.get('authtoken')?.value;
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  if (pathname === "/admin" && adminToken) {
    try {
      await jwtVerify(adminToken, secret);
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } catch (error) {
      const response = NextResponse.redirect(new URL("/admin", request.url));
      response.cookies.delete('authtoken');
      return response;
    }
  }

  if (pathname.startsWith("/admin/dashboard")) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    try {
      await jwtVerify(adminToken, secret);
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL("/admin", request.url));
      response.cookies.delete("authtoken");
      return response;
    }
  }

  // Admin user side middleware.

  if (pathname.startsWith('/user')) {

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }


  if (token) {

    try {
      const { payload } = await jwtVerify(token, secret);
      if (payload.userType === 'AdminUser') {
        return NextResponse.redirect(new URL(`/user`, request.url));
      }
    } catch {
      const response = NextResponse.next();
      response.cookies.delete('token');
      return response;
    }
  }


  // User side
  if (pathname.startsWith("/sub-user")) {

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      if (payload.userType === 'User') {
        return NextResponse.redirect(new URL(`/sub-user`, request.url));
      }
    } catch {
      const response = NextResponse.next();
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {

  matcher: [ '/', '/admin', '/admin/:path*', '/user' , '/sub-user' , '/login'],

};