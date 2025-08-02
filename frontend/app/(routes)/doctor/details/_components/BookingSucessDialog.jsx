"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { CheckCircle2 } from "lucide-react"
import { format } from "date-fns"

const BookingSuccessDialog = ({ 
    isOpen, 
    onOpenChange, 
    bookingDetails 
}) => {
    if (!bookingDetails) return null;
    
    // Format the date for display
    const formattedDate = bookingDetails.bookingDate ? 
        format(new Date(bookingDetails.bookingDate), "EEEE, MMMM d, yyyy") : 
        "N/A";

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
                {/* Success header with green background */}
                <div className="bg-green-500 p-6 text-white flex flex-col items-center">
                    <CheckCircle2 className="h-16 w-16 mb-2" />
                    <DialogTitle className="text-2xl font-bold text-center">Booking Confirmed!</DialogTitle>
                    <DialogDescription className="text-white text-center mt-2">
                        Your appointment has been successfully booked
                    </DialogDescription>
                </div>
                
                {/* Booking details */}
                <div className="p-6">
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h3 className="font-semibold text-gray-700 mb-2">Booking Details</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Booking ID:</span>
                                <span className="font-medium">{bookingDetails.bookingSerialNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Patient Name:</span>
                                <span className="font-medium">{bookingDetails.patientName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Date:</span>
                                <span className="font-medium">{formattedDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Time:</span>
                                <span className="font-medium">{bookingDetails.bookingTimeSlot}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-700">
                        <p>Please arrive at the hospital at least 30 minutes before your appointment time.</p>
                        <p className="mt-1">A confirmation email has been sent to your registered email address.</p>
                    </div>
                </div>
                
                <DialogFooter className="px-6 pb-6">
                    <Button 
                        onClick={() => onOpenChange(false)}
                        className="w-full"
                    >
                        Done
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BookingSuccessDialog;
