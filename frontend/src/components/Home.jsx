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

  const [showLogo, setShowLogo] = useState(false);
  const [userName, setUserName] = useState("Dev-Chat");
  const [selectedChat, setSelectedChat] = useState(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showChat, setShowChat] = useState(false);
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
        console.log("API Response:", response); // Debug log
        console.log("Response structure:", JSON.stringify(response, null, 2)); // Debug log

        if (response && response.message && response.message.userName) {
          setUserName(response.message.userName);
          setUser(response.message);
        } else if (response && response.userName) {
          // Check if userName is directly in response
          setUserName(response.userName);
          setUser(response);
        } else if (response && response.data && response.data.userName) {
          // Check if userName is in response.data
          setUserName(response.data.userName);
          setUser(response.data);
        } else {
          console.error("Unexpected API response structure:", response);
          setUserName("User"); // Fallback
        }

        // Fetch all users for search functionality
        try {
          const allUsersResponse = await userService.getAllUsers();
          setAllUsers(allUsersResponse);
        } catch (error) {
          console.error("Error fetching all users:", error);
        }

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

  // Close settings menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSettingsMenu && !event.target.closest('.settings-menu-container')) {
        setShowSettingsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSettingsMenu]);

  // Page load animations
  useEffect(() => {
    // Fade in entire page
    setTimeout(() => setIsVisible(true), 100);
    // Show sidebar with slide-in
    setTimeout(() => setShowSidebar(true), 300);
    // Show chat section with slide-in
    setTimeout(() => setShowChat(true), 500);
  }, []);

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  // Handle search functionality
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Filter users based on search term
  const filteredUsers = allUsers.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );



  if (loading) {
    return null;
  }

  if (showLogo) {
    return <Logo />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50 animate-fade-in-down">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center animate-fade-in-left">
              <img src={logo} alt="Dev-Chat Logo" className="w-16 h-16 rounded-full animate-float" />
              <span className="ml-3 text-xl font-bold text-white animate-typewriter">Welcome 👋 ,{userName}</span>
            </div>

            {/* Settings Menu and Logout Button */}
            <div className="flex items-center space-x-3 animate-fade-in-right">
              {/* Settings Menu Button */}
              <div className="relative settings-menu-container">
                <button
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 hover:scale-110"
                  title="Settings"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>

                {/* Settings Dropdown Menu */}
                {showSettingsMenu && (
                  <div className="absolute top-0 right-10 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 animate-slide-in-down">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowSettingsMenu(false);
                          navigate("/profile");
                        }}
                        className="block w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-200 hover:translate-x-1"
                      >
                        Update Profile
                      </button>

                    </div>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-red-500/25 hover:scale-105 active:scale-95"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>



      {/* Main Content - Split Screen */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left 1/3 Section */}
        <div className={`w-1/3 bg-slate-800/30 backdrop-blur-md border-r border-slate-700/50 flex flex-col relative transition-all duration-1000 ${showSidebar ? 'transform translate-x-0 opacity-100' : 'transform -translate-x-10 opacity-0'}`}>
        <div className="flex text-2xl font-extrabold ml-8 animate-fade-in-up">
         <h2 className="text-2xl font-bold text-white mb-2 mt-4">Chats</h2>
        </div>
        {/* Search Bar */}
          <div className="px-4 pt-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <SearchBar
              type={activeTab === 'chats' ? 'chat' : 'group'}
              onSearch={handleSearch}
            />
          </div>



          {/* Content Area - Display Component */}
          <div className="flex-1 overflow-y-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Display
              onChatSelect={setSelectedChat}
              users={searchTerm ? filteredUsers : undefined}
            />
          </div>


        </div>

        {/* Right 2/3 Section - Chat Component */}
        <div className={`w-2/3 transition-all duration-1000 ${showChat ? 'transform translate-x-0 opacity-100' : 'transform translate-x-10 opacity-0'}`}>
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
