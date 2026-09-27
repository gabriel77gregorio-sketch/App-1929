import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/common/Button';
import { storageService } from '../services/storageService';
import { 
  ShieldAlert, Settings, RefreshCw, PlusCircle, 
  BarChart3, Database, CheckCircle2 
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { character, resetGameData, notify } = useGame();
  const [balanceMultiplier, setBalanceMultiplier] = useState(1.0);
  const [testMoneyToAdd, setTestMoneyToAdd] = useState(10000);

  if (!character) return null;

  const handleAddFunds = () => {
    const updated = {
      ...character,
      money: character.money + testMoneyToAdd,
      respect: character.respect + 10,
      influence: character.influence + 10
    };
    storageService.saveCharacter(updated);
    window.location.reload();
  };

  const handleResetData = () => {
    if (window.confirm('Tem certeza de que deseja apagar todos os dados e reiniciar o jogo?')) {
      resetGameData();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-6 pb-24">
      {/* Cabeçalho */}
      <div className="pb-3 border-b border-noir-800">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          <h2 className="font-display text-xl font-bold text-paper-100">
            Painel Administrativo & Balanceamento
          </h2>
        </div>
        <p className="text-xs text-noir-400 mt-0.5">
          Controle operacional de economia, telemetria e calibração de dados do MVP.
        </p>
      </div>

      {/* Métricas do MVP (Telemetria) */}
      <div className="bg-noir-900 border border-noir-800 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-gold-400">
          <BarChart3 className="w-4 h-4" />
          <span>Métricas do Produto (Analytics)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-xs">
          <div className="p-3 bg-noir-850 rounded border border-noir-800">
            <span className="text-[10px] text-noir-400 block">Status Servidor</span>
            <span className="font-bold text-emerald-400">100% Online</span>
          </div>
          <div className="p-3 bg-noir-850 rounded border border-noir-800">
            <span className="text-[10px] text-noir-400 block">Modo de Persistência</span>
            <span className="font-bold text-paper-100">Ativo / Local</span>
          </div>
          <div className="p-3 bg-noir-850 rounded border border-noir-800">
            <span className="text-[10px] text-noir-400 block">Retenção D1</span>
            <span className="font-bold text-gold-400">Streak: Dia {character.daily_streak}</span>
          </div>
          <div className="p-3 bg-noir-850 rounded border border-noir-800">
            <span className="text-[10px] text-noir-400 block">PWA Cache</span>
            <span className="font-bold text-blue-400">Ativado (v1)</span>
          </div>
        </div>
      </div>

      {/* Ferramentas de Teste e Calibração Rápida */}
      <div className="bg-noir-900 border border-gold-500/30 rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-gold-400">
          <Settings className="w-4 h-4" />
          <span>Ajustes Rápidos para Validação</span>
        </div>

        <div className="space-y-3 text-xs font-mono">
          <div className="p-3 bg-noir-850 rounded border border-noir-800 flex items-center justify-between">
            <div>
              <span className="text-paper-100 font-bold block">Adicionar Fundos de Teste</span>
              <span className="text-noir-400 text-[11px]">Deposita +$10.000 e +10 Respeito/Influência para testar compras</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddFunds}
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1" />
              Injetar Fundos
            </Button>
          </div>

          <div className="p-3 bg-noir-850 rounded border border-noir-800 flex items-center justify-between">
            <div>
              <span className="text-paper-100 font-bold block">Reiniciar Dados do Jogo (Reset)</span>
              <span className="text-noir-400 text-[11px]">Limpa o storage e recria o personagem a partir do zero</span>
            </div>
            <Button
              size="sm"
              variant="danger"
              onClick={handleResetData}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Reset Total
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
