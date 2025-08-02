"use client"
import React, { useEffect, useState, useRef } from 'react'
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { fetchSpecializations } from '@/app/_utils/getSpecialization';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';


const categoryList = () => {
    const [specList, setSpecList] = useState([]);
    const [isScrolling, setIsScrolling] = useState(false);
    const selectedItemRef = useRef(null);
    const commandListRef = useRef(null);

    const params = usePathname(); // this will give us the current pathname
    const category = params.split('/')[2]; // this will give us the category name only from the path
    const decoded_category = decodeURIComponent(category || ''); // Handle undefined category

    useEffect(() => {
        const getSpecializations = async () => {
            try {
                const result = await fetchSpecializations();
                setSpecList(result);
            }
            catch (error) {
                console.log(error);
            }
        };
        getSpecializations();
    }, []);

    // Auto-scroll to selected category when component mounts or category changes
    useEffect(() => {
        if (selectedItemRef.current && decoded_category && specList.length > 0) {
            setIsScrolling(true);
            
            // Small delay to ensure the DOM is fully rendered
            const timer = setTimeout(() => {
                selectedItemRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center', // Centers the selected item in the viewport
                    inline: 'nearest'
                });
                
                // Reset scrolling state after animation
                setTimeout(() => setIsScrolling(false), 500);
            }, 150);

            return () => clearTimeout(timer);
        }
    }, [decoded_category, specList]);

    return (
        // left side bar for category list.
        <div className='h-screen pt-20 flex flex-col sticky top-0'>
            <Command>
                <CommandInput placeholder="Search specializations..." />
                <CommandList 
                    ref={commandListRef}
                    className="max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                >
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Specializations">
                        {
                            specList.map((item, index) => {
                                const isSelected = decoded_category === item.name;
                                return (
                                    <CommandItem 
                                        key={index}
                                        ref={isSelected ? selectedItemRef : null}
                                        className={`${isScrolling && isSelected ? 'ring-2 ring-blue-300 ring-opacity-50' : ''}`}
                                    >
                                        <Link href={"/doctors/"+item.name}
                                            className={`
                                                p-3 w-full
                                                flex gap-3 
                                                items-center 
                                                text-[14px]
                                                rounded-md cursor-pointer
                                                transition-all duration-200
                                                ${isSelected 
                                                    ? 'bg-blue-100 border-l-4 border-blue-500 text-blue-700 font-medium shadow-sm' 
                                                    : 'hover:bg-gray-50 hover:shadow-sm'
                                                }`}>
                                            <Image 
                                                src={item.image} 
                                                alt={`${item.name} icon`} 
                                                width={28} 
                                                height={28}
                                                className="rounded-full object-cover"
                                            />
                                            <label className='hover:cursor-pointer flex-1'> 
                                                {item.name} 
                                            </label>
                                            {isSelected && (
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            )}
                                        </Link>
                                    </CommandItem>
                                );
                            })
                        }
                    </CommandGroup>
                </CommandList>
            </Command>
        </div>
    )
}

export default categoryList;
