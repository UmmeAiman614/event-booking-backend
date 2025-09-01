import Contact from "../models/Contact.js";

// @desc    Post a new contact message
// @route   POST /api/contacts
export const postContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const contact = new Contact({ name, email, message });
    await contact.save();

    res.status(201).json({ message: "Contact message submitted successfully", contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all contact messages (Admin only)
// @route   GET /api/contacts
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a contact message (Admin only)
// @route   DELETE /api/contacts/:id
export const deleteContact = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Only admins can delete contacts" });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    await contact.deleteOne();
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create new contact message
// @route POST /api/contact
export const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMessage = new Contact({ name, email, subject, message });
    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // @desc Get all messages (Admin only)
// // @route GET /api/contact
// export const getMessages = async (req, res) => {
//   try {
//     const messages = await Contact.find().sort({ createdAt: -1 });
//     res.json(messages);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// @desc Mark message as read (Admin)
// @route PUT /api/contact/:id/read
export const markAsRead = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    message.isRead = true;
    await message.save();

    res.json({ message: "Message marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
