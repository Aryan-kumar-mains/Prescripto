
// Initiate Booking
export const InitiateBooking = async (bookingData) => {
  // Create headers with authentication token
  const headers = {
    "Content-Type": "application/json",
  };
  if (bookingData.accessToken) {
    headers["authorization"] = `Bearer ${bookingData.accessToken}`;
  } else {
    console.log("No access token provided for booking initiation.");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/booking/initiate`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(bookingData),
    credentials: "include", // Important to include cookies for authentication
  });

  const data = await response.json();
  console.log("Booking Data during initiation of booking:", data);
  return data;
};

// Confirm Booking with OTP
export const ConfirmBooking = async ({ otpValue, accessToken }) => {
  //  Create headers with authentication token
  const headers = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers["authorization"] = `Bearer ${accessToken}`;
  } else {
    console.log("No access token provided for booking initiation.");
  }

  // console.log("OTP Value:", otpValue);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/booking/confirm/`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ otpValue }),
    credentials: "include", // Important to include cookies for authentication
  });

  const data = await response.json();
  // console.log("Booking Confirmation Data:", data);
  return data;
};

// Get User Bookings
export const getUserBookings = async (accessToken) => {
  // Create headers with authentication token
  const headers = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers["authorization"] = `Bearer ${accessToken}`;
  } else {
    console.log("No access token provided for fetching bookings.");
    return { success: false, message: "Authentication required" };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/booking/getBooking`, {
      method: "GET",
      headers: headers,
      credentials: "include", // Important to include cookies for authentication
    });

    const data = await response.json();
    // console.log("User Bookings Data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return { success: false, message: "Failed to fetch bookings" };
  }
};


// Cancel Booking
export const cancelBooking = async ({ bookingId, reason, accessToken }) => {
  // Create headers with authentication token
  const headers = {
    "Content-Type": "application/json",
  };
  console.log("Access Token:", accessToken);
  
  if (accessToken) {
    headers["authorization"] = `Bearer ${accessToken}`;
  } else {
    console.log("No access token provided for cancelling booking.");
    return { success: false, message: "Authentication required" };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/booking/cancelBooking/${bookingId}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({ reason }),
      credentials: "include", // Important to include cookies for authentication
    });

    const data = await response.json();
    // console.log("Booking Cancellation Data:", data);
    return data;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return { success: false, message: "Failed to cancel booking" };
  }
};

