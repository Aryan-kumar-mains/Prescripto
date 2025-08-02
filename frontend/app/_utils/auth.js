/**
 * Fetches the user's profile details from the server.
 *
 * This function checks if a token is available in the local storage, and if so, makes a series of fetch requests to different API endpoints to retrieve the user's profile information.
 *
 * @returns {Promise<null>} - Returns null if the token is not available, or if an error occurs during the fetch requests.
 */


// login for patient
export const registerUser = async (userData) => {
  // console.log("User Data before Register: ", userData);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  // console.log("user data after register call:", data);
  return data;
};

// logout for patient
export const logoutUser = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/logout`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  // console.log("Logout User data :", data);
  return data;
};

// forgot password for patient
export const forgotPassword = async (email) => {
  try {
    // console.log("Email : ", email);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/patient/password/forgot`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();
    // console.log("Forgot Password data :", data);
    return data;
  } catch (error) {
    console.log("Forgot password error: ", error);
    throw error;
  }
};

// Reset password for patient
export const resetPassword = async (resetData) => {
  const { password, token } = resetData;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/password/reset/${token}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();
    // console.log("Reset password response:", data);
    return data;
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
};


// for patient profile
export const fetchUserDetails = async (accessToken) => {

  // Create headers with authentication token
  const headers = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers["authorization"] = `Bearer ${accessToken}`;
  } else {
    console.log("No access token provided for booking initiation.");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/profile`, {
    headers: headers,
  });

  const data = await response.json();
  // console.log("User Details data :", data);
  return data;
};

