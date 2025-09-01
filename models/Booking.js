// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", default: null }, // optional for now
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ticketType: { type: String, required: true }, // added ticket type
    quantity: { type: Number, required: true, default: 1 },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    bookedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
