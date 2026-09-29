import React from 'react';
import { useGame } from '../../context/GameContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { DollarSign, Clock, Newspaper, MessageSquare, ArrowRight } from 'lucide-react';

export const WelcomeBackModal: React.FC = () => {
  const { offlineSummary, dismissOfflineModal, setScreen } = useGame();

  if (!offlineSummary) return null;

  const totalRevenue = offlineSummary.ready_businesses.reduce((sum, b) => sum + b.revenue, 0);

  return (
    <Modal
      isOpen={true}
      onClose={dismissOfflineModal}
      title="Enquanto você estava fora..."
      subtitle="A engrenagem de Santa Augusta continuou girando na sua ausência."
      maxWidth="md"
    >
      <div className="space-y-4 my-2">
        {/* Lucros Acumulados dos Negócios */}
        {offlineSummary.ready_businesses.length > 0 && (
          <div className="bg-noir-850 p-3.5 rounded border border-gold-500/30 flex items-start gap-3">
            <div className="p-2 rounded bg-gold-500/10 text-gold-400 mt-0.5">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-serif-vintage font-bold text-paper-100">
                Receita Pronta nos Cofres
              </h4>
              <p className="text-xs text-noir-400 mt-0.5">
                {offlineSummary.ready_businesses.length} estabelecimento(s) geraram rendimentos.
              </p>
              <div className="mt-2 text-base font-mono font-bold text-gold-400">
                +${totalRevenue.toLocaleString('pt-BR')} disponíveis para recolhimento
              </div>
            </div>
          </div>
        )}

        {/* Operações Concluídas */}
        {offlineSummary.completed_actions.length > 0 && (
          <div className="bg-noir-850 p-3.5 rounded border border-noir-700 flex items-start gap-3">
            <div className="p-2 rounded bg-blue-500/10 text-blue-400 mt-0.5">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-serif-vintage font-bold text-paper-100">
                Operações de Rua Concluídas
              </h4>
              <p className="text-xs text-noir-400 mt-0.5">
                Seus homens finalizaram {offlineSummary.completed_actions.length} trabalho(s) e aguardam seu relatório.
              </p>
            </div>
          </div>
        )}

        {/* Propostas de Negociação */}
        {offlineSummary.pending_proposals_count > 0 && (
          <div className="bg-noir-850 p-3.5 rounded border border-noir-700 flex items-start gap-3">
            <div className="p-2 rounded bg-amber-500/10 text-amber-400 mt-0.5">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-serif-vintage font-bold text-paper-100">
                Correspondência & Propostas
              </h4>
              <p className="text-xs text-noir-400 mt-0.5">
                Você recebeu {offlineSummary.pending_proposals_count} proposta(s) de outros negociantes da cidade.
              </p>
            </div>
          </div>
        )}

        {/* Última Notícia da Gazeta */}
        {offlineSummary.recent_articles.length > 0 && (
          <div className="p-3 bg-noir-950 rounded border border-noir-800">
            <div className="flex items-center gap-1.5 text-[10px] text-gold-500 font-mono tracking-wider uppercase mb-1">
              <Newspaper className="w-3 h-3" />
              <span>Gazeta da Capital — Edição Recente</span>
            </div>
            <p className="font-serif italic text-xs text-paper-200">
              "{offlineSummary.recent_articles[0].headline}"
            </p>
          </div>
        )}

        {/* Botão de Fechar e Agir */}
        <div className="pt-2 flex gap-2">
          <Button
            fullWidth
            variant="primary"
            onClick={() => {
              dismissOfflineModal();
              if (offlineSummary.ready_businesses.length > 0) {
                setScreen('businesses');
              } else if (offlineSummary.completed_actions.length > 0) {
                setScreen('actions');
              }
            }}
          >
            <span>
              {offlineSummary.ready_businesses.length > 0 && offlineSummary.completed_actions.length > 0
                ? 'Recolher Lucros & Ver Relatórios'
                : offlineSummary.ready_businesses.length > 0
                  ? 'Recolher Renda dos Negócios'
                  : offlineSummary.completed_actions.length > 0
                    ? 'Ver Relatório das Ações'
                    : 'Entrar em Santa Augusta'}
            </span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};
