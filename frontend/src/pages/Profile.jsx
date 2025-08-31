import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userService } from "../api/userService";
import sampleProfile from "../assets/logo.png";

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  
  // User data states
  const [userData, setUserData] = useState({
    userName: user.userName || "Username",
    fullName: user.fullName || "Full Name",
    email: user.email || "user@example.com",
    profilePic: user.profilePicture || sampleProfile,
    // Mock data for user stats
    messagesSent: 1247,
    onlineTime: "45h/week",
    joinDate: "Jan 2023"
  });

  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  
  // Tab states for switching animation
  const [activeTab, setActiveTab] = useState('profile');
  const [tabTransition, setTabTransition] = useState(false);

  // Handle tab switching with animation
  const handleTabSwitch = (tabName) => {
    if (activeTab !== tabName) {
      setTabTransition(true);
      setTimeout(() => {
        setActiveTab(tabName);
        setTabTransition(false);
      }, 150);
    }
  };

  // Edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEditingPicture, setIsEditingPicture] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);

  // Form states
  const [editForm, setEditForm] = useState({
    fullName: userData.fullName,
    email: userData.email
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Handle profile edit
  const handleEditToggle = () => {
    if (isEditingProfile) {
      // Cancel editing
      setEditForm({
        fullName: userData.fullName,
        email: userData.email
      });
    }
    setIsEditingProfile(!isEditingProfile);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle profile picture selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile picture edit
  const handlePictureEdit = () => {
    setIsEditingPicture(true);
  };

  const handlePictureCancel = () => {
    setIsEditingPicture(false);
    setSelectedImage(null);
    setPreviewImage(null);
  };

  const handlePictureConfirm = async () => {
    if (selectedImage && previewImage) {
      setIsUploadingPicture(true);
      try {
        const formData = new FormData();
        formData.append('profilePic', selectedImage);

        const response = await userService.updateProfilePic(formData);
        if (response.success) {
          setUserData(prev => ({ ...prev, profilePic: previewImage }));
          // Update localStorage user data if needed
          const user = JSON.parse(localStorage.getItem("user")) || {};
          localStorage.setItem("user", JSON.stringify({
            ...user,
            profilePicture: previewImage
          }));
          toast.success("Profile picture updated successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } catch (error) {
        console.error("Error updating profile picture:", error);
        toast.error("Failed to update profile picture. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setIsUploadingPicture(false);
      }
    }
    setIsEditingPicture(false);
    setSelectedImage(null);
    setPreviewImage(null);
  };

  // Simulate upload progress for demo
  const [uploadProgress, setUploadProgress] = useState(0);
  useEffect(() => {
    if (isUploadingPicture) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setUploadProgress(0);
    }
  }, [isUploadingPicture]);

  // Handle save profile changes
  const handleSaveProfile = async () => {
    try {
      const response = await userService.updateUserInfo(editForm);
      if (response.success) {
        setUserData(prev => ({ ...prev, ...editForm }));
        // Update localStorage user data
        const user = JSON.parse(localStorage.getItem("user")) || {};
        localStorage.setItem("user", JSON.stringify({
          ...user,
          fullName: editForm.fullName,
          email: editForm.email
        }));
        setIsEditingProfile(false);
        toast.success("Profile updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Handle password change
  const handlePasswordChangeSubmit = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      const response = await userService.changeCurrentPassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      });

      if (response.success) {
        setPasswordForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        setIsChangingPassword(false);
        toast.success("Password changed successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password. Please check your current password and try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Handle password change toggle
  const handlePasswordToggle = () => {
    if (isChangingPassword) {
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    }
    setIsChangingPassword(!isChangingPassword);
  };

  // Page load animations
  useEffect(() => {
    // Fade in entire page
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-4 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-slideInUp">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white animate-fadeIn" style={{ animationDelay: '0.2s' }}>Profile Settings</h1>
          <div className="w-20"></div> {/* Spacer for balance */}
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-lg p-1 mb-6 border border-slate-700/50">
          <div className="flex space-x-1">
            <button
              onClick={() => handleTabSwitch('profile')}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === 'profile'
                  ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => handleTabSwitch('security')}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === 'security'
                  ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => handleTabSwitch('activity')}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === 'activity'
                  ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              Activity
            </button>
          </div>
        </div>

        {/* Tab Content with Animation */}
        <div className={`transition-all duration-300 ${tabTransition ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
          {activeTab === 'profile' && (
            <>
              {/* Profile Picture Section */}
              <div className="bg-slate-800/50 backdrop-blur-md rounded-lg p-6 mb-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Profile Picture</h2>
                  {!isEditingPicture && (
                    <button
                      onClick={handlePictureEdit}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors duration-200"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {isEditingPicture ? (
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <img
                        src={previewImage || userData.profilePic}
                        alt="Profile Preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
                      />
                    </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="mb-4 text-white border border-purple-500 bg-slate-700 rounded-lg cursor-pointer"
                        style={{ padding: '10px', transition: 'background-color 0.3s' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                      />
                    {isUploadingPicture && (
                      <div className="w-full mb-4">
                        <div className="bg-slate-700 rounded-full h-2 mb-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-center text-sm text-slate-300">{uploadProgress}% uploaded</p>
                      </div>
                    )}
                    <div className="flex space-x-3">
                      <button
                        onClick={handlePictureConfirm}
                        disabled={!selectedImage || isUploadingPicture}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white rounded transition-all duration-200 hover:scale-105 flex items-center justify-center"
                      >
                        {isUploadingPicture ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading...
                          </>
                        ) : (
                          'Confirm'
                        )}
                      </button>
                      <button
                        onClick={handlePictureCancel}
                        disabled={isUploadingPicture}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white rounded transition-all duration-200 hover:scale-105"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <img
                      src={userData.profilePic}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
                    />
                  </div>
                )}
              </div>

              {/* Profile Information Section */}
              <div className="bg-slate-800/50 backdrop-blur-md rounded-lg p-6 mb-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                  <button
                    onClick={handleEditToggle}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors duration-200"
                  >
                    {isEditingProfile ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {isEditingProfile ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-300 mb-2">Username</label>
                      <input
                        type="text"
                        value={userData.userName}
                        disabled
                        className="w-full px-3 py-2 bg-slate-700 text-slate-400 rounded border border-slate-600"
                      />
                      <p className="text-sm text-slate-400 mt-1">Username cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={editForm.fullName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button onClick={handleSaveProfile} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors duration-200">
                        Save Changes
                      </button>
                      <button
                        onClick={handleEditToggle}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-300 mb-1">Username</label>
                      <p className="text-white text-lg">{userData.userName}</p>
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Full Name</label>
                      <p className="text-white text-lg">{userData.fullName}</p>
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Email</label>
                      <p className="text-white text-lg">{userData.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'security' && (
            <>
              {/* Change Password Section */}
              <div className="bg-slate-800/50 backdrop-blur-md rounded-lg p-6 mb-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Change Password</h2>
                  <button
                    onClick={handlePasswordToggle}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors duration-200"
                  >
                    {isChangingPassword ? 'Cancel' : 'Change Password'}
                  </button>
                </div>

                {isChangingPassword && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-300 mb-2">Current Password</label>
                      <input
                        type="password"
                        name="oldPassword"
                        value={passwordForm.oldPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 focus:outline-none"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-2">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 focus:outline-none"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 focus:outline-none"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <button onClick={handlePasswordChangeSubmit} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors duration-200">
                      Update Password
                    </button>
                  </div>
                )}
              </div>

              {/* Security Settings */}
              <div className="bg-slate-800/50 backdrop-blur-md rounded-lg p-6 mb-6 border border-slate-700/50">
                <h2 className="text-xl font-semibold text-white mb-4">Security Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                      <p className="text-slate-400 text-sm">Add an extra layer of security to your account</p>
                    </div>
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors duration-200">
                      Enable
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Login Notifications</h3>
                      <p className="text-slate-400 text-sm">Get notified when someone logs into your account</p>
                    </div>
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors duration-200">
                      Enabled
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'activity' && (
            <>
              {/* Activity Section */}
              <div className="bg-slate-800/50 backdrop-blur-md rounded-lg p-6 mb-6 border border-slate-700/50">
                <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-white">Profile picture updated</p>
                      <p className="text-slate-400 text-sm">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-white">Password changed successfully</p>
                      <p className="text-slate-400 text-sm">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-white">Account created</p>
                      <p className="text-slate-400 text-sm">{userData.joinDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics Section */}
              <div className="bg-slate-800/50 backdrop-blur-md rounded-lg p-6 border border-slate-700/50">
                <h2 className="text-xl font-semibold text-white mb-4">Account Statistics</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">{userData.messagesSent}</p>
                    <p className="text-slate-400 text-sm">Messages Sent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{userData.onlineTime}</p>
                    <p className="text-slate-400 text-sm">Online Time</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;
