const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Amount", amountSchema);
