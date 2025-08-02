"use client"
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { loginUser, registerUser } from '@/app/_utils/auth'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { useLoading } from '@/app/_components/general/LoadingSpinner'
import Link from 'next/link'


export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { data: session, status } = useSession();
  const { startLoading, stopLoading, updateMessage } = useLoading();

  // Non-sensitive display state (doesn't include password)
  const [password, setPassword] = useState('');
  const [displayData, setDisplayData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'patient'
  });

  // Handle redirection when authentication status changes
  useEffect(() => {
    if (status === "authenticated" && !isRedirecting) {
      setIsRedirecting(true);

      startLoading("Success! Redirecting to home page...");
    }
  }, [status, isRedirecting, startLoading]);

  // Handle the actual redirection with delay
  useEffect(() => {
    if (isRedirecting) {
      const redirectTimer = setTimeout(() => {
        router.push('/');
        stopLoading();
      }, 2000); // 2 seconds delay for the animation to be visible

      return () => clearTimeout(redirectTimer);
    }
  }, [isRedirecting, router, stopLoading]);

  const updateFormData = (field, value) => {
    // console.log("Updating field:", field, "with value:", value);
    setDisplayData(prev => ({
      ...prev,
      [field]: value
    }));

  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(displayData.email)) {
    //   newErrors.email = "Please enter a valid email address";
    // }

    // Password validation
    // if (password.length < 8) {
    //   newErrors.password = "Password must be at least 8 characters";
    // }

    // Registration-specific validations
    // if (!isLogin) {
    //   if (displayData.firstName.length < 2) {
    //     newErrors.firstName = "First name is required";
    //   }

    //   if (displayData.lastName.length < 2) {
    //     newErrors.lastName = "Last name is required";
    //   }

    //   if (!["patient", "doctor"].includes(displayData.role)) {
    //     newErrors.role = "Please select a valid role";
    //   }
    // }

    // setErrors(newErrors);
    // return Object.keys(newErrors).length === 0;
  };

  // const resetForm = () => {
  //   // Reset form data
  //   if (!isLogin) {
  //     displayData = {
  //       firstName: '',
  //       lastName: '',
  //       email: '',
  //       password: '',
  //       phone: '',
  //       role: 'patient'
  //     };

  //     setDisplayData({
  //       // firstName: '',
  //       // lastName: '',
  //       email: '',
  //       phone: '',
  //       role: 'patient'
  //     });
  //   } else {
  //     displayData = {
  //       ...displayData,
  //       email: '',
  //       password: ''
  //     };

  //     setDisplayData(prev => ({
  //       ...prev,
  //       email: ''
  //     }));
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      startLoading(isLogin ? "Logging you in..." : "Creating your account...");

      if (isLogin) {
        // Used the nextAuth credentials provider for login
        const response = await signIn("credentials", {
          email: displayData.email,
          password: password,
          redirect: false,
        });

        if (!response.error) {
          // Manually set redirecting state since we want to show the spinner
          setIsRedirecting(true);
          updateMessage("Success! Redirecting to home page...");
        } else {
          // console.log("Login respoonse:", response);
          setErrors({ form: response.message || 'Login failed. Please check your credentials.' });
          setIsSubmitting(false); // Reset isSubmitting when login fails
          stopLoading();
        }
      } else {
        // console.log("Registering user:", displayData);
        // console.log("Registering Password:", password);

        const response = await registerUser({
          firstName: displayData.firstName,
          lastName: displayData.lastName,
          email: displayData.email,
          password: password,
          phone: displayData.phone,
          role: displayData.role
        });
        // console.log("Registration response:", response);


        if (response.success) {
          updateMessage("Registration successful! Logging you in...");

          // After registration, log the user in automatically
          const result = await signIn("credentials", {
            email: displayData.email,
            password: password,
            redirect: false,
          });

          if (!result.error) {
            // Manually set redirecting state
            setIsRedirecting(true);
            updateMessage("Success! Redirecting to home page...");
            // We'll let the useEffect handle the actual redirection
          } else {
            setErrors({ form: result.error || 'Auto-login failed after registration.' });
            setIsSubmitting(false);
            stopLoading();
          }
        } else {
          setErrors({ form: response.message || 'Registration failed. Please try again.' });
          setIsSubmitting(false);
          stopLoading();
          // Reset form on error
          // resetForm();
        }
      }
    } catch (error) {
      console.error('Auth failed:', error);
      setErrors({ form: errorMessage });
      setIsSubmitting(false);
      stopLoading();
    } finally {
      // Only clear password, don't reset isSubmitting here as we want to keep the button disabled
      // password = '';
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    // Reset form data when switching modes
    // resetForm();
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-primary">
          {isLogin ? "Login to Your Account" : "Create an Account"}
        </h2>

        {errors.form && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600">First Name</label>
                <input
                  type="text"
                  placeholder="John"
                  className={`w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.firstName ? 'border-red-500' : ''}`}
                  value={displayData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  required
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-gray-600">Last Name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  className={`w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.lastName ? 'border-red-500' : ''}`}
                  value={displayData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  required
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>
          )}

          <div className="mt-4">
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              placeholder="example@email.com"
              className={`w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? 'border-red-500' : ''}`}
              value={displayData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              required
              autoComplete="username"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {!isLogin && (
            <div className="mt-4">
              <label className="block text-gray-600">Phone Number</label>
              <input
                type="tel"
                placeholder="1234567890"
                className={`w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.phone ? 'border-red-500' : ''}`}
                value={displayData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                required
                maxLength={10}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          )}

          <div className="mt-4">
            <label className="block text-gray-600">Password</label>
            <input
              type="password"
              placeholder="********"
              className={`w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.password ? 'border-red-500' : ''}`}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Forgot Password Link */}
          {isLogin && (
            <div className="mt-1 text-right">
              <Link href="/u/password/forgot" className="text-sm text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>
          )}

          {!isLogin && (
            <div className="mt-4">
              <label className="block text-gray-600">Role</label>
              <select
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={displayData.role}
                onChange={(e) => updateFormData('role', e.target.value)}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
          )}

          <Button
            type="submit"
            className="w-full mt-6 bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-primary cursor-pointer font-semibold"
            onClick={toggleAuthMode}
          // onClick={() => {
          //   setIsLogin(!isLogin);
          //   setErrors({});
          //   password = '';
          // }}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  )
}
