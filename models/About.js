import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    mission: { type: String, default: "" },
    vision: { type: String, default: "" },
  },
  { timestamps: true }
);

const About = mongoose.model("About", aboutSchema);

export default About;
