"use client"
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from 'react-toastify';

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { InitiateBooking } from '@/app/_utils/booking'
import { useSession } from 'next-auth/react'
import BookingConfirmation from './BookingConfirmation'
import { useLoading } from '@/app/_components/general/LoadingSpinner'


// Function to generate date options for the next 15 days
const generateDateOptions = (days = 15) => {
    return Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i + 1); // Start from tomorrow

        return {
            value: date.toISOString(),
            label: format(date, "EEE, MMM d, yyyy")
        };
    });
};

const BookingForm = ({ selectedTime, setSelectedTime, globalTimeSlots, doctorInfo }) => {
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";
    const { startLoading, stopLoading } = useLoading();

    // Add this ref to close the sheet
    const sheetCloseRef = React.useRef(null);

    const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [bookingError, setBookingError] = useState('')

    const [date, setDate] = React.useState('')
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        sex: '',
        mobile: '',
        address: '',
        date: date || null, // now a Date object
        time: '',
        doctor: doctorInfo._id,
    });

    // Generate date options
    const dateOptions = generateDateOptions();


    useEffect(() => {
        if (date) {
            setFormData(prev => ({ ...prev, date }));
        }
        if (selectedTime) {
            setFormData(prev => ({ ...prev, time: selectedTime }));
        }
    }, [date, selectedTime]);



    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    // Form validation function
    const validateForm = () => {
        const errors = [];

        if (!formData.name.trim()) {
            errors.push("Patient name is required");
        }

        if (!formData.age.trim()) {
            errors.push("Age is required");
        }

        if (!formData.sex) {
            errors.push("Patient sex is required");
        }

        if (!formData.mobile.trim()) {
            errors.push("Mobile number is required");
        }

        if (!formData.date) {
            errors.push("Booking date is required");
        }

        if (!formData.time) {
            errors.push("Time slot is required");
        }

        // Additional validations
        if (formData.age && (isNaN(formData.age) || parseInt(formData.age) <= 0 || parseInt(formData.age) > 150)) {
            errors.push("Please enter a valid age");
        }

        if (formData.mobile && !/^\d{10}$/.test(formData.mobile.replace(/\s/g, ''))) {
            errors.push("Please enter a valid 10-digit mobile number");
        }

        return errors;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setBookingError('');

        // Validate form
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            toast.error(validationErrors[0]); // Show first error
            setIsSubmitting(false);
            return;
        }
        
        startLoading('Processing your booking request...');
        
        try {
            // Prepare booking data in the format expected by the backend
            const bookingData = {
                doctor: doctorInfo._id,
                patientName: formData.name,
                patientPhone: formData.mobile,
                patientSex: formData.sex,
                patientAge: formData.age,
                patientAddress: formData.address,
                bookingDate: formData.date,
                bookingTimeSlot: formData.time,
                accessToken: session?.user.accessToken || null, // Include access token if available
            };
            // console.log("Booking Time Slot::", bookingData.bookingTimeSlot);
            // console.log("Date selected::", formData.date);

            // console.log('Sending booking data:', bookingData);

            // Call the API to initiate booking
            const response = await InitiateBooking(bookingData);

            if (response.success) {
                // If successful, open OTP dialog
                setIsOtpDialogOpen(true);
            } else {
                // Handle error
                toast.error(response?.message || 'You are not authenticated! Please login to book an appointment.');
                setBookingError(response.message || 'Failed to initiate booking');
            }
        } catch (error) {
            console.error('Error initiating booking:', error);
            toast.error(response?.message || 'You are not authenticated! Please login to book an appointment.');
            setBookingError('An error occurred while initiating booking');
        } finally {
            setIsSubmitting(false);
            stopLoading();
            // toast.success(response?.message || 'Booked');
        }
    };

    return (
        <div>

            {/* Booking form  */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button className="rounded-full mt-3 tracking-wider">Book Appointment</Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Appointment Booking form</SheetTitle>
                        <SheetDescription>
                            Please fill the form to book an appointment of patient. Click Submit when you're done.
                        </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            {/* Patient full name  */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Patient Full Name<span className="text-red-500">*</span>
                                </Label>
                                <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" />
                            </div>

                            {/* Patient age  */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="age" className="text-right">
                                    Age<span className="text-red-500">*</span>
                                </Label>
                                <Input id="age" value={formData.age} onChange={handleChange} className="col-span-3" />
                            </div>

                            {/* Patient sex  */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="sex" className="text-right">
                                    Patient Sex<span className="text-red-500">*</span>
                                </Label>
                                <div className="col-span-3">
                                    <Select
                                        onValueChange={(value) => setFormData({ ...formData, sex: value })}
                                        value={formData.sex}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Not Selected" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Patient mobile number  */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="mobile" className="text-right">
                                    Mobile Number<span className="text-red-500">*</span>
                                </Label>
                                <Input id="mobile" value={formData.mobile} onChange={handleChange} className="col-span-3" />
                            </div>

                            {/* Patient address  */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="address" className="text-right">
                                    Address
                                </Label>
                                <Input id="address" value={formData.address} onChange={handleChange} className="col-span-3" />
                            </div>

                            {/* Booking date  */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="date" className="text-right">
                                    Select Date<span className="text-red-500">*</span>
                                </Label>
                                <Select onValueChange={(value) => {
                                    const selectedDate = new Date(value);
                                    setFormData({ ...formData, date: selectedDate });
                                    if (setDate) setDate(selectedDate);
                                }}>
                                    <SelectTrigger className="col-span-3">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        <SelectValue placeholder="Select a date">
                                            {formData.date ? format(formData.date, "EEE, MMM d, yyyy") : "Select a date"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dateOptions.map((option, index) => (
                                            <SelectItem key={index} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Time Slot Selection */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="time" className="text-right">
                                    Select Time Slot<span className="text-red-500">*</span>
                                </Label>
                                <Select onValueChange={(value) => {
                                    setFormData({ ...formData, time: value });
                                    setSelectedTime(value); // Also update the selectedTime prop
                                }}
                                    value={formData.time} // Add this to show the selected value
                                >

                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Choose time slot" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {globalTimeSlots.map((slot, index) => (
                                            <SelectItem
                                                key={index}
                                                value={`${slot.startTime} - ${slot.endTime}`}
                                            >
                                                {slot.startTime} - {slot.endTime}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                        </div>

                        {/* Submit and Cancel buttons */}
                        <SheetFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }}
                            >
                                {isSubmitting ? 'Processing...' : 'Submit'}
                            </Button>
                            <SheetClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                            </SheetClose>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>

            {/*  OTP Dialog */}
            <BookingConfirmation
                isOpen={isOtpDialogOpen}
                onOpenChange={setIsOtpDialogOpen}
                onSuccess={() => {
                    // Close the OTP dialog
                    setIsOtpDialogOpen(false);

                    // Reset form
                    setFormData({
                        name: '',
                        age: '',
                        sex: '',
                        mobile: '',
                        address: '',
                        date: '',
                        time: ''
                    });

                    // Close the booking sheet
                    if (sheetCloseRef.current) {
                        sheetCloseRef.current.click();
                    }
                }}
                accessToken={session?.user.accessToken}
                bookingError={bookingError}
                setBookingError={setBookingError}
            />
        </div>
    )
}

export default BookingForm