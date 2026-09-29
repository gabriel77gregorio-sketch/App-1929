import React from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/common/Button';
import { ShieldCheck, Zap, Smartphone, ArrowRight, Play, Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from '../components/common/PWAInstallModal';

import heroImage from '../assets/hero.png';

export const LandingPage: React.FC = () => {
  const { setScreen } = useGame();
  const { isInstallable, isStandalone, showIOSInstructions, setShowIOSInstructions, installApp } = usePWAInstall();

  return (
    <div className="min-h-screen bg-noir-950 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background vignette e textura */}
      <div className="absolute inset-0 bg-gradient-radial from-noir-900/60 via-noir-950/90 to-noir-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#c5a0590a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Linhas decorativas Art Déco no topo */}
      <div className="relative z-10 pt-6 sm:pt-10 px-4 text-center">
        <div className="inline-flex items-center gap-3 mb-2">
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-gold-500/60" />
          <span className="font-mono text-[11px] sm:text-xs text-gold-400 tracking-[0.25em] uppercase font-semibold">
            Santa Augusta • Brasil
          </span>
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-gold-500/60" />
        </div>

        {/* Título Monumental 1929 */}
        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-paper-100 via-gold-400 to-gold-600 tracking-wider filter drop-shadow-2xl">
          1929
        </h1>

        {/* Ilustração Visual de Destaque (Hero) */}
        <div className="mt-3 max-w-xs mx-auto relative rounded-lg overflow-hidden border border-gold-500/40 shadow-2xl">
          <img
            src={heroImage}
            alt="1929 - O submundo de Santa Augusta"
            className="w-full h-36 sm:h-44 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-transparent to-transparent" />
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-gold-400 bg-noir-950/80 px-2 py-0.5 rounded border border-gold-500/30">
              Crônica das Ruas &amp; Oligarquias
            </span>
          </div>
        </div>

        {/* Tagline Oficial */}
        <div className="mt-3 flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-display font-bold tracking-[0.3em] text-paper-200 uppercase">
          <span>DINHEIRO</span>
          <span className="text-gold-500 font-black">•</span>
          <span>PODER</span>
          <span className="text-gold-500 font-black">•</span>
          <span>SILÊNCIO</span>
        </div>
      </div>

      {/* Narrativa Central e Chamada */}
      <div className="relative z-10 max-w-lg mx-auto px-6 py-6 text-center">
        <div className="p-6 sm:p-8 rounded-lg bg-noir-900/80 border border-gold-500/30 backdrop-blur-sm shadow-2xl relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-noir-950 px-4 py-0.5 border border-gold-500/40 rounded text-[10px] text-gold-400 font-mono tracking-widest uppercase">
            Crônica Urbana
          </div>

          <p className="font-serif italic text-paper-200 text-sm sm:text-base leading-relaxed mb-6">
            A cidade cresce. Fortunas surgem na penumbra dos armazéns. Famílias disputam territórios palmo a palmo. Cada negócio esconde seus segredos.
          </p>

          <p className="font-display font-bold text-gold-400 text-base sm:text-lg mb-6">
            Construa seu império.
          </p>

          <div className="space-y-2.5">
            <Button
              size="lg"
              fullWidth
              variant="primary"
              onClick={() => setScreen('character_creation')}
              className="text-base sm:text-lg py-3.5 shadow-gold-glow animate-gold-pulse"
            >
              <span>COMEÇAR AGORA</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            {!isStandalone && isInstallable && (
              <Button
                size="md"
                fullWidth
                variant="secondary"
                onClick={installApp}
                className="text-xs sm:text-sm py-2.5 border-gold-500/50 text-gold-400 hover:text-gold-300"
              >
                <Download className="w-4 h-4 mr-2" />
                <span>BAIXAR APP NO CELULAR</span>
              </Button>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-noir-800 text-[11px] sm:text-xs text-noir-400 flex items-center justify-center gap-1.5">
            <Play className="w-3 h-3 text-gold-500" />
            <span>{isStandalone ? 'Aplicativo instalado. Seu império continua crescendo em segundo plano.' : 'Instale como app ou jogue no navegador sem cadastro burocrático.'}</span>
          </div>
        </div>
      </div>

      {/* Rodapé e Características PWA */}
      <div className="relative z-10 pb-8 px-6 max-w-xl mx-auto w-full">
        <div className="grid grid-cols-3 gap-2 text-center text-noir-400 text-[11px] sm:text-xs">
          <div 
            onClick={!isStandalone ? installApp : undefined}
            className={`flex flex-col items-center gap-1 p-2 bg-noir-900/40 rounded border border-noir-800/80 transition-all ${!isStandalone ? 'cursor-pointer hover:border-gold-500/50 hover:bg-noir-900/80 active:scale-95' : ''}`}
            title={!isStandalone ? "Toque para instalar o aplicativo no celular" : "Aplicativo já instalado"}
          >
            <Smartphone className="w-4 h-4 text-gold-500" />
            <span className="font-medium text-paper-200">{isStandalone ? 'Instalado' : 'Instalar PWA'}</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 bg-noir-900/40 rounded border border-noir-800/80">
            <Zap className="w-4 h-4 text-gold-500" />
            <span>Assíncrono</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 bg-noir-900/40 rounded border border-noir-800/80">
            <ShieldCheck className="w-4 h-4 text-gold-500" />
            <span>100% Gratuito</span>
          </div>
        </div>
      </div>

      <PWAInstallModal
        isOpen={showIOSInstructions}
        onClose={() => setShowIOSInstructions(false)}
      />
    </div>
  );
};
