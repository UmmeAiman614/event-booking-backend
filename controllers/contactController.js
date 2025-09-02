// controllers/contactsController.js
import Contact from "../models/Contact.js";
import connectToDatabase from "../utils/db.js";

// -------------------- Contact Messages --------------------

// Post a new contact message
export const postContact = async (req, res) => {
  try {
    console.log("📢 postContact called");
    await connectToDatabase(process.env.MONGO_URI);

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const contact = new Contact({ name, email, message });
    await contact.save();

    console.log("✅ Contact message saved:", contact._id);
    res.status(201).json({ message: "Contact message submitted successfully", contact });
  } catch (error) {
    console.error("❌ postContact error:", error.message || error);
    res.status(500).json({ message: error.message });
  }
};

// Get all contact messages (Admin only)
export const getAllContacts = async (req, res) => {
  try {
    console.log("📢 getAllContacts called");
    await connectToDatabase(process.env.MONGO_URI);

    const contacts = await Contact.find().sort({ createdAt: -1 });
    console.log(`✅ Fetched ${contacts.length} contacts`);
    res.json(contacts);
  } catch (error) {
    console.error("❌ getAllContacts error:", error.message || error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a contact message (Admin only)
export const deleteContact = async (req, res) => {
  try {
    console.log(`📢 deleteContact called for contactId: ${req.params.id}`);
    await connectToDatabase(process.env.MONGO_URI);

    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: "Only admins can delete contacts" });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      console.warn("🚫 Contact not found:", req.params.id);
      return res.status(404).json({ message: "Contact not found" });
    }

    await contact.deleteOne();
    console.log("✅ Contact deleted:", contact._id);
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("❌ deleteContact error:", error.message || error);
    res.status(500).json({ message: error.message });
  }
};

// Create new contact message (alternative route)
export const createMessage = async (req, res) => {
  try {
    console.log("📢 createMessage called");
    await connectToDatabase(process.env.MONGO_URI);

    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMessage = new Contact({ name, email, subject, message });
    await newMessage.save();

    console.log("✅ Message sent successfully:", newMessage._id);
    res.status(201).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("❌ createMessage error:", error.message || error);
    res.status(500).json({ message: error.message });
  }
};

// Mark message as read (Admin)
export const markAsRead = async (req, res) => {
  try {
    console.log(`📢 markAsRead called for contactId: ${req.params.id}`);
    await connectToDatabase(process.env.MONGO_URI);

    const message = await Contact.findById(req.params.id);
    if (!message) {
      console.warn("🚫 Message not found:", req.params.id);
      return res.status(404).json({ message: "Message not found" });
    }

    message.isRead = true;
    await message.save();

    console.log("✅ Message marked as read:", message._id);
    res.json({ message: "Message marked as read" });
  } catch (error) {
    console.error("❌ markAsRead error:", error.message || error);
    res.status(500).json({ message: error.message });
  }
};
export const getContactsCount = async (req, res) => {
  try {
    await connectToDatabase(process.env.MONGO_URI);
    const count = await Contact.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
