import {
  createInquiry,
  fetchAllInquiries,
  fetchInquiryById,
  updateInquiry,
  deleteInquiry,
} from "../service/InquiryService.js";

export const addInquiry = async (req, res) => {
  try {

    const data = {
      ...req.body,
      ...(req.user ? { submittedBy: req.user.id } : {}),
    };
    const inquiry = await createInquiry(data);
    res.status(201).json(inquiry);
  } catch (error) {
    console.error("Error adding inquiry:", error);
    res.status(400).json({ message: "Failed to submit inquiry.", error: error.message });
  }
};

export const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await fetchAllInquiries(req.query);
    res.status(200).json(inquiries);
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    res.status(500).json({ message: "Failed to fetch inquiries.", error: error.message });
  }
};

export const getInquiry = async (req, res) => {
  try {
    const inquiry = await fetchInquiryById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found." });
    res.status(200).json(inquiry);
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch inquiry.", error: error.message });
  }
};

export const editInquiry = async (req, res) => {
  try {
    const updated = await updateInquiry(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Inquiry not found." });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Failed to update inquiry.", error: error.message });
  }
};

export const removeInquiry = async (req, res) => {
  try {
    const inquiry = await fetchInquiryById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found." });

    const isAdmin = req.user.role === "Admin";
    const isOwner =
      inquiry.submittedBy &&
      inquiry.submittedBy.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "You can only delete your own inquiries." });
    }

    await deleteInquiry(req.params.id);
    res.status(200).json({ message: "Inquiry deleted." });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    res.status(400).json({ message: "Failed to delete inquiry.", error: error.message });
  }
};
