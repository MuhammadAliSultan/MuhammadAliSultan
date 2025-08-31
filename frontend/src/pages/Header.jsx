import React from 'react';

const Header = ({ chat, onClick }) => {
  const { fullName, avatar, lastMessage, lastMessageTime, unreadCount, isOnline } = chat;

  return (
    <div 
      className="flex items-center p-3 hover:bg-slate-700/50 cursor-pointer transition-all duration-200 border-b border-slate-700/30 last:border-b-0"
      onClick={onClick}
    >
      {/* Profile Picture with Online Status */}
      <div className="relative flex-shrink-0">
        <img 
          src={avatar} 
          alt={fullName}
          className="w-12 h-12 rounded-full object-cover"
        />
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
        )}
      </div>

      {/* Chat Info */}
      <div className="flex-1 ml-3 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium truncate">{fullName}</h3>
          <span className="text-xs text-slate-400">{lastMessageTime}</span>
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-slate-400 truncate max-w-[200px]">
            {lastMessage}
          </p>
          
          {unreadCount > 0 && (
            <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
