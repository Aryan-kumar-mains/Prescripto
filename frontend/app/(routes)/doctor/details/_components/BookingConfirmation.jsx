"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { ConfirmBooking } from '@/app/_utils/booking'
import { useLoading } from '@/app/_components/general/LoadingSpinner'
// import BookingSuccessDialog from './BookingSuccessDialog'
import BookingSuccessDialog from './BookingSucessDialog'
import confetti from "canvas-confetti";  // for confetti effect on booking/OTP confirmation


const BookingConfirmation = ({
    isOpen,
    onOpenChange,
    onSuccess,
    accessToken,
    bookingError,
    setBookingError
}) => {
    const [otpValue, setOtpValue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { startLoading, stopLoading } = useLoading();

    // Add state for success dialog
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);


    const sideCannonFire = () => {
        const end = Date.now() + 3 * 1000; // 3 seconds
        const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

        const frame = () => {
            if (Date.now() > end) return;

            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                startVelocity: 60,
                origin: { x: 0, y: 0.5 },
                colors: colors,
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                startVelocity: 60,
                origin: { x: 1, y: 0.5 },
                colors: colors,
            });

            requestAnimationFrame(frame);
        };

        frame();
    }


    const handleVerifyOtp = async () => {
        setIsSubmitting(true);
        setBookingError('');

        // Start showing the loading spinner
        startLoading('Verifying OTP...');

        try {
            // Call the API to confirm booking with OTP
            const response = await ConfirmBooking({
                otpValue,
                accessToken: accessToken || null
            });

            if (response.success) {
                // Reset OTP value
                setOtpValue('');

                // Store booking details for the success dialog
                setBookingDetails(response.booking);

                // Close the OTP dialog
                onOpenChange(false);

                // Show the success dialog
                setShowSuccessDialog(true);

                // Call the success callback (for form reset, etc.)
                onSuccess();

                // Trigger confetti effect
                sideCannonFire();
            } else {
                // Handle error
                setBookingError(response.message || 'Failed to verify OTP');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setBookingError('An error occurred while verifying OTP');
        } finally {
            setIsSubmitting(false);
            // Stop the loading spinner once we're done
            stopLoading();
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Verify OTP</DialogTitle>
                        <DialogDescription>
                            We've sent a 6-digit OTP to your email. Please enter it below to confirm your booking.
                        </DialogDescription>
                    </DialogHeader>

                    {bookingError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{bookingError}</span>
                        </div>
                    )}

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="otp" className="text-right">
                                OTP
                            </Label>
                            <Input
                                id="otp"
                                value={otpValue}
                                onChange={(e) => setOtpValue(e.target.value)}
                                className="col-span-3"
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild className='mt-2'>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                        className="mt-2"
                            onClick={handleVerifyOtp}
                            disabled={isSubmitting || otpValue.length !== 6}
                        >
                            {isSubmitting ? 'Verifying...' : 'Verify & Book'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Success Dialog */}
            <BookingSuccessDialog
                isOpen={showSuccessDialog}
                onOpenChange={setShowSuccessDialog}
                bookingDetails={bookingDetails}
            />
        </>
    )
}

export default BookingConfirmation;
