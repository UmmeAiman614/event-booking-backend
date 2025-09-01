// controllers/speakersController.js
import User from "../models/User.js";
import connectToDatabase from "../utils/db.js";

// ------------------ Speaker CRUD ------------------

// Create speaker
export const createSpeaker = async (req, res) => {
  try {
    console.log("📢 createSpeaker request received");
    await connectToDatabase(process.env.MONGO_URI);

    const { name, username, email, password, bio, expertise, schedules } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already exists" });

    const speaker = await User.create({
      name,
      username,
      email,
      password,
      role: "speaker",
      bio,
      expertise: expertise ? expertise.split(",").map(e => e.trim()) : [],
      schedules: schedules ? JSON.parse(schedules) : [],
      photo: req.file ? `/uploads/${req.file.filename}` : null,
    });

    console.log("✅ Speaker created:", speaker);
    res.status(201).json(speaker);
  } catch (error) {
    console.error("❌ createSpeaker error:", error.message || error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update speaker
export const updateSpeaker = async (req, res) => {
  try {
    console.log(`📢 updateSpeaker request received for ID ${req.params.id}`);
    await connectToDatabase(process.env.MONGO_URI);

    const speaker = await User.findById(req.params.id);
    if (!speaker || speaker.role !== "speaker")
      return res.status(404).json({ message: "Speaker not found" });

    const { name, username, email, password, bio, expertise, schedules } = req.body;

    speaker.name = name || speaker.name;
    speaker.username = username || speaker.username;
    speaker.email = email || speaker.email;
    if (password) speaker.password = password;
    speaker.bio = bio || speaker.bio;
    if (expertise) speaker.expertise = expertise.split(",").map(e => e.trim());
    if (schedules) speaker.schedules = JSON.parse(schedules);
    if (req.file) speaker.photo = `/uploads/${req.file.filename}`;

    await speaker.save();
    console.log("✅ Speaker updated:", speaker);
    res.json(speaker);
  } catch (error) {
    console.error("❌ updateSpeaker error:", error.message || error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete speaker
export const deleteSpeaker = async (req, res) => {
  try {
    console.log(`📢 deleteSpeaker request received for ID ${req.params.id}`);
    await connectToDatabase(process.env.MONGO_URI);

    const speaker = await User.findOne({ _id: req.params.id, role: "speaker" });
    if (!speaker) return res.status(404).json({ message: "Speaker not found" });

    await speaker.deleteOne();
    console.log("✅ Speaker deleted:", req.params.id);
    res.json({ message: "Speaker deleted successfully" });
  } catch (err) {
    console.error("❌ deleteSpeaker error:", err.message || err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

// Get all speakers
export const getAllSpeakers = async (req, res) => {
  try {
    console.log("📢 getAllSpeakers request received");
    await connectToDatabase(process.env.MONGO_URI);

    const speakers = await User.find({ role: "speaker" });
    console.log(`✅ Fetched ${speakers.length} speakers`);
    res.json(speakers);
  } catch (error) {
    console.error("❌ getAllSpeakers error:", error.message || error);
    res.status(500).json({ message: error.message });
  }
};

// Get speaker by ID
export const getSpeakerById = async (req, res) => {
  try {
    console.log(`📢 getSpeakerById request for ID ${req.params.id}`);
    await connectToDatabase(process.env.MONGO_URI);

    const speaker = await User.findById(req.params.id);
    if (!speaker || speaker.role !== "speaker")
      return res.status(404).json({ message: "Speaker not found" });

    console.log("✅ Speaker fetched:", speaker);
    res.json(speaker);
  } catch (error) {
    console.error("❌ getSpeakerById error:", error.message || error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------ Schedule Management ------------------

// Add schedule
export const addScheduleToSpeaker = async (req, res) => {
  try {
    console.log(`📢 addScheduleToSpeaker for ID ${req.params.id}`);
    await connectToDatabase(process.env.MONGO_URI);

    const speaker = await User.findById(req.params.id);
    if (!speaker || speaker.role !== "speaker")
      return res.status(404).json({ message: "Speaker not found" });

    speaker.schedules.push(req.body);
    await speaker.save();

    console.log("✅ Schedule added:", req.body);
    res.status(201).json(speaker);
  } catch (error) {
    console.error("❌ addScheduleToSpeaker error:", error.message || error);
    res.status(400).json({ message: error.message });
  }
};

// Update schedule
export const updateScheduleForSpeaker = async (req, res) => {
  try {
    console.log(`📢 updateScheduleForSpeaker for ID ${req.params.id}, schedule ${req.params.scheduleId}`);
    await connectToDatabase(process.env.MONGO_URI);

    const speaker = await User.findById(req.params.id);
    if (!speaker || speaker.role !== "speaker")
      return res.status(404).json({ message: "Speaker not found" });

    const schedule = speaker.schedules.id(req.params.scheduleId);
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });

    Object.assign(schedule, req.body);
    await speaker.save();

    console.log("✅ Schedule updated:", schedule);
    res.json(speaker);
  } catch (error) {
    console.error("❌ updateScheduleForSpeaker error:", error.message || error);
    res.status(400).json({ message: error.message });
  }
};

// Delete schedule
export const deleteScheduleForSpeaker = async (req, res) => {
  try {
    console.log(`📢 deleteScheduleForSpeaker for ID ${req.params.id}, schedule ${req.params.scheduleId}`);
    await connectToDatabase(process.env.MONGO_URI);

    const speaker = await User.findById(req.params.id);
    if (!speaker || speaker.role !== "speaker")
      return res.status(404).json({ message: "Speaker not found" });

    const schedule = speaker.schedules.id(req.params.scheduleId);
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });

    schedule.deleteOne();
    await speaker.save();

    console.log("✅ Schedule deleted:", req.params.scheduleId);
    res.json(speaker);
  } catch (error) {
    console.error("❌ deleteScheduleForSpeaker error:", error.message || error);
    res.status(500).json({ message: error.message });
  }
};
