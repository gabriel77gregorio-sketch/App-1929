import React, { useState } from 'react';
import { 
  Building2, Crosshair, MapPin, Store, 
  Package, Landmark, Ship, Train, Wine, 
  Wrench, Trees, Beer, Coffee, Dices, Shield, FileText
} from 'lucide-react';

interface GameImageProps {
  src?: string;
  alt: string;
  className?: string;
  theme?: 'gold' | 'emerald' | 'crimson' | 'purple' | 'blue' | 'neutral';
  iconType?: string;
  aspect?: string;
  overlayText?: string;
}

export const GameImage: React.FC<GameImageProps> = ({
  src,
  alt,
  className = '',
  theme = 'gold',
  iconType,
  aspect = 'h-full w-full',
  overlayText
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Paleta de gradientes e temas Art Déco
  const themeGradients = {
    gold: 'from-amber-950/80 via-noir-900 to-noir-950 text-gold-400 border-gold-500/30',
    emerald: 'from-emerald-950/80 via-noir-900 to-noir-950 text-emerald-400 border-emerald-500/30',
    crimson: 'from-rose-950/80 via-noir-900 to-noir-950 text-rose-400 border-rose-500/30',
    purple: 'from-purple-950/80 via-noir-900 to-noir-950 text-purple-400 border-purple-500/30',
    blue: 'from-blue-950/80 via-noir-900 to-noir-950 text-blue-400 border-blue-500/30',
    neutral: 'from-noir-850 via-noir-900 to-noir-950 text-paper-300 border-noir-700',
  };

  const renderIcon = () => {
    switch (iconType) {
      case 'bar':
      case 'beer':
        return <Beer className="w-8 h-8 opacity-75" />;
      case 'oficina':
      case 'tool':
      case 'wrench':
        return <Wrench className="w-8 h-8 opacity-75" />;
      case 'armazem':
      case 'warehouse':
      case 'package':
        return <Package className="w-8 h-8 opacity-75" />;
      case 'cafe':
      case 'coffee':
        return <Coffee className="w-8 h-8 opacity-75" />;
      case 'cassino':
      case 'dice':
        return <Dices className="w-8 h-8 opacity-75" />;
      case 'ship':
      case 'porto':
        return <Ship className="w-8 h-8 opacity-75" />;
      case 'train':
      case 'estacao':
        return <Train className="w-8 h-8 opacity-75" />;
      case 'wine':
      case 'boemio':
        return <Wine className="w-8 h-8 opacity-75" />;
      case 'trees':
      case 'interior':
        return <Trees className="w-8 h-8 opacity-75" />;
      case 'landmark':
      case 'centro':
        return <Landmark className="w-8 h-8 opacity-75" />;
      case 'gun':
      case 'violencia':
      case 'crosshair':
        return <Crosshair className="w-8 h-8 opacity-75" />;
      case 'document':
      case 'newspaper':
        return <FileText className="w-8 h-8 opacity-75" />;
      default:
        return <Building2 className="w-8 h-8 opacity-75" />;
    }
  };

  return (
    <div className={`relative overflow-hidden bg-noir-950 border ${themeGradients[theme]} ${aspect} ${className}`}>
      {/* 1. Backdrop Ilustrado / Gravura Art Déco (Sempre presente) */}
      <div className={`absolute inset-0 bg-gradient-to-br ${themeGradients[theme]} flex flex-col items-center justify-center p-3 text-center`}>
        {/* Padrão geométrico Art Déco de fundo */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c5a05933_1px,transparent_1px)] [background-size:12px_12px]" />
        
        {/* Moldura de cantos */}
        <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-current opacity-40" />
        <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-current opacity-40" />
        <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-current opacity-40" />
        <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-current opacity-40" />

        {/* Ícone central estilizado */}
        <div className="relative z-0 transform transition-transform duration-300">
          {renderIcon()}
        </div>

        {overlayText && (
          <span className="relative z-0 mt-1 font-serif-vintage text-[10px] tracking-wider uppercase opacity-80 line-clamp-1">
            {overlayText}
          </span>
        )}
      </div>

      {/* 2. Fotografia Temática ou Ilustração Pixel Art */}
      {src && !hasError && (() => {
        const isPixelArt = src.startsWith('/images/') || src.includes('pixel') || src.includes('preso_cafe');
        return (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isLoaded ? (isPixelArt ? 'opacity-95' : 'opacity-70') : 'opacity-0'
            }`}
            style={{ imageRendering: isPixelArt ? 'pixelated' : 'auto' }}
          />
        );
      })()}

      {/* 3. Vinheta e Sombra para Contraste de Texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-noir-950/90 via-noir-950/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-15 mix-blend-overlay pointer-events-none" />
    </div>
  );
};
