const mongoose = require("mongoose");
const User = require("./user.model.js");

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
  // If user is provided, update the user's amounts array
  if (this.user) {
    await User.findByIdAndUpdate(this.user, { $push: { amounts: this._id } });
  }

  next();
});

// Post-delete hook to remove reference from user's amounts array
amountSchema.post("findOneAndDelete", async function (doc, next) {
  if (doc.user) {
    await User.findByIdAndUpdate(doc.user, { $pull: { amounts: doc._id } });
  }
  next();
});

module.exports = mongoose.model("Amount", amountSchema);
