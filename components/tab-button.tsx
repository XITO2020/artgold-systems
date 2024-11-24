import React from 'react';
import { motion } from 'framer-motion';
import { TabButtonProps } from '@/types';
import Button from './ui/button';
import { ArrowLeftRight } from 'lucide-react';

export const TabButton: React.FC<TabButtonProps> = ({
  children,
  onClick,
  className = '',
  active = false,
  variant = 'default',
  size = 'default'
}) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      size={size}
      className={`relative ${className} ${
        active ? 'bg-rose-600 text-white' : 'bg-zinc-800 text-gray-300'
      }`}
    >
      <motion.span
        animate={{ scale: active ? 1.05 : 1 }}
        className="flex items-center gap-2"
      >
        {active && <ArrowLeftRight className="w-4 h-4" />}
        {children}
      </motion.span>
    </Button>
  );
};