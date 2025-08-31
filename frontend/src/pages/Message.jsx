import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ text, direction, timestamp, sender }) => {
  const isLeft = direction === 'left';
  
  const messageStyles = {
    container: {
      display: 'flex',
      justifyContent: isLeft ? 'flex-start' : 'flex-end',
      margin: '4px 0',
      padding: '0 8px',
    },
    message: {
      maxWidth: '70%',
      minWidth: 'fit-content',
      padding: '8px 12px',
      borderRadius: isLeft ? '0px 8px 8px 8px' : '8px 0px 8px 8px',
      backgroundColor: isLeft ? '#ffffff' : '#dcf8c6',
      color: isLeft ? '#000000' : '#000000',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      wordWrap: 'break-word',
      whiteSpace: 'pre-wrap',
    },
    text: {
      fontSize: '14px',
      lineHeight: '1.4',
      margin: 0,
    },
    metadata: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: isLeft ? 'flex-start' : 'flex-end',
      gap: '4px',
      marginTop: '4px',
      fontSize: '11px',
      color: '#667781',
    },
    senderName: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#008069',
      marginBottom: '2px',
    },
    timestamp: {
      fontSize: '11px',
      color: '#667781',
    },
  };

  return (
    <div style={messageStyles.container}>
      <div style={messageStyles.message}>
        {sender && isLeft && (
          <div style={messageStyles.senderName}>{sender}</div>
        )}
        <p style={messageStyles.text}>{text}</p>
        {timestamp && (
          <div style={messageStyles.metadata}>
            <span style={messageStyles.timestamp}>
              {new Date(timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            {!isLeft && (
              <span style={{ color: '#4fc3f7', fontSize: '16px' }}>✓✓</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

Message.propTypes = {
  text: PropTypes.string.isRequired,
  direction: PropTypes.oneOf(['left', 'right']).isRequired,
  timestamp: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date)
  ]),
  sender: PropTypes.string,
};

Message.defaultProps = {
  timestamp: new Date(),
  sender: null,
};

export default Message;
