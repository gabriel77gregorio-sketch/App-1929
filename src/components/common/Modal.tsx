import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-noir-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      <div className={`relative w-full ${maxWidthClasses[maxWidth]} bg-noir-900 border border-gold-500/30 rounded-lg shadow-2xl p-5 sm:p-6 overflow-hidden max-h-[90vh] flex flex-col z-10`}>
        {/* Detalhe de canto Art Déco */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold-500/60 pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold-500/60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold-500/60 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold-500/60 pointer-events-none" />

        {/* Cabeçalho */}
        {(title || subtitle) && (
          <div className="flex items-start justify-between pb-3 border-b border-noir-700/80 mb-4">
            <div>
              {title && (
                <h3 className="font-display text-lg sm:text-xl font-bold text-gold-400 tracking-wide">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-noir-400 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-noir-400 hover:text-gold-400 p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Conteúdo */}
        <div className="overflow-y-auto flex-1 pr-1">
          {children}
        </div>
      </div>
    </div>
  );
};
