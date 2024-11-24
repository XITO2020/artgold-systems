import React from 'react';

// Interface ButtonProps
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
  className?: string;
}

// Composant Button
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'default',
  size = 'default',
  children,
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors';
  const sizeStyles = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 px-3 py-1',
    lg: 'h-12 px-6 py-3',
    icon: 'h-4 px-2 py-1',
  };
  const variantStyles = {
    default: 'bg-rose-600 text-white hover:bg-rose-700',
    outline: 'border-2 border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white',
    secondary: 'bg-zinc-800 text-white hover:bg-zinc-700',
    ghost: 'bg-slate-400 bg-opacity-40 hover:bg-opacity-80 text-slate-800 hover:text-amber-500',
  };

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
