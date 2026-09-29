import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isStandalone, showIOSInstructions, setShowIOSInstructions, installApp } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem('pwa_banner_dismissed') === 'true';
  });

  if (isStandalone || !isInstallable || isDismissed) {
    return (
      <PWAInstallModal
        isOpen={showIOSInstructions}
        onClose={() => setShowIOSInstructions(false)}
      />
    );
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  return (
    <>
      <div className="bg-gradient-to-r from-noir-900 via-noir-850 to-noir-900 border-b border-gold-500/40 px-3 py-2 sm:px-6 relative z-30 shadow-lg animate-fadeIn">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-gold-500/10 border border-gold-500/40 flex items-center justify-center text-gold-400 shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs sm:text-sm font-semibold text-paper-100 flex items-center gap-1.5 truncate">
                <span>Instalar 1929 no celular</span>
                <span className="hidden xs:inline-block text-[10px] uppercase font-mono px-1.5 py-0.2 bg-gold-500/20 text-gold-400 rounded border border-gold-500/30">
                  App Nativo
                </span>
              </p>
              <p className="text-[10px] sm:text-xs text-noir-400 truncate">
                Jogue em tela cheia e acesse direto da tela inicial
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={installApp}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-noir-950 font-bold text-xs rounded shadow-gold-subtle active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar</span>
            </button>

            <button
              onClick={handleDismiss}
              className="p-1.5 text-noir-500 hover:text-paper-100 transition-colors"
              title="Dispensar por enquanto"
              aria-label="Dispensar aviso de instalação"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <PWAInstallModal
        isOpen={showIOSInstructions}
        onClose={() => setShowIOSInstructions(false)}
      />
    </>
  );
};

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isStandalone, showIOSInstructions, setShowIOSInstructions, installApp } = usePWAInstall();

  if (isStandalone || !isInstallable) {
    return (
      <PWAInstallModal
        isOpen={showIOSInstructions}
        onClose={() => setShowIOSInstructions(false)}
      />
    );
  }

  return (
    <>
      <button
        onClick={installApp}
        className="flex items-center gap-1 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/40 text-gold-400 font-medium text-[11px] px-2 py-1 rounded transition-colors"
        title="Instalar aplicativo 1929 no celular"
      >
        <Download className="w-3.5 h-3.5 text-gold-400 animate-bounce" />
        <span className="hidden sm:inline">Baixar App</span>
      </button>

      <PWAInstallModal
        isOpen={showIOSInstructions}
        onClose={() => setShowIOSInstructions(false)}
      />
    </>
  );
};
