import otpGenerator from 'otp-generator';
import { sendEmail } from './sendEmail.js';

// In-memory OTP storage with expiration
const otpStore = new Map();

// Generate OTP
export const generateOTP = () => {
  return otpGenerator.generate(6, { 
    upperCaseAlphabets: false, 
    lowerCaseAlphabets: false, 
    specialChars: false 
  });
};

// Store OTP with expiration
export const storeOTP = (patientId, bookingData, otp) => {
  const key = `booking:otp:${patientId}`;
  
  // Clear any existing timeout for this key
  if (otpStore.has(key) && otpStore.get(key).timeoutId) {
    clearTimeout(otpStore.get(key).timeoutId);
  }
  
  // Set expiration (15 minutes)
  const timeoutId = setTimeout(() => {
    otpStore.delete(key);
  }, 15 * 60 * 1000);
  
  // Store OTP, booking data, and timeout ID
  otpStore.set(key, { otp, bookingData, timeoutId });
};

// Verify OTP
export const verifyOTP = (patientId, userOTP) => {
  const key = `booking:otp:${patientId}`;
  const data = otpStore.get(key);
  
  if (!data) {
    return { valid: false, message: "OTP expired or not found" };
  }
  
  if (data.otp !== userOTP) {
    return { valid: false, message: "Invalid OTP" };
  }
  
  // Clear the timeout
  if (data.timeoutId) {
    clearTimeout(data.timeoutId);
  }
  
  // Delete the OTP after successful verification
  otpStore.delete(key);
  
  return { valid: true, bookingData: data.bookingData };
};

// Send OTP via email
export const sendOTPEmail = async (patient, otp) => {
  const message = `Hi ${patient.firstName},\n\nYour OTP for booking confirmation is: ${otp}\n\nThis OTP is valid for 5 minutes.\n\nThanks and Regards,\nSreeDev Hospital Management System`;
  
  await sendEmail({
    email: patient.email,
    subject: "OTP for Appointment Booking",
    message
  });
};
