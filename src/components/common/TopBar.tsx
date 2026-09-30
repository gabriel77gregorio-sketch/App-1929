import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { Coins, Award, Users, Skull, Calendar, ShieldAlert, HelpCircle, RotateCcw, Cloud, CheckCircle2, Gift, MoreVertical, Smartphone } from 'lucide-react';
import { HowItWorksModal } from './HowItWorksModal';
import { GoogleLinkModal } from './GoogleLinkModal';
import { ReferralModal } from './ReferralModal';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const TopBar: React.FC = () => {
  const { character, claimDailyReward, setScreen, resetGameData, referralData } = useGame();
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const { isInstallable, isStandalone, installApp } = usePWAInstall();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleResetGame = () => {
    if (window.confirm('Deseja reiniciar o jogo e apagar todo o progresso?')) {
      resetGameData('character_creation');
      setIsMenuOpen(false);
    }
  };

  if (!character) return null;

  const today = new Date().toISOString().split('T')[0];
  const canClaimDaily = character.last_login_date !== today;

  return (
    <header className="sticky top-0 z-40 bg-noir-950/95 backdrop-blur-md border-b border-gold-500/10">
      {/* Linha 1: Logo — Nome — Ações */}
      <div className="px-3 sm:px-5 py-2 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => setScreen('dashboard')} 
          className="cursor-pointer flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-gold-500/20 to-gold-600/10 border border-gold-500/30 flex items-center justify-center font-display font-black text-gold-400 text-sm group-hover:border-gold-500/60 transition-all">
            29
          </div>
          <div>
            <h1 className="font-display text-sm font-bold tracking-widest text-gold-400 leading-none">
              1929
            </h1>
            <p className="text-[9px] text-noir-500 uppercase tracking-[0.2em] mt-0.5 leading-none">
              Santa Augusta
            </p>
          </div>
        </div>

        {/* Direita: Diário + Avatar + Menu */}
        <div className="flex items-center gap-1.5 relative">
          {canClaimDaily && (
            <button
              onClick={claimDailyReward}
              className="w-8 h-8 rounded-md bg-gradient-to-br from-gold-500 to-amber-600 text-noir-950 flex items-center justify-center shadow-lg shadow-gold-500/20 animate-pulse"
              title="Recolher bônus diário"
            >
              <Calendar className="w-4 h-4" />
            </button>
          )}

          {/* Avatar / Nível */}
          <button 
            onClick={() => setScreen('ranking')} 
            className="flex items-center gap-1.5 h-8 pl-2 pr-1 rounded-md bg-noir-900 border border-noir-750 hover:border-gold-500/30 transition-colors"
            title="Ranking & Reputação"
          >
            <span className="text-[10px] text-gold-400 font-mono font-bold leading-none">
              Nv.{character.level}
            </span>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-500/30 to-gold-600/10 border border-gold-500/30 flex items-center justify-center text-[11px] font-bold text-gold-400">
              {character.nickname.slice(0, 1).toUpperCase()}
            </div>
          </button>

          {/* Botão Menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${
              isMenuOpen 
                ? 'bg-noir-800 text-gold-400' 
                : 'text-noir-400 hover:text-paper-200 hover:bg-noir-900'
            }`}
            title="Mais opções"
          >
            <MoreVertical className="w-4.5 h-4.5" />
          </button>

          {/* Dropdown */}
          {isMenuOpen && (
            <div 
              ref={menuRef}
              className="absolute top-full right-0 mt-2 bg-noir-900 border border-noir-700/80 rounded-xl shadow-2xl shadow-black/40 p-1.5 min-w-[220px] z-50 flex flex-col"
            >
              <DropdownItem
                icon={<Gift className="w-4 h-4 text-gold-400" />}
                label="Indicar Amigos"
                badge={`${referralData?.referrals.length || 0}/3`}
                onClick={() => { setIsReferralModalOpen(true); setIsMenuOpen(false); }}
              />

              <DropdownItem
                icon={character.is_cloud_synced 
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  : <Cloud className="w-4 h-4 text-gold-400" />
                }
                label={character.is_cloud_synced ? 'Nuvem Salva' : 'Salvar na Nuvem'}
                badge={character.is_cloud_synced ? undefined : '+$500'}
                onClick={() => { setIsGoogleModalOpen(true); setIsMenuOpen(false); }}
              />

              {!isStandalone && isInstallable && (
                <DropdownItem
                  icon={<Smartphone className="w-4 h-4 text-gold-400" />}
                  label="Instalar App"
                  onClick={() => { installApp(); setIsMenuOpen(false); }}
                />
              )}

              <DropdownItem
                icon={<HelpCircle className="w-4 h-4 text-noir-400" />}
                label="Como Funciona"
                onClick={() => { setIsManualOpen(true); setIsMenuOpen(false); }}
              />

              <DropdownItem
                icon={<ShieldAlert className="w-4 h-4 text-noir-500" />}
                label="Admin"
                onClick={() => { setScreen('admin'); setIsMenuOpen(false); }}
              />

              <div className="h-px bg-noir-800 my-1 mx-2" />

              <DropdownItem
                icon={<RotateCcw className="w-4 h-4 text-rose-400" />}
                label="Reiniciar Jogo"
                onClick={handleResetGame}
                destructive
              />
            </div>
          )}
        </div>
      </div>

      {/* Linha 2: Stats em pill bar centralizada */}
      <div className="px-3 sm:px-5 pb-2 flex justify-center">
        <div className="inline-flex items-center gap-0.5 bg-noir-900/80 rounded-lg px-1 py-0.5 border border-noir-800/80">
          {/* Dinheiro — destaque */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-gold-500/10 border border-gold-500/15" title="Dinheiro">
            <Coins className="w-3 h-3 text-gold-400" />
            <span className="font-mono text-[11px] font-bold text-gold-300 tracking-tight">
              ${character.money.toLocaleString('pt-BR')}
            </span>
          </div>

          <div className="w-px h-4 bg-noir-750 mx-0.5" />

          {/* Respeito */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-md" title="Respeito">
            <Award className="w-3 h-3 text-amber-400" />
            <span className="font-mono text-[11px] font-medium text-paper-300">
              {character.respect}
            </span>
          </div>

          {/* Influência */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-md" title="Influência">
            <Users className="w-3 h-3 text-blue-400" />
            <span className="font-mono text-[11px] font-medium text-paper-300">
              {character.influence}
            </span>
          </div>

          {/* Medo */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-md" title="Medo">
            <Skull className="w-3 h-3 text-red-400" />
            <span className="font-mono text-[11px] font-medium text-paper-300">
              {character.fear}
            </span>
          </div>
        </div>
      </div>

      {/* Modais */}
      <HowItWorksModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
      />

      <GoogleLinkModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
      />

      <ReferralModal
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
      />
    </header>
  );
};

/* Componente interno para itens do dropdown */
interface DropdownItemProps {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  onClick: () => void;
  destructive?: boolean;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ icon, label, badge, onClick, destructive }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-[13px] transition-colors text-left ${
      destructive 
        ? 'text-rose-300 hover:bg-rose-950/40' 
        : 'text-paper-200 hover:bg-noir-800'
    }`}
  >
    {icon}
    <span className="flex-1">{label}</span>
    {badge && (
      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
        destructive 
          ? 'bg-rose-500/10 text-rose-400' 
          : 'bg-gold-500/15 text-gold-400'
      }`}>
        {badge}
      </span>
    )}
  </button>
);
