import express from "express";

// Controllers
import * as eventController from "../controllers/eventController.js";
import * as speakerController from "../controllers/speakerController.js";
import * as bookingController from "../controllers/bookingController.js";
import * as blogController from "../controllers/blogController.js";
import * as commentController from "../controllers/commentController.js";
import * as aboutController from "../controllers/aboutController.js";
import * as contactController from "../controllers/contactController.js";
import * as userController from "../controllers/userController.js";
import upload from "../middlewares/multer.js"; // import multer
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
const router = express.Router();

// ================== Admin-only Routes ==================


//Users
router.get("/users/count", adminOnly, protect, userController.getUsersCount);
router.post("/users", adminOnly, protect, userController.createUser);
router.put("/users/:id", protect, adminOnly, userController.updateUser);
router.delete("/users/:id", protect, adminOnly, userController.deleteUser);

// Events
router.get("/events", protect, adminOnly, eventController.getAllEvents);
router.put("/events/:id", protect, adminOnly, upload.single("image"), eventController.updateEvent); 
router.delete("/events/:id", protect, adminOnly, eventController.deleteEvent);
router.post("/events/:id/schedules", protect, adminOnly, eventController.addSchedule);
router.put("/events/:id/schedules/:sid", protect, adminOnly, eventController.updateSchedule);
router.delete("/events/:id/schedules/:sid", protect, adminOnly, eventController.deleteSchedule);
router.get("/events/count", protect, adminOnly, eventController.getEventsCount);



// ----------------- Speakers -----------------

// Admin-only routes
router.post("/speakers", protect, adminOnly, upload.single("photo"), speakerController.createSpeaker);
router.delete("/speakers/:id", protect, adminOnly, speakerController.deleteSpeaker);
router.get("/speakers/count", protect, adminOnly, speakerController.getSpeakersCount);

// Admin-only schedule management
router.post("/speakers/:id/schedules", protect, adminOnly, speakerController.addScheduleToSpeaker);
router.put("/speakers/:id/schedules/:sid", protect, adminOnly, speakerController.updateScheduleForSpeaker);
router.delete("/speakers/:id/schedules/:sid", protect, adminOnly, speakerController.deleteScheduleForSpeaker);


// Bookings
// Book an event
router.get("/bookings", protect, adminOnly, bookingController.getAllBookings);
router.put("/bookings/:id/approve", protect, bookingController.approveBooking);
router.put("/bookings/:id/reject", protect, bookingController.rejectBooking);
router.get("/bookings/count", protect, adminOnly, bookingController.getBookingsCount);

// Blogs
router.post("/blogs", protect, adminOnly, upload.single("photo"), blogController.createBlog);
router.put("/blogs/:id", protect, adminOnly, upload.single("photo"), blogController.updateBlog);
router.delete("/blogs/:id", protect, adminOnly, blogController.deleteBlog);
router.get("/blogs/count", protect, adminOnly, blogController.getBlogsCount);

// Comments

router.get("/comments", protect, adminOnly, commentController.getAllComments);
router.put("/comments/:id/approve", protect, adminOnly, commentController.approveComment);
router.delete("/comments/:id", protect, adminOnly, commentController.deleteComment);
router.get("/comments/count", protect, adminOnly, commentController.getCommentsCount);

// About
router.put("/about", protect, adminOnly, aboutController.updateAbout);
router.get("/about/count", protect, adminOnly, aboutController.getAboutCount);


// Admin: Manage contacts/messages
router.get("/contacts", protect, adminOnly, contactController.getAllContacts);
router.delete("/contacts/:id", protect, adminOnly, contactController.deleteContact);
router.put("/contacts/:id/read", protect, adminOnly, contactController.markAsRead);
router.get("/contacts/count", protect, adminOnly, contactController.getContactsCount);


export default router;
