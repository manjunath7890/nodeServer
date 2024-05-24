const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
    partId: String,
    partName: String,
    quantityUsed: Number,
    dateInstalled: Date,
    mileageAtInstallation: Number,
    supplier: String,
    costPerUnit: Number,
    totalCost: Number,
    installationLocation: String,
    replacementCount: Number,
    previousUsageDates: Date,
    previousMileages: String,
    notes: String
  });
  
  // Define a schema for the vehicle
  const vehicleSchema = new mongoose.Schema({
    vehicleNumber: String,
    vehicleName: String,
    chassisNumber: String,
    parts: [partSchema] // Embed the parts schema within an array
  });
  
  // Create a model based on the vehicle schema
  const VehicleParts = mongoose.model('VehiclePart', vehicleSchema);
  module.exports = VehicleParts;