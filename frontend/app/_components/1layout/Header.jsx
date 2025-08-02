"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from "next-auth/react";
import { logoutUser } from '@/app/_utils/auth'
import { useLoading } from '@/app/_components/general/LoadingSpinner'
import { ArrowRight, Menu, X, User, LogOut, ChevronDown, ChevronUp, Calendar, LogOutIcon } from "lucide-react";
import { fetchSpecializations } from '@/app/_utils/getSpecialization'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@radix-ui/react-navigation-menu"

export const Header = () => {
  const { data: session, status } = useSession();
  const { startLoading, stopLoading, updateMessage } = useLoading();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [specializations, setSpecializations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);


  // console.log("Session data : ", session);

  const pathname = usePathname();
  const router = useRouter();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  // Fetch specializations
  useEffect(() => {
    const getSpecializations = async () => {
      try {
        const result = await fetchSpecializations();
        const activeSpecializations = result.filter(item => item.isActive);
        setSpecializations(activeSpecializations);
      } catch (error) {
        console.log(error);
      }
    };
    getSpecializations();
  }, []);

  // Control navbar visibility on scroll
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;

        // Show navbar when scrolling up or at top
        if (currentScrollY < lastScrollY || currentScrollY < 10) {
          setIsVisible(true);
        }
        // Hide navbar when scrolling down (after 100px)
        else if (currentScrollY > 100 && currentScrollY > lastScrollY) {
          setIsVisible(false);
        }

        setLastScrollY(currentScrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => window.removeEventListener('scroll', controlNavbar);
    }
  }, [lastScrollY]);


  // Toggle categories accordion
  const toggleCategories = () => {
    setCategoriesOpen(!categoriesOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const drawer = document.getElementById('mobile-drawer');
      const hamburgerButton = document.getElementById('hamburger-button');

      if (drawer &&
        mobileMenuOpen &&
        !drawer.contains(event.target) &&
        hamburgerButton &&
        !hamburgerButton.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);


  // Handle logout
  const handleLogout = async () => {
    try {
      // Start with initial loading message
      startLoading("Logging out...");

      // Call backend logout endpoint
      const response = await logoutUser();
      // console.log("Logout response:", response);

      // Update message to show progress
      updateMessage("Clearing your session...");

      // NextAuth signOut function
      await signOut({ redirect: false });

      // Update message again before redirect
      updateMessage("Success! Redirecting to home page...");

      // Add a delay before redirecting
      setTimeout(() => {
        router.push('/');
        router.refresh();
        stopLoading();
      }, 1500);
    } catch (error) {
      console.error("Logout error:", error);
      stopLoading();
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Navigation menu items for desktop
  const NavMenu = [
    {
      name: "HOME",
      link: "/"
    },
    {
      name: "ALL DOCTORS",
      link: "/doctors"
    },
    {
      name: "ABOUT",
      link: "/about"
    },
    {
      name: "CONTACT",
      link: "/contact"
    }
  ]

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-40 bg-white flex items-center pt-4 pb-5 justify-between shadow-sm px-4 md:px-6 transition-transform duration-300 ease-in-out ${
  isVisible ? 'translate-y-0' : '-translate-y-full'
}`}>

        <div className='flex gap-10 items-center'>

          {/* Company Logo */}
          <Link href="/">
            <Image src="/assets/assets_frontend/logo.svg" alt="logo" width={180} height={80} />
          </Link>

          {/* Desktop Navigation Menu */}
          <ul className='hidden 2xl:flex gap-8'>
            {NavMenu.map((item, index) => (
              <Link href={item.link} key={index} className={`text-sm tracking-widest hover:text-primary relative after:content-[""] after:absolute after:h-[2px] after:bg-primary after:left-0 after:-bottom-2 after:transition-all after:duration-300 
                ${pathname === item.link ? 'text-primary after:w-full' : 'after:w-0 hover:after:w-full'}`}>{item.name}</Link>
            ))}

            {/* Specialities Dropdown menu -- in desktop only */}
            <NavigationMenu className="hidden md:flex relative">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="group flex items-center gap-2 text-sm tracking-widest hover:text-primary data-[state=open]:text-primary transition-colors relative after:content-[''] after:absolute after:h-[2px] after:bg-primary after:left-0 after:-bottom-2 after:transition-all after:duration-300 after:w-0 hover:after:w-full data-[state=open]:after:w-full ">
                    SPECIALTIES
                    <ChevronDown
                      size={16}
                      className="transition-transform duration-200 group-data-[state=open]:rotate-180"
                    />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="absolute top-full left-0 mt-2 data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 z-50">
                    <div className="w-[280px] md:w-[400px] lg:w-[500px] p-4 bg-white shadow-lg rounded-lg border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {specializations.slice(0, 10).map((spec) => (
                          <NavigationMenuLink key={spec._id} asChild>
                            <Link
                              href={`/doctors/${spec.name}`}
                              className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition-all duration-200 group"
                            >
                              <div className="flex-shrink-0">
                                <Image
                                  src={spec.image}
                                  alt={spec.name}
                                  width={28}
                                  height={28}
                                  className="rounded-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors block truncate">
                                  {spec.name}
                                </span>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>

                      {/* View All Link */}
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <NavigationMenuLink asChild>
                          <Link
                            href="/doctors"
                            className="flex items-center justify-center gap-2 p-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors rounded-md hover:bg-primary/5"
                          >
                            View All Doctors
                            <ArrowRight size={16} />
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </ul>
        </div>

        {/* User profile or Get Started button - ONLY VISIBLE ON DESKTOP */}
        <div className='flex items-center gap-3'>
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : isAuthenticated ? (
            // show profile dropdown menu - If user is authenticated, 
            <div className="hidden 2xl:flex items-center gap-3">
              <NavigationMenu className="relative">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="group flex items-center gap-2 hover:opacity-80 transition-opacity p-0 bg-transparent border-none shadow-none hover:bg-transparent data-[state=open]:bg-transparent">
                      <div className="flex items-center gap-2">
                        {session.user.image ? (
                          <Image
                            src={session.user.image}
                            alt='profile'
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-lg font-semibold">
                            {session.user.name?.charAt(0) || 'U'}
                          </div>
                        )}
                        <span className='text-sm font-medium'>
                          {session.user.name || 'User'}
                        </span>
                        <ChevronDown
                          size={16}
                          className="transition-transform duration-200 group-data-[state=open]:rotate-180"
                        />
                      </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="absolute top-full right-0 mt-2 data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 z-50">
                      <div className="w-[200px] p-2 bg-white shadow-lg rounded-lg border">
                        <div className="flex flex-col gap-1">
                          {/* Profile Link */}
                          <NavigationMenuLink asChild>
                            <Link
                              href="/u/profile"
                              className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition-all duration-200 group"
                            >
                              <User size={18} className="text-gray-600 group-hover:text-primary transition-colors" />
                              <span className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
                                Profile
                              </span>
                            </Link>
                          </NavigationMenuLink>

                          {/* Bookings Link */}
                          <NavigationMenuLink asChild>
                            <Link
                              href="/u/bookings"
                              className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition-all duration-200 group"
                            >
                              <Calendar size={18} className="text-gray-600 group-hover:text-primary transition-colors" />
                              <span className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
                                Bookings
                              </span>
                            </Link>
                          </NavigationMenuLink>

                          {/* Divider */}
                          <div className="h-px bg-gray-100 my-1"></div>

                          {/* Logout Button */}
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 p-3 rounded-md hover:bg-red-50 transition-all duration-200 group w-full text-left"
                          >
                            <LogOutIcon size={18} className="text-gray-600 group-hover:text-red-600 transition-colors" />
                            <span className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                              Logout
                            </span>
                          </button>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

          ) : (
            <Link href="/u/authorize" className="hidden lg:block">

              {/* Get Started button - when user is not authenticated */}
              <Button
                className='group relative rounded-full border border-primary bg-white p-2 text-lg tracking-widest'
                variant="ghost"
              >
                <div
                  className="absolute left-0 top-0 flex h-full w-11 items-center justify-end rounded-full transition-all duration-200 ease-in-out group-hover:w-full bg-primary"
                >
                  <span className="mr-3 text-white transition-all duration-200 ease-in-out">
                    <ArrowRight size={20} />
                  </span>
                </div>
                <span className="relative left-4 z-10 whitespace-nowrap px-8 text-black transition-all duration-200 ease-in-out group-hover:-left-3 group-hover:text-white">
                  Get Started
                </span>
              </Button>
            </Link>
          )}

          {/* Mobile menu button - ALWAYS VISIBLE ON MOBILE */}
          <button
            id="hamburger-button"
            onClick={toggleMobileMenu}
            className="2xl:hidden ml-2 p-2 text-gray-700 hover:text-primary focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        id="mobile-drawer"
        className={`fixed top-0 right-0 z-50 h-full w-[280px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out 2xl:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* toggle button for mobile drawer */}
        <div className="flex justify-end p-4 flex-shrink-0">
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-gray-700 hover:text-primary focus:outline-none"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable content container */}
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto pb-20"> {/* Increased bottom padding */}

            {/* User profile summary like Email & profile picture in mobile drawer */}
            {isAuthenticated && (
              <div className="px-6 mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt='profile'
                      width={50}
                      height={50}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-semibold">
                      {session.user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">{session.user.name || 'User'}</h3>
                    <p className="text-sm text-gray-500 truncate max-w-[160px]">{session.user.email}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="px-6">
              <ul className="flex flex-col space-y-4">
                {NavMenu.map((item, index) => (
                  // Home, All Doctors, About, Contact Menu Items
                  <li key={index}>
                    <Link
                      href={item.link}
                      className={`text-lg font-medium block py-2 ${pathname === item.link ? 'text-primary' : 'text-gray-800'}`}
                      onClick={() => {
                        setSelectedCategory(null); // Reset selected category
                        toggleMobileMenu();
                      }}
                    >
                      {item.name}
                    </Link>
                    <div className="h-px bg-gray-100 mt-2"></div>
                  </li>
                ))}

                {/* Mobile-only All Categories accordion */}
                <li>
                  <button
                    onClick={toggleCategories}
                    className="flex items-center justify-between w-full text-lg font-medium py-2 text-gray-800 hover:text-primary transition-colors"
                  >
                    ALL CATEGORIES
                    {categoriesOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>

                  {/* Accordion content */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${categoriesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}> {/* Changed from max-h-screen to max-h-96 for better control */}
                    <div className="pl-4 pt-2 pb-2 max-h-80 overflow-y-auto"> {/* Added max-height and scroll to categories list */}
                      {specializations.map((spec) => (
                        <Link
                          key={spec._id}
                          href={`/doctors/${spec.name}`}
                          className="flex items-center gap-3 py-2 px-2 hover:bg-gray-50 rounded-md transition-colors"
                          // onClick={toggleMobileMenu}
                          onClick={() => {
                            setSelectedCategory(spec.name);
                            toggleMobileMenu();
                          }}
                        >
                          <Image
                            src={spec.image}
                            alt={spec.name}
                            width={24}
                            height={24}
                            className="rounded-full object-cover"
                          />
                          <span className={`text-sm transition-colors ${selectedCategory === spec.name
                            ? 'text-primary font-medium'
                            : 'text-gray-700 hover:text-primary'
                            }`}>
                            {spec.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* For a line break between two options*/}
                  <div className="h-px bg-gray-100 mt-2"></div>
                </li>

                {isAuthenticated ? (
                  <>
                    {/* My Profile Section in mobile drawer */}
                    <li>
                      <Link
                        href="/u/profile"
                        className={`flex items-center gap-3 text-lg font-medium py-2 ${pathname === '/u/profile' ? 'text-primary' : 'text-gray-800'}`}
                        onClick={() => {
                          setSelectedCategory(null); // Reset selected category
                          toggleMobileMenu();
                        }}
                      >
                        <User size={20} />
                        My Profile
                      </Link>
                      <div className="h-px bg-gray-100 mt-2"></div>
                    </li>

                    {/* Logout Button */}
                    <li>
                      <button
                        onClick={() => {
                          toggleMobileMenu();
                          handleLogout();
                        }}
                        className="flex items-center gap-3 text-lg font-medium py-2 text-gray-800 w-full text-left"
                      >
                        <LogOut size={20} />
                        Logout
                      </button>
                      <div className="h-px bg-gray-100 mt-2"></div>
                    </li>
                  </>
                ) : (

                  // Get Started button in mobile drawer
                  <li className="pt-4">
                    <Link
                      href="/u/authorize"
                      className="block w-full"
                      onClick={toggleMobileMenu}
                    >
                      <Button
                        className='w-full py-6 text-lg font-medium bg-primary text-white hover:bg-primary/90'
                      >
                        Get Started
                      </Button>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>


    </>
  )
}
