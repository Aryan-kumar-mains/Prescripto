import express from "express";
import Doctor from "../models/doctorModel.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { v2 as cloudinary } from "cloudinary";

const globalTimeSlots = [
  { startTime: "09:00 AM", endTime: "10:00 AM" },
  { startTime: "10:00 AM", endTime: "11:00 AM" },
  { startTime: "11:00 AM", endTime: "12:00 PM" },
  { startTime: "12:00 PM", endTime: "01:00 PM" },
  { startTime: "01:00 PM", endTime: "02:00 PM" },
  { startTime: "02:00 PM", endTime: "03:00 PM" },
  { startTime: "03:00 PM", endTime: "04:00 PM" },
  { startTime: "04:00 PM", endTime: "05:00 PM" },
];

// login doctor
export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter email and password" });
    }
    const doctor = await Doctor.findOne({ email }).select("+password");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    const isPasswordMatched = await doctor.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    sendToken(doctor, 200, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// logout doctor
export const logoutDoctor = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// forget password of doctor
export const forgotPassword = async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(400).json({ message: "Please enter email or phone" });
    }

    const doctor = await Doctor.findOne({ email: req.body.email });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Generate reset password token
    const resetToken = doctor.getResetPasswordToken();
    await doctor.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/doctor/password/reset/${resetToken}`;
    const Message = `Your password reset token is as follow:\n\n${resetPasswordUrl}\n\nIf you have not requested this email then, please ignore it.`;
    try {
      await sendEmail({
        email: doctor.email,
        subject: "Password Reset Request",
        message: Message,
      });
      res.status(200).json({
        success: true,
        message: `Email sent to ${doctor.email} successfully`,
      });
    } catch (error) {
      doctor.resetPasswordToken = undefined;
      doctor.resetPasswordExpire = undefined;
      await doctor.save({ validateBeforeSave: false });
      return res.status(500).json({ message: error.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// reset password of doctor
export const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // Find doctor with the given token and check if it is not expired
    const doctor = await Doctor.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!doctor) {
      return res
        .status(400)
        .json({ message: "Invalid token or token expired" });
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm password does not match" });
    }

    // Set new password
    doctor.password = req.body.password;
    doctor.resetPasswordToken = undefined;
    doctor.resetPasswordExpire = undefined;
    await doctor.save();
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get Details or Profile of Doctor
export const getDoctorDetails = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) {
      return res.status(404).json({ status: false, message: "Doctor not found" });
    }
    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update Doctor Profile
export const updateDoctorDetails = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const {
      name,
      gender,
      specialization,
      image,
      years,
      description,
      fees,
      qualification,
      languages,
      hospital,
      addressLine1,
      city,
      state,
      country,
      pincode,
    } = req.body;

    // console.log(description);

    // Upload image to Cloudinary
    const imageFile = req.file;
    let imageUpload = "";
    if (imageFile) {
      imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
    }

    const imageUrl = imageUpload.secure_url;

    doctor.name = name || doctor.name;
    doctor.gender = gender || doctor.gender;
    doctor.specialization = specialization || doctor.specialization;
    doctor.image = image || doctor.image;
    doctor.experience.years = years || doctor.experience.years;
    doctor.experience.description =
      description || doctor.experience?.description;
    doctor.fees = fees || doctor.fees;
    doctor.qualification = qualification || doctor.qualification;
    doctor.languages = languages || doctor.languages;
    doctor.hospital = hospital || doctor.hospital;
    doctor.address.addressLine1 = addressLine1 || doctor.address.addressLine1;
    doctor.address.city = city || doctor.address.city;
    doctor.address.state = state || doctor.address.state;
    doctor.address.country = country || doctor.address.country;
    doctor.address.pincode = pincode || doctor.address.pincode;
    doctor.image = imageUrl || doctor.image;

    await doctor.save();
    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// add or update their availability
export const updateAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const { schedules, isAvailable } = req.body;

    // Update availability status if provided
    if (isAvailable !== undefined) {
      doctor.availability.isAvailable = isAvailable;
    }

    // Update schedules if provided
    if (isAvailable && schedules && schedules.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const oneMonthFromNow = new Date();
      oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

      // Validate each schedule
      for (const schedule of schedules) {
        const scheduleDate = new Date(schedule.date);
        scheduleDate.setHours(0, 0, 0, 0);

        // Check for past date
        if (scheduleDate < today) {
          return res.status(400).json({
            message:
              "You have chosen a past date, please select today or future date",
          });
        }

        // Check for date more than one month ahead
        if (scheduleDate > oneMonthFromNow) {
          return res.status(400).json({
            message:
              "You can only schedule appointments for the next one month only",
          });
        }

        // Check for duplicate slots on same date
        const existingSchedule = doctor.availability.schedules.find(
          (existing) =>
            new Date(existing.date).toDateString() ===
            scheduleDate.toDateString()
        );

        // Check for duplicate slots on same time
        if (existingSchedule) {
          for (const newSlot of schedule.timeSlots) {
            const duplicateSlot = existingSchedule.timeSlots.find(
              (existingSlot) =>
                existingSlot.startTime === newSlot.startTime &&
                existingSlot.endTime === newSlot.endTime
            );

            if (duplicateSlot) {
              return res.status(400).json({
                message:
                  "You already marked this time slot as available, please select another date or different time slots",
              });
            }
          }
        }

        // handle if any hacker select different time slot which is not in our globalTimeSlots array
        for (const newSlot of schedule.timeSlots) {
          const isValidSlot = globalTimeSlots.find(
            (slot) =>
              slot.startTime === newSlot.startTime &&
              slot.endTime === newSlot.endTime
          );

          if (!isValidSlot) {
            return res.status(400).json({
              message: "Invalid time slot selected",
            });
          }
        }
      }

      // If all validations pass, process the schedules
      for (const schedule of schedules) {
        const scheduleDate = new Date(schedule.date);
        scheduleDate.setHours(0, 0, 0, 0);

        // Find if date already exists in schedules
        const existingScheduleIndex = doctor.availability.schedules.findIndex(
          (existing) =>
            new Date(existing.date).toDateString() ===
            scheduleDate.toDateString()
        );

        if (existingScheduleIndex !== -1) {
          // Date exists - add new time slots to existing date
          const newTimeSlots = schedule.timeSlots.map((slot) => ({
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBooked: slot.isBooked || false,
          }));

          doctor.availability.schedules[existingScheduleIndex].timeSlots.push(
            ...newTimeSlots
          );
        } else {
          // New date - create new schedule entry
          const newSchedule = {
            date: scheduleDate,
            timeSlots: schedule.timeSlots.map((slot) => ({
              startTime: slot.startTime,
              endTime: slot.endTime,
              isBooked: slot.isBooked || false,
            })),
          };

          doctor.availability.schedules.push(newSchedule);
        }
      }
    }

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      availability: doctor.availability,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// delete their availability
export const deleteAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    const { selectedDate, selectedSlotTime } = req.body;
    const scheduleDate = new Date(selectedDate);
    scheduleDate.setHours(0, 0, 0, 0);

    const scheduleIndex = doctor.availability.schedules.findIndex(
      (schedule) =>
        new Date(schedule.date).toDateString() === scheduleDate.toDateString()
    );

    if (scheduleIndex === -1) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // If selectedSlotTime is provided, delete specific time slot
    if (selectedSlotTime) {
      const timeSlot = doctor.availability.schedules[
        scheduleIndex
      ].timeSlots.find(
        (slot) =>
          slot.startTime === selectedSlotTime.startTime &&
          slot.endTime === selectedSlotTime.endTime
      );

      if (!timeSlot) {
        return res.status(404).json({ message: "Time slot not found" });
      }

      if (timeSlot.isBooked) {
        return res.status(400).json({
          message: "Cannot delete a booked time slot",
        });
      }

      // Remove specific time slot
      doctor.availability.schedules[scheduleIndex].timeSlots =
        doctor.availability.schedules[scheduleIndex].timeSlots.filter(
          (slot) =>
            slot.startTime !== selectedSlotTime.startTime ||
            slot.endTime !== selectedSlotTime.endTime
        );

      // If no time slots left for that date, remove the entire schedule
      if (doctor.availability.schedules[scheduleIndex].timeSlots.length === 0) {
        doctor.availability.schedules.splice(scheduleIndex, 1);
      }
    } else {
      // Delete entire schedule for the date
      const timeSlotsToDelete = doctor.availability.schedules[
        scheduleIndex
      ].timeSlots.filter((slot) => slot.isBooked);
      if (timeSlotsToDelete.length > 0) {
        return res.status(400).json({
          message: "Cannot delete this schedule as it has booked time slots",
        });
      }
      doctor.availability.schedules.splice(scheduleIndex, 1);
    }

    await doctor.save();
    res.status(200).json({
      success: true,
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Change the status of booking
export const changeBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    if (!bookingId || !status) {
      return res.status(400).json({ message: "Booking ID and status are required" });
    }

    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    const booking = doctor.myBookings.find(
      (booking) => booking._id.toString() === bookingId
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update the booking status
    booking.status = status;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
