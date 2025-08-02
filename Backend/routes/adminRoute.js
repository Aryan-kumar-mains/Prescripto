import express from "express";
import { addDoctor, addSpecialization, updateDoctorRecords } from "../controllers/adminController.js";
import upload from "../middleware/multer.js";
import { authorizeRoles, isAuthenticateUser } from "../middleware/auth.js";


const adminRouter = express.Router();


// api call for adding doctor
adminRouter.route("/add-doctor").post(upload.single('image') ,isAuthenticateUser, authorizeRoles, addDoctor); // calling a middleware called upload to upload image of doctor


// api call for adding specialization
adminRouter.route("/add-specialization").post(upload.single('image'), isAuthenticateUser, authorizeRoles, addSpecialization); // calling a middleware called upload to upload image of specialization;

// api call for updating doctor's schema in existing doctors data in DB
adminRouter.route("/update-doctor-schema").put(isAuthenticateUser, authorizeRoles, updateDoctorRecords);





export default adminRouter;