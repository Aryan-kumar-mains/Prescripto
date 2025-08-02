import "dotenv/config";
import express from "express";
import connectDB from "./config/database.js";
import connectCloudinary from "./config/cloudinary.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import csrf from "csurf";

// import Routes
import adminRouter from "./routes/adminRoute.js";
import patientRouter from "./routes/patientRoute.js";
import bookingRouter from "./routes/bookingRoute.js";
import doctorRouter from "./routes/doctorRoute.js";

const app = express();
const PORT = process.env.PORT || 4000;

dotenv.config();

app.use(cookieParser()); // it will be usefull when we want to take token fromm cookies

// Add security headers
app.use(helmet());

// First Load environment variables from config/config.env
// dotenv.config({ path: path.resolve(__dirname, 'config/.env') });
connectDB();
connectCloudinary();

app.use(express.json());

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Parse application/json
app.use(bodyParser.json());

// Parse multipart/form-data
app.use(bodyParser.raw());

// app.use(cors()); // it allows to make request from different domain name or port number(like from frontend)

// With this:
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend origin
    credentials: true, // Allow credentials
  })
);

// calling api
app.use("/api/patient", patientRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/booking", bookingRouter);

// CSRF protection for non-GET requests
app.use(csrf({ cookie: true }));

app.get("/", (req, res) => {
  res.send("Hello World" + process.env.DB_URI);
});

app.listen(PORT, () => {
  console.log("Server is running on port http://localhost:" + PORT);
});
