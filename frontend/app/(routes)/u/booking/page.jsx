"use client";
import { getUserBookings } from '@/app/_utils/booking';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';

const TABS = [
  { key: "upcoming", label: "Upcoming Booking" },
  { key: "past", label: "Past Booking" },
];

function isPastBooking(booking) {
  const now = new Date();
  const bookingDate = new Date(booking.bookingDate);
  return (
    booking.bookingStatus === "Cancelled" ||
    booking.bookingStatus === "Completed" ||
    bookingDate < now
  );
}

function formatDateTime(date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleString();
}

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

  const filteredBookings = myBookings.filter((booking) =>
    activeTab === "upcoming" ? !isPastBooking(booking) : isPastBooking(booking)
  );

  return (
    <div className="max-w-2xl mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-6 text-center">My Booking Page</h1>
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

      {/* Accordion */}
      <Accordion.Root
        type="single"
        collapsible
        value={expanded}
        onValueChange={setExpanded}
        className="space-y-3"
      >
        {filteredBookings.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No {activeTab === "upcoming" ? "upcoming" : "past"} bookings found.
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <Accordion.Item
              key={booking._id}
              value={booking._id}
              className="border rounded"
            >
              <Accordion.Header>
                <Accordion.Trigger className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 font-medium text-left">
                  <div>
                    <div>
                      <span className="font-semibold text-blue-700">
                        {booking.doctor?.name
                          ? `Dr. ${booking.doctor.name}`
                          : "Doctor N/A"}
                      </span>
                      <span className="ml-2 text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">
                        {booking.doctor?.specialization || "Specialization N/A"}
                      </span>
                    </div>
                    <div className="text-sm mt-1">
                      <span className="mr-4">
                        <b>Booking:</b> {formatDateTime(booking.bookingDate)}{" "}
                        {booking.bookingTimeSlot && `(${booking.bookingTimeSlot})`}
                      </span>
                      <span className="mr-4">
                        <b>Created:</b> {formatDateTime(booking.createdAt)}
                      </span>
                      {booking.bookingStatus === "Cancelled" && (
                        <span className="text-red-500 font-semibold ml-2">
                          Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                  <span>{expanded === booking._id ? "▲" : "▼"}</span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="p-4 border-t bg-white space-y-2">
                <div>
                  <b>Doctor Name:</b>{" "}
                  {booking.doctor?.name
                    ? `Dr. ${booking.doctor.name}`
                    : "N/A"}
                </div>
                <div>
                  <b>Specialization:</b>{" "}
                  {booking.doctor?.specialization || "N/A"}
                </div>
                <div>
                  <b>Booking Date & Time:</b> {formatDateTime(booking.bookingDate)}{" "}
                  {booking.bookingTimeSlot && `(${booking.bookingTimeSlot})`}
                </div>
                <div>
                  <b>Booking Created On:</b> {formatDateTime(booking.createdAt)}
                </div>
                <div>
                  <b>Status:</b>{" "}
                  <span
                    className={
                      booking.bookingStatus === "Cancelled"
                        ? "text-red-500"
                        : booking.bookingStatus === "Completed"
                        ? "text-green-600"
                        : "text-blue-700"
                    }
                  >
                    {booking.bookingStatus}
                  </span>
                </div>
                {booking.bookingStatus === "Cancelled" && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                    <div>
                      <b>Cancelled By:</b>{" "}
                      {booking.cancelledBy || "Patient"}
                    </div>
                    <div>
                      <b>Cancelled On:</b>{" "}
                      {booking.bookingCancelledAt
                        ? formatDateTime(booking.bookingCancelledAt)
                        : "N/A"}
                    </div>
                    <div>
                      <b>Reason:</b>{" "}
                      {booking.bookingCancellationReason
                        ? booking.bookingCancellationReason.slice(0, 40) +
                          (booking.bookingCancellationReason.length > 40
                            ? "..."
                            : "")
                        : "N/A"}
                    </div>
                  </div>
                )}
                {/* Patient Details */}
                <div className="mt-4 border-t pt-3">
                  <div className="font-semibold mb-2">Patient Details</div>
                  <div>
                    <b>Name:</b> {booking.patientName || "N/A"}
                  </div>
                  <div>
                    <b>Phone:</b> {booking.patientPhone || "N/A"}
                  </div>
                  <div>
                    <b>Sex:</b> {booking.patientSex || "N/A"}
                  </div>
                  <div>
                    <b>Age:</b> {booking.patientAge || "N/A"}
                  </div>
                  <div>
                    <b>Address:</b> {booking.patientAddress || "N/A"}
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))
        )}
      </Accordion.Root>
    </div>
  );
};

export default MyBookingPage;