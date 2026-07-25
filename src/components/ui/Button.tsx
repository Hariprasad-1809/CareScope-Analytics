import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium font-display rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-teal/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer duration-150';
    
    const variants = {
      primary: 'bg-teal hover:bg-teal/90 text-paper border border-teal',
      secondary: 'bg-white border border-grid text-ink hover:bg-paper',
      danger: 'bg-coral hover:bg-coral/90 text-paper border border-coral',
      success: 'bg-teal hover:bg-teal/90 text-paper border border-teal',
      ghost: 'bg-transparent hover:bg-grid/30 text-ink',
      glow: 'bg-teal hover:bg-teal/90 text-paper border border-teal'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...(props as any)}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
