import express from "express";
import Address from "../models/Address.js";
import { authenticateToken } from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

// All address routes require authentication
router.use(authenticateToken);

// GET /api/addresses - Get all addresses for the authenticated user
router.get("/", async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
});

// GET /api/addresses/default - Get user's default address
router.get("/default", async (req, res) => {
  try {
    const address = await Address.findOne({
      user: req.user.id,
      isDefault: true,
    });

    if (!address) {
      return res.status(404).json({ error: "No default address found" });
    }

    res.json(address);
  } catch (error) {
    console.error("Error fetching default address:", error);
    res.status(500).json({ error: "Failed to fetch default address" });
  }
});

// GET /api/addresses/:id - Get specific address
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid address ID format" });
    }

    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({ error: "Failed to fetch address" });
  }
});

// POST /api/addresses - Create new address
router.post("/", async (req, res) => {
  try {
    const addressData = { ...req.body, user: req.user.id };

    // If this is the first address or marked as default, make it default
    const existingAddresses = await Address.countDocuments({
      user: req.user.id,
    });
    if (existingAddresses === 0 || addressData.isDefault) {
      addressData.isDefault = true;
    }

    const address = new Address(addressData);
    await address.save();

    res.status(201).json(address);
  } catch (error) {
    console.error("Error creating address:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to create address" });
  }
});

// PUT /api/addresses/:id - Update address
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid address ID format" });
    }

    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    const updateData = req.body;

    // If setting as default, remove default from other addresses
    if (updateData.isDefault) {
      await Address.updateMany(
        { user: req.user.id, _id: { $ne: req.params.id } },
        { isDefault: false }
      );
    }

    Object.assign(address, updateData);
    await address.save();

    res.json(address);
  } catch (error) {
    console.error("Error updating address:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to update address" });
  }
});

// PUT /api/addresses/:id/default - Set address as default
router.put("/:id/default", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid address ID format" });
    }

    // Remove default from all addresses for this user
    await Address.updateMany({ user: req.user.id }, { isDefault: false });

    // Set the specified address as default
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isDefault: true },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.json(address);
  } catch (error) {
    console.error("Error setting default address:", error);
    res.status(500).json({ error: "Failed to set default address" });
  }
});

// DELETE /api/addresses/:id - Delete address
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid address ID format" });
    }

    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    // If deleted address was default, make another address default
    if (address.isDefault) {
      const nextDefault = await Address.findOne({ user: req.user.id }).sort({
        createdAt: -1,
      });
      if (nextDefault) {
        nextDefault.isDefault = true;
        await nextDefault.save();
      }
    }

    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ error: "Failed to delete address" });
  }
});

export default router;
