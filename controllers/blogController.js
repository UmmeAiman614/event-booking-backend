// controllers/blogsController.js
import Blog from "../models/Blog.js";
import connectToDatabase from "../utils/db.js";


// Helper to get full image URL
const getImageUrl = (req, filename) => {
  if (!filename) return null;
  return `${req.protocol}://${req.get("host")}/${filename.replace(/\\/g, "/")}`;
};

// -------------------- Blog CRUD --------------------

// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    console.log("📢 getAllBlogs request received");
    await connectToDatabase(process.env.MONGO_URI);

    const blogs = await Blog.find().populate("author", "name email");
    console.log(`✅ Fetched ${blogs.length} blogs`);
    res.json(blogs);
  } catch (error) {
    console.error("❌ getAllBlogs error:", error.message || error);
    res.status(500).json({ message: error.message });
  }
};

// Get blog by ID
export const getBlogById = async (req, res) => {
  try {
    console.log(`📢 getBlogById request for ID ${req.params.id}`);
    await connectToDatabase(process.env.MONGO_URI);

    const blog = await Blog.findById(req.params.id).populate("author", "name email");
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    console.log("✅ Blog fetched:", blog.title);
    res.json(blog);
  } catch (error) {
    console.error("❌ getBlogById error:", error.message || error);
    res.status(500).json({ message: error.message });
  }
};

// Create Blog
export const createBlog = async (req, res) => {
  try {
    await connectToDatabase(process.env.MONGO_URI);

    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const blog = new Blog({
      title,
      content,
      author: req.user._id,
      image: req.file ? req.file.path : null, // Cloudinary URL
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Blog
export const updateBlog = async (req, res) => {
  try {
    await connectToDatabase(process.env.MONGO_URI);

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    if (req.file) blog.image = req.file.path; // Cloudinary URL

    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Delete a blog
export const deleteBlog = async (req, res) => {
  try {
    console.log(`📢 deleteBlog request for ID ${req.params.id}`);
    await connectToDatabase(process.env.MONGO_URI);

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this blog" });
    }

    await blog.deleteOne();
    console.log("✅ Blog deleted:", blog.title);
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("❌ deleteBlog error:", error.message || error);
    res.status(500).json({ message: error.message });
  }
};

export const getBlogsCount = async (req, res) => {
  try {
    await connectToDatabase(process.env.MONGO_URI);
    const count = await Blog.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
