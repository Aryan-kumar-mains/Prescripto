"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { forgotPassword } from '@/app/_utils/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLoading } from '@/app/_components/general/LoadingSpinner'

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { startLoading, stopLoading, updateMessage } = useLoading();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Basic validation
    if (!email || !email.includes('@')) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    try {
      setIsSubmitting(true);
      startLoading("Sending password reset link...");
      
      const response = await forgotPassword(email);
      
      if (response.success) {
        setSuccess(true);
        updateMessage("Reset link sent! Check your email.");
        setTimeout(() => {
          stopLoading();
        }, 2000);
      } else {
        setErrors({ form: response.message || 'Failed to send reset link. Please try again.' });
        stopLoading();
      }
    } catch (error) {
      console.error('Forgot password failed:', error);
      setErrors({ form: 'An unexpected error occurred. Please try again.' });
      stopLoading();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-primary">
          Forgot Password
        </h2>
        
        {success ? (
          <div className="mt-6 text-center">
            <div className="p-3 bg-green-100 text-green-700 rounded mb-4">
              Password reset link has been sent to your email.
            </div>
            <p className="mb-4">Please check your inbox and follow the instructions to reset your password.</p>
            <Link href="/u/authorize">
              <Button className="w-full">
                Return to Login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-2 text-gray-600 text-center">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {errors.form && (
              <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6">
              <div className="mt-4">
                <label className="block text-gray-600">Email</label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  className={`w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? 'border-red-500' : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <Button
                type="submit"
                className="w-full mt-6 bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
              
              <div className="mt-4 text-center">
                <Link href="/u/authorize" className="text-primary hover:underline">
                  Back to Login
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
