

export const fetchDoctorDetails = async (accessToken) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctor/profile`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    // console.log("Fetched doctor data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching doctor data:", error);
    throw error;
  }
};
