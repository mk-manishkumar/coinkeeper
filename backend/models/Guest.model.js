import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    name: { type: String, default: "Guest User" },
    password: { type: String, required: true },
    amounts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Amount" }], 
    createdAt: { type: Date, default: Date.now, expires: "10m" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Guest", guestSchema);