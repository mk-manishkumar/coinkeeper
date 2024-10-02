import mongoose from "mongoose";
import Amount from "./amount.model.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
    },
    amounts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Amount",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to update User's amounts array
userSchema.pre("save", async function (next) {
  try {
    // If amounts are provided, update the user's amounts array
    if (this.amounts && this.amounts.length > 0) {
      await Amount.updateMany({ _id: { $in: this.amounts } }, { $set: { user: this._id } });
    }
    next();
  } catch (error) {
    console.error("Error in pre-save hook:", error);
    next(error); 
  }
});

export default mongoose.model("User", userSchema);
