import React from 'react';
import { PlayerAction, ActionOutcome } from '../../types/game';
import { RetroActionScene } from './RetroActionScene';
import { Coins, Award, Users, Skull, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface ActionOutcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: PlayerAction;
}

export const ActionOutcomeModal: React.FC<ActionOutcomeModalProps> = ({
  isOpen,
  onClose,
  action
}) => {
  if (!isOpen) return null;

  const atype = action.action_type;
  const isCoffeeAction = atype?.slug === 'transporte_fardo' || atype?.slug?.includes('cafe') || action.result_notes?.toLowerCase().includes('café');
  const isFailure = action.outcome_result === 'fracasso' || action.outcome_result === 'complicacao_policial';
  const isPartial = action.outcome_result === 'sucesso_parcial';
  const isTotal = action.outcome_result === 'sucesso_total';

  // Se for a ação de café ou uma falha de grande impacto, usamos a imagem de referência!
  const imageToUse = (isCoffeeAction || isFailure || atype?.illustration?.includes('preso_cafe'))
    ? '/images/actions/preso_cafe.jpg'
    : (atype?.illustration || '/images/actions/preso_cafe.jpg');

  // Verifica se a imagem usada é a de referência enviada pelo usuário
  const isBakedImage = imageToUse === '/images/actions/preso_cafe.jpg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-noir-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-noir-900 border-2 border-gold-500/50 rounded-xl overflow-hidden shadow-[0_0_35px_rgba(0,0,0,0.8)] flex flex-col max-h-[92vh]">
        
        {/* Cabeçalho Art Déco */}
        <div className="p-3 bg-gradient-to-r from-noir-950 via-noir-900 to-noir-950 border-b border-noir-750 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isTotal && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {isPartial && <AlertTriangle className="w-4 h-4 text-amber-400" />}
            {isFailure && <ShieldAlert className="w-4 h-4 text-rose-500" />}
            <span className="text-xs font-mono uppercase tracking-widest font-bold text-paper-100">
              {isTotal ? '★ Operação Concluída com Sucesso' : isPartial ? '⚠ Desfecho com Complicações' : '🚨 Flagrante Policial / Fracasso'}
            </span>
          </div>

          <span className="text-[10px] font-mono text-gold-400 px-1.5 py-0.5 rounded bg-gold-500/10 border border-gold-500/20">
            1929
          </span>
        </div>

        {/* Corpo com Scroll suave se necessário */}
        <div className="p-3.5 space-y-3.5 overflow-y-auto">
          {/* Cena Retrô */}
          <RetroActionScene
            imageSrc={imageToUse}
            imageAlt={atype?.name || 'Desfecho da Operação'}
            narrativeText={action.result_notes || 'A poeira baixou e os homens retornaram aos seus esconderijos.'}
            subPrompt="-- Toque para continuar --"
            status={isFailure ? 'failure' : isTotal ? 'ready' : undefined}
            hasBakedText={isBakedImage}
          />

          {/* Se a imagem for a baked, mostramos um resumo dos ganhos/perdas abaixo dela */}
          <div className="bg-noir-950 border border-noir-800 rounded-lg p-3 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-noir-400 block text-center">
              Balanço da Operação
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="flex items-center gap-1.5 bg-noir-900/90 p-2 rounded border border-noir-800">
                <Coins className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span className="text-noir-400 text-[11px]">Dinheiro:</span>
                <span className={`font-bold ml-auto ${(action.reward_money_granted ?? 0) > 0 ? 'text-emerald-400' : 'text-paper-300'}`}>
                  +${(action.reward_money_granted ?? 0).toLocaleString('pt-BR')}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-noir-900/90 p-2 rounded border border-noir-800">
                <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-noir-400 text-[11px]">Respeito:</span>
                <span className="font-bold text-amber-300 ml-auto">
                  +{(action.reward_respect_granted ?? 0)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-noir-900/90 p-2 rounded border border-noir-800">
                <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="text-noir-400 text-[11px]">Influência:</span>
                <span className="font-bold text-blue-300 ml-auto">
                  +{(action.reward_influence_granted ?? 0)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-noir-900/90 p-2 rounded border border-noir-800">
                <Skull className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="text-noir-400 text-[11px]">Atenção Policial:</span>
                <span className="font-bold text-rose-300 ml-auto">
                  +{(action.reward_fear_granted ?? 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Botão de Rodapé estilo arcade / vintage */}
        <div className="p-3 bg-noir-950 border-t border-noir-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-gold-600 via-gold-500 to-amber-500 hover:from-gold-500 hover:to-amber-400 text-noir-950 font-mono text-xs uppercase font-bold tracking-widest shadow-gold-subtle active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continuar nas Ruas de Santa Augusta</span>
            <span>→</span>
          </button>
        </div>

      </div>
    </div>
  );
};
