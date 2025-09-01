import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const speakerScheduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
  },
  { _id: false }
);

const speakerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true }, // will be hashed
    bio: { type: String, trim: true },
    expertise: [{ type: String, trim: true }],
    photo: { type: String, trim: true }, // store uploaded file path
    schedules: [speakerScheduleSchema],
  },
  { timestamps: true }
);

// Hash password before saving
speakerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Speaker = mongoose.model("Speaker", speakerSchema);
export default Speaker;
