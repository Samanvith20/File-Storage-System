import { NextResponse } from "next/server";

import s3 from "../../lib/s3";
import { connectDB } from "../../lib/db";
import { authenticate } from "../../middleware.js/verifyToken";
import File from "../../model/file.model";

export async function POST(req) {
  try {
    const user = await authenticate(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const files = formData.getAll("file");

    if (!files || files.length === 0) {
      return NextResponse.json(
        { message: "No files uploaded" },
        { status: 400 }
      );
    }

    await connectDB();

    const uploadedFiles = [];

    for (const file of files) {
      if (typeof file === "string") continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const mimeCategory = file.type.split("/")[0]; // 'image', 'application', etc.
      const mimeSubType = file.type.split("/")[1]; // 'png', 'pdf', etc.
      const key = `${user.name}/${mimeCategory}/${mimeSubType}/${file.name}`;

      const uploadResult = await s3
        .upload({
          Bucket: process.env.MY_BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: file.type,
          // ACL: 'public-read',
        })
        .promise();
      console.log("Upload Result:", uploadResult);

      const savedFile = await File.create({
        filename: file.name,
        url: uploadResult.Location,
        size: file.size,
        contentType: file.type,
        user: user._id,
        s3Key: key,
      });

      uploadedFiles.push(savedFile);
    }

    return NextResponse.json(
      {
        message: "Files uploaded successfully",
        files: uploadedFiles,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      {
        status: 500,
      }
    );
  }
}
