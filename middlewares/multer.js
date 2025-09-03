// middleware/upload.js
import multer from "multer";

// Use memory storage (file kept in RAM, not disk)
const storage = multer.memoryStorage();

// Filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
