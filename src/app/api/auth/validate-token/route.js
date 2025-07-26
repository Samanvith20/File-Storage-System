import { NextResponse } from "next/server";
import { verifyAccessToken } from "../../lib/auth"



export async function POST(req) {
    const { accessToken } = await req.json()

    try {
        // need to check it is valid (or) not
      const user = verifyAccessToken(accessToken)
        if (!user || !user.id) {
            return NextResponse.json({  valid: false, message: 'Invalid or expired token' }, { status: 401 });
        }
        return NextResponse.json({   valid: true, message: 'Token is valid', user }, { status: 200 });
    } catch (error) {
        console.error("Token validation error:", error);
        return NextResponse.json({ message: 'Token validation failed' }, { status: 500 });
    }
}