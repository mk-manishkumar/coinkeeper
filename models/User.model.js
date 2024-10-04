import mongoose from "mongoose";
import bcrypt from "bcrypt";

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

const SALT_ROUNDS = 10;

// Pre-save hook to hash the password before saving the user
userSchema.pre("save", async function (next) {
  try {
    // Hash the password only if it has been modified (or is new)
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      this.password = await bcrypt.hash(this.password, salt);
    }

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

// Method to compare passwords for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
