const Contact = require("../models/Contact");

// CREATE
exports.createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res
      .status(201)
      .json({ status: true, message: "Contact created", data: contact });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// READ ALL
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ submittedAt: -1 });
    res.json({ status: true, data: contacts });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// READ SINGLE
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact)
      return res
        .status(404)
        .json({ status: false, message: "Contact not found" });
    res.json({ status: true, data: contact });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// UPDATE
exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!contact)
      return res
        .status(404)
        .json({ status: false, message: "Contact not found" });
    res.json({ status: true, message: "Contact updated", data: contact });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// DELETE
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact)
      return res
        .status(404)
        .json({ status: false, message: "Contact not found" });
    res.json({ status: true, message: "Contact deleted" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
