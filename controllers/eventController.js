// controllers/eventsController.js
import Event from "../models/Event.js";
import connectToDatabase from "../utils/db.js";

// -------------------- Events --------------------

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    console.log("📢 getAllEvents called");
    await connectToDatabase(process.env.MONGO_URI);

    const events = await Event.find().populate("schedules");
    console.log(`✅ Found ${events.length} events`);
    res.status(200).json(events);
  } catch (err) {
    console.error("❌ getAllEvents error:", err.message || err);
    res.status(500).json({ message: "Error fetching events", error: err.message });
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  try {
    console.log(`📢 getEventById called with id: ${req.params.id}`);
    await connectToDatabase(process.env.MONGO_URI);

    const event = await Event.findById(req.params.id).populate("schedules");
    if (!event) {
      console.warn("🚫 Event not found:", req.params.id);
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (err) {
    console.error("❌ getEventById error:", err.message || err);
    res.status(500).json({ message: "Error fetching event", error: err.message });
  }
};

// Create new event
export const createEvent = async (req, res) => {
  try {
    console.log("📢 createEvent called");
    await connectToDatabase(process.env.MONGO_URI);

    const newEvent = new Event(req.body);
    await newEvent.save();

    console.log("✅ Event created:", newEvent._id);
    res.status(201).json(newEvent);
  } catch (err) {
    console.error("❌ createEvent error:", err.message || err);
    res.status(400).json({ message: "Error creating event", error: err.message });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    console.log(`📢 updateEvent called with id: ${req.params.id}`);
    await connectToDatabase(process.env.MONGO_URI);

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEvent) {
      console.warn("🚫 Event not found:", req.params.id);
      return res.status(404).json({ message: "Event not found" });
    }

    console.log("✅ Event updated:", updatedEvent._id);
    res.status(200).json(updatedEvent);
  } catch (err) {
    console.error("❌ updateEvent error:", err.message || err);
    res.status(400).json({ message: "Error updating event", error: err.message });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    console.log(`📢 deleteEvent called with id: ${req.params.id}`);
    await connectToDatabase(process.env.MONGO_URI);

    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      console.warn("🚫 Event not found:", req.params.id);
      return res.status(404).json({ message: "Event not found" });
    }

    console.log("✅ Event deleted:", deletedEvent._id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("❌ deleteEvent error:", err.message || err);
    res.status(500).json({ message: "Error deleting event", error: err.message });
  }
};

// Add schedule to event
export const addSchedule = async (req, res) => {
  try {
    console.log(`📢 addSchedule called for eventId: ${req.params.id}`);
    await connectToDatabase(process.env.MONGO_URI);

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.schedules.push(req.body);
    await event.save();

    console.log("✅ Schedule added to event:", event._id);
    res.status(201).json(event);
  } catch (err) {
    console.error("❌ addSchedule error:", err.message || err);
    res.status(400).json({ message: "Error adding schedule", error: err.message });
  }
};

// Update schedule inside event
export const updateSchedule = async (req, res) => {
  try {
    const { id, scheduleId } = req.params;
    console.log(`📢 updateSchedule called for eventId: ${id}, scheduleId: ${scheduleId}`);
    await connectToDatabase(process.env.MONGO_URI);

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const schedule = event.schedules.id(scheduleId);
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });

    Object.assign(schedule, req.body);
    await event.save();

    console.log("✅ Schedule updated:", scheduleId);
    res.status(200).json(event);
  } catch (err) {
    console.error("❌ updateSchedule error:", err.message || err);
    res.status(400).json({ message: "Error updating schedule", error: err.message });
  }
};

// Delete schedule from event
export const deleteSchedule = async (req, res) => {
  try {
    const { id, scheduleId } = req.params;
    console.log(`📢 deleteSchedule called for eventId: ${id}, scheduleId: ${scheduleId}`);
    await connectToDatabase(process.env.MONGO_URI);

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const schedule = event.schedules.id(scheduleId);
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });

    schedule.remove();
    await event.save();

    console.log("✅ Schedule deleted:", scheduleId);
    res.status(200).json({ message: "Schedule deleted successfully", event });
  } catch (err) {
    console.error("❌ deleteSchedule error:", err.message || err);
    res.status(500).json({ message: "Error deleting schedule", error: err.message });
  }
};
