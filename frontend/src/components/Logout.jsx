import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleConfirmLogout = () => {
    // Clear tokens and user data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // Redirect to welcome page
    navigate("/welcome");
  };

  const handleCancel = () => {
    // Just close the popup
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Logout?</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to logout?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleConfirmLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition"
          >
            Yes, Logout
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-300 px-6 py-2 rounded-xl hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
