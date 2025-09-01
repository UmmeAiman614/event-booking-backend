import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";

// @desc    Post a new comment (default = pending)
// @route   POST /api/comments/:blogId
export const postComment = async (req, res) => {
  try {
    const { name, email, content } = req.body;
    const { blogId } = req.params;

    if (!content || !name || !email) {
      return res.status(400).json({ message: "Name, email, and content are required" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comment = new Comment({
      blog: blogId,
      name,
      email,
      content,
      status: "pending",
    });

    await comment.save();
    res.status(201).json({ message: "Comment submitted for approval", comment });
  } catch (error) {
    console.error("Error in postComment:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all comments (Admin only)
// @route   GET /api/comments
export const getAllComments = async (req, res) => {
  try {
    // adminOnly middleware guarantees req.user is admin
    const comments = await Comment.find()
      .populate("blog", "title") // fetch blog title
      .sort({ createdAt: -1 });   // latest first

    res.json(comments);
  } catch (error) {
    console.error("Error in getAllComments:", error);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Approve or Reject a comment (Admin only)
// @route   PUT /api/comments/:id/approve
export const approveComment = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.status = status;
    await comment.save();

    res.json({ message: `Comment ${status} successfully`, comment });
  } catch (error) {
    console.error("Error in approveComment:", error);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Delete a comment (Admin only)
// @route   DELETE /api/comments/:id
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get approved comments for a blog
// @route   GET /api/blogs/:id/comments
export const getCommentsByBlogId = async (req, res) => {
  try {
    const blogId = req.params.id;

    // Fetch only approved comments based on status field
    const comments = await Comment.find({ blog: blogId, status: "approved" }).populate(
      "user",
      "name email"
    );

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};
