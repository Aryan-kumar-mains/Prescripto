"use client"
import { fetchDoctorDetails } from "@/app/_utils/doctorAuth";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
// import { AppSidebar } from "@/components/app-sidebar"

const page = () => {
     const { data: session, status } = useSession();
     const [userData, setUserData] = useState(null);

     useEffect(() => {
          let data = null; // to store doctor data

          const getUserData = async () => {
               try {
                    data = await fetchDoctorDetails(session.user.accessToken);
                    // console.log("user data:", data);
                    setUserData(data);
               } catch (err) {
                    console.error("Error fetching user data:", err);
                    toast({
                         variant: "destructive",
                         title: "Error loading profile",
                         description:
                              "Failed to load your profile data. Please try again later.",
                    });
               }
          };
          if(status === "authenticated") {
               getUserData();
               // console.log("User Data ::", userData)
          }

     },[status]);

     if(status === "unauthenticated" || userData?.status == false) {
          return (
               <div className="container mx-auto py-8 px-4 text-center">
                    <p>{userData.message}</p>
               </div>
          );
     }


     return <div>page</div>;
};

export default page;
