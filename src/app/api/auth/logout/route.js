

import { NextResponse } from "next/server";
import * as cookie from "cookie";

export async function POST() {
  const expiredCookie = cookie.serialize("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0), // expires immediately
    sameSite: "lax",
  });

  return new Response(JSON.stringify({ message: "Logged out successfully" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": expiredCookie,
    },
  });
}
