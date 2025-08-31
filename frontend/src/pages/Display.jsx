import React, { useState, useEffect } from 'react';
import Header from './Header';
import { userService } from '../api/userService';
import { messageService } from '../api/messageService';
import socket from '../api/socket';
import profile from '../profilepic/me1.jpg'

const Display = ({ onChatSelect, users: propUsers }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastMessages, setLastMessages] = useState({});

  useEffect(() => {
    // Only fetch users if no propUsers are provided
    if (!propUsers) {
      fetchUsers();
    } else {
      setUsers(propUsers);
      setLoading(false);
    }

    // Listen for sidebar update events
    const handleUpdateSidebar = (data) => {
      setLastMessages(prev => ({
        ...prev,
        [data.userId]: data.lastMessage
      }));

      // Re-fetch users to update the order based on latest message
      if (!propUsers) {
        fetchUsers();
      }
    };

    // Listen for conversation cleared events
    const handleConversationCleared = () => {
      // Re-fetch users to update the sidebar after conversation is cleared
      if (!propUsers) {
        fetchUsers();
      }
    };

    socket.on("update_sidebar", handleUpdateSidebar);
    socket.on("conversation_cleared", handleConversationCleared);

    return () => {
      socket.off("update_sidebar", handleUpdateSidebar);
      socket.off("conversation_cleared", handleConversationCleared);
    };
  }, [propUsers]);
   
const fetchUsers = async () => {
  try {
    const usersArray = await userService.getAllUsers();
    
    // Fetch last messages for each user
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const messagesPromises = usersArray.map(async (userItem) => {
        try {
          const lastMessage = await messageService.getLastMessage(userItem._id);
          return { userId: userItem._id, lastMessage };
        } catch (error) {
          console.error(`Error fetching last message for user ${userItem._id}:`, error);
          return { userId: userItem._id, lastMessage: null };
        }
      });
      
      const messagesResults = await Promise.all(messagesPromises);
      const messagesMap = {};
      messagesResults.forEach(result => {
        messagesMap[result.userId] = result.lastMessage;
      });
      setLastMessages(messagesMap);
      
      // Sort users by most recent message or creation time
      const sortedUsers = [...usersArray].sort((a, b) => {
        const aLastMessage = messagesMap[a._id];
        const bLastMessage = messagesMap[b._id];
        
        // If both have messages, sort by most recent
        if (aLastMessage && bLastMessage) {
          return new Date(bLastMessage.createdAt) - new Date(aLastMessage.createdAt);
        }
        // If only one has message, that one comes first
        if (aLastMessage && !bLastMessage) return -1;
        if (!aLastMessage && bLastMessage) return 1;
        // If neither has messages, sort by creation time
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setUsers(sortedUsers);
    } else {
      setUsers(usersArray);
    }
    
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
            {users.map((user) => {
              const lastMessage = lastMessages[user._id];
              const lastMessageText = lastMessage?.content || "No messages yet";
              const lastMessageTime = lastMessage?.createdAt 
                ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              
              return (
                <Header
                  key={user._id}
                  chat={{
                    _id: user._id,
                    fullName: user.fullName,
                    avatar: user.profilePic || profile,
                    isOnline: user.isOnline || false,
                    lastMessage: lastMessageText,
                    lastMessageTime: lastMessageTime,
                  }}
                  onClick={() => handleUserClick(user)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Display;
