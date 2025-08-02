"use client"
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLoading } from '@/app/_components/general/LoadingSpinner'
import { resetPassword } from '@/app/_utils/auth'
import { use } from 'react'

export default function ResetPasswordPage({ params }) {
  const router = useRouter();

  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const token = unwrappedParams.token || params.token;  // Extract token from URL parameters
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { startLoading, stopLoading, updateMessage } = useLoading();

  // Validate token format
  useEffect(() => {
    if (!token || token.length < 20) {
      setErrors({ form: "Invalid or expired reset token" });
    }
  }, [token]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (password.length < 8) {
      setErrors({ password: "Password must be at least 8 characters" });
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    try {
      setIsSubmitting(true);
      startLoading("Resetting your password...");

      const response = await resetPassword({ password, token });

      if (response.success) {
        setSuccess(true);
        updateMessage("Password reset successful!");
        setTimeout(() => {
          router.push('/u/authorize');
          stopLoading();
        }, 2000);
      } else {
        setErrors({ form: response.message || 'Failed to reset password. The link may have expired.' });
        stopLoading();
      }
    } catch (error) {
      console.error('Reset password failed:', error);
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
          Reset Password
        </h2>

        {success ? (
          <div className="mt-6 text-center">
            <div className="p-3 bg-green-100 text-green-700 rounded mb-4">
              Your password has been reset successfully!
            </div>
            <p className="mb-4">You can now log in with your new password.</p>
            <Link href="/u/authorize">
              <Button className="w-full">
                Go to Login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-2 text-gray-600 text-center">
              Create a new password for your account
            </p>

            {errors.form && (
              <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6">
              <div className="mt-4">
                <label className="block text-gray-600">New Password</label>
                <input
                  type="password"
                  placeholder="********"
                  className={`w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.password ? 'border-red-500' : ''}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="mt-4">
                <label className="block text-gray-600">Confirm Password</label>
                <input
                  type="password"
                  placeholder="********"
                  className={`w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <Button
                type="submit"
                className="w-full mt-6 bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition"
                disabled={isSubmitting || Object.keys(errors).length > 0}
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
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
