import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  const token = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const publicPaths = (path === "/" || path === "/pp");

  if (publicPaths && token) {
    //return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }
  if (!publicPaths && !token) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
 
}

export const config = {
    matcher: [
        "/",
        "/nueva",
        "/ordenes",
        "/usuarios",
        "/"
    ]
};