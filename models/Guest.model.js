import mongoose from "mongoose";
import bcrypt from "bcrypt";

const guestSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  name: { type: String, default: "Guest User" },
  password: { type: String, required: true },
  amount: [{ type: mongoose.Schema.Types.ObjectId, ref: "Amount" }],
  createdAt: { type: Date, default: Date.now, expires: "10m" },
});

export default mongoose.model("Guest", guestSchema);
