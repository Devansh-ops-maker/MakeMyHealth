const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 150,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  contactNumber: {
    type: String,
    required: true,
    match: /^(\+\d{1,3}[- ]?)?\d{10}$/,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  address: {
    type: String,
    required: true,
    trim: true,
    minLength: 10,
  },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  allergies: [{
    type: String,
    trim: true,
  }],
  emergencyContact: {
    name: String,
    relation: String,
    phone: String,
  },
  prescriptions: [{
    medicineName: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    prescribedBy: { type: String, required: true },
    prescribedDate: { type: Date, default: Date.now },
    verificationCode: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active"
    }
  }],
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    medications: [String],
    notes: String
  }],
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
});

patientSchema.index({ email: 1 });
patientSchema.index({ contactNumber: 1 });
patientSchema.index({ 'prescriptions.verificationCode': 1 });

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
