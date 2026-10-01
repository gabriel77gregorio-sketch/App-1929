import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/common/Button';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { HowItWorksModal } from '../components/common/HowItWorksModal';
import { 
  Building2, Crosshair, Target, 
  ArrowRight, PlusCircle, Sparkles 
} from 'lucide-react';
import { INITIAL_BUSINESS_TYPES, INITIAL_ACTION_TYPES } from '../lib/mockData';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from '../components/common/PWAInstallModal';
import { ReferralModal } from '../components/common/ReferralModal';

export const DashboardPage: React.FC = () => {
  const { 
    character, businesses, activeAction, 
    articles, missions, setScreen, 
    collectBusinessRevenue, completeAction, claimMissionReward,
    season, attackLogs, referralData
  } = useGame();

  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const { showIOSInstructions, setShowIOSInstructions } = usePWAInstall();

  if (!character) return null;

  const now = Date.now();
  const latestArticle = articles.length > 0 ? articles[0] : null;
  const currentMission = missions.find(m => !m.claimed);

  return (
    <div className="max-w-2xl mx-auto px-4 py-3 space-y-4 pb-24">
      {/* 1. Header do Império */}
      <div className="bg-noir-900 border border-noir-750 rounded-lg p-3 relative overflow-hidden flex items-center gap-3">
        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-gold-500/40 bg-noir-950 shadow">
          <img
            src={`/images/characters/${character.style}.jpg`}
            alt={character.name}
            className="w-full h-full object-cover"
            style={{ imageRendering: 'pixelated' }}
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        <div className="flex-1 min-w-0 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-black text-paper-100 truncate">
              {character.name}
            </h2>
            <p className="text-xs text-gold-400 font-serif italic truncate">
              "{character.nickname}" • {character.origin}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase font-mono text-noir-400 block">Nível {character.level}</span>
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
      </div>

      {/* 2. Widget de Submundo, Rivais e Temporada */}
      {(() => {
        const pendingRevenges = attackLogs.filter(a => a.can_revenge && !a.revenge_executed);
        return (
          <div className="bg-noir-900 border border-noir-750 rounded-lg p-3 shadow-md space-y-2">
            {pendingRevenges.length > 0 && (
              <div 
                onClick={() => setScreen('ranking')}
                className="bg-blood-950/80 border border-rose-500/50 p-2 rounded flex items-center justify-between cursor-pointer"
              >
                <span className="text-xs font-bold text-rose-200">
                  ⚔️ Invasão de {pendingRevenges[0].attacker_name} — Vingança →
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span className="text-xs font-bold text-paper-100">
                  {season.title.split(':')[0]} <span className="text-noir-400 font-normal">({season.days_left}d)</span>
                </span>
              </div>

              <button
                onClick={() => setScreen('ranking')}
                className="flex items-center gap-1 px-2 py-1 rounded bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 text-[10px] font-mono font-bold uppercase"
              >
                <Crosshair className="w-3 h-3" />
                <span>Rivais</span>
              </button>
            </div>

            {/* Barra de Progresso da Temporada */}
            <div className="w-full bg-noir-950 h-1.5 rounded-full overflow-hidden border border-noir-800">
              <div 
                className="bg-gold-500 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, ((season.current_glory % season.glory_per_level) / season.glory_per_level) * 100)}%` }}
              />
            </div>
          </div>
        );
      })()}

      {/* 4. Seu Império (Negócios) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gold-400" />
            <h3 className="font-display text-sm font-bold tracking-wider uppercase text-paper-100">
              Negócios ({businesses.length})
            </h3>
          </div>
          <button
            onClick={() => setScreen('businesses')}
            className="text-[10px] uppercase font-mono text-gold-400 hover:text-gold-300 flex items-center gap-1"
          >
            <span>Ver todos</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {businesses.length === 0 ? (
          <div className="bg-noir-900 border border-noir-800 rounded p-3 flex items-center justify-between">
             <span className="text-xs text-noir-400">Nenhum negócio ainda.</span>
             <Button size="sm" variant="primary" onClick={() => setScreen('businesses')} className="text-[10px] py-1 px-2">
               <PlusCircle className="w-3 h-3 mr-1" />
               Adquirir
             </Button>
          </div>
        ) : (
          <div className="space-y-1.5">
            {businesses.slice(0, 4).map((biz) => {
              const isReady = now >= new Date(biz.next_collection_at).getTime();
              return (
                <div
                  key={biz.id}
                  className={`rounded p-2.5 flex items-center justify-between border ${
                    isReady
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-noir-900 border-noir-800'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-paper-100">{biz.custom_name}</span>
                    <span className="text-[10px] text-noir-400">Nível {biz.level}</span>
                  </div>
                  
                  <div className="flex items-center">
                    {isReady ? (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => collectBusinessRevenue(biz.id)}
                        className="text-[10px] py-1 px-3 font-bold h-7"
                      >
                        Recolher
                      </Button>
                    ) : (
                      <div className="w-20 text-right">
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

      {/* 5. Ação Atual / Operação em Andamento */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-gold-400" />
            <h3 className="font-display text-sm font-bold tracking-wider uppercase text-paper-100">
              Operação nas Ruas
            </h3>
          </div>
        </div>

        {activeAction ? (
          <div className="bg-noir-900 border border-gold-500/30 rounded p-3 flex items-center justify-between">
            {(() => {
              const atype = activeAction.action_type || INITIAL_ACTION_TYPES.find(a => a.id === activeAction.action_type_id);
              const isReady = now >= new Date(activeAction.finish_at).getTime();
              return (
                <>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-paper-100">{atype?.name || 'Operação'}</span>
                    <span className="text-[10px] text-gold-400">Em andamento</span>
                  </div>
                  <div>
                    {isReady ? (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => completeAction(activeAction.id)}
                        className="text-[10px] py-1 px-3 font-bold h-7"
                      >
                        Concluir
                      </Button>
                    ) : (
                      <div className="w-20 text-right">
                        <CountdownTimer
                          targetDate={activeAction.finish_at}
                          startDate={activeAction.started_at}
                        />
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        ) : (
          <div className="bg-noir-900 border border-noir-800 rounded p-3 flex items-center justify-between">
            <span className="text-xs text-noir-400">Nenhuma operação ativa.</span>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setScreen('actions')}
              className="text-[10px] py-1 px-3 h-7 font-bold"
            >
              Ir para Operações
            </Button>
          </div>
        )}
      </div>

      {/* 6. Gazeta da Capital (Manchete Recente) */}
      {latestArticle && (
        <div 
          onClick={() => setScreen('newspaper')}
          className="cursor-pointer bg-paper-100 text-noir-950 rounded p-3 flex items-center gap-2 border border-noir-300"
        >
          <span className="font-display font-black text-[10px] tracking-widest uppercase bg-noir-950 text-paper-100 px-1.5 py-0.5 rounded shrink-0">
            Gazeta
          </span>
          <h4 className="font-serif font-bold text-xs uppercase truncate flex-1">
            {latestArticle.headline}
          </h4>
          <span className="font-bold shrink-0">→</span>
        </div>
      )}

      {/* 7. Próximo Objetivo / Missão */}
      {currentMission && currentMission.mission && (
        <div className="bg-noir-900 border border-noir-800 rounded p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-gold-400" />
              <span className="font-bold text-xs text-paper-100">
                {currentMission.mission.title}
              </span>
            </div>
            <span className="text-[10px] font-mono text-paper-300">
              {currentMission.current_count} / {currentMission.mission.target_count}
            </span>
          </div>

          {currentMission.completed ? (
            <Button
              size="sm"
              variant="success"
              fullWidth
              onClick={() => claimMissionReward(currentMission.mission_id)}
              className="text-xs font-bold h-8"
            >
              Recolher Recompensa
            </Button>
          ) : (
            <div className="w-full h-1.5 bg-noir-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-500 transition-all"
                style={{
                  width: `${Math.min(100, (currentMission.current_count / currentMission.mission.target_count) * 100)}%`
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Modais */}
      <HowItWorksModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
      />

      <PWAInstallModal
        isOpen={showIOSInstructions}
        onClose={() => setShowIOSInstructions(false)}
      />

      <ReferralModal
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
      />
    </div>
  );
};
