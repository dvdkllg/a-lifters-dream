
import React from 'react';

interface AppLogoProps {
  size?: number;
  className?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 32, className = "" }) => {
  return (
    <img 
      src="/lovable-uploads/1662ed20-70b5-434a-9547-17d48c3d1e2a.png"
      alt="A Lifter's Dream Logo"
      width={size} 
      height={size} 
      className={`${className} rounded-lg`}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default AppLogo;
