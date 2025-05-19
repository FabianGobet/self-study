import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { dbLogger } from "../loggers/logger.js";
import { ApiError } from "./ApiError.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const resp = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });
    dbLogger.info(`File uploaded to Cloudinary: ${resp.secure_url}`);
    fs.unlinkSync(localFilePath);
    return resp;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    dbLogger.error(`Error uploading file to Cloudinary: ${error}`);
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const resp = await cloudinary.uploader.destroy(publicId);
    dbLogger.info(`File deleted from Cloudinary: ${resp}`);
    return resp;
  } catch (error) {
    dbLogger.error(`Error deleting file from Cloudinary: ${error}`);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
