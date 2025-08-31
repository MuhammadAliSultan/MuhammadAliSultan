import React, { useState } from 'react';

const Emoji = ({ onEmojiSelect, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('smileys');
  
  // Manually entered emojis organized by categories
  const emojiCategories = {
    smileys: {
      name: 'Smileys',
      emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩']
    },
    animals: {
      name: 'Animals',
      emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔']
    },
    food: {
      name: 'Food',
      emojis: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅']
    },
    activities: {
      name: 'Activities',
      emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍']
    },
    travel: {
      name: 'Travel',
      emojis: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵']
    },
    objects: {
      name: 'Objects',
      emojis: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '💽', '💾', '💿', '📀', '📼', '📷']
    }
  };

  const handleEmojiClick = (emoji) => {
    onEmojiSelect(emoji);
    onClose();
  };

  const currentEmojis = emojiCategories[selectedCategory]?.emojis || [];

  return (
    <div 
      className="absolute bg-slate-800 rounded-lg p-3 shadow-lg border border-slate-700 z-50"
      style={{
        maxHeight: '38vh',
        width: '250px',
        bottom: 'auto',
        top: '-250px',
        left: '0'
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-white">Emoji</h3>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white text-lg"
        >
          ×
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-1 mb-2 overflow-x-auto">
        {Object.entries(emojiCategories).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-2 py-1 rounded text-xs whitespace-nowrap transition-colors ${
              selectedCategory === key
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Emoji Grid */}
      <div className="overflow-y-auto">
        <div className="grid grid-cols-6 gap-1">
          {currentEmojis.map((emoji, index) => (
            <button
              key={`${emoji}-${index}`}
              onClick={() => handleEmojiClick(emoji)}
              className="p-1 text-lg hover:bg-slate-700 rounded transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Emoji;
