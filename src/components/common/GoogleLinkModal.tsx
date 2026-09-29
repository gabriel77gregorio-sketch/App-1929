import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Modal } from './Modal';
import { Button } from './Button';
import { ShieldCheck, Cloud, Coins, Award, Sparkles, CheckCircle2, LogOut } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GoogleLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleLinkModal: React.FC<GoogleLinkModalProps> = ({ isOpen, onClose }) => {
  const { character, linkAccountWithGoogle, logoutGoogle, authUser } = useGame();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!character) return null;

  const isLinked = Boolean(character.google_email || character.is_cloud_synced);

  const handleLink = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await linkAccountWithGoogle();
      if (res.success) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#c5a059', '#10b981', '#ffffff']
          });
        } catch {
          // Ignora
        }
        onClose();
      } else {
        setError(res.error || 'Não foi possível conectar com o Google.');
      }
    } catch (err: any) {
      setError(err?.message || 'Falha ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logoutGoogle();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isLinked ? 'Sua Conta Está Protegida' : 'Proteja seu Império com o Google'}
      subtitle={isLinked ? 'Seu progresso está salvo com segurança na nuvem.' : 'Vincule sua conta com 1 toque e ganhe bônus de inauguração.'}
      maxWidth="md"
    >
      <div className="space-y-4 my-2">
        {/* Banner com benefícios */}
        {isLinked ? (
          <div className="p-4 bg-emerald-950/80 border border-emerald-600 rounded-lg space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-bold font-mono text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Nuvem Ativa • Império Sincronizado</span>
            </div>
            <p className="text-paper-200">
              Conectado como: <strong className="text-gold-400">{character.google_email || authUser?.email || 'jogador@gmail.com'}</strong>
            </p>
            <p className="text-[11px] text-noir-300 font-serif italic">
              Você pode abrir o jogo em qualquer celular ou computador e continuar de onde parou.
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-amber-950/40 via-noir-900 to-noir-900 border border-gold-500/40 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-gold-400 font-bold font-serif-vintage text-sm">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>BÔNUS EXCLUSIVO DE VINCULAÇÃO</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-noir-850 rounded border border-gold-500/30 flex items-center gap-2">
                <Coins className="w-4 h-4 text-gold-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-noir-400 block">Dinheiro</span>
                  <strong className="text-gold-400">+$500 Réis</strong>
                </div>
              </div>

              <div className="p-2.5 bg-noir-850 rounded border border-amber-500/30 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-noir-400 block">Reputação</span>
                  <strong className="text-amber-400">+5 Respeito</strong>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-paper-300 font-sans pt-1">
              <div className="flex items-center gap-2">
                <Cloud className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Jogue no celular e no PC com a mesma conta.</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Limpar o histórico ou trocar de aparelho nunca apagará seu império.</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-2.5 bg-red-950/80 border border-red-700 rounded text-xs text-red-200">
            {error}
          </div>
        )}

        {/* Botão de Ação */}
        <div className="pt-2 space-y-2">
          {isLinked ? (
            <div className="flex gap-2">
              <Button
                fullWidth
                variant="secondary"
                onClick={onClose}
              >
                Voltar ao Jogo
              </Button>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="text-xs text-noir-400 hover:text-red-400"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Desconectar
              </Button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={handleLink}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-100 text-noir-950 font-bold text-xs sm:text-sm py-3 px-4 rounded shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {/* SVG Oficial do Logo do Google */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{loading ? 'Conectando...' : 'Salvar com Conta Google (+$500)'}</span>
              </button>

              <Button
                fullWidth
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-xs text-noir-400 hover:text-paper-100"
              >
                Continuar como Convidado por Enquanto
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
