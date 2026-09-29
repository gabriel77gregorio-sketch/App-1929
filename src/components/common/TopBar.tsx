import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Coins, Award, Users, Skull, Calendar, ShieldAlert, HelpCircle, RotateCcw } from 'lucide-react';
import { HowItWorksModal } from './HowItWorksModal';
import { PWAInstallButton } from './PWAInstallBanner';

export const TopBar: React.FC = () => {
  const { character, claimDailyReward, setScreen, resetGameData } = useGame();
  const [isManualOpen, setIsManualOpen] = useState(false);

  const handleResetGame = () => {
    if (window.confirm('Deseja reiniciar o jogo e apagar o progresso atual para testar o novo onboarding de 21 páginas?')) {
      resetGameData('character_creation');
    }
  };

  if (!character) return null;

  const today = new Date().toISOString().split('T')[0];
  const canClaimDaily = character.last_login_date !== today;

  return (
    <header className="sticky top-0 z-40 bg-noir-950/95 backdrop-blur-md border-b border-noir-700/80 px-3 py-2 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Título e Cidade */}
        <div 
          onClick={() => setScreen('dashboard')} 
          className="cursor-pointer flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded bg-noir-850 border border-gold-500/40 flex items-center justify-center font-display font-black text-gold-500 text-sm shadow-gold-subtle group-hover:border-gold-500 transition-colors">
            29
          </div>
          <div className="hidden xs:block">
            <h1 className="font-display text-sm sm:text-base font-bold tracking-widest text-gold-400 leading-tight">
              1929
            </h1>
            <p className="text-[10px] text-noir-400 uppercase tracking-widest -mt-0.5">
              Santa Augusta
            </p>
          </div>
        </div>

        {/* 4 Atributos de Poder */}
        <div className="flex items-center gap-1.5 sm:gap-4 overflow-x-auto py-0.5 scrollbar-none">
          {/* Dinheiro */}
          <div className="flex items-center gap-1 bg-noir-900/90 border border-gold-500/30 px-2 sm:px-2.5 py-1 rounded shadow-inner-dark" title="Dinheiro nos cofres">
            <Coins className="w-3.5 h-3.5 text-gold-400" />
            <span className="font-mono text-xs sm:text-sm font-semibold text-paper-50 tracking-tight">
              ${character.money.toLocaleString('pt-BR')}
            </span>
          </div>

          {/* Respeito */}
          <div className="flex items-center gap-1 bg-noir-900/90 border border-noir-700 px-1.5 sm:px-2 py-1 rounded" title="Respeito e Reputação">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-xs sm:text-sm font-medium text-paper-200">
              {character.respect}
            </span>
          </div>

          {/* Influência */}
          <div className="flex items-center gap-1 bg-noir-900/90 border border-noir-700 px-1.5 sm:px-2 py-1 rounded" title="Influência e Contatos">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-mono text-xs sm:text-sm font-medium text-paper-200">
              {character.influence}
            </span>
          </div>

          {/* Medo */}
          <div className="flex items-center gap-1 bg-noir-900/90 border border-noir-700 px-1.5 sm:px-2 py-1 rounded" title="Medo e Intimidação (valores muito altos atraem a polícia)">
            <Skull className="w-3.5 h-3.5 text-red-400" />
            <span className="font-mono text-xs sm:text-sm font-medium text-paper-200">
              {character.fear}
            </span>
          </div>
        </div>

        {/* Bônus diário & Nível */}
        <div className="flex items-center gap-2">
          {canClaimDaily && (
            <button
              onClick={claimDailyReward}
              className="flex items-center gap-1 bg-gradient-to-r from-gold-600 to-gold-500 text-noir-950 font-semibold text-[11px] px-2 py-1 rounded shadow-gold-glow animate-pulse"
              title="Recolher bônus diário"
            >
              <Calendar className="w-3 h-3" />
              <span className="hidden sm:inline">Diário</span>
            </button>
          )}

          {/* Nível / Avatar */}
          <div 
            onClick={() => setScreen('ranking')} 
            className="cursor-pointer flex items-center gap-1.5 bg-noir-850 hover:bg-noir-800 border border-noir-700 px-2 py-1 rounded transition-colors"
            title="Nível e Reputação"
          >
            <span className="text-[10px] text-gold-400 font-serif uppercase tracking-wider font-bold">
              Nv.{character.level}
            </span>
            <div className="w-5 h-5 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-[10px] font-bold text-gold-400">
              {character.nickname.slice(0, 1).toUpperCase()}
            </div>
          </div>

          {/* Botão de Instalação PWA */}
          <PWAInstallButton />

          {/* Botão Manual / Como Funciona */}
          <button
            onClick={() => setIsManualOpen(true)}
            className="p-1 text-gold-400 hover:text-gold-300 transition-colors"
            title="Manual de Santa Augusta — Como Funciona o Jogo"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Admin shortcut */}
          <button
            onClick={() => setScreen('admin')}
            className="p-1 text-noir-500 hover:text-gold-400 transition-colors"
            title="Painel de Administração e Balanceamento"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>

          {/* Botão Reiniciar Jogo (Para testar o Onboarding) */}
          <button
            onClick={handleResetGame}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-950/80 hover:bg-rose-900 border border-rose-500/70 text-rose-200 hover:text-white text-xs font-mono font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            title="Reiniciar o Jogo e Abrir o Novo Onboarding de 21 Páginas"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Reiniciar (Testar Onboarding)</span>
          </button>
        </div>
      </div>

      {/* Modal Manual de Regras */}
      <HowItWorksModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
      />
    </header>
  );
};
