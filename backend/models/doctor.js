const mongoose = require("mongoose");

const availabilitySlotSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  startTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  endTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  }
});

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Doctor name is required"],
    trim: true,
    minLength: [2, "Name must be at least 2 characters"]
  },
  specialization: {
    type: String,
    required: [true, "Specialization is required"],
    trim: true,
    enum: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General Medicine', 'Dermatology']
  },
  qualifications: [{
    degree: String,
    university: String,
    year: Number
  }],
  licenseNumber: {
    type: String,
    required: [true, "License number is required"],
    unique: true
  },
  contactNumber: {
    type: String,
    required: [true, "Contact number is required"],
    match: [/^(\+\d{1,3}[- ]?)?\d{10}$/, "Please enter a valid 10-digit number"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email format"]
  },
  associatedHospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: [true, "Hospital association is required"]
  },
  availability: [availabilitySlotSchema],
  status: {
    type: String,
    enum: ['active', 'on-leave', 'not-practicing'],
    default: 'active'
  },
  experience: {
    type: Number,
    min: 0
  },
  languages: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
}, {
  timestamps: true
});

// Indexes
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ associatedHospital: 1 });
doctorSchema.index({ status: 1 });

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
