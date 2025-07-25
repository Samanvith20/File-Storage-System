
import * as cookie from 'cookie';

import { generateAccessToken, verifyRefreshToken } from '../../lib/auth';


export  function GET(req,) {
  try {
 const cookieHeader = req.headers.get('cookie') || '';
    const { refreshToken } = cookie.parse(cookieHeader);

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
  
    const newAccessToken = generateAccessToken({ id: payload.id, email: payload.email });
    return new Response(JSON.stringify({ accessToken: newAccessToken }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
