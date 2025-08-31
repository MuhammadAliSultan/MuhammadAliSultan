import React, { useState, useEffect, useRef } from "react";
import sampleProfile from "../assets/logo.png";
import Emoji from "../pages/subpages/Emoji";
import Message from "./Message";
import socket from "../api/socket"; // socket.io client
import { messageService } from "../api/messageService"; // backend calls

const Chat = ({ selectedChat }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState("offline");

  const user = JSON.parse(localStorage.getItem("user"));
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch messages & join chat room when selected chat changes
  useEffect(() => {
    if (!selectedChat || !user) return;

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const res = await messageService.getMessages(selectedChat._id);
        setMessages(res?.data || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();

    // Join socket room
    socket.emit("join_room", { roomId: selectedChat._id, userId: user._id });

    // Presence
    const handlePresence = (presenceList) => {
      const statusObj = presenceList.find((p) => p.userId === selectedChat._id);
      setOnlineStatus(statusObj?.status || "offline");
    };
    socket.on("user_presence", handlePresence);

    // Typing
    const handleTypingOn = ({ userId }) => {
      if (userId === selectedChat._id) setIsTyping(true);
    };
    const handleTypingOff = ({ userId }) => {
      if (userId === selectedChat._id) setIsTyping(false);
    };
    socket.on("user_typing", handleTypingOn);
    socket.on("user_stop_typing", handleTypingOff);

    return () => {
      socket.off("user_presence", handlePresence);
      socket.off("user_typing", handleTypingOn);
      socket.off("user_stop_typing", handleTypingOff);
    };
  }, [selectedChat, user]);

  // Listen for incoming messages
  useEffect(() => {
    if (!selectedChat) return;

    const handleIncoming = (msg) => {
      if (msg.chatId === selectedChat._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("personal-message", handleIncoming);
    return () => socket.off("personal-message", handleIncoming);
  }, [selectedChat]);

  // Typing input
  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!selectedChat) return;

    socket.emit("typing", { roomId: selectedChat._id, userId: user._id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { roomId: selectedChat._id, userId: user._id });
    }, 1000);
  };

  // Send message
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    const payload = {
      chatId: selectedChat._id,
      senderId: user._id,
      toUserId: selectedChat._id,
      message,
      createdAt: new Date(),
    };

    socket.emit("private_message", payload);

    try {
      const res = await messageService.sendMessage(selectedChat._id, message);
      setMessages((prev) => [...prev, res.data || res]);
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!selectedChat) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
        <div className="text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Welcome to Dev-Chat</h2>
          <p className="text-slate-300 text-lg">Select a conversation to get started 🚀</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 border-l border-slate-700">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50 flex-shrink-0">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <img src={selectedChat.avatar || sampleProfile} alt="Profile" className="w-10 h-10 rounded-full border-2 border-purple-500" />
            <div className="ml-3">
              <span className="text-lg font-semibold text-white">{selectedChat.fullName}</span>
              <div className="text-xs text-slate-300">{onlineStatus}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {loadingMessages ? (
          <div className="flex justify-center items-center h-full text-slate-400">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-slate-400">No messages yet. Start the conversation ✨</div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <Message
                key={msg._id || Math.random()}
                text={msg.content || msg.message || ""}
                direction={msg.sender?._id === user?._id ? "right" : "left"}
                timestamp={msg.createdAt ? new Date(msg.createdAt) : new Date()}
                sender={msg.sender?.username || "Unknown"}
              />
            ))}
            {isTyping && <div className="text-sm text-slate-300 italic">Typing...</div>}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-slate-800/50 backdrop-blur-md border-t border-slate-700/50 p-4 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 text-slate-400 hover:text-purple-400" title="Add emoji">😊</button>
            {showEmojiPicker && <Emoji onEmojiSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />}
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
            className="p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
