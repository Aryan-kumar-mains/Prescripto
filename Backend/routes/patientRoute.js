import express from 'express';
import { forgotPassword, getAllDoctors, getAllSpecialization, getDoctorBySpecialization, getDoctorInfoById, getFeaturedDoctors, getPatientDetails, loginPatient, logoutPatient, registerPatient, resetPassword, updatePassword } from '../controllers/patientController.js';
import upload from '../middleware/multer.js';
import { isAuthenticateUser } from '../middleware/auth.js';
import Specialization from '../models/specializationModel.js';


const router = express.Router();


// api call for register a patient
router.route("/register").post(upload.single('image') , registerPatient );

// api call for login a patient
router.route("/login").post(loginPatient);

//  api call for logout a patient
router.route("/logout").get(logoutPatient);

/// api call for get patient details
router.route("/profile").get(isAuthenticateUser,  getPatientDetails);

// api call for forgot password
router.route("/password/forgot").post(forgotPassword);

// api call for reset password
router.route("/password/reset/:token").put(resetPassword);

// api call for update the patient password
router.route("/password/update").put(isAuthenticateUser ,updatePassword);

// api call for update the patient profile

// api call for getting all the specializations
router.route("/specializations").get(getAllSpecialization);

// api call for getting all the doctors list
router.route("/all-doctors").get(getAllDoctors);

// api call for getting featured doctors only
router.route("/featured-doctors").get(getFeaturedDoctors);

// api call for getting doctor's info by id
router.route("/doctor/:id").get(getDoctorInfoById);

// api call for getting doctors by specialization
router.route("/doctors-by-specialization/:specialization").get(getDoctorBySpecialization);



export default router;