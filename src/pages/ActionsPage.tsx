import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { INITIAL_ACTION_TYPES } from '../lib/mockData';
import { ActionType, ActionCategory } from '../types/game';
import { 
  Crosshair, Clock, ShieldAlert, Award, 
  Coins, Users, Skull, CheckCircle, AlertTriangle 
} from 'lucide-react';

export const ActionsPage: React.FC = () => {
  const { 
    character, activeAction, startAction, completeAction 
  } = useGame();

  const [selectedCategory, setSelectedCategory] = useState<ActionCategory | 'todas'>('todas');
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);

  if (!character) return null;

  const now = Date.now();
  const isActionReady = activeAction && now >= new Date(activeAction.finish_at).getTime();

  const filteredActions = selectedCategory === 'todas'
    ? INITIAL_ACTION_TYPES
    : INITIAL_ACTION_TYPES.filter(a => a.category === selectedCategory);

  const handleStart = (action: ActionType) => {
    startAction(action.id);
    setSelectedAction(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-6 pb-24">
      {/* Cabeçalho */}
      <div className="pb-3 border-b border-noir-800">
        <div className="flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-gold-400" />
          <h2 className="font-display text-xl font-bold text-paper-100">
            Operações & Ações nas Ruas
          </h2>
        </div>
        <p className="text-xs text-noir-400 mt-0.5">
          Articule manobras com informantes, capangas e policiais. Ações rodam no servidor mesmo com o app fechado.
        </p>
      </div>

      {/* Operação Ativa / Em Andamento */}
      {activeAction && (
        <div className="bg-noir-900 border-2 border-gold-500/50 rounded-lg p-4 sm:p-5 shadow-2xl relative overflow-hidden">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/30">
                Operação em Andamento
              </span>
              <h3 className="font-serif-vintage font-bold text-lg text-paper-100 mt-1">
                {activeAction.action_type?.name}
              </h3>
            </div>

            <div className="text-right">
              {isActionReady ? (
                <span className="text-xs font-mono font-bold text-emerald-400 animate-pulse">
                  Pronta para Resolução!
                </span>
              ) : (
                <span className="text-xs font-mono text-noir-400">
                  Na calada da noite...
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-paper-300 font-serif italic mb-4">
            {activeAction.action_type?.description}
          </p>

          <div className="pt-2 border-t border-noir-800">
            {isActionReady ? (
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={() => completeAction(activeAction.id)}
                className="animate-bounce py-3"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Receber Relatório e Recolher Recompensas
              </Button>
            ) : (
              <CountdownTimer
                targetDate={activeAction.finish_at}
                startDate={activeAction.started_at}
              />
            )}
          </div>
        </div>
      )}

      {/* Filtros de Categoria */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {(['todas', 'operacao', 'influencia', 'violencia', 'comercio', 'investigacao'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-gold-500 text-noir-950 font-bold shadow-gold-subtle'
                : 'bg-noir-900 text-noir-400 hover:text-paper-100 border border-noir-800'
            }`}
          >
            {cat === 'todas' ? 'Todas' : cat}
          </button>
        ))}
      </div>

      {/* Lista de Ações Disponíveis */}
      <div className="space-y-3">
        {filteredActions.map((atype) => {
          const canAfford = character.money >= atype.cost_money && character.influence >= atype.cost_influence;
          const meetsLevel = character.level >= atype.req_level;
          const isLocked = !meetsLevel;
          const isBusy = Boolean(activeAction);

          return (
            <div
              key={atype.id}
              className={`bg-noir-900 border rounded-lg p-4 transition-all ${
                isLocked 
                  ? 'border-noir-800 opacity-60' 
                  : 'border-noir-700/80 hover:border-gold-500/40 shadow-lg'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif-vintage font-bold text-sm sm:text-base text-paper-100">
                      {atype.name}
                    </h4>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-noir-800 text-gold-400 border border-noir-700">
                      {atype.category}
                    </span>
                  </div>
                  <p className="text-xs text-noir-400 mt-1">
                    {atype.description}
                  </p>
                </div>

                {/* Duração & Sucesso */}
                <div className="flex sm:flex-col items-end gap-1 shrink-0 text-right">
                  <span className="flex items-center gap-1 text-xs font-mono text-paper-200">
                    <Clock className="w-3.5 h-3.5 text-gold-500" />
                    {Math.floor(atype.duration_seconds / 60)}m {atype.duration_seconds % 60}s
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    {atype.success_chance}% chance base
                  </span>
                </div>
              </div>

              {/* Custos e Recompensas */}
              <div className="pt-2 border-t border-noir-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-3 text-paper-300">
                  <span>
                    Custo: <strong className="text-gold-400">${atype.cost_money}</strong>
                    {atype.cost_influence > 0 && ` + ${atype.cost_influence} Inf.`}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-400">
                    Ganho: ${atype.reward_money_min} a ${atype.reward_money_max}
                  </span>
                </div>

                <div>
                  {isLocked ? (
                    <span className="text-[11px] text-amber-500 font-mono">
                      Requer Nível {atype.req_level}
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant={canAfford && !isBusy ? 'primary' : 'secondary'}
                      disabled={!canAfford || isBusy}
                      onClick={() => handleStart(atype)}
                    >
                      {isBusy 
                        ? 'Ocupado' 
                        : canAfford 
                          ? 'Iniciar Operação' 
                          : 'Recursos Insuficientes'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
