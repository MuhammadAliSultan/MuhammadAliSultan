import React, { useState, useEffect } from 'react';
import Header from './Header';
import { userService } from '../api/userService';
import profile from '../profilepic/me1.jpg'

const Display = ({ onChatSelect }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);
   
const fetchUsers = async () => {
  try {
    const usersArray = await userService.getAllUsers();
    
    setUsers(usersArray);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching users:", error);
    setUsers([]); 
    setLoading(false);
  }
};




  const handleUserClick = (user) => {
    if (onChatSelect) {
      onChatSelect(user);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-800/30 backdrop-blur-md border-r border-slate-700/50">
      <div className="flex-1 overflow-y-auto relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">No users found</p>
            <p className="text-sm text-slate-500 mt-2">Invite someone to join Dev-Chat</p>
          </div>
        ) : (
          <div className="space-y-1">
            {users.map((user) => (
              <Header
                key={user._id}
                chat={{
                  fullName: user.fullName,
                  avatar: user.profilePicture || profile,
                  isOnline: user.isOnline || false,
                  lastMessage: "",
                  lastMessageTime: new Date(user.createdAt).toLocaleTimeString(),
                  unreadCount: 0,
                }}
                onClick={() => handleUserClick(user)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Display;
