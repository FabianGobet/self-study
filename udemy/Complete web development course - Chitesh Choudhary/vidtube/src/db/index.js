import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { dbLogger } from "../loggers/logger.js"; // Import dbLogger

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    // Use dbLogger for info
    dbLogger.info(
      `MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    // Use dbLogger for error
    dbLogger.fatal("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDB;
