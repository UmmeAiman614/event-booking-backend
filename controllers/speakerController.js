import User from "../models/User.js";

// ------------------ Speaker CRUD ------------------

// Create speaker
export const createSpeaker = async (req, res) => {
  try {
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
      photo: req.file ? `/uploads/${req.file.filename}` : null, // ✅ save uploaded photo
    });

    res.status(201).json(speaker);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update speaker
export const updateSpeaker = async (req, res) => {
  try {
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

    // ✅ update photo if new file uploaded
    if (req.file) {
      speaker.photo = `/uploads/${req.file.filename}`;
    }

    await speaker.save();
    res.json(speaker);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};



export const deleteSpeaker = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: validate ObjectId to avoid cast errors
    // if (!mongoose.isValidObjectId(id)) {
    //   return res.status(400).json({ message: "Invalid speaker id" });
    // }

    // Ensure it’s actually a speaker
    const speaker = await User.findOne({ _id: id, role: "speaker" });
    if (!speaker) {
      return res.status(404).json({ message: "Speaker not found" });
    }

    // Delete using modern API
    await speaker.deleteOne(); // or: await User.deleteOne({ _id: id });
    // or: const deleted = await User.findOneAndDelete({ _id: id, role: "speaker" });

    return res.json({ message: "Speaker deleted successfully" });
  } catch (err) {
    console.error("deleteSpeaker error:", err);
    return res.status(500).json({ message: err.message || "Internal server error" });
  }
};


// Get all speakers
export const getAllSpeakers = async (req, res) => {
  try {
    const speakers = await User.find({ role: "speaker" }); // <-- important
    res.json(speakers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get speaker by ID
export const getSpeakerById = async (req, res) => {
  const speaker = await User.findById(req.params.id);
  if (!speaker || speaker.role !== "speaker")
    return res.status(404).json({ message: "Speaker not found" });
  res.json(speaker);
};

// ------------------ Schedule Management ------------------

// Add schedule
export const addScheduleToSpeaker = async (req, res) => {
  try {
    const speaker = await User.findById(req.params.id);
    if (!speaker || speaker.role !== "speaker")
      return res.status(404).json({ message: "Speaker not found" });

    speaker.schedules.push(req.body);
    await speaker.save();
    res.status(201).json(speaker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update schedule
export const updateScheduleForSpeaker = async (req, res) => {
  try {
    const speaker = await User.findById(req.params.id);
    if (!speaker || speaker.role !== "speaker")
      return res.status(404).json({ message: "Speaker not found" });

    const schedule = speaker.schedules.id(req.params.scheduleId);
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });

    Object.assign(schedule, req.body);
    await speaker.save();
    res.json(speaker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete schedule
export const deleteScheduleForSpeaker = async (req, res) => {
  try {
    const speaker = await User.findById(req.params.id);
    if (!speaker || speaker.role !== "speaker")
      return res.status(404).json({ message: "Speaker not found" });

    const schedule = speaker.schedules.id(req.params.scheduleId);
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });

    schedule.deleteOne();
    await speaker.save();
    res.json(speaker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
