const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const pharmacistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Pharmacist name is required"],
        trim: true,
        minLength: [2, "Name must be at least 2 characters"]
    },
    qualifications: {
        type: String,
        required: [true, "Qualifications are required"],
        trim: true
    },
    licenseNumber: {
        type: String,
        required: [true, "License number is required"],
        unique: true,
        trim: true
    },
    contactNumber: {
        type: String,
        required: [true, "Contact number is required"],
        match: [/^(\+\d{1,3}[- ]?)?\d{10}$/, "Please enter a valid 10-digit number"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be at least 8 characters"],
        select: false
    },
    associatedPharmacy: {
        type: String,
        required: [true, "Pharmacy name is required"],
        trim: true
    },
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
}, {
    timestamps: true
});

pharmacistSchema.index({ licenseNumber: 1 });
pharmacistSchema.index({ email: 1 });

pharmacistSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 12);
        next();
    } catch (error) {
        next(new Error('Error hashing password'));
    }
});

pharmacistSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

const Pharmacist = mongoose.model("Pharmacist", pharmacistSchema);

module.exports = Pharmacist;
