import React from 'react';
import type { ComponentType, SVGProps } from 'react';

interface IconProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  className?: string;
  size?: number | string;
  strokeWidth?: number | string;
}

const Icon: React.FC<IconProps> = ({ icon: IconComp, className = '', size = 20, strokeWidth = 2 }) => {
  return <IconComp className={className} size={size} strokeWidth={strokeWidth} />;
};

export default Icon;
