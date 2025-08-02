import { BadgeCheck, BadgeCheckIcon, BriefcaseBusinessIcon, GraduationCap, MapPin } from 'lucide-react';
import Image from 'next/image';
import React from 'react'
import BookAppointment from './BookAppointment';

const DoctorDetail = ({ doctorInfo }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 rounded-lg border-[1px] p-5 mt-5">
        {/* Doctor Image */}
        <div className="col-span-1">
          <Image src={doctorInfo?.image}
            alt="doctor"
            width={200} height={200}
            className="rounded-lg h-[270px] object-cover" />
        </div>
        {/* Doctor Info */}
        <div className="col-span-2 mt-5 md:px-10 space-y-3">
          <div className="space-y-2 ">
            {/* Name & verfied icon */}
            <div className='flex items-center gap-4'>
              <h2 className="font-bold text-2xl">{doctorInfo?.name}</h2>
              <div className="ml-2 bg-primary text-white inline-flex items-center justify-center rounded-full">
                <BadgeCheckIcon className="w-5 h-5" />
              </div>
            </div>
            {/* Specialization */}
            <h2 className="text-primary inline-block text-[10px] bg-blue-100 rounded-full p-1 px-2 tracking-wider">
              {doctorInfo?.specialization}
            </h2>
            {/* Experience */}
            <h2 className="text-gray-500 flex gap-2">
              <BriefcaseBusinessIcon /> {/* Icon */}
              <span>{doctorInfo?.experience?.years}+ Years Experience</span>
            </h2>
            {/* Qualifications */}
            <h2 className='text-gray-500 flex gap-2'>
              <GraduationCap />
              {doctorInfo?.qualification}
            </h2>
            {/* Locations */}
            <h2 className='text-gray-500 flex gap-2'>
              <MapPin />
              {doctorInfo?.address?.addressLine1}, {doctorInfo?.address?.city}, {doctorInfo?.address?.pincode}, {doctorInfo?.address?.state}
            </h2>
            {/* Fees */}
            <h2>
              <span className="">Appointment Fees: ${doctorInfo?.fees} </span>
            </h2>
            {/* Book Appointment */}
            <BookAppointment doctorInfo={doctorInfo} />
          </div>
        </div>
        
        {/* About */}
      </div>
      <div className='p-3 border-[1px] rounded-lg mt-5'>
        <h2 className="font-bold text-xl">About</h2>
        <p className="text-gray-500">{doctorInfo?.about}</p>
      </div>
    </>
  )
}

export default DoctorDetail
