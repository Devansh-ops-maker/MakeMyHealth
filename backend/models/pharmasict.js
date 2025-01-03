const Pharmacist = require("../models/pharmacist");
const Hospital = require("../models/hospital");

const addPharmacist = async (pharmacistData) => {
  try {
    const pharmacy = await Hospital.findOne({ 
      name: pharmacistData.pharmacyName,
      status: "active"
    });
    
    if (!pharmacy) {
      throw new Error("Pharmacy not found or inactive");
    }

    const existingPharmacist = await Pharmacist.findOne({ 
      email: pharmacistData.email 
    });
    
    if (existingPharmacist) {
      throw new Error("Pharmacist with this email already exists");
    }

    const newPharmacist = new Pharmacist({
      name: pharmacistData.name,
      qualifications: pharmacistData.qualifications,
      licenseNumber: pharmacistData.licenseNumber,
      contactNumber: pharmacistData.contactNumber,
      email: pharmacistData.email,
      associatedPharmacy: pharmacy._id,
      status: "active"
    });

    const savedPharmacist = await newPharmacist.save();

    return {
      success: true,
      message: "Pharmacist added successfully",
      pharmacist: savedPharmacist
    };

  } catch (error) {
    return {
      success: false,
      message: error.message || "Error adding pharmacist",
      error: error
    };
  }
};

module.exports = addPharmacist;
