import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/common/Button';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { HowItWorksModal } from '../components/common/HowItWorksModal';
import { GameImage } from '../components/common/GameImage';
import { 
  Building2, Crosshair, Newspaper, Target, 
  ArrowRight, PlusCircle, CheckCircle, Flame, ShieldAlert, HelpCircle, Store 
} from 'lucide-react';
import { INITIAL_BUSINESS_TYPES, INITIAL_ACTION_TYPES } from '../lib/mockData';

export const DashboardPage: React.FC = () => {
  const { 
    character, businesses, activeAction, 
    articles, missions, setScreen, 
    collectBusinessRevenue, completeAction, claimMissionReward 
  } = useGame();

  const [isManualOpen, setIsManualOpen] = useState(false);

  if (!character) return null;

  const now = Date.now();
  const latestArticle = articles.length > 0 ? articles[0] : null;

  // Próxima missão ativa para meta
  const currentMission = missions.find(m => !m.claimed);

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-6 pb-24">
      {/* 1. Header do Império */}
      <div className="bg-gradient-to-b from-noir-900 to-noir-850 border border-gold-500/30 rounded-lg p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase font-semibold">
                Santa Augusta • Território Livre
              </span>
              <span className="text-[10px] text-noir-400 font-mono">
                • Dia {character.daily_streak}
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-paper-100 mt-0.5">
              {character.name}
            </h2>
            <p className="text-xs text-gold-400 font-serif italic">
              Conhecido como "{character.nickname}" • {character.origin}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-noir-400">Título / Nível</span>
            <div className="font-serif-vintage text-xs sm:text-sm font-bold text-gold-400">
              {character.level === 1 && 'Aspirante'}
              {character.level === 2 && 'Capanga de Respeito'}
              {character.level === 3 && 'Homem de Confiança'}
              {character.level === 4 && 'Chefe de Bairro'}
              {character.level === 5 && 'Empresário da Noite'}
              {character.level >= 6 && 'Chefão de Santa Augusta'}
            </div>
          </div>
        </div>

        {/* Citação imersiva */}
        <div className="mt-3 pt-3 border-t border-noir-700/60 text-[11px] text-paper-300 font-serif italic flex items-center gap-2">
          <Flame className="w-3.5 h-3.5 text-gold-500 shrink-0" />
          <span className="flex-1">
            {character.style === 'empresario' && '“O dinheiro limpo cala a boca de juízes e constrói legados duradouros.”'}
            {character.style === 'negociador' && '“Nenhum conflito resiste a uma proposta bem calculada e ao silêncio certo.”'}
            {character.style === 'contrabandista' && '“A névoa do porto é o melhor manto para quem não teme o mar.”'}
            {character.style === 'executor' && '“O respeito se conquista na bala ou na promessa de sangue.”'}
          </span>
          <button
            onClick={() => setIsManualOpen(true)}
            className="text-[10px] text-gold-400 hover:text-gold-300 font-mono underline shrink-0 flex items-center gap-1"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Como Funciona</span>
          </button>
        </div>
      </div>

      {/* 2. Seu Império (Negócios) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gold-400" />
            <h3 className="font-display text-sm font-bold tracking-wider uppercase text-paper-100">
              Seu Império ({businesses.length})
            </h3>
          </div>
          <button
            onClick={() => setScreen('businesses')}
            className="text-xs text-gold-400 hover:text-gold-300 font-medium flex items-center gap-1"
          >
            <span>Ver todos</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {businesses.length === 0 ? (
          <div className="bg-noir-900/80 border border-noir-800 rounded-lg p-5 text-center space-y-3">
            <p className="text-xs text-paper-300 font-serif italic">
              Você ainda não possui nenhum endereço em Santa Augusta. Seu império começa aqui.
            </p>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setScreen('businesses')}
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Adquirir Primeiro Negócio
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {businesses.slice(0, 4).map((biz) => {
              const btype = biz.type || INITIAL_BUSINESS_TYPES.find(t => t.id === biz.business_type_id);
              const isReady = now >= new Date(biz.next_collection_at).getTime();
              return (
                <div
                  key={biz.id}
                  className={`rounded-lg p-3 transition-all shadow-inner-dark flex flex-col justify-between space-y-2.5 border-2 ${
                    isReady
                      ? 'bg-gradient-to-b from-emerald-950/20 via-noir-900 to-noir-900 border-emerald-500/80 shadow-[0_0_12px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30'
                      : 'bg-noir-900 border-noir-750 hover:border-gold-500/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Thumbnail do negócio com GameImage */}
                    <div className="w-12 h-12 rounded overflow-hidden shrink-0 border border-noir-700 relative">
                      <GameImage
                        src={btype?.illustration}
                        alt={biz.custom_name}
                        iconType={btype?.slug}
                        theme={isReady ? 'emerald' : 'gold'}
                        aspect="w-full h-full"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-serif-vintage font-bold text-sm text-paper-100 truncate">
                          {biz.custom_name}
                        </h4>
                        {isReady && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-700 animate-pulse shrink-0 font-bold">
                            Pronto
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-noir-400 truncate">
                        {biz.district?.name || 'Santa Augusta'} • Nível {biz.level}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-noir-800/80 flex items-center justify-between">
                    {isReady ? (
                      <Button
                        size="sm"
                        variant="success"
                        fullWidth
                        onClick={() => collectBusinessRevenue(biz.id)}
                        className="text-xs py-1.5 min-h-[36px] font-bold"
                      >
                        Recolher Receita
                      </Button>
                    ) : (
                      <div className="w-full">
                        <CountdownTimer
                          targetDate={biz.next_collection_at}
                          startDate={biz.last_collected_at}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Ação Atual / Operação em Andamento */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-gold-400" />
            <h3 className="font-display text-sm font-bold tracking-wider uppercase text-paper-100">
              Operação nas Ruas
            </h3>
          </div>
          <button
            onClick={() => setScreen('actions')}
            className="text-xs text-gold-400 hover:text-gold-300 font-medium flex items-center gap-1"
          >
            <span>Ver operações</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {activeAction ? (
          <div className="bg-noir-900 border-2 border-gold-500/50 rounded-lg shadow-xl overflow-hidden">
            {/* Banner ilustrado da ação ativa com GameImage */}
            {(() => {
              const atype = activeAction.action_type || INITIAL_ACTION_TYPES.find(a => a.id === activeAction.action_type_id);
              const isReady = now >= new Date(activeAction.finish_at).getTime();
              return (
                <div>
                  <div className="relative w-full h-24 sm:h-28 overflow-hidden">
                    <GameImage
                      src={atype?.illustration}
                      alt={atype?.name || 'Operação'}
                      theme="gold"
                      iconType="crosshair"
                      aspect="w-full h-full"
                    />
                    <div className="absolute top-2 left-2 right-2 flex justify-between items-center text-[10px] font-mono z-10">
                      <span className="uppercase tracking-widest text-gold-400 bg-noir-950/90 px-2 py-0.5 rounded border border-gold-500/40 font-bold">
                        Em Andamento
                      </span>
                      <span className="text-paper-200 bg-noir-950/90 px-2 py-0.5 rounded border border-noir-700">
                        {isReady ? (
                          <strong className="text-emerald-400 font-bold animate-pulse">✓ Concluída!</strong>
                        ) : (
                          'Executando...'
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 space-y-2">
                    <h4 className="font-serif-vintage font-bold text-base text-paper-100">
                      {atype?.name || 'Operação Especial'}
                    </h4>
                    <p className="text-xs text-noir-400 font-serif italic">
                      {atype?.description}
                    </p>

                    <div className="pt-2 border-t border-noir-800">
                      {isReady ? (
                        <Button
                          fullWidth
                          variant="success"
                          onClick={() => completeAction(activeAction.id)}
                          className="animate-bounce min-h-[42px] text-xs font-bold"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Receber Relatório &amp; Lucros
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
              );
            })()}
          </div>
        ) : (
          <div className="bg-noir-900/60 border border-noir-800 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-paper-200">
                Nenhuma operação nas ruas no momento.
              </p>
              <p className="text-[11px] text-noir-400">
                Seus homens estão ociosos aguardando novas ordens.
              </p>
            </div>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setScreen('actions')}
              className="text-xs py-1.5 px-3 min-h-[36px] font-bold"
            >
              Iniciar Operação
            </Button>
          </div>
        )}
      </div>

      {/* 4. Gazeta da Capital (Manchete Recente) */}
      {latestArticle && (
        <div 
          onClick={() => setScreen('newspaper')}
          className="cursor-pointer bg-paper-100 text-noir-950 rounded-lg p-4 sm:p-5 shadow-2xl border-2 border-noir-900 relative group transition-transform hover:scale-[1.01]"
        >
          <div className="border-b-2 border-noir-900 pb-1.5 mb-2 flex items-center justify-between">
            <span className="font-display font-black text-xs tracking-widest uppercase">
              Gazeta da Capital
            </span>
            <span className="font-mono text-[10px] font-bold text-noir-700">
              Edição #{latestArticle.edition_number}
            </span>
          </div>

          <h4 className="font-serif font-black text-base sm:text-lg leading-tight uppercase tracking-tight group-hover:text-blood-800 transition-colors">
            {latestArticle.headline}
          </h4>

          <p className="font-serif italic text-xs text-noir-800 mt-1 line-clamp-2">
            {latestArticle.subheadline}
          </p>

          <div className="mt-2 pt-2 border-t border-noir-300 flex items-center justify-between text-[10px] font-mono text-noir-600">
            <span>Categoria: {latestArticle.category}</span>
            <span className="font-bold underline">Ler notícia completa →</span>
          </div>
        </div>
      )}

      {/* 5. Próximo Objetivo / Missão */}
      {currentMission && currentMission.mission && (
        <div className="bg-noir-900/90 border border-noir-700 rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gold-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-500 font-bold">
                Objetivo Imediato
              </span>
            </div>
            {currentMission.completed ? (
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">
                Concluído
              </span>
            ) : (
              <span className="text-[10px] font-mono text-paper-300">
                {currentMission.current_count} / {currentMission.mission.target_count}
              </span>
            )}
          </div>

          <h4 className="font-serif-vintage font-bold text-sm text-paper-100">
            {currentMission.mission.title}
          </h4>
          <p className="text-xs text-noir-400 mt-0.5 mb-3">
            {currentMission.mission.description}
          </p>

          {currentMission.completed ? (
            <Button
              size="sm"
              variant="success"
              fullWidth
              onClick={() => claimMissionReward(currentMission.mission_id)}
              className="font-bold min-h-[38px] animate-bounce"
            >
              Recolher Recompensa (+${currentMission.mission.reward_money.toLocaleString('pt-BR')})
            </Button>
          ) : (
            <div className="w-full h-1.5 bg-noir-800 rounded-full overflow-hidden border border-noir-700">
              <div
                className="h-full bg-gold-500 transition-all duration-300"
                style={{
                  width: `${Math.min(100, (currentMission.current_count / currentMission.mission.target_count) * 100)}%`
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Modal Manual de Regras e Como Funciona */}
      <HowItWorksModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
      />
    </div>
  );
};
