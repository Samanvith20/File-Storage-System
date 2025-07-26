import { verifyAccessToken } from "../lib/auth";
import { connectDB } from "../lib/db";
import User from "../model/user.model";


export async function authenticate(request) {
  await connectDB();

  const authHeader = request.headers.get('authorization');
  

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyAccessToken(token);

  if (!decoded || !decoded.id) {
    return null;
  }

  // Optionally fetch full user object (recommended)
  const user = await User.findById(decoded.id).select('-password');

  return user || null;
}
