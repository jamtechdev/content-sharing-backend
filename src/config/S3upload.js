const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { exec } = require("child_process");
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

    if (folder === "videos") {
      const lessonId = uuidv4();
      const videoPath = filePath;
      const outputPath = path.join(__dirname, `../uploads/videos/${lessonId}`);

      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }

      const resolutions = [
        { name: "480p", width: 854, height: 480 },
        { name: "720p", width: 1280, height: 720 },
        { name: "1080p", width: 1920, height: 1080 },
      ];

      for (const res of resolutions) {
        const command = `ffmpeg -i "${videoPath}" -c:v libx264 -preset veryfast -crf 23 -b:v 1500k \
          -c:a aac -b:a 128k -vf "scale=${res.width}:${res.height}" -f hls \
          -hls_time 10 -hls_segment_type mpegts -hls_playlist_type vod \
          -hls_list_size 0 -hls_segment_filename "${outputPath}/${res.name}_%03d.ts" \
          "${outputPath}/${res.name}.m3u8"`;

        await new Promise((resolve, reject) => {
          exec(command, (error) => {
            if (error) {
              console.error(`FFmpeg error: ${error.message}`);
              return reject(error);
            } else {
              resolve();
            }
          });
        });
      }

      const uploadVideoS3 = async (filePath, key) => {
        try {
          const fileContent = fs.readFileSync(filePath);
          const contentType = filePath.endsWith(".m3u8")
            ? "application/vnd.apple.mpegurl"
            : "video/MP2T";

          const params = {
            Bucket: process.env.S3_BUCKET_NAME_SECOND,
            Key: key,
            Body: fileContent,
            ContentType: contentType,
          };

          const command = new PutObjectCommand(params);
          await s3.send(command); // Correct method in AWS SDK v3

          fs.unlinkSync(filePath); // Delete local file after upload
          fs.unlinkSync('/public/uploads/videos'); // Delete the m3u8 file
          console.log(`Uploaded ${filePath} to S3 successfully.`);
        } catch (err) {
          console.error(`Upload failed for ${filePath}:`, err);
        }
      };

      const hlsFiles = fs.readdirSync(outputPath);
      for (const file of hlsFiles) {
        const filePath = path.join(outputPath, file);
        const key = `videos/${lessonId}/${file}`;
        await uploadVideoS3(filePath, key);
      }

      fs.unlinkSync(videoPath); // Delete the original video
      fs.rmdirSync(outputPath, { recursive: true });

      return {
        message: "Video converted and uploaded to S3",
        resourceType: "video",
        secureUrl: [
          {
            "480p": `${process.env.CLOUD_FRONT_URL}/videos/${lessonId}/480p.m3u8`,
            "720p": `${process.env.CLOUD_FRONT_URL}/videos/${lessonId}/720p.m3u8`,
            "1080p": `${process.env.CLOUD_FRONT_URL}/videos/${lessonId}/1080p.m3u8`,
          },
        ],
      };
    } else {
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
        secureUrl: [
          {
            url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`,
          },
        ],
        resourceType: contentType.startsWith("image") ? "image" : "video",
      };
    }
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("S3 upload failed");
  } finally {
    try {
      if(filePath && fs.existsSync(filePath)){
        fs.unlinkSync(filePath);
        console.log("Deleted original file:", filePath);
      }
      if(outputPath && outputPath.fs.existsSync(outputPath)){
        console.log("output path", outputPath)
        fs.rmdirSync(outputPath, {recursive: true});
        console.log("Deleted output folder:", outputPath);
      }
    } catch (cleanupError) {
      console.error("Error during cleanup:", cleanupError);
    }
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
    ".m3u8": "application/vnd.apple.mpegurl",
    ".ts": "video/MP2T",
  };
  return mimeTypes[ext] || "application/octet-stream";
};

module.exports = { uploadToS3 };
