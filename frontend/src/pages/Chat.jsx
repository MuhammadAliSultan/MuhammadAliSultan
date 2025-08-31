import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import sampleProfile from "../assets/logo.png";
import Emoji from "../pages/subpages/Emoji";
import Message from "./Message";
import ConfirmationDialog from "../components/ConfirmationDialog";
import socket from "../api/socket";
import { messageService } from "../api/messageService"; // 🔥 REST API fallback (retained for loading messages)
import { userService } from "../api/userService";
import logo from "../assets/logo.png";

const Chat = ({ selectedChat }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingContent, setTypingContent] = useState("");
  const [onlineStatus, setOnlineStatus] = useState("offline");
  const [lastSeen, setLastSeen] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isBlockedByOther, setIsBlockedByOther] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Typing animation states for no conversation selected
  const [displayText, setDisplayText] = useState('');
  const [currentMessage] = useState('Select conversation to get started');
  const [showLogo, setShowLogo] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Typing animation for no conversation selected
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= currentMessage.length) {
        setDisplayText(currentMessage.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          setShowLogo(true);
        }, 500);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [currentMessage]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.relative')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // Load conversation when chat changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat || !user) return;
      setLoadingMessages(true);
      try {
        console.log("📥 Fetching messages for receiverId:", selectedChat._id);
        const data = await messageService.getMessages(selectedChat._id);
        setMessages(data || []); // ✅ ensure array

        // Removed unread count reset functionality
      } catch (err) {
        console.error("❌ Failed to fetch messages:", err.message);
        setMessages([]); // ✅ clear instead of staying stuck
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [selectedChat?._id]);

  // Load blocked users
  useEffect(() => {
    const loadBlockedUsers = async () => {
      if (!user) return;
      try {
        const blocked = await userService.getBlockedUsers();
        setBlockedUsers(blocked || []);
      } catch (err) {
        console.error("❌ Failed to fetch blocked users:", err.message);
        setBlockedUsers([]);
      }
    };

    loadBlockedUsers();
  }, [user]);

  // Check if selected chat is blocked
  useEffect(() => {
    if (!selectedChat || !blockedUsers.length) {
      setIsBlocked(false);
      return;
    }

    const isUserBlocked = blockedUsers.some(blockedUser => blockedUser._id === selectedChat._id);
    setIsBlocked(isUserBlocked);
  }, [selectedChat, blockedUsers]);

  // Check if current user is blocked by selected chat
  useEffect(() => {
    const checkBlockedByOther = async () => {
      if (!selectedChat || !user) {
        setIsBlockedByOther(false);
        return;
      }

      try {
        const result = await userService.checkIfBlocked(selectedChat._id);
        setIsBlockedByOther(result.isBlocked);
      } catch (err) {
        console.error("❌ Failed to check if blocked by other user:", err.message);
        setIsBlockedByOther(false);
      }
    };

    checkBlockedByOther();
  }, [selectedChat, user]);

  // Periodic refresh of online status every 10 seconds
  useEffect(() => {
    if (!selectedChat || !user) return;

    const refreshOnlineStatus = () => {
      const roomId = [user._id, selectedChat._id].sort().join('_');
      // Emit event to refresh presence information
      socket.emit("refresh_presence", {
        roomId,
        userId: user._id,
        targetUserId: selectedChat._id
      });
    };

    // Initial refresh
    refreshOnlineStatus();

    // Set up interval for periodic refresh every 10 seconds
    const intervalId = setInterval(refreshOnlineStatus, 10000);

    // Cleanup interval on unmount or when selectedChat/user changes
    return () => clearInterval(intervalId);
  }, [selectedChat, user]);

  // Join chat room & setup socket listeners
  useEffect(() => {
    if (!selectedChat || !user) return;

    const roomId = [user._id, selectedChat._id].sort().join('_'); // ✅ Symmetric room ID

    socket.emit("join_room", {
      roomId,
      userId: user._id,
    });

  // Presence
  const handlePresence = (presenceList) => {
    const statusObj = presenceList.find(
      (p) => p.userId === selectedChat._id
    );
    if (statusObj?.status === "offline") {
      setOnlineStatus("offline");
      setLastSeen(statusObj?.lastSeen || null);
    } else {
      setOnlineStatus(statusObj?.status || "offline");
      setLastSeen(null);
    }
  };
  socket.on("user_presence", handlePresence);

  // Add socket listener for user disconnect to update presence immediately
  socket.on("user_disconnected", (userId) => {
    if (userId === selectedChat._id) {
      setOnlineStatus("offline");
      setLastSeen(new Date().toISOString());
    }
  });

  // Add socket listener for user connected to update presence immediately
  socket.on("user_connected", (userId) => {
    if (userId === selectedChat._id) {
      setOnlineStatus("online");
      setLastSeen(null);
    }
  });

    // Typing
    const handleTypingOn = ({ userId, content }) => {
      if (userId === selectedChat._id) {
        setIsTyping(true);
        setTypingContent(content || "");
      }
    };
    const handleTypingOff = ({ userId }) => {
      if (userId === selectedChat._id) {
        setIsTyping(false);
        setTypingContent("");
      }
    };
    socket.on("user_typing", handleTypingOn);
    socket.on("user_stop_typing", handleTypingOff);

    // Messages
    const handleIncoming = (msg) => {
      const senderId = msg.sender?._id || msg.sender; // ✅ Handle populated or raw ID
      const receiverId = msg.receiver?._id || msg.receiver;
      if (senderId === selectedChat._id || receiverId === user._id) {
        setMessages((prev) => {
          // Check if this message is replacing a temporary one
          const existingTempIndex = prev.findIndex(m => m.isTemp && m.sender._id === msg.sender._id && m.content === msg.content);

          if (existingTempIndex !== -1) {
            // Replace the temporary message with the real one
            const newMessages = [...prev];
            newMessages[existingTempIndex] = msg;
            return newMessages;
          } else {
            // Add as new message
            return [...prev, msg];
          }
        });
      }
    };

    // Handle message deletion
    const handleMessageDeleted = (data) => {
      const { messageId, deletedBy, deletedForEveryone } = data;
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? {
                ...msg,
                content: deletedForEveryone ? "This message was deleted" : (deletedBy === user._id ? msg.content : "This message was deleted"),
                isDeleted: deletedForEveryone || deletedBy !== user._id,
                attachments: deletedForEveryone ? [] : (deletedBy === user._id ? msg.attachments : [])
              }
            : msg
        )
      );
    };

    // Handle conversation cleared
    const handleConversationCleared = (data) => {
      const { clearedBy } = data;
      // If someone else cleared the conversation, clear messages for this user
      if (clearedBy !== user._id) {
        setMessages([]);
      }
    };

    socket.on("receive_message", handleIncoming);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("conversation_cleared", handleConversationCleared);

    // Error handling
    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });
    socket.on("disconnect", () => {
      console.warn("⚠️ Disconnected from server");
    });

    return () => {
      socket.off("user_presence", handlePresence);
      socket.off("user_typing", handleTypingOn);
      socket.off("user_stop_typing", handleTypingOff);
      socket.off("receive_message", handleIncoming);
      socket.off("connect_error");
      socket.off("disconnect");
    };
  }, [selectedChat, user]);

  // Typing input
  const handleTyping = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    if (!selectedChat) return;

    const roomId = [user._id, selectedChat._id].sort().join('_'); // ✅ Symmetric room ID for typing
    socket.emit("typing", { roomId, userId: user._id, content: newMessage });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { roomId, userId: user._id });
    }, 1000);
  };

  // Send message
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    // Check if user is blocked
    if (isBlocked) {
      toast.error("You cannot send messages to this user as they are blocked.");
      return;
    }

    // Check if current user is blocked by the other user
    if (isBlockedByOther) {
      toast.error("You cannot send messages to this user as they have blocked you.");
      return;
    }

    const roomId = [user._id, selectedChat._id].sort().join('_'); // ✅ Symmetric room ID

    // Generate temporary ID for optimistic UI
    const tempId = `temp_${Date.now()}_${Math.random()}`;

    const payload = {
      _id: tempId,
      sender: { _id: user._id, userName: user.userName },
      receiver: selectedChat._id,
      content: message,
      createdAt: new Date(),
      isTemp: true, // Mark as temporary
    };

    // Optimistic UI
    setMessages((prev) => [...prev, payload]);
    setMessage("");

    // Send via socket (only socket to prevent duplicates) and update sidebar
    socket.emit("private_message", {
      roomId,
      senderId: user._id,
      receiverId: selectedChat._id,
      content: message,
    });

    // Emit event to update sidebar with the latest message
    socket.emit("update_sidebar", {
      userId: selectedChat._id,
      lastMessage: {
        content: message,
        createdAt: new Date(),
      },
    });

    // Also call API to save message and get real message ID for deletion
    try {
      const savedMessage = await messageService.sendMessage(selectedChat._id, message);
      // Replace temporary message with saved message (with real _id)
      setMessages((prev) => {
        const index = prev.findIndex(m => m._id === payload._id);
        if (index !== -1) {
          const newMessages = [...prev];
          newMessages[index] = savedMessage;
          return newMessages;
        }
        return prev;
      });
    } catch (err) {
      console.error("❌ Failed to save message:", err.message);
      // Optionally remove temporary message or notify user
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Check if message has content (including single emojis)
      if (message && message.trim().length > 0) {
        handleSendMessage();
      }
    }
  };

  const handleDeleteMessage = async (messageId) => {
    // Prevent deletion of temporary messages (messages not yet saved to database)
    if (!messageId || messageId.startsWith('temp_')) {
      console.warn("Cannot delete temporary message:", messageId);
      return;
    }

    try {
      // Call API to delete message
      await messageService.deleteMessage(messageId);

      // Emit socket event to notify other user immediately
      const roomId = [user._id, selectedChat._id].sort().join('_');
      socket.emit("delete_message", {
        roomId,
        messageId,
        deletedBy: user._id,
      });

      // Optimistically update local state immediately
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? {
                ...msg,
                content: "This message was deleted",
                isDeleted: true,
                attachments: [],
              }
            : msg
        )
      );

      toast.success("Message deleted successfully.");
      console.log("Message deletion request sent:", messageId);
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast.error("Failed to delete message. Please try again.");
    }
  };

  const handleClearConversation = () => {
    setShowDeleteDialog(true);
  };

  const confirmClearConversation = () => {
    if (!selectedChat) return;
    messageService.deleteConversation(selectedChat._id)
      .then(() => {
        // Remove all messages from local state for current user immediately
        setMessages([]);
        console.log("Conversation cleared for current user");
        toast.success("Chat deleted successfully.");

        // Emit socket event to notify other user (if online) to clear their view
        const roomId = [user._id, selectedChat._id].sort().join('_');
        socket.emit("conversation_cleared", {
          roomId,
          userId: selectedChat._id,
          clearedBy: user._id
        });
      })
      .catch((error) => {
        console.error("Failed to clear conversation:", error);
        toast.error("Failed to delete chat. Please try again.");
      });
    setShowDeleteDialog(false);
  };

  const cancelClearConversation = () => {
    setShowDeleteDialog(false);
  };

  const handleBlockUser = async () => {
    if (!selectedChat) return;
    try {
      const response = await userService.blockUser(selectedChat._id);
      console.log("Block user response:", response);
      // Update local state
      setBlockedUsers(prev => [...prev, selectedChat]);
      setIsBlocked(true);
      setShowMenu(false);
      toast.success("User blocked successfully.");
    } catch (error) {
      console.error("Failed to block user:", error);
      const errorMessage = error.response?.data?.message || "Failed to block user.";
      toast.error(errorMessage);
    }
  };

  const handleUnblockUser = async () => {
    if (!selectedChat) return;
    try {
      await userService.unblockUser(selectedChat._id);
      // Update local state
      setBlockedUsers(prev => prev.filter(user => user._id !== selectedChat._id));
      setIsBlocked(false);
      setShowMenu(false);
      toast.success("User unblocked successfully.");
    } catch (error) {
      console.error("Failed to unblock user:", error);
      toast.error("Failed to unblock user.");
    }
  };

  if (!selectedChat) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
        <div className="text-center px-4">
          <div className="mb-8">
            <img
              src={logo}
              alt="Dev-Chat Logo"
              className={`w-24 h-24 mx-auto mb-6 transition-all duration-1000 ${
                showLogo ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
            />
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome to Dev-Chat
            </h2>
          </div>
          <p className="text-slate-300 text-lg font-mono">
            {displayText}
            <span className="animate-pulse">|</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 border-l border-slate-700 animate-fadeIn">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50 flex-shrink-0 animate-slideInUp">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center justify-between">
            <img
                src={selectedChat.profilePic || sampleProfile}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-purple-500 hover:border-purple-400 transition-all duration-300 animate-fadeIn"
                onClick={() => {
                  // Navigate to public profile page on click
                  window.location.href = `/public-profile/${selectedChat._id}`;
                }}
              />
              <div className="ml-3 animate-slideInRight" onClick={() => {
                // Navigate to public profile page on click
                window.location.href = `/public-profile/${selectedChat._id}`;
              }}>
                <span className="text-lg font-semibold text-white">
                  {selectedChat.fullName}
                </span>
                <div className="text-xs text-slate-300">
                  {onlineStatus === "offline" && lastSeen
                    ? `Last seen at ${new Date(lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : onlineStatus
                  }
                </div>
              </div>
            </div>

            {/* Three dots menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-slate-400 hover:text-purple-400 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute bottom-0 right-3.5  mt-2 w-48 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-50">
                    {isBlocked ? (
                      <button 
                        onClick={() => {
                          setShowMenu(false);
                          handleUnblockUser();
                        }}
                        className="w-full text-left px-4 py-2 text-green-400 hover:bg-slate-700 hover:text-green-300 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Unblock User</span>
                      </button>
                    ) : isBlockedByOther ? (
                      // If current user is blocked by other, do not show block option
                      null
                    ) : (
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          handleBlockUser();
                        }}
                        className="w-full text-left px-4 py-2 text-yellow-400 hover:bg-slate-700 hover:text-yellow-300 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span>Block User</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        handleClearConversation();
                      }}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete Chat</span>
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 animate-fadeIn">
        {loadingMessages ? (
          <div className="flex justify-center items-center h-full text-slate-400 animate-pulse">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-slate-400">
            No messages yet. Start the conversation ✨
          </div>
        ) : (
          <div className="space-y-2">
            {messages.reduce((acc, msg, index) => {
              const messageDate = new Date(msg.createdAt || new Date());
              const dateKey = messageDate.toDateString();

              // Check if we need to add a date separator
              const prevMessage = messages[index - 1];
              const prevDateKey = prevMessage ? new Date(prevMessage.createdAt || new Date()).toDateString() : null;

              if (dateKey !== prevDateKey) {
                acc.push(
                  <div key={`date-${dateKey}`} className="flex justify-center my-4">
                    <div className="bg-slate-700/50 text-slate-300 text-xs px-3 py-1 rounded-full">
                      {messageDate.toLocaleDateString([], {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                );
              }

              acc.push(
                <div
                  key={msg._id || Math.random()}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Message
                    text={msg.content || msg.message || ""}
                    direction={msg.sender?._id === user?._id ? "right" : "left"}
                    timestamp={messageDate}
                    sender={msg.sender?.userName || msg.sender?.fullName || "Unknown"}
                    messageId={msg._id} // Pass the message ID
                    onDelete={msg.content === "This message was deleted" ? undefined : handleDeleteMessage}
                  />
                </div>
              );

              return acc;
            }, [])}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Typing Indicator - Fixed at bottom above input */}
      {isTyping && (
        <div className="bg-slate-800/70 backdrop-blur-sm border-t border-slate-700/30 p-2 flex-shrink-0 animate-slideInUp">
          <div className="flex items-center space-x-2 px-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <div className="text-sm text-slate-300 italic animate-fadeIn">
              {selectedChat.fullName} is typing{typingContent ? `: "${typingContent}"` : '...'}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      {isBlocked ? (
        <div className="bg-slate-800/50 backdrop-blur-md border-t border-slate-700/50 p-4 flex-shrink-0 flex items-center justify-center text-red-400 font-semibold">
          You have blocked this user. Messaging is disabled.
        </div>
      ) : isBlockedByOther ? (
        <div className="bg-slate-800/50 backdrop-blur-md border-t border-slate-700/50 p-4 flex-shrink-0 flex items-center justify-center text-red-400 font-semibold">
          This user has blocked you. Messaging is disabled.
        </div>
      ) : (
        <div className="bg-slate-800/50 backdrop-blur-md border-t border-slate-700/50 p-4 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-slate-400 hover:text-purple-400"
                title="Add emoji"
              >
                😊
              </button>
              {showEmojiPicker && (
                <Emoji
                  onEmojiSelect={handleEmojiSelect}
                  onClose={() => setShowEmojiPicker(false)}
                />
              )}
            </div>

            <div className="flex-1">
              <textarea
                value={message}
                onChange={handleTyping}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white resize-none"
                rows="1"
              />
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className={`p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100 button-press ${
                message.trim() ? 'animate-pulse-once' : ''
              }`}
              style={{
                animation: message.trim() ? 'sendButtonPulse 0.6s ease-out' : 'none'
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showDeleteDialog && (
        <ConfirmationDialog
          title="Delete Chat"
          message="Are you sure you want to delete this chat? This action cannot be undone for you."
          onConfirm={confirmClearConversation}
          onCancel={cancelClearConversation}
        />
      )}
    </div>
  );
};

export default Chat;
