// controllers/aboutController.js
import About from "../models/About.js";

// @desc    Get About info
// @route   GET /api/about
export const getAbout = async (req, res) => {
  try {
    const about = await About.findOne(); // only one record
    if (!about) {
      return res.status(404).json({ message: "About info not found" });
    }
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update or Create About info
// @route   PUT /api/about
export const updateAbout = async (req, res) => {
  try {
    const { heading, description, mission, vision } = req.body;

    let about = await About.findOne();
    if (!about) {
      // If no about exists, create new
      about = new About({ heading, description, mission, vision });
    } else {
      // Update existing fields
      about.heading = heading || about.heading;
      about.description = description || about.description;
      about.mission = mission || about.mission;
      about.vision = vision || about.vision;
    }

    const updated = await about.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
