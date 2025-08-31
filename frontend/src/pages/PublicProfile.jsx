import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userService } from "../api/userService";
import sampleProfile from "../assets/logo.png";

const PublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setError("User ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const user = await userService.getUserById(userId);
        setUserData(user);
        setError(null);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-lg">Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-400 text-lg mb-4">{error}</div>
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-slate-400 text-lg mb-4">User not found</div>
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">User Profile</h1>
          <div className="w-20"></div> {/* Spacer for balance */}
        </div>

        {/* Profile Content */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-lg p-8 border border-slate-700/50">
          {/* Profile Picture */}
          <div className="flex justify-center mb-8">
            <img
              src={userData.profilePic || sampleProfile}
              alt={`${userData.fullName}'s profile`}
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
            />
          </div>

          {/* User Information */}
          <div className="space-y-6">
            {/* Full Name */}
            <div className="text-center">
              <label className="block text-slate-300 mb-2 text-sm font-medium">Full Name</label>
              <p className="text-white text-2xl font-semibold">{userData.fullName}</p>
            </div>

            {/* Username */}
            <div className="text-center">
              <label className="block text-slate-300 mb-2 text-sm font-medium">Username</label>
              <p className="text-white text-lg">@{userData.userName}</p>
            </div>

            {/* Email */}
            <div className="text-center">
              <label className="block text-slate-300 mb-2 text-sm font-medium">Email</label>
              <p className="text-white text-lg">{userData.email}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center mt-8 space-x-4">
            
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
