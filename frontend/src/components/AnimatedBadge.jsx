import React from 'react';

const AnimatedBadge = ({
  children,
  variant = 'primary',
  size = 'md',
  animated = true,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300';

  const variantClasses = {
    primary: 'bg-purple-600 text-white',
    secondary: 'bg-slate-600 text-slate-300',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-600 text-white',
    danger: 'bg-red-600 text-white',
    info: 'bg-blue-600 text-white'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base'
  };

  const animationClasses = animated ? 'badge-glow' : '';

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${animationClasses} ${className}`}
    >
      {children}
    </span>
  );
};

export default AnimatedBadge;
