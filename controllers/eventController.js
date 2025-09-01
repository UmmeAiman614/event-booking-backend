import Event from "../models/Event.js";

// ✅ Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("schedules");
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events", error: err.message });
  }
};

// ✅ Get event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("schedules");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: "Error fetching event", error: err.message });
  }
};

// ✅ Create new event
export const createEvent = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: "Error creating event", error: err.message });
  }
};

// ✅ Update event
export const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEvent) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: "Error updating event", error: err.message });
  }
};

// ✅ Delete event
export const deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting event", error: err.message });
  }
};

// ✅ Add schedule to event
export const addSchedule = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.schedules.push(req.body);
    await event.save();

    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: "Error adding schedule", error: err.message });
  }
};

// ✅ Update schedule inside event
export const updateSchedule = async (req, res) => {
  try {
    const { id, scheduleId } = req.params;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const schedule = event.schedules.id(scheduleId);
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });

    Object.assign(schedule, req.body);
    await event.save();

    res.status(200).json(event);
  } catch (err) {
    res.status(400).json({ message: "Error updating schedule", error: err.message });
  }
};

// ✅ Delete schedule from event
export const deleteSchedule = async (req, res) => {
  try {
    const { id, scheduleId } = req.params;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const schedule = event.schedules.id(scheduleId);
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });

    schedule.remove();
    await event.save();

    res.status(200).json({ message: "Schedule deleted successfully", event });
  } catch (err) {
    res.status(500).json({ message: "Error deleting schedule", error: err.message });
  }
};
