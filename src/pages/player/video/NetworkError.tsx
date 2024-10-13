import React from "react";
import NetworkIssue from "../../../assets/NetworkError.svg";
import ErrorBack from "../../../assets/errorBack.svg"; // Import the background image

const NetworkError: React.FC<any> = ({ onBack }) => {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-background text-white relative">
      {/* Back Arrow */}
      <div className="absolute top-4 left-4 z-50">
        <button className="text-white text-2xl" onClick={onBack}>
          ← {/* Replace with your actual back arrow component or icon */}
        </button>
      </div>

      {/* Network Error Message with Background */}
      <div
        className="relative flex flex-col items-center justify-center mt-16"
        style={{
          backgroundImage: `url(${ErrorBack})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          height: "35vh",
          marginTop: 0,
          width: "100%", // Adjusting width to ensure proper spacing
          opacity: 0.7, // Slight transparency for a better effect
        }}
      >
        <p className="text-lg font-semibold mb-1">
          Network Connection Is Not Connected.
        </p>
        <p className="text-sm text-gray-400">
          Please Check Your Network Settings
        </p>
      </div>

      {/* WiFi Icon */}
      <div className="flex flex-col items-center mt-10">
        <img
          src={NetworkIssue}
          alt="Network Issue"
          className="h-16 w-16 mb-6"
        />
        <p className="text-sm text-gray-400 mb-6">
          Please check your network connection and try again
        </p>

        {/* Refresh Button */}
        <button
          className="px-10 py-2 rounded-full text-white text-base hover:bg-gray-600 transition"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%)",
          }}
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>

      {/* Bottom padding for notch */}
      <div className="pb-6" />
    </div>
  );
};

export default NetworkError;
