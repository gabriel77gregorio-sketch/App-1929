import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { 
  Users, Gift, Share2, Copy, Check, Sparkles, 
  Award, Coins, ArrowRight, ShieldCheck, HelpCircle, 
  ExternalLink, UserPlus, Flame, Wine, ChevronRight
} from 'lucide-react';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({ isOpen, onClose }) => {
  const { 
    character, referralData, applyReferralCode, 
    claimReferralMilestone, simulateFriendInvite 
  } = useGame();

  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !character || !referralData) return null;

  const currentCount = referralData.referrals.length;
  const isGoalReached = currentCount >= 3;
  const isMilestoneClaimed = referralData.milestone_claimed;

  const handleCopyLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://1929game.app';
    const link = `${origin}/?ref=${referralData.my_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://1929game.app';
    const link = `${origin}/?ref=${referralData.my_code}`;
    const text = `🏛️ *CONVITE CONFIDENCIAL DE SANTA AUGUSTA (1929)*\n\n` +
      `O chefão *${character.nickname}* convocou você para reforçar a aliança na cidade!\n\n` +
      `Entre pelo link abaixo para iniciar seu império com *$1.000 réis de ajuda de custo*, *+5 de Respeito* e *1 Caixa de Whisky Escocês*:\n\n` +
      `🔗 ${link}\n\n` +
      `Token de Padrinho: *${referralData.my_code}*`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleApplyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    setIsSubmitting(true);
    await applyReferralCode(inputCode);
    setInputCode('');
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-noir-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-gradient-to-b from-noir-900 via-noir-925 to-noir-950 border-2 border-gold-500/50 rounded-xl shadow-2xl p-5 sm:p-6 space-y-5 text-paper-100 my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Detalhes Art Déco de Fundo */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Cabeçalho */}
        <div className="flex items-start justify-between border-b border-noir-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase font-bold px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/30">
                Pacto de Sangue &amp; Alianças
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                <Gift className="w-3 h-3" />
                Ganhe até $9.500 réis
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-paper-100 via-gold-300 to-gold-500 mt-1">
              Convoque Seus Comparsas
            </h3>
            <p className="text-xs text-noir-300 font-serif italic">
              Compartilhe seu token com amigos: eles ganham ajuda de custo e você constrói uma rede leal.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-noir-850 hover:bg-noir-800 border border-noir-700 text-noir-400 hover:text-paper-100 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        {/* 1. SEU TOKEN DE PADRINHO */}
        <div className="bg-noir-850/90 border border-gold-500/40 rounded-lg p-4 text-center space-y-3 shadow-inner">
          <span className="text-[10px] uppercase font-mono tracking-widest text-noir-400 block font-bold">
            Seu Token Exclusivo de Indicação
          </span>

          <div className="font-mono text-2xl sm:text-3xl font-black tracking-widest text-gold-400 bg-noir-950/80 py-2.5 px-4 rounded border border-gold-500/30 select-all shadow-inner">
            {referralData.my_code}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-2.5 px-3 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Convidar no WhatsApp</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 px-3 rounded bg-noir-800 hover:bg-noir-750 border border-gold-500/50 text-gold-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gold-400" />}
              <span>{copied ? 'Link Copiado!' : 'Copiar Link Convite'}</span>
            </button>
          </div>
        </div>

        {/* 2. TRILHA DOS 3 AMIGOS (PROGRESSO 0/3) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gold-400" />
              <h4 className="font-serif-vintage font-bold text-sm text-paper-100">
                Meta do Padrinho ({currentCount} de 3 Aliados)
              </h4>
            </div>
            <span className="text-xs font-mono font-bold text-gold-400">
              {currentCount}/3 Confirmados
            </span>
          </div>

          {/* Barra de Progresso */}
          <div className="w-full bg-noir-950 h-2.5 rounded-full overflow-hidden border border-noir-700">
            <div 
              className="bg-gradient-to-r from-gold-600 via-gold-500 to-amber-400 h-full rounded-full transition-all duration-500 shadow-gold-glow"
              style={{ width: `${Math.min(100, (currentCount / 3) * 100)}%` }}
            />
          </div>

          {/* Cards dos 3 Passos */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            {/* Amigo 1 */}
            <div className={`p-2.5 rounded border transition-all ${
              currentCount >= 1 ? 'bg-gold-500/10 border-gold-500 text-gold-300' : 'bg-noir-900 border-noir-800 text-noir-500'
            }`}>
              <div className="text-[10px] uppercase font-bold">1º Amigo</div>
              <div className="font-bold text-paper-100 mt-0.5">+$1.500</div>
              <div className="text-[10px] text-amber-400">+10 Respeito</div>
              <div className="mt-1">
                {currentCount >= 1 ? (
                  <span className="text-[10px] text-emerald-400 font-bold">✓ Concluído</span>
                ) : (
                  <span className="text-[10px] text-noir-500">Pendente</span>
                )}
              </div>
            </div>

            {/* Amigo 2 */}
            <div className={`p-2.5 rounded border transition-all ${
              currentCount >= 2 ? 'bg-gold-500/10 border-gold-500 text-gold-300' : 'bg-noir-900 border-noir-800 text-noir-500'
            }`}>
              <div className="text-[10px] uppercase font-bold">2º Amigo</div>
              <div className="font-bold text-paper-100 mt-0.5">+$1.500</div>
              <div className="text-[10px] text-amber-400">+10 Respeito</div>
              <div className="mt-1">
                {currentCount >= 2 ? (
                  <span className="text-[10px] text-emerald-400 font-bold">✓ Concluído</span>
                ) : (
                  <span className="text-[10px] text-noir-500">Pendente</span>
                )}
              </div>
            </div>

            {/* Amigo 3 - Grande Prêmio */}
            <div className={`p-2.5 rounded border transition-all ${
              isGoalReached ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-gold-subtle' : 'bg-noir-900 border-noir-800 text-noir-500'
            }`}>
              <div className="text-[10px] uppercase font-bold text-gold-400">👑 Meta 3 Amigos</div>
              <div className="font-bold text-paper-100 mt-0.5">+$5.000</div>
              <div className="text-[10px] text-blue-400">+25 Influência</div>
              <div className="mt-1">
                {isMilestoneClaimed ? (
                  <span className="text-[10px] text-emerald-400 font-bold">✓ Resgatado</span>
                ) : isGoalReached ? (
                  <span className="text-[10px] text-gold-400 font-bold animate-pulse">Pronto!</span>
                ) : (
                  <span className="text-[10px] text-noir-500">Pendente</span>
                )}
              </div>
            </div>
          </div>

          {/* Botão de Resgate da Meta dos 3 Amigos */}
          {isGoalReached && !isMilestoneClaimed && (
            <button
              onClick={claimReferralMilestone}
              className="w-full py-3 rounded bg-gradient-to-r from-gold-600 via-gold-500 to-amber-400 hover:from-gold-500 hover:to-gold-300 text-noir-950 font-display font-black text-sm uppercase tracking-wider transition-all shadow-gold-glow animate-bounce cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Resgatar Recompensa Lendária do Padrinho ($5.000 réis + 25 Influência)</span>
            </button>
          )}

          {/* Lista de Comparsas Confirmados */}
          {referralData.referrals.length > 0 && (
            <div className="bg-noir-900/60 border border-noir-800 rounded p-2.5 text-xs font-mono">
              <span className="text-[10px] text-noir-400 uppercase block font-bold mb-1">
                Comparsas que entraram pela sua bênção:
              </span>
              <div className="space-y-1">
                {referralData.referrals.map((ref) => (
                  <div key={ref.id} className="flex justify-between items-center text-paper-300">
                    <span className="flex items-center gap-1.5">
                      <UserPlus className="w-3 h-3 text-gold-400" />
                      {ref.friend_name}
                    </span>
                    <span className="text-[10px] text-emerald-400">+{ref.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. FOI INDICADO POR UM PADRINHO? */}
        <div className="bg-noir-900 border border-noir-800 rounded-lg p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-serif-vintage font-bold text-xs text-paper-100 flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-gold-400" />
              <span>Foi Convidado por um Amigo?</span>
            </span>
            <span className="text-[10px] font-mono text-gold-400">
              Bônus: +$1.000 + 1 Whisky
            </span>
          </div>

          {referralData.referred_by ? (
            <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Padrinho Ativado: <strong>{referralData.referred_by}</strong></span>
              </span>
              <span className="text-[10px] text-emerald-400 uppercase font-bold">✓ Bônus Creditado</span>
            </div>
          ) : (
            <form onSubmit={handleApplyCode} className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: 1929-MORE-7491"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                className="flex-1 bg-noir-950 border border-noir-700 rounded px-3 py-1.5 text-xs font-mono text-paper-100 uppercase tracking-wider focus:outline-none focus:border-gold-500"
              />
              <button
                type="submit"
                disabled={isSubmitting || !inputCode.trim()}
                className="px-3.5 py-1.5 rounded bg-gold-500 hover:bg-gold-400 text-noir-950 text-xs font-mono font-bold uppercase transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Validando...' : 'Ativar'}
              </button>
            </form>
          )}
        </div>

        {/* 4. BOTÃO DE DEMONSTRAÇÃO / TESTE RÁPIDO */}
        <div className="pt-2 border-t border-noir-800/80 flex items-center justify-between text-[11px] font-mono text-noir-400">
          <span>Modo de Teste da Mecânica:</span>
          <button
            onClick={() => simulateFriendInvite()}
            className="text-[10px] text-gold-400 hover:text-gold-300 underline font-mono flex items-center gap-1 cursor-pointer"
            title="Simula 1 amigo aceitando o seu convite para você testar a progressão de recompensas"
          >
            <UserPlus className="w-3 h-3" />
            <span>Simular 1 amigo entrando (+1/3)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
