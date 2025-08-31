import React from 'react';

const LoadingSkeleton = ({ type = 'text', width = '100%', height = '20px', className = '' }) => {
  const baseClasses = 'animate-pulse bg-slate-700/50 rounded';

  const getSkeletonStyle = () => {
    switch (type) {
      case 'text':
        return {
          width,
          height,
          className: `${baseClasses} ${className}`
        };
      case 'circle':
        return {
          width: width,
          height: width,
          borderRadius: '50%',
          className: `${baseClasses} ${className}`
        };
      case 'rectangle':
        return {
          width,
          height,
          className: `${baseClasses} ${className}`
        };
      case 'avatar':
        return {
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          className: `${baseClasses} ${className}`
        };
      case 'message':
        return {
          width,
          height: '60px',
          className: `${baseClasses} ${className}`
        };
      default:
        return {
          width,
          height,
          className: `${baseClasses} ${className}`
        };
    }
  };

  const { className: skeletonClass, ...style } = getSkeletonStyle();

  return <div className={skeletonClass} style={style} />;
};

export default LoadingSkeleton;
