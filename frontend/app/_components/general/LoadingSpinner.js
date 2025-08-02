"use client"

import React from 'react';
import { createContext, useContext, useState } from 'react';

// Create a LoadingSpinner component that can be used standalone
export const LoadingSpinner = ({ 
  fullScreen = false, 
  message = "Loading...", 
  size = "medium",
  overlay = true
}) => {
  // Size classes mapping
  const sizeClasses = {
    small: "h-6 w-6 border-2",
    medium: "h-12 w-12 border-t-3 border-b-3",
    large: "h-16 w-16 border-t-4 border-b-4"
  };

  // Inline spinner (used within buttons or small containers)
  if (!fullScreen) {
    return (
      <div className="flex items-center justify-center">
        <div className={`animate-spin rounded-full ${sizeClasses[size]} border-primary border-t-transparent`}></div>
        {message && <span className="ml-2">{message}</span>}
      </div>
    );
  }

  // Full screen overlay spinner
  return (
    <div className={`fixed inset-0 ${overlay ? 'bg-white bg-opacity-80' : ''} z-50 flex flex-col justify-center items-center`}>
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-primary border-t-transparent mb-4`}></div>
      {message && <p className="text-lg font-medium text-gray-700">{message}</p>}
    </div>
  );
};

// Create a global loading context to manage application-wide loading state
const LoadingContext = createContext({
  isLoading: false,
  message: '',
  startLoading: () => {},
  stopLoading: () => {},
  updateMessage: () => {},
});

export const LoadingProvider = ({ children }) => {
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    message: 'Loading...'
  });

  const startLoading = (customMessage = 'Loading...') => {
    setLoadingState({
      isLoading: true,
      message: customMessage
    });
  };

  const stopLoading = () => {
    setLoadingState({
      isLoading: false,
      message: 'Loading...' // Reset to default
    });
  };

  const updateMessage = (newMessage) => {
    if (loadingState.isLoading) {
      setLoadingState(prev => ({
        ...prev,
        message: newMessage
      }));
    }
  };

  return (
    <LoadingContext.Provider 
      value={{ 
        isLoading: loadingState.isLoading, 
        message: loadingState.message, 
        startLoading, 
        stopLoading,
        updateMessage
      }}
    >
      {children}
      {loadingState.isLoading && (
        <LoadingSpinner 
          fullScreen 
          message={loadingState.message} 
          size="large" 
        />
      )}
    </LoadingContext.Provider>
  );
};

// Custom hook to use the loading context
export const useLoading = () => useContext(LoadingContext);
