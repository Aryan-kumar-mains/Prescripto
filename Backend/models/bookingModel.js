import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor', // Reference to the Doctor model
    required: true,
  },
  patient: { // it's for the loged in user
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient', // Reference to the Patient model
    required: true,
  },
  patientName: { // this is for the patient whose name is mentioned during filling the form.
    type: String,
    required: true,
  },
  patientPhone: {
    type: String,
    required: true,
  },
  patientSex: {
    type: String,
    required: true,
  },
  patientAge: {
    type: String,
    required: true,
  },
  patientAddress: {
    type: String,
    required: true,
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  bookingTimeSlot: {
    type: String, // E.g., "9AM-10AM"
    required: true,
  },
  bookingStatus: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled',
  },
  bookingSerialNumber: {
    type: String,
    required: true,
  },
  bookingCancelledAt: {
    type: Date,
    default: null,
  },
  bookingCancellationReason: {
    type: String,
    default: null,
  }
}, {
  timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
