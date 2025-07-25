import jwt from 'jsonwebtoken';


export const generateAccessToken = (payload) => {
   try {
     return jwt.sign(payload, process.env.ACCESS_SECRET, {
         expiresIn: process.env.ACCESS_TOKEN_EXPIRY
     });
   } catch (error) {
     console.error("Error generating access token:", error);
     throw new Error("Token generation failed");
    
   }
}

export const generateRefreshToken = (payload) => {
   try {
       return jwt.sign(payload, process.env.REFRESH_SECRET, {
           expiresIn: process.env.REFRESH_TOKEN_EXPIRY
       });
   } catch (error) {
       console.error("Error generating refresh token:", error);
       throw new Error("Token generation failed");
   }
}

export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.ACCESS_SECRET);
    } catch (error) {
        return null;
    }
}

export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.REFRESH_SECRET);
    } catch (error) {
        return null;
    }
}
