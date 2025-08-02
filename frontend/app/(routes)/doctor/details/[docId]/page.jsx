"use client";
import React, { useEffect, useState } from "react";

import DoctorSuggestions from "../_components/DoctorSuggestions";
import DoctorDetail from "../_components/DoctorDetail";
import { getDoctorDetails } from "@/app/_utils/getDoctors.js";

const page = ({ params }) => {
  const [doctorInfo, setDoctorInfo] = useState();

  let { docId } = React.use(params);
  // console.log("param.recordId: ", params.recordId);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await getDoctorDetails(docId);
        setDoctorInfo(response);
      } catch (error) {
        // console.log("Error while fetching doctor's details : ", error.message);
      }
    };

    fetchDoctorDetails();
  }, [docId]);

  return (
    <div className="p-5 md:px-5">
      <h2 className="font-bold text-[22px]">Details</h2>
      <div className="grid grid-cols-1 lg:grid-cols-4">
        {/* Doctor Details  */}
        <div className="col-span-3">
          {doctorInfo && <DoctorDetail doctorInfo={doctorInfo} />}
        </div>

        {/* Doctors suggestion */}
        <div className="col-span-1 mx-4 border rounded-lg  px-4 mt-5">
          <DoctorSuggestions doctorInfo={doctorInfo} />
        </div>
      </div>
    </div>
  );
};

export default page;
