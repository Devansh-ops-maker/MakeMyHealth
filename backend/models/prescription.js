const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  prescriptionId: {
    type: String,
    required: true,
    unique: true
  },
  hospitalName: {
    type: String,
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  patientAge: {
    type: Number,
    required: true
  },
  symptoms: [{
    type: String
  }],
  diagnosis: {
    type: String,
    required: true
  },
  medicines: [{
    name: {
      type: String,
      required: true
    },
    dosage: {
      type: String,
      required: true
    },
    dispensed: {
      type: Boolean,
      default: false
    },
    dispensedTime: Date
  }],
  dateCreated: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'fulfilled'],
    default: 'active'
  },
  expiryDate: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
