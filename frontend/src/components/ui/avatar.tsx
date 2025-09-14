import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const getAvatarColor = (name: string): string => {
  const colors = [
    'avatar-1', 'avatar-2', 'avatar-3', 
    'avatar-4', 'avatar-5', 'avatar-6'
  ];
  
  // Simple hash function to consistently assign colors based on name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base'
};

export const Avatar: React.FC<AvatarProps> = ({ 
  name, 
  size = 'md', 
  className 
}) => {
  const colorClass = getAvatarColor(name);
  const initials = getInitials(name);
  
  return (
    <div 
      className={cn(
        'avatar-modern',
        colorClass,
        sizeClasses[size],
        className
      )}
      title={name}
    >
      {initials}
    </div>
  );
};

export default Avatar;
