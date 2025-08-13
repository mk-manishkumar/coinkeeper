import mongoose from "mongoose";
import { devLog } from "../utils/consoleLogHelper.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "Coinkeeper",
    });

    console.log(`MongoDB Connected`);
  } catch (err) {
    devLog(`Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
