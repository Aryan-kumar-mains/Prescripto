import mongoose from 'mongoose';

import Booking from "../models/bookingModel.js";
import Patient from "../models/patientModel.js";
import Doctor from "../models/doctorModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import {
  generateOTP,
  storeOTP,
  verifyOTP,
  sendOTPEmail,
} from "../utils/otpUtils.js";

// Step 1: Initiate booking and send OTP
export const initiateBooking = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id);
    const {
      doctor,
      patientName,
      patientPhone,
      patientSex,
      patientAge,
      patientAddress,
      bookingDate,
      bookingTimeSlot,
    } = req.body;

    // Convert the bookingDate to a proper Date object and normalize it
    const requestedDate = new Date(bookingDate);
    const startOfDay = new Date(requestedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(requestedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Check existing booking with proper date range and ObjectId conversion
    const existingBooking = await Booking.findOne({
      patient: patient._id,
      doctor: new mongoose.Types.ObjectId(doctor), // Ensure proper ObjectId conversion
      bookingDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      bookingTimeSlot: bookingTimeSlot.trim(), // Remove any extra whitespace
      bookingStatus: "Scheduled",
    });


    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "This Date or Time Slot is already booked. Please choose another Date or Time Slot.",
      });
    } else {
      // Generate OTP
      const otp = generateOTP();

      // Store booking data and OTP in memory
      const bookingData = {
        doctor,
        patientName,
        patientPhone,
        patientSex,
        patientAge,
        patientAddress,
        bookingDate,
        bookingTimeSlot,
      };

      storeOTP(patient._id, bookingData, otp);

      // Send OTP to patient's email
      await sendOTPEmail(patient, otp);

      res.status(200).json({
        success: true,
        message: "OTP sent to your email for booking confirmation",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Step 2: Confirm booking with OTP
export const confirmBooking = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id);
    const { otpValue } = req.body;

    // Verify OTP
    const verification = verifyOTP(patient._id, otpValue);

    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        message: verification.message,
      });
    }

    const bookingData = verification.bookingData;

    // Format the date to YYYYMMDD
    const formattedDate = new Date(bookingData.bookingDate)
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");

    // Count the number of bookings on the given date
    // Count the number of bookings on the given date
    const bookingDateStart = new Date(bookingData.bookingDate);
    bookingDateStart.setHours(0, 0, 0, 0); // Start of the day

    const bookingDateEnd = new Date(bookingData.bookingDate);
    bookingDateEnd.setHours(23, 59, 59, 999); // End of the day

    const dailyBookings = await Booking.countDocuments({
      bookingDate: {
        $gte: bookingDateStart,
        $lte: bookingDateEnd,
      },
    });

    // const dailyBookings = await Booking.countDocuments({
    //   bookingDate: bookingData.bookingDate,
    // });

    // console.log("Daily bookings:", dailyBookings);

    // const dailyBookings = await Booking.countDocuments({
    //   bookingDate: new Date(bookingData.bookingDate)
    // });

    // Generate serial number: <YYYYMMDD>-<IncrementalNumber>
    const bookingSerialNumber = `${formattedDate}-${String(
      dailyBookings + 1
    ).padStart(3, "0")}`;

    // Create the booking
    const booking = await Booking.create({
      doctor: bookingData.doctor,
      patient: patient._id,
      patientName: bookingData.patientName,
      patientPhone: bookingData.patientPhone,
      patientSex: bookingData.patientSex,
      patientAge: bookingData.patientAge,
      patientAddress: bookingData.patientAddress,
      bookingDate: bookingData.bookingDate,
      bookingTimeSlot: bookingData.bookingTimeSlot,
      bookingStatus: "Scheduled",
      bookingSerialNumber,
    });

    // If your Patient model has a bookings array, update it
    if (patient.bookings) {
      patient.bookings.push(booking._id);
      await patient.save();
    }

    // push the booking to the doctor's bookings array
    const doctor = await Doctor.findById(bookingData.doctor);
    if (doctor.myBookings) {
      doctor.myBookings.push(booking._id);
      await doctor.save();
    }

    // Send confirmation email to the patient
    const message = `Hi ${
      patient.firstName
    },\n\nYour appointment has been booked successfully for ${new Date(
      bookingData.bookingDate
    ).toDateString()} at ${
      bookingData.bookingTimeSlot
    }.\n\nYour serial number is ${bookingSerialNumber}.\n\nPlease arrive at the hospital at least 30 minutes before your appointment time.\n\n\nThanks and Regards,\nSreeDev Hospital Management System`;

    await sendEmail({
      email: patient.email,
      subject: "Appointment Booking Confirmation",
      message,
    });

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id);
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);

    //  Check if the booking exists and belongs to the patient
    if (!booking || booking.patient.toString() !== patient._id.toString()) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or not authorized",
      });
    }
    if (booking.bookingStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    } else if (booking.bookingStatus === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Booking is already completed",
      });
    }
    // Update the booking status to "Cancelled" and add cancellation reason
    booking.bookingStatus = "Cancelled";
    booking.bookingCancelledAt = new Date();
    booking.bookingCancellationReason = req.body.reason;
    await booking.save();

    // Send cancellation email to the patient
    const Message = `Dear ${patient.firstName},\n\nYour appointment with serial number ${booking?.bookingSerialNumber} scheduled for ${booking?.bookingDate} ${booking?.bookingTimeSlot} has been cancelled.\n\nThank you for informing us.\n\nBest Regards,\nSreeDev Hospital`;
    try {
      await sendEmail({
        email: patient.email,
        subject: "Appointment Cancellation Confirmation",
        message: Message,
      });
    } catch (error) {
      console.log("Error in sending email to patient:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    // send email to doctor
    // try {
    //   await sendEmail({
    //     email: booking.doctor.email,
    //     subject: "Appointment Cancellation",
    //     message: `Dear ${booking.doctor.firstName},\n\nYour appointment with serial number ${booking.serialNumber} scheduled for ${booking.date} ${booking.timeSlot} has been cancelled by the patient.\n\nThank you for informing us.\n\nBest Regards,\nSreeDev Hospital`,
    //   });
    // } catch (error) {
    //   console.log("Error in sending email to doctor:", error);
    //   return res.status(500).json({
    //     success: false,
    //     message: error.message,
    //   });
    // }

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all bookings for a patient
export const getPatientBookings = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id).populate({
      path: "bookings",
      populate: {
        path: "doctor",
        select: "name specialization",
      },
    });
    res.status(200).json({
      success: true,
      bookings: patient.bookings,
    });
    // const bookings = await Booking.find({ patient: patient._id });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
