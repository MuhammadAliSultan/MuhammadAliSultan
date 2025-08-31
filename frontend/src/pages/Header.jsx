import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { messageService } from '../api/messageService';
const Header = ({ chat, onClick }) => {
  const { fullName, avatar, lastMessage, lastMessageTime, isOnline } = chat;
  const [notificationMessage, setNotificationMessage] = useState('');
  const navigate = useNavigate();



  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);

  const confirmDeleteChat = async () => {
    try {
      await messageService.deleteConversation(chat._id);
      setNotificationMessage(`Chat cleared with ${fullName}`);
    } catch {
      setNotificationMessage(`Failed to clear chat with ${fullName}`);
    }
    setShowConfirmDialog(false);
  };

  const cancelDeleteChat = () => {
    setShowConfirmDialog(false);
  };

  const handleNotificationClose = () => {
    setNotificationMessage('');
  };

  return (
    <div 
      className="flex items-center p-3 hover:bg-slate-700/50 cursor-pointer transition-all duration-200 border-b border-slate-700/30 last:border-b-0 relative"
      onClick={onClick}
    >
      {/* Profile Picture with Online Status */}
      <div className="relative flex-shrink-0" onClick={(e) => { e.stopPropagation(); navigate(`/public-profile/${chat._id}`); }}>
        <img
          src={avatar}
          alt={fullName}
          className="w-12 h-12 rounded-full object-cover cursor-pointer"
        />
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
        )}
      </div>

      {/* Chat Info */}
      <div className="flex-1 ml-3 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium truncate cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate(`/public-profile/${chat._id}`); }}>{fullName}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">{lastMessageTime}</span>
            
            {/* Three dots menu button */}
           
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-slate-400 truncate max-w-[200px]">
            {lastMessage}
          </p>
        </div>
      </div>

     

      {/* Notification */}
      <Notification
        message={notificationMessage}
        onClose={handleNotificationClose}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        title="Clear Chat"
        message={`Are you sure you want to clear your chat with ${fullName}? This action cannot be undone and will only remove messages from your view.`}
        onConfirm={confirmDeleteChat}
        onCancel={cancelDeleteChat}
      />
    </div>
  );
};

export default Header;
