
import React from 'react';

interface AppLogoProps {
  size?: number;
  className?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 32, className = "" }) => {
  return (
    <img 
      src="/lovable-uploads/762242bf-9156-463f-ab66-3b7ae004a168.png"
      alt="A Lifter's Dream Logo"
      width={size} 
      height={size} 
      className={`${className} rounded-lg`}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default AppLogo;
