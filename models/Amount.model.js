import mongoose from "mongoose";
import User from "./user.model.js";

const amountSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 25,
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

// Pre-save hook to update Amount's user field
amountSchema.pre("save", async function (next) {
  try {
    if (this.user) {
      await User.findByIdAndUpdate(this.user, { $push: { amounts: this._id } });
    }
    next();
  } catch (error) {
    console.error("Error in pre-save hook:", error);
    next(error);
  }
});

// Post-delete hook to remove reference from user's amounts array
amountSchema.post("findOneAndDelete", async function (doc, next) {
  try {
    if (doc && doc.user) {
      await User.findByIdAndUpdate(doc.user, { $pull: { amounts: doc._id } });
    }
    next();
  } catch (error) {
    console.error("Error in post-delete hook:", error);
    next(error); // Pass the error to the next middleware
  }
});

export default mongoose.model("Amount", amountSchema);
