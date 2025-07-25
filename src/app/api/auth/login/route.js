import * as cookie from 'cookie';

import { findUserByEmail, validatePassword } from '../../lib/user';
import { generateAccessToken, generateRefreshToken } from '../../lib/auth';


export  async function POST(req) {
  try {
    // here req.body() is not used, instead we use req.json() to parse the request body
    const { email, password } =  await req.json()
    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    console.log('Login attempt:', { email, password });
    // Find user by email and validate password
    const user = await findUserByEmail(email);
    if (!user || !(await validatePassword(password, user.password))) {
     return new Response(JSON.stringify({ message: 'Invalid email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
        });
    }
  
    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

    const serializedCookie = cookie.serialize('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return new Response(JSON.stringify({ accessToken }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': serializedCookie,
      },
    });
     
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
