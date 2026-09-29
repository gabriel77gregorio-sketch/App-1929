import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/common/Button';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { GameImage } from '../components/common/GameImage';
import { INITIAL_ACTION_TYPES, getActionButtonLabel } from '../lib/mockData';
import { ActionType, ActionCategory } from '../types/game';
import { 
  Crosshair, Clock, ShieldAlert, Award, 
  Coins, Users, Skull, CheckCircle2, AlertTriangle
} from 'lucide-react';

// Cores temáticas e bordas por categoria
const CATEGORY_STYLES: Record<ActionCategory, {
  badge: string;
  borderLeft: string;
  theme: 'blue' | 'gold' | 'crimson' | 'emerald' | 'purple';
  iconType: string;
}> = {
  operacao: {
    badge: 'bg-blue-900/80 text-blue-200 border-blue-600',
    borderLeft: 'border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-950/20 via-noir-900 to-noir-900',
    theme: 'blue',
    iconType: 'ship'
  },
  influencia: {
    badge: 'bg-amber-900/80 text-amber-200 border-amber-600',
    borderLeft: 'border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-950/20 via-noir-900 to-noir-900',
    theme: 'gold',
    iconType: 'document'
  },
  violencia: {
    badge: 'bg-rose-900/80 text-rose-200 border-rose-600',
    borderLeft: 'border-l-4 border-l-rose-500 bg-gradient-to-r from-rose-950/20 via-noir-900 to-noir-900',
    theme: 'crimson',
    iconType: 'gun'
  },
  comercio: {
    badge: 'bg-emerald-900/80 text-emerald-200 border-emerald-600',
    borderLeft: 'border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-950/20 via-noir-900 to-noir-900',
    theme: 'emerald',
    iconType: 'coffee'
  },
  investigacao: {
    badge: 'bg-purple-900/80 text-purple-200 border-purple-600',
    borderLeft: 'border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-950/20 via-noir-900 to-noir-900',
    theme: 'purple',
    iconType: 'document'
  },
};

