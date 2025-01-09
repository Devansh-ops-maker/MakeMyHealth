import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be at least 8 characters"]
    },
    associatedHospital: {
        type: String,
        required: [true, "Hospital name is required"],
        trim: true
    },
    availability: [{
        day: String,
        startTime: String,
        endTime: String
    }],
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

doctorSchema.index({ specialization: 1 });
doctorSchema.index({ associatedHospital: 1 });
doctorSchema.index({ status: 1 });

doctorSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

doctorSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
