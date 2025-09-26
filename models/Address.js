import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["home", "work", "other"],
      default: "home",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    street: {
      type: String,
      required: true,
      trim: true,
    },
    apartment: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    zipCode: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      default: "India",
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    instructions: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      trim: true,
      maxlength: 50,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
addressSchema.index({ user: 1 });
addressSchema.index({ user: 1, isDefault: 1 });
addressSchema.index({ user: 1, type: 1 });

// Pre-save middleware to ensure only one default address per user
addressSchema.pre("save", async function (next) {
  if (this.isDefault && this.isModified("isDefault")) {
    // Remove default flag from other addresses for this user
    await mongoose
      .model("Address")
      .updateMany(
        { user: this.user, _id: { $ne: this._id } },
        { isDefault: false }
      );
  }
  next();
});

// Static method to get user's default address
addressSchema.statics.getDefaultAddress = function (userId) {
  return this.findOne({ user: userId, isDefault: true });
};

// Static method to get all addresses for a user
addressSchema.statics.getUserAddresses = function (userId) {
  return this.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
};

const Address = mongoose.model("Address", addressSchema);

export default Address;
