import express from "express";
import { isAuthenticateUser } from "../middleware/auth.js";
import { cancelBooking, confirmBooking, getPatientBookings, initiateBooking,  } from "../controllers/bookingController.js";

const router = express.Router();


// api call for two-step booking process with OTP
router.route("/initiate").post(isAuthenticateUser ,initiateBooking);
router.route("/confirm").post(isAuthenticateUser ,confirmBooking);

// api call for cancel booking
router.route("/cancelBooking/:id").put(isAuthenticateUser ,cancelBooking);

// api call for get all booking of a patient
router.route("/getBooking").get(isAuthenticateUser, getPatientBookings);

export default router;