"use client"
import { fetchSpecializations } from '@/app/_utils/getSpecialization';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import '../../../styles/global.css';
import Link from 'next/link';

const CategorySearch = () => {
    const [specializations, setSpecializations] = useState([]);

    useEffect(() => {
        const getSpecializations = async () => {
            try {
                const result = await fetchSpecializations();
                // console.log("All Specializations are here : ", result);
                // Filtering active specializations
                const activeSpecializations = result.filter(item => item.isActive);
                setSpecializations(activeSpecializations);
            }
            catch (error) {
                console.log(error);
            }
        };
        getSpecializations();
        // console.log(specializations);
    }, []);

    return (
        <div className='mb-16'>
            <div className='flex flex-col items-center'>
                <h2 className='font-semibold text-3xl tracking-wide mt-10 pt-10 mb-4'>Find by Speciality</h2>
                <p className='text-center text-neutral-700 text-wrap text-sm tracking-wider'>Simply browse through our extensive list of trusted doctors,<br /> schedule your appointment hassle-free.</p>
            </div>

            {/* Category of Speciality of Doctors */}
            <div className="overflow-x-auto scrollbar-hide">
                <div className='flex justify-center w-fit min-w-full my-10 mx-3'>
                        {
                            specializations.map(spec => (
                                <Link href={'/doctors/' + spec.name } key={spec._id} className='hover:cursor-pointer transition-all hover:-translate-y-4 duration-700 items-center min-w-[130px] min-h-[100px]' >
                                    <Image className='flex justify-center items-center mx-4' key={spec._id} alt='spec-img' src={spec.image} width={100} height={100} />
                                    <p className='flex justify-center items-center tracking-wider text-sm mt-2'>{spec.name} </p>
                                </Link>
                            ))
                        }
                </div>
            </div>

        </div>
    )
}

export default CategorySearch