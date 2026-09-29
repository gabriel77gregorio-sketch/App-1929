import React from 'react';

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'buy' 
  | 'sell' 
  | 'upgrade' 
  | 'danger' 
  | 'outline' 
  | 'outline-emerald'
  | 'ghost';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
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
  const baseStyles = 'inline-flex items-center justify-center font-serif-vintage tracking-wider font-semibold rounded-md transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:grayscale disabled:pointer-events-none select-none cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5 min-h-[34px]',
    md: 'text-sm px-4 py-2 gap-2 min-h-[40px]',
    lg: 'text-base px-6 py-3 gap-2.5 min-h-[46px]',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    // Dourado Art Déco — Ação Principal / Destaque
    primary: 'bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-noir-950 hover:brightness-110 shadow-gold-subtle border border-gold-400 font-bold',
    
    // Neutro discreto
    secondary: 'bg-noir-800 text-paper-200 hover:bg-noir-750 hover:text-paper-100 border border-noir-700 hover:border-noir-600 shadow-sm',
    
    // Verde Esmeralda — Lucro, Coleta de Renda, Recompensa e Sucesso
    success: 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 text-white hover:brightness-110 shadow-md shadow-emerald-950/50 border border-emerald-400 font-bold',
    
    // Ação de Compra no Mercado — Verde Teal
    buy: 'bg-gradient-to-r from-emerald-700 to-teal-700 text-emerald-100 hover:brightness-110 border border-emerald-500/60 shadow-sm font-bold',
    
    // Ação de Venda no Mercado — Âmbar / Laranja Queimado
    sell: 'bg-gradient-to-r from-amber-700 via-orange-700 to-amber-700 text-amber-100 hover:brightness-110 border border-amber-500/60 shadow-sm font-bold',
    
    // Evolução / Upgrade de Estabelecimentos — Púrpura Imperial
    upgrade: 'bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-800 text-purple-100 hover:brightness-110 border border-purple-400/50 shadow-md shadow-purple-950/40 font-bold',
    
    // Ação Violenta / Perigo / Cancelar / Reset
    danger: 'bg-gradient-to-r from-rose-800 via-red-800 to-rose-800 text-paper-50 hover:brightness-110 border border-red-500/60 shadow-sm font-bold',
    
    // Contorno Dourado
    outline: 'bg-transparent text-gold-400 hover:bg-gold-500/10 border border-gold-500/60 hover:border-gold-400',
    
    // Contorno Esmeralda
    'outline-emerald': 'bg-transparent text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/60 hover:border-emerald-400',
    
    // Botão Fantasma / Mínimo
    ghost: 'bg-transparent text-noir-400 hover:text-paper-100 hover:bg-noir-850/60',
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
