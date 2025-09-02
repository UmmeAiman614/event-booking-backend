// controllers/commentsController.js
import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";
import connectToDatabase from "../utils/db.js";

// -------------------- Comments CRUD --------------------

// Post a new comment (default = pending)
export const postComment = async (req, res) => {
  try {
    console.log(`📢 postComment called for blogId: ${req.params.blogId}`);
    await connectToDatabase(process.env.MONGO_URI);

    const { name, email, content } = req.body;
    const { blogId } = req.params;

    if (!content || !name || !email) {
      return res.status(400).json({ message: "Name, email, and content are required" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      console.warn("🚫 Blog not found:", blogId);
      return res.status(404).json({ message: "Blog not found" });
    }

    const comment = new Comment({
      blog: blogId,
      name,
      email,
      content,
      status: "pending",
    });

    await comment.save();
    console.log("✅ Comment submitted:", comment._id);
    res.status(201).json({ message: "Comment submitted for approval", comment });
  } catch (error) {
    console.error("❌ postComment error:", error.message || error);
    res.status(500).json({ message: error.message });
  }
};

// Get all comments (Admin only)
export const getAllComments = async (req, res) => {
  try {
    console.log("📢 getAllComments request received");
    await connectToDatabase(process.env.MONGO_URI);

    const comments = await Comment.find()
      .populate("blog", "title")
      .sort({ createdAt: -1 });

    console.log(`✅ Fetched ${comments.length} comments`);
    res.json(comments);
  } catch (error) {
    console.error("❌ getAllComments error:", error.message || error);
    res.status(500).json({ message: error.message });
  }
};

// Approve or reject a comment (Admin only)
export const approveComment = async (req, res) => {
  try {
    console.log(`📢 approveComment called for commentId: ${req.params.id}`);
    await connectToDatabase(process.env.MONGO_URI);

    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      console.warn("🚫 Comment not found:", req.params.id);
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.status = status;
    await comment.save();

    console.log(`✅ Comment ${status}:`, comment._id);
    res.json({ message: `Comment ${status} successfully`, comment });
  } catch (error) {
    console.error("❌ approveComment error:", error.message || error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a comment (Admin only)
export const deleteComment = async (req, res) => {
  try {
    console.log(`📢 deleteComment called for commentId: ${req.params.id}`);
    await connectToDatabase(process.env.MONGO_URI);

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      console.warn("🚫 Comment not found:", req.params.id);
      return res.status(404).json({ message: "Comment not found" });
    }

    await comment.deleteOne();
    console.log("✅ Comment deleted:", comment._id);
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("❌ deleteComment error:", error.message || error);
    res.status(500).json({ message: error.message });
  }
};

// Get approved comments for a blog
export const getCommentsByBlogId = async (req, res) => {
  try {
    console.log(`📢 getCommentsByBlogId called for blogId: ${req.params.id}`);
    await connectToDatabase(process.env.MONGO_URI);

    const blogId = req.params.id;

    const comments = await Comment.find({ blog: blogId, status: "approved" }).populate(
      "user",
      "name email"
    );

    console.log(`✅ Found ${comments.length} approved comments`);
    res.json(comments);
  } catch (error) {
    console.error("❌ getCommentsByBlogId error:", error.message || error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

export const getCommentsCount = async (req, res) => {
  try {
    const count = await Comment.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
