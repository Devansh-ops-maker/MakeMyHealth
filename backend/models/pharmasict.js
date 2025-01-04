
const mongoose = require("mongoose");

const pharmacistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  qualifications: {
    type: String,
    required: true,
    trim: true,
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  contactNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/,
  },
 associatedPharmacy: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  }
});

pharmacistSchema.index({ licenseNumber: 1 });
pharmacistSchema.index({ email: 1 });

const Pharmacist = mongoose.model("Pharmacist", pharmacistSchema);
module.exports = Pharmacist;
