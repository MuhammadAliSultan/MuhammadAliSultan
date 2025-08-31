import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Message = ({ text, direction, timestamp, sender, messageId, onDelete }) => {
  const isLeft = direction === 'left';
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check if message is a single emoji
  const isSingleEmoji = text && /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]{1,3}$/u.test(text.trim()) && text.trim().length <= 3;

  // Check if message is long enough to need "See More"
  const isLongMessage = text && text.length > 200;
  const shouldShowSeeMore = isLongMessage && !isExpanded;
  const displayText = shouldShowSeeMore ? text.substring(0, 200) + '...' : text;



  const messageStyles = {
    container: {
      display: 'flex',
      justifyContent: isLeft ? 'flex-start' : 'flex-end',
      margin: '4px 0',
      padding: '0 8px',
    },
      message: {
        maxWidth: isSingleEmoji ? 'auto' : '70%',
        minWidth: isSingleEmoji ? 'auto' : 'fit-content',
        maxHeight: isExpanded ? 'none' : '200px',
        overflow: isExpanded ? 'visible' : 'hidden',
        padding: isSingleEmoji ? '6px 8px' : '8px 14px',
        borderRadius: isSingleEmoji ? '50%' : (isLeft ? '12px 12px 12px 0px' : '12px 12px 0px 12px'),
        background: isSingleEmoji ? 'transparent' : (isLeft
          ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)'
          : 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)'
        ),
        color: isLeft ? '#dcddde' : '#ffffff',
        boxShadow: isSingleEmoji ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)',
        position: 'relative',
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        transition: 'all 0.3s ease',
        border: 'none',
        cursor: !isLeft ? 'pointer' : 'default',
        transform: isHovered && !isSingleEmoji ? 'scale(1.02)' : 'scale(1)',
        animation: isSingleEmoji ? 'emojiBounce 0.6s ease-out' : 'messageSlideIn 0.3s ease-out',
        marginBottom: '4px',
        fontSize: '15px',
        lineHeight: '1.4',
      },
    text: {
      fontSize: isSingleEmoji ? '32px' : '14px',
      lineHeight: isSingleEmoji ? '1' : '1.4',
      margin: 0,
      wordBreak: 'break-word',
      overflowWrap: 'anywhere',
      hyphens: 'auto',
      whiteSpace: 'pre-wrap',
      textAlign: 'center',
      maxWidth: '100%',
      wordWrap: 'break-word',
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
    modalBackdrop: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
    },
    modal: {
      backgroundColor: '#1f2937',
      borderRadius: '12px',
      padding: '20px',
      maxWidth: '300px',
      width: '90%',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
      border: '1px solid #374151',
    },
    modalTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#f3f4f6',
      marginBottom: '16px',
      textAlign: 'center',
    },
    modalButtons: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
    },
    deleteButton: {
      background: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 50%, #c2410c 100%)',
      color: '#ffffff',
      border: 'none',
      padding: '10px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      flex: 1,
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 4px rgba(124, 45, 18, 0.2)',
    },
    cancelButton: {
      background: 'linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #a855f7 100%)',
      color: '#f3f4f6',
      border: 'none',
      padding: '10px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      flex: 1,
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 4px rgba(88, 28, 135, 0.2)',
    },
  };

  const handleMessageClick = (e) => {
    if (!isLeft && onDelete) {
      e.stopPropagation();
      setShowDeleteModal(true);
    }
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteModal(false);
    // Add deletion animation
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageElement) {
      messageElement.style.animation = 'messageDelete 0.5s ease-out forwards';
      setTimeout(() => {
        if (onDelete) {
          onDelete(messageId);
        }
      }, 500);
    } else {
      if (onDelete) {
        onDelete(messageId);
      }
    }
  };

  const handleCancel = () => {
    setShowDeleteModal(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div style={messageStyles.container}>
        <div
          style={messageStyles.message}
          onClick={handleMessageClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {sender && isLeft && (
            <div style={messageStyles.senderName}>{sender}</div>
          )}
          <p style={messageStyles.text}>{displayText}</p>
          {isLongMessage && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: isLeft ? '#60a5fa' : '#fbbf24',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                padding: '2px 0',
                marginTop: '4px',
                textDecoration: 'underline',
              }}
            >
              {isExpanded ? 'See Less' : 'See More'}
            </button>
          )}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={messageStyles.modalBackdrop} onClick={handleBackdropClick}>
          <div style={messageStyles.modal}>
            <div style={messageStyles.modalTitle}>
              Delete Message
            </div>
            <div style={messageStyles.modalButtons}>
              <button
                style={messageStyles.cancelButton}
                onClick={handleCancel}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 4px 8px rgba(55, 65, 81, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 2px 4px rgba(55, 65, 81, 0.2)';
                }}
              >
                Cancel
              </button>
              <button
                style={messageStyles.deleteButton}
                onClick={handleDeleteConfirm}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 4px 8px rgba(220, 38, 38, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 2px 4px rgba(220, 38, 38, 0.2)';
                }}
              >
                Delete from Everyone
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
  onDelete: PropTypes.func,
};

Message.defaultProps = {
  timestamp: new Date(),
  sender: null,
  onDelete: null,
};

export default Message;
