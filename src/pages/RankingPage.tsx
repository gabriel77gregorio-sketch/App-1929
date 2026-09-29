import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { SABOTAGE_TYPES } from '../services/rivalService';
import { SabotageTypeId, RivalTarget } from '../types/game';
import { 
  Trophy, Coins, Award, Users, Crown, Crosshair, Flame, 
  Shield, ShieldCheck, Newspaper, Package, ShieldAlert, Sparkles, 
  Check, Lock, ArrowRight, Zap, RefreshCw, AlertTriangle
} from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  familyTag?: string;
  value: number;
  isPlayer?: boolean;
}

export const RankingPage: React.FC = () => {
  const { 
    character, families, rivals, attackLogs, playerDefense, 
    season, executeSabotage, hireGuard, upgradeSafe, claimSeasonReward, 
    refreshRivals 
  } = useGame();

  const [activeTab, setActiveTab] = useState<'sabotagem' | 'vinganca' | 'temporada' | 'defesa' | 'notaveis'>('sabotagem');
  const [rankingSubTab, setRankingSubTab] = useState<'fortuna' | 'respeito' | 'familias'>('fortuna');
  const [selectedRival, setSelectedRival] = useState<RivalTarget | null>(null);
  const [selectedSabotage, setSelectedSabotage] = useState<SabotageTypeId>('armazem');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<{ success: boolean; message: string; lootMoney: number; lootRespect: number } | null>(null);

  if (!character) return null;

  // Ataques com vingança pendente
  const pendingRevenges = attackLogs.filter(a => a.can_revenge && !a.revenge_executed);

  // Mock de ranking comparativo
  const fortuneRank: LeaderboardEntry[] = [
    { rank: 1, name: 'Bento de Albuquerque', familyTag: 'ALBUQ', value: 140000 },
    { rank: 2, name: 'Don Vincenzo Moretti', familyTag: 'MORTI', value: 85000 },
    { rank: 3, name: 'Tião "Machado" Ferreira', familyTag: 'FERRA', value: 62000 },
    { rank: 4, name: character.name, familyTag: character.family_name ? 'SUA' : undefined, value: character.money, isPlayer: true },
    { rank: 5, name: 'Comendador Azevedo', familyTag: 'INDEP', value: 34000 },
    { rank: 6, name: 'Madame Lili Cartier', familyTag: 'BOEMI', value: 28000 },
    { rank: 7, name: 'Manoel das Docas', familyTag: 'FERRA', value: 21000 },
  ].sort((a, b) => b.value - a.value).map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  const respectRank: LeaderboardEntry[] = [
    { rank: 1, name: 'Coronel Bento de Albuquerque', familyTag: 'ALBUQ', value: 92 },
    { rank: 2, name: 'Don Vincenzo Moretti', familyTag: 'MORTI', value: 85 },
    { rank: 3, name: 'Tião "Machado" Ferreira', familyTag: 'FERRA', value: 74 },
    { rank: 4, name: 'Capitão Gervásio', familyTag: 'POLIC', value: 50 },
    { rank: 5, name: character.name, familyTag: character.family_name ? 'SUA' : undefined, value: character.respect, isPlayer: true },
  ].sort((a, b) => b.value - a.value).map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  const handleLaunchSabotage = async (isRevenge = false) => {
    if (!selectedRival) return;
    setIsExecuting(true);
    setExecutionResult(null);

    const res = await executeSabotage(selectedRival.id, selectedSabotage, isRevenge);
    setExecutionResult(res);
    setIsExecuting(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-6 pb-24">
      {/* Banner Principal de Submundo & Temporada */}
      <div className="bg-gradient-to-r from-noir-950 via-noir-900 to-noir-950 border border-gold-500/40 rounded-lg p-4 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase font-bold px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/30">
                Submundo de Santa Augusta
              </span>
              <span className="text-[10px] text-noir-400 font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-gold-400" />
                Temporada {season.season_number} • {season.days_left} dias restantes
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-paper-100 mt-1">
              Disputa de Poder &amp; Rivais
            </h2>
            <p className="text-xs text-noir-300 font-serif italic">
              Espie armazéns alheios, dê o troco em invasores e dispute a hegemonia da cidade.
            </p>
          </div>

          <div className="bg-noir-900/90 border border-gold-500/30 p-2.5 rounded text-right shrink-0">
            <span className="text-[10px] uppercase font-mono text-noir-400 block">Passe de Glória</span>
            <div className="font-display text-sm font-bold text-gold-400">
              Nível {season.current_level} <span className="text-noir-500 text-xs">/ 10</span>
            </div>
            <div className="w-24 bg-noir-950 h-1.5 rounded-full overflow-hidden mt-1 border border-noir-700">
              <div 
                className="bg-gold-500 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (season.current_glory % season.glory_per_level) / season.glory_per_level * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Principais de Navegação */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 border-b border-noir-800 scrollbar-none">
        <button
          onClick={() => { setActiveTab('sabotagem'); setExecutionResult(null); }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'sabotagem' ? 'bg-gold-500 text-noir-950 font-bold shadow-gold-subtle' : 'text-noir-400 hover:text-paper-100 bg-noir-900/50'
          }`}
        >
          <Crosshair className="w-3.5 h-3.5" />
          <span>Ruas &amp; Sabotagem</span>
        </button>

        <button
          onClick={() => { setActiveTab('vinganca'); setExecutionResult(null); }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer relative ${
            activeTab === 'vinganca' ? 'bg-blood-700 text-white font-bold shadow-md' : 'text-noir-400 hover:text-paper-100 bg-noir-900/50'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Vingança</span>
          {pendingRevenges.length > 0 && (
            <span className="bg-amber-500 text-noir-950 text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
              {pendingRevenges.length}
            </span>
          )}
        </button>

        <button
          onClick={() => { setActiveTab('temporada'); setExecutionResult(null); }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'temporada' ? 'bg-gold-500 text-noir-950 font-bold shadow-gold-subtle' : 'text-noir-400 hover:text-paper-100 bg-noir-900/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Passe de Glória</span>
        </button>

        <button
          onClick={() => { setActiveTab('defesa'); setExecutionResult(null); }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'defesa' ? 'bg-gold-500 text-noir-950 font-bold shadow-gold-subtle' : 'text-noir-400 hover:text-paper-100 bg-noir-900/50'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Defesa</span>
        </button>

        <button
          onClick={() => { setActiveTab('notaveis'); setExecutionResult(null); }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'notaveis' ? 'bg-gold-500 text-noir-950 font-bold shadow-gold-subtle' : 'text-noir-400 hover:text-paper-100 bg-noir-900/50'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Notáveis</span>
        </button>
      </div>

      {/* ABA 1: RUAS & SABOTAGEM */}
      {activeTab === 'sabotagem' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-noir-400">
            <span>Selecione um alvo para espionar ou sabotar:</span>
            <button 
              onClick={refreshRivals}
              className="flex items-center gap-1 text-gold-400 hover:text-gold-300 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Atualizar alvos</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rivals.map((rival) => {
              const isSelected = selectedRival?.id === rival.id;
              return (
                <div
                  key={rival.id}
                  onClick={() => {
                    setSelectedRival(rival);
                    setExecutionResult(null);
                  }}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-noir-850 border-gold-500 shadow-gold-glow' 
                      : 'bg-noir-900/90 border-noir-800 hover:border-gold-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded bg-noir-800 border border-gold-500/40 flex items-center justify-center font-display font-black text-gold-400 text-base">
                        {rival.avatar_initial}
                      </div>
                      <div>
                        <h4 className="font-serif-vintage font-bold text-sm text-paper-100 leading-tight">
                          {rival.name}
                        </h4>
                        <span className="text-[11px] text-gold-400 font-serif italic block">
                          "{rival.nickname}"
                        </span>
                      </div>
                    </div>

                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold ${
                      rival.online_status === 'online' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-noir-800 text-noir-400'
                    }`}>
                      {rival.online_status}
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-noir-800/80 grid grid-cols-3 gap-1 text-[11px] font-mono">
                    <div>
                      <span className="text-[9px] text-noir-500 block uppercase">Distrito</span>
                      <span className="text-paper-300 truncate block">{rival.district_name.split(' ')[0]}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-noir-500 block uppercase">Fortuna</span>
                      <span className="text-gold-400 font-bold">${(rival.fortune / 1000).toFixed(0)}k</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-noir-500 block uppercase">Defesa</span>
                      <span className="text-paper-200">{rival.defense_rating}%</span>
                    </div>
                  </div>

                  <div className="mt-2.5">
                    <button
                      className={`w-full py-1.5 rounded text-xs font-mono font-bold uppercase transition-all ${
                        isSelected 
                          ? 'bg-gold-500 text-noir-950' 
                          : 'bg-noir-800 text-gold-400 hover:bg-noir-750'
                      }`}
                    >
                      {isSelected ? '✓ Alvo Focado' : 'Focar Alvo'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Painel de Sabotagem do Alvo Selecionado */}
          {selectedRival && (
            <div className="bg-noir-900 border-2 border-gold-500/60 rounded-lg p-4 sm:p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between border-b border-noir-800 pb-2">
                <div>
                  <span className="text-[10px] font-mono text-gold-500 uppercase tracking-widest block font-bold">
                    Operação Clandestina Contra
                  </span>
                  <h3 className="font-display text-lg font-bold text-paper-100">
                    {selectedRival.name} ({selectedRival.family_tag})
                  </h3>
                </div>
                <div className="text-right text-xs font-mono">
                  <span className="text-noir-400 block text-[10px]">Defesa Estimada</span>
                  <span className="text-rose-400 font-bold">{selectedRival.defense_rating}% de resistência</span>
                </div>
              </div>

              {/* Opções de Sabotagem */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-paper-200 block font-semibold">
                  Escolha o método de incursão:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {SABOTAGE_TYPES.map((sab) => {
                    const isPicked = selectedSabotage === sab.id;
                    return (
                      <div
                        key={sab.id}
                        onClick={() => setSelectedSabotage(sab.id)}
                        className={`p-3 rounded border text-left cursor-pointer transition-all ${
                          isPicked
                            ? 'bg-gold-500/15 border-gold-500 shadow-gold-subtle'
                            : 'bg-noir-850/80 border-noir-700/60 hover:border-gold-500/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-serif-vintage font-bold text-xs text-paper-100">
                            {sab.name.split(' ')[0]} {sab.name.split(' ')[1]}
                          </span>
                          {sab.id === 'armazem' && <Package className="w-3.5 h-3.5 text-gold-400" />}
                          {sab.id === 'denuncia' && <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
                          {sab.id === 'gazeta' && <Newspaper className="w-3.5 h-3.5 text-blue-400" />}
                        </div>
                        <p className="text-[10px] text-noir-400 mt-1 line-clamp-2">
                          {sab.description}
                        </p>
                        <div className="mt-2 pt-2 border-t border-noir-700/60 text-[10px] font-mono flex justify-between">
                          <span className="text-gold-400 font-bold">${sab.cost_money}</span>
                          <span className="text-emerald-400">{sab.reward_label.split('+')[0]}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Resultado da Operação */}
              {executionResult && (
                <div className={`p-3 rounded border text-xs font-mono animate-in fade-in ${
                  executionResult.success 
                    ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200' 
                    : 'bg-rose-950/80 border-rose-500/60 text-rose-200'
                }`}>
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    {executionResult.success ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                    <span>{executionResult.success ? 'OPERAÇÃO CONCLUÍDA COM ÊXITO!' : 'OPERAÇÃO INTERROMPIDA!'}</span>
                  </div>
                  <p>{executionResult.message}</p>
                </div>
              )}

              {/* Botão de Disparo */}
              <button
                onClick={() => handleLaunchSabotage(false)}
                disabled={isExecuting || character.money < (SABOTAGE_TYPES.find(s => s.id === selectedSabotage)?.cost_money || 100)}
                className="w-full py-3 rounded bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-noir-950 font-display font-black text-sm uppercase tracking-wider transition-all shadow-gold-glow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Crosshair className="w-4 h-4" />
                <span>
                  {isExecuting 
                    ? 'Executando Incursão...' 
                    : `Lançar Operação ($${SABOTAGE_TYPES.find(s => s.id === selectedSabotage)?.cost_money} réis)`}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ABA 2: VINGANÇA (OLHO POR OLHO) */}
      {activeTab === 'vinganca' && (
        <div className="space-y-4">
          <div className="bg-blood-950/40 border border-blood-800/80 rounded-lg p-4 text-center">
            <h3 className="font-display text-base font-bold text-rose-200 flex items-center justify-center gap-2">
              <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>O Livro de Vingança das Ruas</span>
            </h3>
            <p className="text-xs text-rose-300 font-serif italic mt-0.5">
              "Quem fere com ferro será cobrado em ouro e respeito dobrado."
            </p>
          </div>

          {pendingRevenges.length > 0 ? (
            <div className="space-y-3">
              <span className="text-xs font-mono text-gold-400 uppercase font-bold block">
                Ataques Sofridos — Reclame sua Vingança (2x Recompensa):
              </span>
              {pendingRevenges.map((atk) => (
                <div
                  key={atk.id}
                  className="bg-noir-900 border-2 border-rose-500/70 rounded-lg p-4 shadow-xl space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase bg-rose-950 text-rose-300 px-2 py-0.5 rounded font-bold border border-rose-500/40">
                          Invasão Hostil
                        </span>
                        <span className="text-[10px] text-noir-400 font-mono">
                          {new Date(atk.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h4 className="font-display text-base font-bold text-paper-100 mt-1">
                        {atk.attacker_name}
                      </h4>
                      <p className="text-xs text-paper-300 font-serif italic mt-0.5">
                        {atk.details}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-rose-400 uppercase block font-bold">Prejuízo</span>
                      <span className="font-mono text-sm font-bold text-rose-400">-${atk.loot_money} réis</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-noir-800 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-gold-400 flex items-center gap-1 font-bold">
                      <Zap className="w-3.5 h-3.5" />
                      Troco Imediato: Ganhe 2x Dinheiro &amp; Glória!
                    </span>

                    <button
                      onClick={async () => {
                        const targetRival = rivals.find(r => r.id === atk.attacker_id) || rivals[0];
                        setSelectedRival(targetRival);
                        setIsExecuting(true);
                        const res = await executeSabotage(targetRival.id, 'armazem', true);
                        setExecutionResult(res);
                        setIsExecuting(false);
                      }}
                      className="px-3.5 py-1.5 rounded bg-gradient-to-r from-blood-700 to-rose-600 hover:from-blood-600 hover:to-rose-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>VINGANÇA (2X)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-noir-900/60 border border-noir-800 rounded-lg space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="font-display font-bold text-paper-100 text-sm">Seus cofres estão em paz</h4>
              <p className="text-xs text-noir-400">
                Nenhum rival ousou atacar seus negócios recentemente. Quando sofrer uma incursão, o botão de vingança dobrada aparecerá aqui.
              </p>
            </div>
          )}

          {/* Histórico Geral de Incursões */}
          <div className="mt-6 space-y-2">
            <span className="text-xs font-mono text-noir-400 uppercase font-bold block">
              Histórico Recente do Submundo:
            </span>
            <div className="bg-noir-900 border border-noir-800 rounded-lg divide-y divide-noir-800 text-xs font-mono">
              {attackLogs.map((log) => (
                <div key={log.id} className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-paper-200">
                      {log.attacker_name} vs {log.victim_name}
                    </span>
                    <span className="text-[10px] text-noir-400 block font-serif italic">
                      {log.details}
                    </span>
                  </div>
                  <span className={`text-[11px] font-bold ${log.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {log.success ? `+${log.loot_money} réis` : 'Defendido'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: PASSE DE GLÓRIA (TEMPORADA 1929) */}
      {activeTab === 'temporada' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-b from-noir-900 to-noir-950 border border-gold-500/40 rounded-lg p-4 sm:p-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-noir-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-gold-500 uppercase font-bold tracking-widest block">
                  Passe de Glória Sazonal • Gratuito
                </span>
                <h3 className="font-display text-lg sm:text-xl font-black text-paper-100">
                  {season.title}
                </h3>
                <p className="text-xs text-noir-300 font-serif italic mt-0.5">
                  {season.subtitle}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-noir-400 uppercase block">Glória Total</span>
                <span className="font-mono text-base font-bold text-gold-400">
                  {season.current_glory} pts
                </span>
              </div>
            </div>

            {/* Barra Geral de Progresso */}
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-xs font-mono text-paper-200">
                <span>Progresso para o Nível {season.current_level + 1}</span>
                <span className="text-gold-400 font-bold">
                  {season.current_glory % season.glory_per_level} / {season.glory_per_level} pts
                </span>
              </div>
              <div className="w-full bg-noir-950 h-3 rounded-full overflow-hidden border border-gold-500/30">
                <div 
                  className="bg-gradient-to-r from-gold-600 via-gold-500 to-amber-400 h-full rounded-full transition-all duration-500 shadow-gold-glow"
                  style={{ width: `${Math.min(100, ((season.current_glory % season.glory_per_level) / season.glory_per_level) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Trilha de Recompensas Níveis 1 a 10 */}
          <div className="space-y-2.5">
            <span className="text-xs font-mono text-paper-300 uppercase font-bold block">
              Trilha de Recompensas da Temporada (1 a 10):
            </span>

            <div className="space-y-2">
              {season.rewards.map((reward) => {
                const isReached = season.current_level >= reward.level;
                const isClaimed = season.claimed_levels.includes(reward.level);

                return (
                  <div
                    key={reward.level}
                    className={`p-3.5 rounded-lg border flex items-center justify-between transition-all ${
                      isClaimed 
                        ? 'bg-noir-950/60 border-noir-800 opacity-60' 
                        : isReached 
                          ? 'bg-gold-500/10 border-gold-500 shadow-gold-subtle' 
                          : 'bg-noir-900 border-noir-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-black text-xs ${
                        isClaimed 
                          ? 'bg-noir-800 text-noir-500' 
                          : isReached 
                            ? 'bg-gold-500 text-noir-950 shadow-gold-glow' 
                            : 'bg-noir-800 text-paper-400'
                      }`}>
                        {reward.level}
                      </div>

                      <div>
                        <h4 className="font-serif-vintage font-bold text-sm text-paper-100">
                          {reward.title}
                        </h4>
                        <span className="text-xs text-gold-400 font-mono block">
                          {reward.reward_name}
                        </span>
                      </div>
                    </div>

                    <div>
                      {isClaimed ? (
                        <span className="text-xs font-mono text-noir-500 flex items-center gap-1 font-bold">
                          <Check className="w-4 h-4 text-emerald-500" />
                          <span>Resgatado</span>
                        </span>
                      ) : isReached ? (
                        <button
                          onClick={() => claimSeasonReward(reward.level)}
                          className="px-3 py-1.5 rounded bg-gold-500 hover:bg-gold-400 text-noir-950 font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-gold-glow animate-pulse cursor-pointer"
                        >
                          Resgatar
                        </button>
                      ) : (
                        <span className="text-xs font-mono text-noir-500 flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Nv.{reward.level}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: DEFESA & COFRES */}
      {activeTab === 'defesa' && (
        <div className="space-y-4">
          <div className="bg-noir-900 border border-gold-500/30 rounded-lg p-4 sm:p-5 shadow-xl space-y-4">
            <div>
              <span className="text-[10px] font-mono text-gold-500 uppercase tracking-widest font-bold">
                Segurança do Império
              </span>
              <h3 className="font-display text-lg font-bold text-paper-100">
                Guarda-Costas &amp; Blindagem de Cofres
              </h3>
              <p className="text-xs text-noir-400 font-serif italic">
                Proteja seu dinheiro e cargas contra invasões de outros chefões de Santa Augusta.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Guarda-Costas */}
              <div className="p-4 rounded-lg bg-noir-850 border border-noir-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gold-400" />
                    <h4 className="font-serif-vintage font-bold text-sm text-paper-100">Capangas de Vigia</h4>
                  </div>
                  <span className="font-mono text-xs font-bold text-gold-400">
                    {playerDefense.guards_count} / 5 Contratados
                  </span>
                </div>
                <p className="text-xs text-noir-400">
                  Cada guarda patrulha seus armazéns e reduz em 15% a chance de rivais obterem sucesso em invasões.
                </p>
                <button
                  onClick={hireGuard}
                  disabled={playerDefense.guards_count >= 5 || character.money < 500}
                  className="w-full py-2 rounded bg-noir-800 hover:bg-gold-500 hover:text-noir-950 border border-gold-500/50 text-gold-300 text-xs font-mono font-bold uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {playerDefense.guards_count >= 5 ? 'Contingente Máximo' : 'Contratar Guarda ($500 réis)'}
                </button>
              </div>

              {/* Cofre Blindado */}
              <div className="p-4 rounded-lg bg-noir-850 border border-noir-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-serif-vintage font-bold text-sm text-paper-100">Cofre Blindado Krupp</h4>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    Nível {playerDefense.safe_level} / 3
                  </span>
                </div>
                <p className="text-xs text-noir-400">
                  Garante que até {playerDefense.safe_level * 25}% do seu dinheiro esteja completamente protegido contra qualquer furto.
                </p>
                <button
                  onClick={upgradeSafe}
                  disabled={playerDefense.safe_level >= 3 || character.money < (playerDefense.safe_level === 1 ? 1200 : 2500)}
                  className="w-full py-2 rounded bg-noir-800 hover:bg-emerald-500 hover:text-noir-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {playerDefense.safe_level >= 3 ? 'Cofre Máximo (Krupp)' : `Reforçar Cofre ($${playerDefense.safe_level === 1 ? '1.200' : '2.500'} réis)`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 5: CÍRCULO DE NOTÁVEIS (RANKING GERAL) */}
      {activeTab === 'notaveis' && (
        <div className="space-y-4">
          <div className="flex gap-2 border-b border-noir-800 pb-2">
            <button
              onClick={() => setRankingSubTab('fortuna')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                rankingSubTab === 'fortuna' ? 'bg-gold-500 text-noir-950 font-bold' : 'text-noir-400 hover:text-paper-100'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Fortuna</span>
            </button>

            <button
              onClick={() => setRankingSubTab('respeito')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                rankingSubTab === 'respeito' ? 'bg-gold-500 text-noir-950 font-bold' : 'text-noir-400 hover:text-paper-100'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Respeito</span>
            </button>

            <button
              onClick={() => setRankingSubTab('familias')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                rankingSubTab === 'familias' ? 'bg-gold-500 text-noir-950 font-bold' : 'text-noir-400 hover:text-paper-100'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Famílias</span>
            </button>
          </div>

          <div className="bg-noir-900 border border-noir-800 rounded-lg overflow-hidden shadow-xl">
            {rankingSubTab === 'fortuna' && (
              <div className="divide-y divide-noir-800">
                {fortuneRank.map((e) => (
                  <div
                    key={e.name}
                    className={`p-3.5 flex items-center justify-between text-xs font-mono transition-colors ${
                      e.isPlayer ? 'bg-gold-500/10 border-l-4 border-gold-500' : 'hover:bg-noir-850'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 text-center font-bold ${e.rank <= 3 ? 'text-gold-400 text-sm' : 'text-noir-500'}`}>
                        #{e.rank}
                      </span>
                      <div>
                        <span className={`font-serif-vintage font-bold text-sm ${e.isPlayer ? 'text-gold-400' : 'text-paper-100'}`}>
                          {e.name}
                        </span>
                        {e.familyTag && (
                          <span className="ml-2 text-[10px] text-noir-400">[{e.familyTag}]</span>
                        )}
                      </div>
                    </div>
                    <div className="font-bold text-paper-100 text-sm">
                      ${e.value.toLocaleString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {rankingSubTab === 'respeito' && (
              <div className="divide-y divide-noir-800">
                {respectRank.map((e) => (
                  <div
                    key={e.name}
                    className={`p-3.5 flex items-center justify-between text-xs font-mono transition-colors ${
                      e.isPlayer ? 'bg-gold-500/10 border-l-4 border-gold-500' : 'hover:bg-noir-850'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 text-center font-bold ${e.rank <= 3 ? 'text-gold-400 text-sm' : 'text-noir-500'}`}>
                        #{e.rank}
                      </span>
                      <div>
                        <span className={`font-serif-vintage font-bold text-sm ${e.isPlayer ? 'text-gold-400' : 'text-paper-100'}`}>
                          {e.name}
                        </span>
                        {e.familyTag && (
                          <span className="ml-2 text-[10px] text-noir-400">[{e.familyTag}]</span>
                        )}
                      </div>
                    </div>
                    <div className="font-bold text-amber-400 text-sm">
                      {e.value} pontos
                    </div>
                  </div>
                ))}
              </div>
            )}

            {rankingSubTab === 'familias' && (
              <div className="divide-y divide-noir-800">
                {families.map((fam, idx) => (
                  <div key={fam.id} className="p-3.5 flex items-center justify-between text-xs font-mono hover:bg-noir-850">
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center font-bold text-gold-400">#{idx + 1}</span>
                      <div>
                        <span className="font-serif-vintage font-bold text-sm text-paper-100">{fam.name}</span>
                        <span className="text-[10px] text-noir-400 block font-serif italic">"{fam.motto}"</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gold-400 font-bold">${fam.treasury.toLocaleString('pt-BR')}</div>
                      <div className="text-[10px] text-noir-400">Reputação: {fam.reputation}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
