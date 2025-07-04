
import React from 'react';

interface AppLogoProps {
  size?: number;
  className?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 32, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="url(#gradient)" stroke="#1f2937" strokeWidth="2"/>
      
      {/* Barbell design */}
      <rect x="20" y="47" width="60" height="6" rx="3" fill="#ffffff"/>
      
      {/* Left weight plates */}
      <rect x="12" y="40" width="16" height="20" rx="2" fill="#ef4444" stroke="#dc2626" strokeWidth="1"/>
      <rect x="8" y="42" width="12" height="16" rx="2" fill="#f97316" stroke="#ea580c" strokeWidth="1"/>
      
      {/* Right weight plates */}
      <rect x="72" y="40" width="16" height="20" rx="2" fill="#ef4444" stroke="#dc2626" strokeWidth="1"/>
      <rect x="80" y="42" width="12" height="16" rx="2" fill="#f97316" stroke="#ea580c" strokeWidth="1"/>
      
      {/* Center grip */}
      <rect x="45" y="45" width="10" height="10" rx="1" fill="#6b7280" stroke="#4b5563" strokeWidth="1"/>
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default AppLogo;
