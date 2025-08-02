import Patient from "../models/patientModel.js";
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

import Specialization from "../models/specializationModel.js";
import Doctor from "../models/doctorModel.js";

// Register a new patient
export const registerPatient = async (req, res) => {
  try {
    const { email, phone } = req.body;
    // console.log(req.body);
    // Check if the user already exists (by email or phone)
    const existingPatient = await Patient.findOne({
      $or: [{ email }, { phone }],
    });
    // console.log("Registration attempt with :", email);
    if (existingPatient) {
      // console.log("Found existing patient: ", existingPatient);
      return res.status(400).json({
        message: "User already exists with this email or phone number",
      });
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

    // Create a new user
    const newPatient = await Patient.create({
      ...req.body,
      image: imageUrl,
      phone,
    });
    sendToken(newPatient, 201, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Login a patient
export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log("Email in body: ", email, "Password in body: ", password);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter email and password" });
    }

    const patient = await Patient.findOne({ email }).select("+password");
    if (!patient) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log("Patientt: ", patient);

    // const isMatch = await bcrypt.compare(password, patient.password);
    const isPasswordMatched = await patient.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    sendToken(patient, 200, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// logout a patient
export const logoutPatient = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true, // Prevent client-side access to cookie for security
    });

    res.status(200).json({
      success: true,
      message: "Logged out",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get Patient details or profile
export const getPatientDetails = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.user.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// forgot password of patient
export const forgotPassword = async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(400).json({ message: "Please enter email or phone" });
    }

    const patient = await Patient.findOne({ email: req.body.email });

    if (!patient) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get reset password token
    const resetToken = patient.getResetPasswordToken();

    await patient.save({ validateBeforeSave: false });

    // Create reset password url
    // const resetUrl = `${req.protocol}://${req.get(
    //   "host"
    // )}/api/patient/password/reset/${resetToken}`;

    const resetUrl = `${process.env.FRONTEND_URL}/u/password/reset/${resetToken}`; // Update this URL to match your frontend route

    // create reset password mail
    const Message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email then, please ignore it.`;

    try {
      await sendEmail({
        email: patient.email,
        subject: "Password Reset Request",
        message: Message,
      });
      res.status(200).json({
        success: true,
        message: `Email sent to ${patient.email} successfully`,
      });
    } catch (error) {
      patient.resetPasswordToken = undefined;
      patient.resetPasswordExpire = undefined;
      await patient.save({ validateBeforeSave: false });
      return res.status(500).json({ message: error.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Reset password of patient
export const resetPassword = async (req, res) => {
  try {
    // Hash URL token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // Find patient based on their token and token expire
    const patient = await Patient.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!patient) {
      return res.status(400).json({
        message: "Password reset token is invalid or has been expired",
      });
    }

    // Reset password
    patient.password = req.body.password;
    patient.resetPasswordToken = undefined;
    patient.resetPasswordExpire = undefined;
    await patient.save();

    sendToken(patient, 200, res); // Send token to client. nhi bhi bhejoge to chalega. kyuki hum token password k saath generate nhi kr rhe. patient k Id k saath generate kr rhe hai
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update patient password
export const updatePassword = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id);

    const isPasswordMatched = await patient.comparePassword(
      req.body.oldPassword
    );

    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Set new password - it will be automatically hashed by the pre-save hook in patientModel.js
    patient.password = req.body.newPassword;
    await patient.save();

    sendToken(patient, 200, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// update Patient profile

// get all specialization list
export const getAllSpecialization = async (req, res) => {
  try {
    const specializations = await Specialization.find();
    res.status(200).json(specializations);
  } catch (error) {
    console.error(error);
  }
};

// get all doctors list
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ role: "doctor" });
    res.status(200).json(doctors);
  } catch (error) {
    console.error(error);
  }
};

//  get only featured doctors
export const getFeaturedDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ role: "doctor", featured: true });
    res.status(200).json(doctors);
  } catch (error) {
    console.error(error);
  }
};

// get doctor's specific info only by id
export const getDoctorInfoById = async (req, res) => {
  try {
    const doctorInfo = await Doctor.findById(req.params.id).select(
      "name gender specialization image experience qualification about fees availability hospital, address "
    );

    if (!doctorInfo) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctorInfo);
  } catch (error) {
    console.error(error);
  }
};

// get doctor by specialization for doctor suggestion except for a specific doctor
export const getDoctorBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;
    const { excludeDoctorId } = req.query;

    let query = {
      specialization: specialization,
    };

    // Add condition to exclude the specified doctor if an ID is provided
    if (excludeDoctorId) {
      query._id = { $ne: excludeDoctorId };
    }

    const doctors = await Doctor.find(query);
    // if (doctors.length === 0) {
    //   return res
    //     .status(404)
    //     .json({
    //       message: "No doctors found with the specified specialization",
    //     });
    // }

    res.status(200).json(doctors);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching doctors by specialization" });
  }
};
