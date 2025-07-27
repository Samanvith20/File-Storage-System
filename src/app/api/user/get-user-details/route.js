import { verifyRefreshToken } from "../../lib/auth";

import * as cookie from 'cookie';
import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import User from "../../model/user.model";

export async function GET(req) {

    await connectDB();
    // check user has refresh token 
    const cookieHeader = req.headers.get('cookie') || '';
    const { refreshToken } = cookie.parse(cookieHeader);
    if (!refreshToken) {
        return NextResponse.json({ message: 'Refresh token is required' }, { status: 401 });
    }
    if (!refreshToken) {
            return new Response(JSON.stringify({ message: 'Refresh token is required' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
            }
        const payload = verifyRefreshToken(refreshToken);
      
        if (!payload) {
            return new Response(JSON.stringify({ message: 'Invalid refresh token' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' }
            });
        }
        console.log("Payload from refresh token:", payload);
        const user=await User.findById(payload.id).select("-password -__v");
        console.log("User from payload:", user);
        if (!user || user.length === null || user.length === 0) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        // Return user details
        return NextResponse.json({ user: user }, { status: 200 });


}