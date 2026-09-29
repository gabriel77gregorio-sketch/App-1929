import React from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/common/Button';
import { ShieldCheck, Zap, Smartphone, ArrowRight, Play, Download, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from '../components/common/PWAInstallModal';

import heroImage from '../assets/hero.png';

export const LandingPage: React.FC = () => {
  const { setScreen, resetGameData, loginWithGoogle } = useGame();
  const { isInstallable, isStandalone, showIOSInstructions, setShowIOSInstructions, installApp } = usePWAInstall();

  return (
    <div className="min-h-screen bg-noir-950 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background vignette e textura */}
      <div className="absolute inset-0 bg-gradient-radial from-noir-900/60 via-noir-950/90 to-noir-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#c5a0590a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Linhas decorativas Art Déco no topo */}
      <div className="relative z-10 pt-4 sm:pt-8 px-4 text-center">
        {/* Banner de Teste do Novo Onboarding */}
        <div className="mb-2">
          <button
            onClick={() => resetGameData('character_creation')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/60 text-gold-400 text-xs font-mono font-bold hover:bg-gold-500/30 transition-all cursor-pointer shadow-gold-glow animate-pulse"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Testar Novo Onboarding (21 Páginas) • Clique Aqui</span>
          </button>
        </div>

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
              onClick={() => resetGameData('character_creation')}
              className="text-base sm:text-lg py-3.5 shadow-gold-glow animate-gold-pulse font-bold"
            >
              <span>INICIAR ONBOARDING (21 PÁGINAS)</span>
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

            <button
              onClick={async () => {
                await loginWithGoogle();
              }}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded bg-noir-850 hover:bg-noir-800 border border-noir-700 hover:border-gold-500/60 text-paper-200 hover:text-gold-300 text-xs sm:text-sm font-medium transition-all shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Já tem uma conta? Entrar com Google</span>
            </button>
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
