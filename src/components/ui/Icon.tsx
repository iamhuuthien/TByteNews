import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconProps {
  icon: LucideIcon;
  className?: string;
  size?: number | string;
  strokeWidth?: number | string;
}

const Icon: React.FC<IconProps> = ({ icon: IconComp, className = '', size = 20, strokeWidth = 2 }) => {
  return <IconComp className={className} size={size} strokeWidth={strokeWidth} />;
};

export default Icon;
