// controllers/aboutController.js
import About from "../models/About.js";
import connectToDatabase from "../utils/db.js"; // utility to handle serverless DB connection

// @desc    Get About info
// @route   GET /api/about
export const getAbout = async (req, res) => {
  try {
    console.log("📢 GET /api/about request received");

    // Ensure DB connection
    await connectToDatabase(process.env.MONGO_URI);

    const about = await About.findOne();
    if (!about) {
      console.warn("⚠️ About info not found in DB");
      return res.status(404).json({ message: "About info not found" });
    }

    console.log("✅ About fetched successfully:", about);
    res.json(about);
  } catch (error) {
    console.error("❌ Error fetching About:", error.message || error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update or Create About info
// @route   PUT /api/about
export const updateAbout = async (req, res) => {
  try {
    console.log("📢 PUT /api/about request received with body:", req.body);

    // Ensure DB connection
    await connectToDatabase(process.env.MONGO_URI);

    const { heading, description, mission, vision } = req.body;

    let about = await About.findOne();
    if (!about) {
      // Create new About document
      about = new About({ heading, description, mission, vision });
      console.log("🆕 Creating new About document");
    } else {
      // Update existing document
      about.heading = heading || about.heading;
      about.description = description || about.description;
      about.mission = mission || about.mission;
      about.vision = vision || about.vision;
      console.log("✏️ Updating existing About document");
    }

    const updated = await about.save();
    console.log("✅ About saved successfully:", updated);
    res.json(updated);
  } catch (error) {
    console.error("❌ Error updating About:", error.message || error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
