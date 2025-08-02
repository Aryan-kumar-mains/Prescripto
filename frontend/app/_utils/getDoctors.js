
// get all doctors from backend
export const getAllDoctors = async () => {
  try {
    const allDoctors = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/patient/all-doctors`,
      {
        method: "Get",
        headers: {
          "content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
      }
    );

    if (!allDoctors.ok) {
      throw new Error("Failed to fetch doctors list");
    }

    const data = await allDoctors.json();
    return data;
  } catch (error) {
    console.error("Error fetching featured doctors:", error);
    throw new Error({ message: error.message });
  }
};

// fetching doctor's specific Info only from backend
export const getDoctorDetails = async (docId) => {

  try {
    const doctorDetails = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/patient/doctor/${docId}`,
      {
        method: "Get",
        headers: {
          "content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
      }
    );

    if(!doctorDetails.ok){
      console.log("Not able to find Details of doctor from backend");
    }
    const data = await doctorDetails.json();
    return data;
  } catch (error) {
    console.log("Error fetching doctor's details:", error);
    throw new Error({ message: error.message });
  }
};

// fetching doctors list by specialization
export const getDoctorsBySpecialization = async ({ specialization, doctorId }) => {
  try {
    // Build the URL with optional query parameter
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/patient/doctors-by-specialization/${specialization}`;

    // Add excludeDoctorId as a query parameter if provided
    if (doctorId) {
      url += `?excludeDoctorId=${doctorId}`;
    }
    
    const doctorsBySpecialization = await fetch(
      url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
      }
    );

    if (!doctorsBySpecialization.ok) {
      throw new Error("Failed to fetch doctors by specialization");
    }

    const data = await doctorsBySpecialization.json();
    return data;
  } catch (error) {
    console.error("Error fetching doctors by specialization:", error);
    throw new Error(error.message);
  }
};
