import { getDoctorsBySpecialization } from '@/app/_utils/getDoctors';
import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, MapPin } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const DoctorSuggestions = ({ doctorInfo }) => {
  const [suggestedDoctors, setSuggestedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDoctorSuggestionBySpecialization = async () => {
      if (!doctorInfo?.specialization || !doctorInfo?._id) return;
      
      setLoading(true);
      try {
        const response = await getDoctorsBySpecialization({ 
          specialization: doctorInfo.specialization, 
          doctorId: doctorInfo._id 
        });
        setSuggestedDoctors(response);
      }
      catch(error) {
        console.log("Error while fetching doctors list based on specialization : ", error.message);
      }
      finally {
        setLoading(false);
      }
    };
    
    getDoctorSuggestionBySpecialization();
  }, [doctorInfo]);

  if (loading) {
    return (
      <div className="py-4">
        <h3 className="font-bold text-lg mb-4">Similar Doctors</h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex flex-col space-y-2">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (suggestedDoctors?.length === 0) {
    return (
      <div className="py-4">
        <h3 className="font-bold text-lg mb-4">Similar Doctors</h3>
        <p className="text-gray-500 text-sm">No other doctors found with this specialization.</p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <h3 className="font-bold text-lg mb-4">Similar Doctors</h3>
      <div className="space-y-4">
        {suggestedDoctors?.slice(0, 3).map((doctor) => (
          <Link href={`/doctor/details/${doctor._id}`} key={doctor._id}>
            <div className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
              {/* Doctor Image */}
              <div className="mb-2">
                <Image 
                  src={doctor.image} 
                  alt={doctor.name}
                  width={100} 
                  height={100}
                  className="rounded-lg h-[100px] w-full object-contain" 
                />
              </div>
              
              {/* Doctor Name with Verified Badge */}
              <div className="flex items-center gap-1 mb-1">
                <h4 className="font-semibold text-sm truncate">{doctor.name}</h4>
                <BadgeCheck className="w-3 h-3 text-primary" />
              </div>
              
              {/* Specialization */}
              <div className="mb-1">
                <span className="text-primary text-[10px] bg-blue-100 rounded-full px-2 py-0.5">
                  {doctor.specialization}
                </span>
              </div>
              
              {/* Experience */}
              <p className="text-xs text-gray-600 mb-1">
                {doctor.experience?.years}+ Years Experience
              </p>
              
              {/* Location */}
              <div className="flex items-center text-xs text-gray-500">
                <MapPin className="w-3 h-3 mr-1" />
                <span className="truncate">{doctor.address?.city}</span>
              </div>
              
              {/* Fees */}
              <p className="text-xs font-medium mt-1">
                ${doctor.fees}
              </p>
            </div>
          </Link>
        ))}
        
        {suggestedDoctors?.length > 3 && (
          <Link 
            href={`/doctor/search?specialization=${doctorInfo.specialization}`}
            className="text-primary text-sm font-medium block text-center hover:underline"
          >
            View all {suggestedDoctors.length} doctors
          </Link>
        )}
      </div>
    </div>
  );
};

export default DoctorSuggestions;
