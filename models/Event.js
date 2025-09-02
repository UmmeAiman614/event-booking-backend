import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    speaker: { type: mongoose.Schema.Types.ObjectId, ref: "Speaker" },
  }
);

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    date: { type: Date, required: true },
    location: { type: String, trim: true },
    image: { type: String, trim: true }, // <-- new field for image path
    schedules: [scheduleSchema],
    totalSeats: { type: Number, required: true, default: 100 },
    availableSeats: { type: Number, required: true, default: 100 },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
