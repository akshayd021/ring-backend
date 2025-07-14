const ContactSection = require("../models/ContactSection");

// ➕ Add or create contact section (only one allowed ideally)
exports.createContactSection = async (req, res) => {
  try {
    const data = await ContactSection.create(req.body);
    res
      .status(201)
      .json({ status: true, message: "Contact section created", data });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getContactSection = async (req, res) => {
  try {
    const data = await ContactSection.find().sort({
      createdAt: -1,
    });
    res
      .status(200)
      .json({ status: true, message: "Contact section fetched", data });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// ✏️ Update by ID
exports.updateContactSection = async (req, res) => {
  try {
    const updated = await ContactSection.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ status: false, message: "Contact section not found" });
    }

    res.status(200).json({
      status: true,
      message: "Contact section updated",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// ❌ Delete
exports.deleteContactSection = async (req, res) => {
  try {
    await ContactSection.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: true, message: "Contact section deleted" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
