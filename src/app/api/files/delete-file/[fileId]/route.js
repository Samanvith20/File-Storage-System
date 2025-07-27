import { NextResponse } from "next/server";

import { connectDB } from "../../../lib/db.js";

import File from "../../../model/file.model.js";

import s3 from "../../../lib/s3.js";
import { authenticate } from "../../../middleware.js/verifyToken.js";

export async function DELETE(req, { params }) {
  try {
    console.log("Delete file request received");
    const user = await authenticate(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const fileId = await params.fileId;
    console.log("File ID:", fileId);

    if (!fileId) {
      return NextResponse.json(
        { message: "File ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const file = await File.findById(fileId);
    if (!file) {
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    if (file.user.toString() !== user._id.toString()) {
      return NextResponse.json(
        { message: "Forbidden: Not your file" },
        { status: 403 }
      );
    }

    await s3
      .deleteObject({
        Bucket: process.env.MY_BUCKET_NAME,
        Key: file.s3Key,
      })
      .promise();

    await File.findByIdAndDelete(fileId);

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
}
