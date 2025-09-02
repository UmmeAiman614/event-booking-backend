import express from "express";

// Controllers
import * as eventController from "../controllers/eventController.js";
import * as bookingController from "../controllers/bookingController.js";
import * as blogController from "../controllers/blogController.js";
import * as commentController from "../controllers/commentController.js";
import * as aboutController from "../controllers/aboutController.js";
import * as contactController from "../controllers/contactController.js";
import * as userController from "../controllers/userController.js";
import * as speakerController from "../controllers/speakerController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js"; // import multer

const router = express.Router();

// Public + User Routes
router.get("/users", userController.getAllUsers);
router.get("/events", upload.single("image"),eventController.getAllEvents);
router.get("/events/:id", upload.single("image"), eventController.getEventById);

router.get("/speakers", speakerController.getAllSpeakers);
router.get("/speakers/:id", speakerController.getSpeakerById);
router.put("/speakers/:id", upload.single("photo"), speakerController.updateSpeaker);

router.post("/bookings", protect, bookingController.bookEvent);
router.get("/my-bookings", protect, bookingController.getMyBookings);
router.get("/bookings/user/:userId", protect, bookingController.getBookingsByUser);

router.get("/blogs", upload.single("photo"), blogController.getAllBlogs);
router.get("/blogs/:id", blogController.getBlogById);
router.get("/blogs/:id/comments", commentController.getCommentsByBlogId);
router.post("/blogs/:blogId/comments", commentController.postComment);


router.get("/about", aboutController.getAbout);
router.post("/contact", contactController.createMessage);     // Public: User submits form
router.post("/contact", contactController.postContact);

export default router;
