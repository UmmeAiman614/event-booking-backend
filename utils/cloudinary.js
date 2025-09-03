import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "event-booking", // all images go in this folder
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

// Export upload middleware
const upload = multer({ storage });

export { cloudinary, upload };
