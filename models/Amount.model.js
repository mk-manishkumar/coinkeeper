import mongoose from "mongoose";

const amountSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 20,
    },
    amount: {
      type: Number,
      required: true,
      maxlength: 8,
      validate: {
        validator: (value) => value > 0,
        message: "Amount must be a positive number",
      },
    },
    expense: {
      type: String,
      required: true,
      enum: ["Savings", "Expenditure", "Investment"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Amount", amountSchema);
