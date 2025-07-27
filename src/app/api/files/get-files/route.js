import File from "../../model/file.model";

const { NextResponse } = require("next/server");
const { authenticate } = require("../../middleware.js/verifyToken");

export async function GET(req) {
  // Authenticate the user
  const user = await authenticate(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const userFiles = await File.find({ user: user._id })
      .select("-user -__v")
      .sort({ createdAt: -1 });
    if (!userFiles || userFiles.length === 0) {
      return NextResponse.json(
        { message: "No files found for this user" },
        { status: 404 }
      );
    }
    return NextResponse.json({ userFiles }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user files:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
