const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
 name: {
   type: String,
   required: [true, "Name is required"],
   trim: true,
   minLength: [2, "Name must be at least 2 characters"]
 },
 email: {
   type: String,
   required: [true, "Email is required"],
   unique: true,
   trim: true,
   lowercase: true,
   match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
 },
 password: {
   type: String,
   required: [true, "Password is required"],
   minLength: [6, "Password must be at least 6 characters"]
 },
 role: {
   type: String,
   enum: ["super-admin", "admin"],
   default: "admin"
 },
 contactNumber: {
   type: String,
   required: [true, "Contact number is required"],
   match: [/^[0-9]{10}$/, "Please enter a valid 10-digit number"]
 },
 status: {
   type: String,
   enum: ["active", "inactive"],
   default: "active"
 },
 lastLogin: {
   type: Date
 },
 createdAt: {
   type: Date,
   default: Date.now,
   immutable: true
 }
}, {
 timestamps: true
});

adminSchema.index({ email: 1 });
adminSchema.index({ role: 1 });

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
