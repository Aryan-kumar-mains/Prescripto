import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const DoctorCard = ({ doctors }) => {
     return (
          <div>
               <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-7 my-14'>
                    {doctors.length > 0 ?
                         doctors.map((item, index) => (
                              <Link key={index} href={'/doctor/details/' + item._id} className='w-full'>
                                   <div className='border-[1px] rounded-lg hover:-translate-y-3 duration-500'>
                                        <Image
                                             src={item.image}
                                             alt='doctor image'
                                             width={500} height={200}
                                             className='bg-[#EAEFFF] w-full'
                                        />
                                        <div className='mt-1 items-baseline flex flex-col gap-1 p-3'>
                                             <h2 className='text-[10px] bg-blue-100 p-1 rounded-full px-2 text-primary'>{item.specialization} </h2>
                                             <h2 className='text-primary text-sm'>{item.experience.years} Years of Exp. </h2>
                                             <h2 className=''>{item.name} </h2>
                                             <Button className='p-2 px-3 border-[1px]
                             border-primary
                             text-white 
                             rounded-full w-full 
                             text-center text-[11px] mt-2 
                             cursor-pointer hover:bg-primary-foreground
                             hover:text-primary tracking-wide text-lg font-serif'>Book Now</Button>
                                        </div>
                                   </div>
                              </Link>
                         )) :
                         // Skeleton Effect
                         [1, 2, 3, 4, 5, 6].map((item, index) => (
                              <div key={index} className='h-[220px] bg-slate-300 animate-pulse rounded-lg w-full'>
                                   <div>

                                   </div>
                              </div>
                         ))
                    }
               </div>
          </div>
     )
}

export default DoctorCard

