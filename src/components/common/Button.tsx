import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-serif-vintage tracking-wider font-semibold rounded transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-noir-950 hover:brightness-110 shadow-gold-subtle border border-gold-400/40',
    secondary: 'bg-noir-800 text-paper-100 hover:bg-noir-700 border border-noir-600',
    outline: 'bg-transparent text-gold-400 hover:bg-gold-500/10 border border-gold-500/50 hover:border-gold-400',
    danger: 'bg-blood-800 text-paper-50 hover:bg-blood-700 border border-red-900/50',
    ghost: 'bg-transparent text-noir-400 hover:text-paper-100 hover:bg-noir-800/50',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
