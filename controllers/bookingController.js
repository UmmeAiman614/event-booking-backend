// controllers/bookingController.js
import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import connectToDatabase from "../utils/db.js";

// -------------------- Booking CRUD --------------------

// Book an event
export const bookEvent = async (req, res) => {
  try {
    console.log(`📢 bookEvent request received for eventId: ${req.params.eventId}`);
    await connectToDatabase(process.env.MONGO_URI);

    const { quantity, totalPrice, ticketType } = req.body;

    let event = null;
    if (req.params.eventId) {
      event = await Event.findById(req.params.eventId);
      if (!event) {
        console.warn("🚫 Event not found:", req.params.eventId);
        return res.status(404).json({ message: "Event not found" });
      }
    }

    const booking = new Booking({
      event: event ? event._id : null,
      user: req.user._id,
      ticketType,
      quantity,
      totalPrice,
    });

    await booking.save();
    console.log("✅ Booking created:", booking._id);
    res.status(201).json({ message: "Booking submitted for admin approval", booking });
  } catch (error) {
    console.error("❌ bookEvent error:", error.message || error);
    res.status(400).json({ message: error.message });
  }
};

// Get logged-in user’s bookings
export const getMyBookings = async (req, res) => {
  try {
    console.log(`📢 getMyBookings request for user: ${req.user._id}`);
    await connectToDatabase(process.env.MONGO_URI);

    const bookings = await Booking.find({ user: req.user._id }).populate("event");
    console.log(`✅ Found ${bookings.length} bookings for user`);
    res.json(bookings);
  } catch (error) {
    console.error("❌ getMyBookings error:", error.message || error);
    res.status(500).json({ message: error.message });
  }
};

// Get bookings by userId (admin)
export const getBookingsByUser = async (req, res) => {
  try {
    console.log("📢 getBookingsByUser called with userId:", req.params.userId);
    await connectToDatabase(process.env.MONGO_URI);

    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "UserId is required in params" });

    const bookings = await Booking.find({ user: userId }).populate("event");
    console.log(`✅ Found ${bookings.length} bookings for user ${userId}`);
    res.status(200).json(bookings);
  } catch (error) {
    console.error("❌ getBookingsByUser error:", error.message || error);
    res.status(500).json({ message: "Failed to fetch user bookings", error: error.message });
  }
};

// Get all bookings (admin only)
export const getAllBookings = async (req, res) => {
  try {
    console.log("📢 getAllBookings request received");
    await connectToDatabase(process.env.MONGO_URI);

    const bookings = await Booking.find()
      .populate("event")
      .populate("user", "name email");

    console.log(`✅ Fetched ${bookings.length} total bookings`);
    res.json(bookings);
  } catch (error) {
    console.error("❌ getAllBookings error:", error.message || error);
    res.status(500).json({ message: error.message });
  }
};

// Approve a booking
export const approveBooking = async (req, res) => {
  try {
    console.log(`📢 approveBooking request for ID: ${req.params.id}`);
    await connectToDatabase(process.env.MONGO_URI);

    const booking = await Booking.findById(req.params.id).populate("event");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status !== "approved") {
      booking.status = "approved";

      // ✅ Decrease available seats in the event
      if (booking.event && booking.event.availableSeats != null) {
        booking.event.availableSeats -= booking.quantity;
        if (booking.event.availableSeats < 0) booking.event.availableSeats = 0; // prevent negative
        await booking.event.save();
      }

      await booking.save();
    }

    console.log("✅ Booking approved:", booking._id);
    res.json(booking);
  } catch (error) {
    console.error("❌ approveBooking error:", error.message || error);
    res.status(500).json({ message: error.message });
  }
};

// Reject a booking
export const rejectBooking = async (req, res) => {
  try {
    console.log(`📢 rejectBooking request for ID: ${req.params.id}`);
    await connectToDatabase(process.env.MONGO_URI);

    const booking = await Booking.findById(req.params.id).populate("event");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status === "approved") {
      // ✅ If previously approved, restore seats
      if (booking.event && booking.event.availableSeats != null) {
        booking.event.availableSeats += booking.quantity;
        await booking.event.save();
      }
    }

    booking.status = "rejected";
    await booking.save();

    console.log("✅ Booking rejected:", booking._id);
    res.json(booking);
  } catch (error) {
    console.error("❌ rejectBooking error:", error.message || error);
    res.status(500).json({ message: error.message });
  }
};


export const getBookingsCount = async (req, res) => {
  try {
    await connectToDatabase(process.env.MONGO_URI);
    const count = await Booking.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
