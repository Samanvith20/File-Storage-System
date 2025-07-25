import { verifyAccessToken } from "../lib/auth";




export const authenticate = (handler) => (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  const user = verifyAccessToken(token);

  if (!user) return res.status(403).json({ message: 'Invalid or expired token' });

  req.user = user;
  return handler(req, res);
};
