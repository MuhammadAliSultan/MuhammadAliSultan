import React, { useState } from 'react';
import PropTypes from 'prop-types';

const SearchBar = ({ placeholder, onSearch, type }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  const getPlaceholderText = () => {
    if (placeholder) return placeholder;
    return type === 'chat' ? 'Search user...' : 'Search Group by Name...';
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchContainer}>
        <div style={styles.searchIcon}>
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={getPlaceholderText()}
          style={styles.input}
        />
        {searchTerm && (
          <button onClick={handleClear} style={styles.clearButton}>
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    padding: '8px 16px',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    borderRadius: '8px',
    padding: '8px 12px',
    position: 'relative',
  },
  searchIcon: {
    color: '#667781',
    marginRight: '8px',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '14px',
    color: '#000000',
  },
  clearButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#667781',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['chat', 'group']),
};

SearchBar.defaultProps = {
  type: 'chat',
};

export default SearchBar;
