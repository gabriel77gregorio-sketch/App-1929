import React from 'react';
import { Share, PlusSquare, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-noir-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-noir-900 border border-gold-500/40 rounded-lg p-5 sm:p-6 shadow-2xl text-paper-100">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-noir-400 hover:text-paper-100 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded bg-noir-850 border border-gold-500/50 flex items-center justify-center text-gold-400 font-display font-black text-lg shadow-gold-subtle">
            29
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-gold-400 tracking-wide">
              Instalar no iPhone / iPad
            </h3>
            <p className="text-xs text-noir-400">
              Transforme o 1929 em um aplicativo nativo em 3 passos
            </p>
          </div>
        </div>

        {/* Passos Ilustrados */}
        <div className="space-y-3 my-4">
          <div className="flex items-start gap-3 p-3 bg-noir-850 rounded border border-noir-750">
            <div className="p-2 rounded bg-gold-500/10 text-gold-400 mt-0.5">
              <Share className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-paper-100">
                1. Toque em Compartilhar
              </p>
              <p className="text-[11px] text-noir-400 mt-0.5">
                No menu inferior do Safari do iPhone, toque no ícone de compartilhamento (um quadrado com uma seta para cima).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-noir-850 rounded border border-noir-750">
            <div className="p-2 rounded bg-gold-500/10 text-gold-400 mt-0.5">
              <PlusSquare className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-paper-100">
                2. Adicionar à Tela de Início
              </p>
              <p className="text-[11px] text-noir-400 mt-0.5">
                Role as opções para baixo e selecione <strong className="text-gold-400">"Adicionar à Tela de Início"</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-noir-850 rounded border border-noir-750">
            <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-paper-100">
                3. Concluir Instalação
              </p>
              <p className="text-[11px] text-noir-400 mt-0.5">
                Toque em <strong className="text-paper-100">Adicionar</strong> no canto superior direito. O app 1929 estará pronto na sua tela inicial!
              </p>
            </div>
          </div>
        </div>

        {/* Vantagens */}
        <div className="bg-noir-950/60 p-3 rounded border border-gold-500/20 text-[11px] text-noir-300 mb-5 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-gold-400 shrink-0" />
          <span>Tela cheia sem barras de navegador, carregamento instantâneo e resposta mais rápida.</span>
        </div>

        <Button
          variant="primary"
          fullWidth
          onClick={onClose}
          className="text-xs py-2.5 font-bold"
        >
          Entendido
        </Button>
      </div>
    </div>
  );
};
