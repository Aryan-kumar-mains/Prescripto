"use client"

import React from 'react'
import BookingForm from './BookingForm.jsx'

const BookAppointment = ({doctorInfo}) => {

    const [selectedTime, setSelectedTime] = React.useState("")

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

    const handleClose = () => {
        setSelectedTime("")
    }


    return (
        <BookingForm
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        globalTimeSlots={globalTimeSlots}
        doctorInfo={doctorInfo}
         />
    )
}

export default BookAppointment