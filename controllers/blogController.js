import Blog from "../models/Blog.js";

// -------------------- Blog CRUD --------------------

// @desc    Get all blogs
// @route   GET /api/blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "name email");
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a blog by ID
// @route   GET /api/blogs/:id
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name email");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Helper to get full image URL
const getImageUrl = (req, filename) => {
  if (!filename) return null;
  return `${req.protocol}://${req.get("host")}/${filename.replace(/\\/g, "/")}`;
};

// @desc    Create a new blog
export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    let imagePath = "";
    if (req.file) {
      imagePath = `uploads/${req.file.filename}`;
    }

    const blog = new Blog({
      title,
      content,
      author: req.user._id,
      image: imagePath,
    });

    await blog.save();

    // Return blog with full image URL
    const blogWithFullImage = blog.toObject();
    blogWithFullImage.image = getImageUrl(req, blog.image);

    res.status(201).json(blogWithFullImage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a blog
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this blog" });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;

    if (req.file) {
      blog.image = `uploads/${req.file.filename}`;
    }

    await blog.save();

    const blogWithFullImage = blog.toObject();
    blogWithFullImage.image = getImageUrl(req, blog.image);

    res.json(blogWithFullImage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // only author can delete
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this blog" });
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
