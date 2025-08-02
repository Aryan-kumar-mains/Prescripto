'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import styles from './FeedbackCarousel.module.css'; // Import the CSS module

const FeedbackCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Sample patient feedback data - replace with actual data from your API
  const patientFeedbacks = [
    {
      id: 1,
      name: "Sarah Johnson",
      age: 34,
      condition: "General Checkup",
      rating: 5,
      feedback: "Excellent service! The online booking system made it so easy to schedule my appointment. Dr. Smith was very professional and thorough.",
      avatar: "/images/patients/patient1.jpg",
      date: "2024-01-15"
    },
    {
      id: 2,
      name: "Michael Chen",
      age: 28,
      condition: "Dental Care",
      rating: 5,
      feedback: "Amazing experience! The reminder notifications were helpful, and the doctor was punctual. Highly recommend this platform.",
      avatar: "/images/patients/patient2.jpg",
      date: "2024-01-10"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      age: 42,
      condition: "Cardiology",
      rating: 4,
      feedback: "Great platform for booking appointments. The interface is user-friendly and the doctors are very knowledgeable. Will use again!",
      avatar: "/images/patients/patient3.jpg",
      date: "2024-01-08"
    },
    {
      id: 4,
      name: "David Thompson",
      age: 55,
      condition: "Orthopedics",
      rating: 5,
      feedback: "Outstanding service! The booking process was seamless, and the doctor provided excellent care. The follow-up was also great.",
      avatar: "/images/patients/patient4.jpg",
      date: "2024-01-05"
    },
    {
      id: 5,
      name: "Lisa Wang",
      age: 31,
      condition: "Dermatology",
      rating: 5,
      feedback: "Very satisfied with the service. Easy to book, professional doctors, and great customer support. Definitely recommend!",
      avatar: "/images/patients/patient5.jpg",
      date: "2024-01-03"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % patientFeedbacks.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, patientFeedbacks.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % patientFeedbacks.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + patientFeedbacks.length) % patientFeedbacks.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Patients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real feedback from patients who have used our appointment booking system
            and received care from our trusted healthcare providers.
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="group relative bg-white rounded-2xl shadow-xl overflow-hidden"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Main Carousel */}
          <div className="relative h-[500px] sm:h-[450px] md:h-80">
            <div 
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {patientFeedbacks.map((feedback, index) => (
                <div key={feedback.id} className="w-full flex-shrink-0 p-6 sm:p-8 md:p-12">
                  <div className="flex flex-col md:flex-row items-center h-full">
                    {/* Patient Avatar and Info */}
                    <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                      <div className="relative">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-lg">
                          {feedback.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <Quote className="absolute -top-2 -right-2 w-8 h-8 text-blue-500 bg-white rounded-full p-1 shadow-md" />
                      </div>
                    </div>

                    {/* Feedback Content */}
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex justify-center md:justify-start mb-3">
                        {renderStars(feedback.rating)}
                      </div>
                      
                      <blockquote className="text-base sm:text-lg md:text-xl text-gray-700 mb-4 leading-relaxed">
                        "{feedback.feedback}"
                      </blockquote>
                      
                      <div className="space-y-1">
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {feedback.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Age {feedback.age} • {feedback.condition}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(feedback.date)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - Show only on group hover and hidden on small screens */}
          <button
            onClick={prevSlide}
            className="hidden sm:block absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto"
            aria-label="Previous feedback"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <button
            onClick={nextSlide}
            className="hidden sm:block absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 opacity-0 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto"
            aria-label="Next feedback"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Dots Indicator - Always visible on mobile, hover on desktop */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 transition-all duration-300 sm:opacity-0 sm:translate-y-2 sm:pointer-events-none sm:group-hover:opacity-100 sm:group-hover:translate-y-0 sm:group-hover:pointer-events-auto">
            {patientFeedbacks.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? 'bg-blue-500 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to feedback ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Happy Patients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">4.8/5</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackCarousel;
