import React from "react";
import "../global.css";

const DashboardLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center flex flex-col items-center">
        {/* Spinner */}
        <div className="custom-spin rounded-full h-32 w-32 border-t-4 border-b-4 text-4xl border-purple-800 dark:border-purple-500 mb-4">.</div>

        {/* Loading Text */}
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Loading Dashboard...
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Please wait while we prepare your dashboard.
        </p>
      </div>
    </div>
  );
};

export default DashboardLoading;
