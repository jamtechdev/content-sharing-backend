const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require('path')

module.exports.cloudinaryImageUpload = async (filepath, contentType) => {

  // if (!filepath) {
  //   throw new Error("No file path provided to cloudinaryImageUpload.");
  // }
    const fileExtension = path.extname(filepath).toLowerCase();
    const resourceType = fileExtension === '.mp4' || fileExtension === '.mov' ? 'video' : 'image';
  try {
    // Read the file as a buffer
    const byteArrayBuffer = fs.readFileSync(filepath);

    // Upload the buffer to Cloudinary using upload_stream
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: resourceType, folder: "uploads" },
        (error, uploadResult) => {
          if (error) {
            console.error(`Error uploading ${resourceType} to Cloudinary:`, error);
            return reject(new Error(`Error uploading ${resourceType} to Cloudinary`));
          }
          resolve(uploadResult);
        }
      );
      stream.end(byteArrayBuffer);
    });

    console.log(`Buffer upload_stream with promise success - ${result.public_id}`);

    // Delete the file after a successful upload
    fs.unlink(filepath, (unlinkError) => {
      if (unlinkError) {
        console.error(`Error deleting file ${filepath}:`, unlinkError);
      } else {
        console.log(`File ${filepath} deleted successfully.`);
      }
    });

    return {secureUrl: result.secure_url, resourceType:result.resource_type};
    // return result.secure_url;
  } catch (error) {
    console.error("Error in cloudinaryImageUpload:", error.message);

    // Attempt to delete the file if it exists
    if (filepath) {
      fs.unlink(filepath, (unlinkError) => {
        if (unlinkError) {
          console.error(`Error deleting file ${filepath}:`, unlinkError);
        } else {
          console.log(`File ${filepath} deleted after upload failure.`);
        }
      });
    }
    // throw error;
  }
};
