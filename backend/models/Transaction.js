import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Please specify transaction type"]
    },
    amount: {
      type: Number,
      required: [true, "Please add an amount"],
      min: [0, "Amount must be positive"]
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      trim: true
    },
    category: {
      type: String,
      required: [true, "Please add a category"]
    },
    date: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
)

const Transaction = mongoose.model("Transaction", transactionSchema)
export default Transaction