export const ActionsPage: React.FC = () => {
  const { 
    character, activeAction, startAction, completeAction 
  } = useGame();

  const [selectedCategory, setSelectedCategory] = useState<ActionCategory | 'todas'>('todas');

  if (!character) return null;

  const now = Date.now();
  const isActionReady = activeAction && now >= new Date(activeAction.finish_at).getTime();

  const filteredActions = selectedCategory === 'todas'
    ? INITIAL_ACTION_TYPES
    : INITIAL_ACTION_TYPES.filter(a => a.category === selectedCategory);

  const handleStart = (action: ActionType) => {
    startAction(action.id);
  };

  const activeActionType = activeAction?.action_type_id
    ? INITIAL_ACTION_TYPES.find(a => a.id === activeAction.action_type_id)
    : undefined;

  const activeCategory = (activeAction?.action_type?.category ?? activeActionType?.category ?? 'operacao') as ActionCategory;
  const activeStyle = CATEGORY_STYLES[activeCategory] || CATEGORY_STYLES.operacao;

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-5 pb-24">
      {/* Cabeçalho */}
      <div className="pb-3 border-b border-noir-800">
        <div className="flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-gold-400 shrink-0" />
          <h2 className="font-display text-xl font-bold text-paper-100">
            Operações &amp; Ações nas Ruas
          </h2>
        </div>
        <p className="text-xs text-noir-400 mt-0.5">
          Articule manobras com informantes, capangas e policiais. Ações rodam no servidor mesmo com o app fechado.
        </p>
      </div>

      {/* Operação Ativa / Em Andamento com Visual Destacado */}
      {activeAction && (
        <div className={`rounded-lg shadow-2xl relative overflow-hidden border-2 transition-all ${
          isActionReady
            ? 'bg-gradient-to-b from-emerald-950/30 via-noir-900 to-noir-900 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
            : 'bg-noir-900 border-gold-500/60 shadow-gold-subtle'
        }`}>
          {/* Banner Ilustrado da Operação Ativa com GameImage */}
          <div className="relative w-full h-36 sm:h-44 overflow-hidden">
            <GameImage
              src={activeAction.action_type?.illustration ?? activeActionType?.illustration}
              alt={activeAction.action_type?.name ?? 'Operação em andamento'}
              theme={activeStyle.theme}
              iconType={activeStyle.iconType}
              aspect="w-full h-full"
            />

            {/* Badges superiores sobrepostos na imagem */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 z-10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 bg-noir-950/90 px-2 py-0.5 rounded border border-gold-500/40 font-bold">
                Operação em Andamento
              </span>
              {isActionReady ? (
                <span className="text-[11px] font-mono font-bold text-emerald-300 bg-emerald-950/90 px-2.5 py-0.5 rounded border border-emerald-500 animate-pulse shadow">
                  ✓ Pronta para Resolução!
                </span>
              ) : (
                <span className="text-[11px] font-mono text-noir-300 bg-noir-950/90 px-2 py-0.5 rounded border border-noir-700">
                  Na calada da noite...
                </span>
              )}
            </div>
          </div>

          {/* Conteúdo textual */}
          <div className="p-3.5 sm:p-4">
            <h3 className="font-serif-vintage font-bold text-base sm:text-lg text-paper-100 mb-1">
              {activeAction.action_type?.name}
            </h3>
            <p className="text-xs text-paper-300 font-serif italic mb-3">
              {activeAction.action_type?.description}
            </p>

            <div className="pt-2 border-t border-noir-800">
              {isActionReady ? (
                <Button
                  variant="success"
                  fullWidth
                  size="lg"
                  onClick={() => completeAction(activeAction.id)}
                  className="animate-bounce py-3 min-h-[46px] text-xs sm:text-sm font-black shadow-lg"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Receber Relatório &amp; Recolher Recompensas
                </Button>
              ) : (
                <CountdownTimer
                  targetDate={activeAction.finish_at}
                  startDate={activeAction.started_at}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filtros de Categoria (Rolagem horizontal suave para mobile com cores) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {(['todas', 'operacao', 'influencia', 'violencia', 'comercio', 'investigacao'] as const).map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 ${
                isSelected
                  ? 'bg-gold-500 text-noir-950 font-black shadow-gold-subtle ring-1 ring-gold-400'
                  : 'bg-noir-900 text-noir-400 hover:text-paper-100 border border-noir-800'
              }`}
            >
              {cat === 'todas' ? 'Todas' : cat}
            </button>
          );
        })}
      </div>

      {/* Lista de Ações Disponíveis com BORDAS E CORES POR CATEGORIA */}
      <div className="space-y-3.5">
        {filteredActions.map((atype) => {
          const canAfford = character.money >= atype.cost_money && character.influence >= atype.cost_influence;
          const meetsLevel = character.level >= atype.req_level;
          const isLocked = !meetsLevel;
          const isBusy = Boolean(activeAction);
          const style = CATEGORY_STYLES[atype.category] || CATEGORY_STYLES.operacao;

          return (
            <div
              key={atype.id}
              className={`border rounded-lg overflow-hidden transition-all shadow-lg ${style.borderLeft} ${
                isLocked 
                  ? 'border-noir-800 opacity-60' 
                  : 'border-noir-750 hover:border-gold-500/40'
              }`}
            >
              {/* Banner com GameImage */}
              <div className="relative w-full h-28 sm:h-34">
                <GameImage
                  src={atype.illustration}
                  alt={atype.name}
                  theme={style.theme}
                  iconType={style.iconType}
                  aspect="w-full h-full"
                />

                {/* Badge de categoria sobreposto na imagem */}
                <div className="absolute top-2 left-2 z-10">
                  <span className={`inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded border backdrop-blur-md font-bold shadow ${style.badge}`}>
                    {atype.category}
                  </span>
                </div>

                {/* Duração & Sucesso sobrepostos na imagem */}
                <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-noir-950/90 px-2 py-0.5 rounded border border-noir-700/80 backdrop-blur-md text-[10px] font-mono text-paper-200 z-10">
                  <Clock className="w-3 h-3 text-gold-500" />
                  <span>{Math.floor(atype.duration_seconds / 60)}m {atype.duration_seconds % 60}s</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">{atype.success_chance}%</span>
                </div>
              </div>

              {/* Conteúdo do card */}
              <div className="p-3 sm:p-4 space-y-2.5">
                <div>
                  <h4 className="font-serif-vintage font-bold text-sm sm:text-base text-paper-100">
                    {atype.name}
                  </h4>
                  <p className="text-xs text-noir-400 mt-0.5 font-serif italic">
                    {atype.description}
                  </p>
                </div>

                {/* Custos, Recompensas e Botão (Mobile-First Layout) */}
                <div className="pt-2 border-t border-noir-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono">
                  <div className="flex items-center gap-2 text-paper-300 text-[11px] flex-wrap">
                    <span>
                      Custo: <strong className="text-gold-400 font-bold">${atype.cost_money}</strong>
                      {atype.cost_influence > 0 && ` + ${atype.cost_influence} Inf.`}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400">
                      Ganho: ${atype.reward_money_min} a ${atype.reward_money_max}
                    </span>
                  </div>

                  <div className="w-full sm:w-auto shrink-0">
                    {isLocked ? (
                      <span className="text-[11px] text-amber-500 font-mono block text-center sm:text-right">
                        Requer Nível {atype.req_level}
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant={canAfford && !isBusy ? 'primary' : 'secondary'}
                        disabled={!canAfford || isBusy}
                        onClick={() => handleStart(atype)}
                        className="w-full sm:w-auto min-h-[38px] text-xs font-bold"
                      >
                        {isBusy 
                          ? 'Ocupado' 
                          : canAfford 
                            ? getActionButtonLabel(atype) 
                            : 'Fundos Insuficientes'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
