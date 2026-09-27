import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Coins, Award, Users, Crown } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  familyTag?: string;
  value: number;
  isPlayer?: boolean;
}

export const RankingPage: React.FC = () => {
  const { character, families } = useGame();
  const [tab, setTab] = useState<'fortuna' | 'respeito' | 'influencia' | 'familias'>('fortuna');

  if (!character) return null;

  // Mock de ranking comparativo com personagens e NPCs de Santa Augusta
  const fortuneRank: LeaderboardEntry[] = [
    { rank: 1, name: 'Bento de Albuquerque', familyTag: 'ALBUQ', value: 140000 },
    { rank: 2, name: 'Don Vincenzo Moretti', familyTag: 'MORTI', value: 85000 },
    { rank: 3, name: 'Tião "Machado" Ferreira', familyTag: 'FERRA', value: 62000 },
    { rank: 4, name: character.name, familyTag: character.family_name ? 'SUA' : undefined, value: character.money, isPlayer: true },
    { rank: 5, name: 'Comendador Azevedo', familyTag: 'INDEP', value: 34000 },
    { rank: 6, name: 'Manoel das Docas', familyTag: 'FERRA', value: 21000 },
  ].sort((a, b) => b.value - a.value).map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  const respectRank: LeaderboardEntry[] = [
    { rank: 1, name: 'Coronel Bento de Albuquerque', familyTag: 'ALBUQ', value: 92 },
    { rank: 2, name: 'Don Vincenzo Moretti', familyTag: 'MORTI', value: 85 },
    { rank: 3, name: 'Tião "Machado" Ferreira', familyTag: 'FERRA', value: 74 },
    { rank: 4, name: 'Capitão Gervásio', familyTag: 'POLIC', value: 50 },
    { rank: 5, name: character.name, familyTag: character.family_name ? 'SUA' : undefined, value: character.respect, isPlayer: true },
  ].sort((a, b) => b.value - a.value).map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-6 pb-24">
      {/* Cabeçalho */}
      <div className="pb-3 border-b border-noir-800">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-gold-400" />
          <h2 className="font-display text-xl font-bold text-paper-100">
            Círculo de Notáveis de Santa Augusta
          </h2>
        </div>
        <p className="text-xs text-noir-400 mt-0.5">
          Os nomes que exercem hegemonia financeira, política e territorial no Estado.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-noir-800 pb-2">
        <button
          onClick={() => setTab('fortuna')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all ${
            tab === 'fortuna' ? 'bg-gold-500 text-noir-950 font-bold' : 'text-noir-400 hover:text-paper-100'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>Fortuna</span>
        </button>

        <button
          onClick={() => setTab('respeito')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all ${
            tab === 'respeito' ? 'bg-gold-500 text-noir-950 font-bold' : 'text-noir-400 hover:text-paper-100'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Respeito</span>
        </button>

        <button
          onClick={() => setTab('familias')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all ${
            tab === 'familias' ? 'bg-gold-500 text-noir-950 font-bold' : 'text-noir-400 hover:text-paper-100'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Famílias</span>
        </button>
      </div>

      {/* Tabela de Classificação */}
      <div className="bg-noir-900 border border-noir-800 rounded-lg overflow-hidden shadow-xl">
        {tab === 'fortuna' && (
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

        {tab === 'respeito' && (
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

        {tab === 'familias' && (
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
  );
};
