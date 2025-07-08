const CustomDesignRequest = require("../models/CustomDesignRequest");

// 📝 Create request (public)
exports.createCustomDesignRequest = async (req, res) => {
  try {
    const request = await CustomDesignRequest.create(req.body);
    res.status(201).json({
      status: true,
      message: "Custom design request submitted",
      data: request,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// 📥 Get all (admin)
exports.getAllCustomDesignRequests = async (req, res) => {
  try {
    const requests = await CustomDesignRequest.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      message: "All custom design requests fetched",
      data: requests,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// 📍 Get single
exports.getCustomDesignRequest = async (req, res) => {
  try {
    const request = await CustomDesignRequest.findById(req.params.id);
    if (!request)
      return res.status(404).json({ status: false, message: "Request not found" });

    res.status(200).json({
      status: true,
      message: "Custom design request fetched",
      data: request,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// ✏️ Update request (admin)
exports.updateCustomDesignRequest = async (req, res) => {
  try {
    const updated = await CustomDesignRequest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      status: true,
      message: "Custom design request updated",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// ❌ Delete
exports.deleteCustomDesignRequest = async (req, res) => {
  try {
    await CustomDesignRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: true, message: "Request deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
