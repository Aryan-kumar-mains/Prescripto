import { v2 as cloudinary } from "cloudinary";
import { sendToken } from "../utils/jwtToken.js";

import Doctor from "../models/doctorModel.js";
import Specialization from "../models/specializationModel.js";

// add doctor in DB
export const addDoctor = async (req, res) => {
  try {
    const { email, phone, specialization } = req.body;

    // if(!req.body.name || !req.body.gender || !req.body.specialization || !req.body.phone || !req.body.email || !req.body.password || !req.body.experience || !req.body.address || !req.body.fees || !req.body.availability) {
    //     return res.status(400).json({ message: 'Missing Details' });
    // }

    // Check if the user already exists (by email or phone)
    const existingDoctor = await Doctor.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingDoctor) {
      return res.status(400).json({
        message: "Doctor is already exists with this email or phone number",
      });
    }

    // check if  specialization is correct or not

    // Upload image to Cloudinary
    const imageFile = req.file;
    let imageUpload = "";
    if (imageFile) {
      imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
    }
    const imageUrl = imageUpload.secure_url;

    // Create a new doctor
    const newDoctor = await Doctor.create({
      ...req.body,
      image: imageUrl,
    });

    sendToken(newDoctor, 201, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// add specialization of doctors in DB
export const addSpecialization = async (req, res) => {
  try {
    const { name, specializationId, isActive } = req.body;

    // check if the specialization already exists
    const existingSpecialization = await Specialization.findOne({
      specializationId,
    });
    if (existingSpecialization) {
      return res.status(400).json({ message: "Specialization already exists" });
    }

    // Upload image to Cloudinary
    const imageFile = req.file;
    let imageUpload = "";
    if (imageFile) {
      imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
    }

    const imageUrl = imageUpload.secure_url;
    const newSpecialization = await Specialization.create({
      ...req.body,
      image: imageUrl,
    });
    res.status(201).json({
      message: `${req.body.name} added successfully`,
      newSpecialization,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// change Featured status of doctor

// update doctor's schema in existing doctors data in DB
export const updateDoctorRecords = async (req, res) => {
  try {
    // Find all existing doctors
    const doctors = await Doctor.find({});

    // Update the availability schema for each doctor
    for (const doctor of doctors) {
      // Create new availability structure
      const newAvailability = {
        isAvailable: false,
        schedules: [],
      };

      // Update the doctor document with new availability structure
      doctor.availability = newAvailability;
      await doctor.save();
    }

    res.status(200).json({ message: "Doctors schema updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
