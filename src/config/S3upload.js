const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// AWS S3 Configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION, // e.g., "us-east-1"
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3 = async (filePath, fileName) => {
  try {
    // Remove spaces from filename and replace with underscores
    const sanitizedFileName = fileName.replace(/\s+/g, "_");

    const fileStream = fs.createReadStream(filePath);
    const fileExt = path.extname(filePath).toLowerCase();
    const contentType = getContentType(fileExt);

    // Determine folder based on file type
    const folder = contentType.startsWith("image") ? "images" : "videos";
    const s3Key = `${folder}/${sanitizedFileName}`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key,
      Body: fileStream,
      ContentType: contentType,
      ACL: "private",
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    // Delete the file after upload
    fs.unlinkSync(filePath);

    return {
      secureUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`,
      resourceType: contentType.startsWith("image") ? "image" : "video",
    };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("S3 upload failed");
  }
};

// Function to determine Content-Type based on file extension
const getContentType = (ext) => {
  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
  };
  return mimeTypes[ext] || "application/octet-stream";
};

module.exports = { uploadToS3 };
