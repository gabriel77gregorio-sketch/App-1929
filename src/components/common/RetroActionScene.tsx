import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface RetroActionSceneProps {
  imageSrc?: string;
  imageAlt?: string;
  narrativeText?: string;
  subPrompt?: string;
  status?: 'in_progress' | 'ready' | 'success' | 'failure';
  countdownTimer?: React.ReactNode;
  onContinue?: () => void;
  aspect?: string;
  hasBakedText?: boolean;
}

export const RetroActionScene: React.FC<RetroActionSceneProps> = ({
  imageSrc,
  imageAlt = 'Cena de Ação',
  narrativeText,
  subPrompt = '-- Toque para continuar --',
  status,
  countdownTimer,
  onContinue,
  aspect = 'aspect-[4/3] sm:aspect-[16/10]',
  hasBakedText = false
}) => {
  return (
    <div 
      onClick={onContinue}
      className={`relative w-full rounded-lg overflow-hidden border-2 border-noir-700 bg-noir-950 shadow-2xl transition-all ${
        onContinue ? 'cursor-pointer hover:border-gold-500/60 active:scale-[0.99]' : ''
      }`}
    >
      {/* 1. Área da Imagem / Cena */}
      <div className={`relative w-full ${hasBakedText ? 'aspect-[4/5] sm:aspect-[3/4]' : aspect} overflow-hidden bg-noir-900`}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover select-none"
            style={{ imageRendering: 'auto' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-noir-900 to-noir-950 text-noir-500">
            <span className="font-mono text-xs uppercase tracking-widest">[Cena em Produção]</span>
          </div>
        )}

        {/* Gradiente sutil nas bordas para integração com o estilo noir */}
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />

        {/* Status flutuante (apenas se não tiver o texto baked) */}
        {!hasBakedText && status && (
          <div className="absolute top-2 left-2 z-10">
            {status === 'in_progress' && (
              <span className="bg-noir-950/90 text-gold-400 border border-gold-500/40 text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded font-bold backdrop-blur-sm">
                Na Calada da Noite...
              </span>
            )}
            {status === 'ready' && (
              <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded font-bold animate-pulse backdrop-blur-sm">
                ✓ Pronta para Resolução
              </span>
            )}
            {status === 'failure' && (
              <span className="bg-rose-950/90 text-rose-300 border border-rose-500/50 text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded font-bold backdrop-blur-sm">
                ⚠ Flagrante Policial!
              </span>
            )}
          </div>
        )}
      </div>

      {/* 2. Caixa de Diálogo Retrô no Rodapé (Estilo Visual Novel / 1929 Retro Box) */}
      {!hasBakedText && narrativeText && (
        <div className="p-3 sm:p-4 bg-noir-950 border-t-2 border-noir-800">
          <div className="relative bg-noir-900/90 border-2 border-paper-200/40 rounded px-3.5 py-3 shadow-inner">
            {/* Ornamento de cantos clássico da caixa de diálogo */}
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-paper-200/80" />
            <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-paper-200/80" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-paper-200/80" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-paper-200/80" />

            {/* Texto Narrativo Principal */}
            <p className="font-mono text-xs sm:text-sm text-paper-100 leading-relaxed tracking-wide text-center">
              "{narrativeText}"
            </p>

            {/* Timer ou Rodapé com comando retrô */}
            {countdownTimer ? (
              <div className="mt-2.5 pt-2 border-t border-noir-800 flex justify-center">
                {countdownTimer}
              </div>
            ) : subPrompt ? (
              <div className="mt-2.5 pt-2 border-t border-noir-800/80 flex items-center justify-center gap-1.5 text-[10px] font-mono text-gold-400/90 uppercase tracking-widest animate-pulse">
                <span>{subPrompt}</span>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Se a imagem já tiver o texto baked e tiver ação de clique, mostra uma barra de toque sutil */}
      {hasBakedText && onContinue && (
        <div className="p-2.5 bg-noir-950 border-t border-noir-800 text-center">
          <span className="text-[11px] font-mono text-gold-400 font-bold uppercase tracking-widest animate-pulse">
            {subPrompt}
          </span>
        </div>
      )}
    </div>
  );
};
