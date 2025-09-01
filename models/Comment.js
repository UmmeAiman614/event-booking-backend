import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional for logged-in users
    name: { type: String }, // anonymous name or fallback to user.name
    email: { type: String }, // anonymous email or fallback to user.email
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
