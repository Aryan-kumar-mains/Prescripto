import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { TextEffect } from '@/components/motion-primitives/text-effect';

const Hero = () => {
    return (
        <div className='bg-primary grid grid-cols-1 lg:grid-cols-2 rounded-2xl mt-24 md:pt-20'>

            {/* Left Side  */}
            <div className='col-span-1 flex flex-col justify-center items-center p-10 space-y-5'>
                <h1 className='text-5xl font-bold text-white'>
                    Book Appointment <br /> With Trusted Doctors
                </h1>
                <div className='flex gap-4 items-center mt-4 flex-wrap justify-center'>
                    <Image src={"/assets/assets_frontend/group_profiles.png"} alt="group_profiles" width={100} height={100} />

                    {/* <p className='text-secondary '>Simply browse through our extensive list of trusted doctors, <br />
                        schedule your appointment hassle-free.</p> */}
                    <div>
                        <TextEffect per='char' preset='fade' className='text-secondary ' >
                            Simply browse through our extensive list of trusted doctors
                        </TextEffect>
                        <TextEffect per='char' delay={2.2} preset='blur' className='text-secondary ' >Schedule your appointment hassle-free
                        </TextEffect>
                    </div>
                </div>
                <Link href={"/"} className='self-center xl:self-center'>
                    <Button className='group relative overflow-hidden rounded-full bg-secondary text-black px-10 py-6 transition-all hover:text-white'>
                        <span className="absolute bottom-0 left-0 h-48 w-full origin-bottom translate-y-full transform overflow-hidden rounded-full bg-white/30 transition-all duration-1000 ease-out group-hover:translate-y-14"></span>
                        <span className="font-semibold relative z-10 flex items-center gap-2 ">
                            Book Appointment
                            <Image src={"/assets/assets_frontend/arrow_icon.svg"} alt='arrow image' width={15} height={20} className="relative z-10" />
                        </span>
                    </Button>
                </Link>

            </div>

            {/* Right Side  */}
            <div className='col-span-1 flex justify-center px-10'>
                <Image src={"/assets/assets_frontend/header_img.png"} alt='hero image' width={500} height={500} />
            </div>
        </div>
    )
}

export default Hero