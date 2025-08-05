"use client";
import { getUserBookings } from '@/app/_utils/booking';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import MyBooking from './_components/MyBooking';

const TABS = [
  { key: "upcoming", label: "Upcoming Booking" },
  { key: "past", label: "Past Booking" },
];

const MyBookingPage = () => {
  const [myBookings, setMyBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [expanded, setExpanded] = useState("");
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    const getMyBooking = async () => {
      if (isAuthenticated) {
        const token = session?.user?.accessToken;
        const response = await getUserBookings(token);
        if (response.success) {
          // Sort by creation date (latest first)
          const sorted = [...response.bookings].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setMyBookings(sorted);
        }
      }
    };
    getMyBooking();
  }, [isAuthenticated, session]);

  return (
    <div className="max-w-2xl mx-auto mt-28">
      <h1 className="text-2xl font-bold mb-6 text-center">My Bookings</h1>
      {/* Tabs */}
      <div className="flex justify-center mb-6 gap-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => {
              setActiveTab(tab.key);
              setExpanded("");
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <MyBooking
        bookings={myBookings}
        activeTab={activeTab}
        expanded={expanded}
        setExpanded={setExpanded}
      />
    </div>
  );
};

export default MyBookingPage;