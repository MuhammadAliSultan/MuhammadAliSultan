import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../api/userService";
import logo from "../assets/logo.png";
import Logout from "./Logout";
import Logo from "../assets/Logo";
import Chat from "../pages/Chat";
import SearchBar from "../pages/subpages/SearchBar";
import Display from "../pages/Display";

const Home = () => {
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [activeTab, setActiveTab] = useState('chats');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [fullName, setFullName] = useState("Dev-Chat");
  const [selectedChat, setSelectedChat] = useState(null);
  const navigate = useNavigate();

  // ✅ Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      try {
        const response = await userService.getCurrentUser();
        setFullName(response.message.fullName)
        setUser(response.message);
        setShowLogo(true); // Show logo animation when logged in
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Hide logo after 2 seconds
  useEffect(() => {
    if (showLogo) {
      const timer = setTimeout(() => {
        setShowLogo(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showLogo]);

  // ✅ Prevent going back (back button → goes to logout confirm)
  useEffect(() => {
    const handlePopState = () => {
      setShowLogoutPopup(true);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const handleCreateGroup = () => {
    alert("Create group functionality will be added later!");
  };

  if (loading) {
    return null;
  }

  if (showLogo) {
    return <Logo />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img src={logo} alt="Dev-Chat Logo" className="w-16 h-16 rounded-full" />
              <span className="ml-3 text-xl font-bold text-white">Welcome 👋 ,{fullName}</span>
            </div>

            {/* Logout Button - Rightmost corner */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-lg hover:shadow-red-500/25"
            >
              Logout
            </button>
          </div>
        </div>
      </header>



      {/* Main Content - Split Screen */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left 1/3 Section */}
        <div className="w-1/3 bg-slate-800/30 backdrop-blur-md border-r border-slate-700/50 flex flex-col relative">
        <div className="flex text-2xl font-extrabold ml-8 ">
         <h2 className="text-2xl font-bold text-white mb-2 mt-4">Chats</h2>
        </div>
        {/* Search Bar */}
          <div className="px-4 pt-4">
            <SearchBar 
              type={activeTab === 'chats' ? 'chat' : 'group'}
              onSearch={(searchTerm) => {
                console.log(`Searching ${activeTab}:`, searchTerm);
                // Add search logic here
              }}
            />
          </div>

          

          {/* Content Area - Display Component */}
          <div className="flex-1 overflow-y-auto">
            <Display onChatSelect={setSelectedChat} />
          </div>

          {/* Create New Group Button - Fixed at bottom */}
          <div className="absolute bottom-4 right-4">
            <div className="relative">
              <button
                onClick={() => setShowCreateGroup(!showCreateGroup)}
                className="w-auto flex items-center justify-center p-3
                 bg-purple-600 hover:bg-purple-700 text-white rounded-full 
                 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
              >
                <span className="text-2xl font-bold transition-transform duration-300">
                  {showCreateGroup ? '×' : '+'}
                </span>
              </button>
              
              <div className={`absolute bottom-full right-0 mb-2 transition-all duration-300 transform origin-bottom ${
                showCreateGroup ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              }`}>
                <button
                  onClick={handleCreateGroup}
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-lg"
                >
                  Create New Group
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2/3 Section - Chat Component */}
        <div className="w-2/3">
          <Chat selectedChat={selectedChat} />
        </div>
      </div>

      {/* Logout Popup */}
      <Logout 
        isOpen={showLogoutPopup} 
        onClose={() => setShowLogoutPopup(false)} 
      />
    </div>
  );
};

export default Home;
