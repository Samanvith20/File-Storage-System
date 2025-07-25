import User from "../model/user.model";
import bcrypt from "bcryptjs";
import { connectDB } from "./db";


export const createUser=async(email,password,name,age)=>{
  console.log(email,password,name,age)
    try {
        await connectDB()
        const hashed=await bcrypt.hash(password,10);
        const user=new User({
            email:email.trim().toLowerCase(),
            password:hashed,
            name: name.trim().toLowerCase() || email.split("@")[0].toLowerCase(),
            age: age || 0
        });
        const result=await user.save();
        return result;
    } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("User creation failed");
        
    }

}

export const findUserByEmail=async(email)=>{
  console.log("Finding user by email:", email);
   try {
     await connectDB()
     const user=await User.findOne({
         email: email.toLowerCase()
     });
     console.log("User found:", user);
     return user;
   } catch (error) {
     console.error("Error finding user by email:", error);
     throw new Error("User not found");
    
   }
}

export const findUserById=async(id)=>{
    try {
        await connectDB()
        const user=await User.findById(id);
        return user;
    } catch (error) {
        console.error("Error finding user by ID:", error);
        throw new Error("User not found");
    }
}


export const validatePassword=async(password,hashedPassword)=>{
   try {
     await connectDB()
     const isValid=await bcrypt.compare(password,hashedPassword);
     return isValid;
   } catch (error) {
     console.error("Error validating password:", error);
     throw new Error("Password validation failed");
   }
}

