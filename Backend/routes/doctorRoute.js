import express from 'express';
import { deleteAvailability, forgotPassword, getDoctorDetails, loginDoctor, logoutDoctor, resetPassword, updateAvailability, updateDoctorDetails } from '../controllers/doctorController.js';
import { isAuthenticateUser } from '../middleware/auth.js';
import upload from '../middleware/multer.js';


const router = express.Router();

// register of a doctor should be done by admin


// api to login doctor
router.post('/login', loginDoctor);

// api to logout doctor
router.route('/logout').post(isAuthenticateUser, logoutDoctor);

// api to get doctor details
router.route('/profile').get(isAuthenticateUser, getDoctorDetails);

// api to forget password
router.route('/password/forgot').post(forgotPassword);

// api to reset password
router.route('/password/reset/:token').put(resetPassword);

// api to update doctor profile
router.route('/update-profile').put(upload.single('image'), isAuthenticateUser, updateDoctorDetails);

// api to add or update availability of doctor
router.route('/update-availability').put(isAuthenticateUser, updateAvailability);

// api to delete availability of doctor
router.route('/delete-availability').delete(isAuthenticateUser, deleteAvailability);

// api to change the status of booking


export default router;