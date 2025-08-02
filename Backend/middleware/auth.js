import jwt from 'jsonwebtoken';
import Patient from "../models/patientModel.js";
import Doctor from "../models/doctorModel.js";
import exp from 'constants';


// to authenticate patient & doctor
export const isAuthenticateUser = async (req, res, next) => {
    
    try {
        let {token} = req.cookies;

        // Also check for token in Authorization header
        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // console.log("token :: ",token);
        // console.log("token :: ",re);
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login first to access this resource"
            });
        }

        // console.log("JWT secret :: ",process.env.JWT_SECRET);

        const decoded = jwt.verify(token || "", process.env.JWT_SECRET);
        // console.log("decoded :: ",decoded);
        
        // Check in Patient model first
        let user = await Patient.findById(decoded.id)  || 
                await Doctor.findById(decoded.id) || 
                await Admin.findById(decoded.id);
         
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user;
        // console.log("req.user :: ",req.user);
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};


// to authorize roles
export const authorizeRoles = (req, res, next) => {
    if(req.user.role !== 'admin' || req.user.role == null) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to access this resource"
        });
    }
    next();
}
