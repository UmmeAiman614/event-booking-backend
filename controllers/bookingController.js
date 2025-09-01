// controllers/bookingController.js
import Booking from "../models/Booking.js";
import Event from "../models/Event.js";

// @desc    Book an event
// @route   POST /api/bookings/:eventId
// controllers/bookingController.js
export const bookEvent = async (req, res) => {
  try {
    const { quantity, totalPrice, ticketType } = req.body;

    // Optional: only check event if eventId exists
    let event = null;
    if (req.params.eventId) {
      event = await Event.findById(req.params.eventId);
      if (!event) return res.status(404).json({ message: "Event not found" });
    }

    const booking = new Booking({
      event: event ? event._id : null, // leave null for now
      user: req.user._id,
      ticketType, // add ticketType field
      quantity,
      totalPrice,
    });

    await booking.save();
    res.status(201).json({ message: "Booking submitted for admin approval", booking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// @desc    Get logged-in user’s bookings
// @route   GET /api/bookings/my
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("event");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("📌 getBookingsByUser called with userId:", userId);

    if (!userId) {
      return res.status(400).json({ message: "UserId is required in params" });
    }

    const bookings = await Booking.find({ user: userId }).populate("event");
    console.log(`✅ Found ${bookings.length} bookings for user ${userId}`);

    res.status(200).json(bookings);
  } catch (error) {
    console.error("❌ Error in getBookingsByUser:", error);
    res.status(500).json({ message: "Failed to fetch user bookings", error: error.message });
  }
};

// @desc    Get all bookings (admin only)
// @route   GET /api/bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("event")
      .populate("user", "name email"); // only return limited fields
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a booking
// @route   PUT /api/bookings/:id/approve
export const approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "approved";
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject a booking
// @route   PUT /api/bookings/:id/reject
export const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "rejected";
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


