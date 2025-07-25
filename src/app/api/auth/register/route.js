import { createUser, findUserByEmail } from "../../lib/user";



export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, name, age } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ message: "Email and password are required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists." }), {
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }

    const user = await createUser(email, password, name, age);
    return new Response(JSON.stringify({
      message: "User registered successfully.",
      userId: user._id
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Registration error:", error);
    return new Response(JSON.stringify({ message: "Internal server error." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}