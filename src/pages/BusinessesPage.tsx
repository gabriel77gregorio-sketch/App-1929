import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { INITIAL_BUSINESS_TYPES, INITIAL_DISTRICTS } from '../lib/mockData';
import { BusinessType } from '../types/game';
import { 
  Building2, Plus, ArrowUpCircle, CheckCircle, 
  Coins, MapPin, AlertTriangle, Sparkles 
} from 'lucide-react';

export const BusinessesPage: React.FC = () => {
  const { 
    character, businesses, buyBusiness, 
    collectBusinessRevenue, upgradeBusiness 
  } = useGame();

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<BusinessType>(INITIAL_BUSINESS_TYPES[0]);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(INITIAL_DISTRICTS[0].id);
  const [customName, setCustomName] = useState<string>('');

  if (!character) return null;

  const now = Date.now();
  const readyBusinesses = businesses.filter(b => now >= new Date(b.next_collection_at).getTime());

  const handleOpenPurchase = (type?: BusinessType) => {
    if (type) setSelectedType(type);
    setCustomName('');
    setIsPurchaseModalOpen(true);
  };

  const handleConfirmPurchase = () => {
    buyBusiness(selectedType.id, selectedDistrictId, customName);
    setIsPurchaseModalOpen(false);
  };

  const handleCollectAll = () => {
    readyBusinesses.forEach(b => collectBusinessRevenue(b.id));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-6 pb-24">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-noir-800">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gold-400" />
            <h2 className="font-display text-xl font-bold text-paper-100">
              Estabelecimentos & Negócios
            </h2>
          </div>
          <p className="text-xs text-noir-400 mt-0.5">
            A espinha dorsal do seu império. Negócios geram fluxo de caixa em ciclos automáticos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {readyBusinesses.length > 0 && (
            <Button
              size="sm"
              variant="primary"
              onClick={handleCollectAll}
              className="animate-pulse"
            >
              <CheckCircle className="w-3.5 h-3.5 mr-1" />
              Recolher Todos ({readyBusinesses.length})
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleOpenPurchase()}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Adquirir Novo
          </Button>
        </div>
      </div>

      {/* Lista de Negócios Próprios */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-gold-400">
          Seus Estabelecimentos ({businesses.length})
        </h3>

        {businesses.length === 0 ? (
          <div className="bg-noir-900/80 border border-noir-800 rounded-lg p-6 text-center space-y-3">
            <p className="font-serif italic text-paper-300 text-sm">
              Você ainda não possui nenhum negócio em Santa Augusta. Seu dinheiro está ocioso.
            </p>
            <p className="text-xs text-noir-400 max-w-sm mx-auto">
              Adquira um Bar de Esquina ou Armazém para começar a faturar regularmente.
            </p>
            <Button
              variant="primary"
              onClick={() => handleOpenPurchase(INITIAL_BUSINESS_TYPES[0])}
            >
              <Plus className="w-4 h-4 mr-2" />
              Comprar Primeiro Estabelecimento
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {businesses.map((biz) => {
              const btype = biz.type || INITIAL_BUSINESS_TYPES.find(t => t.id === biz.business_type_id);
              const district = biz.district || INITIAL_DISTRICTS.find(d => d.id === biz.district_id);
              const isReady = now >= new Date(biz.next_collection_at).getTime();

              const currentRevenue = btype 
                ? Math.floor(btype.base_revenue * (1 + (biz.level - 1) * 0.45) * (character.style === 'empresario' ? 1.15 : 1)) 
                : 700;

              const upgradeCost = btype ? Math.floor(btype.base_cost * 0.8 * biz.level) : 5000;
              const canAffordUpgrade = character.money >= upgradeCost;

              return (
                <div
                  key={biz.id}
                  className="bg-noir-900 border border-noir-700/80 hover:border-gold-500/30 rounded-lg p-4 transition-all shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif-vintage font-bold text-base text-paper-100">
                          {biz.custom_name}
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-noir-800 text-gold-400 border border-noir-700 font-bold">
                          Nível {biz.level}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-noir-400 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gold-500" />
                          {district?.name || 'Santa Augusta'}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-paper-200">
                          Renda: <strong className="text-gold-400">${currentRevenue.toLocaleString('pt-BR')}</strong> / ciclo
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={!canAffordUpgrade}
                        onClick={() => upgradeBusiness(biz.id)}
                        title={`Evoluir para Nível ${biz.level + 1} por $${upgradeCost.toLocaleString('pt-BR')}`}
                      >
                        <ArrowUpCircle className="w-3.5 h-3.5 mr-1 text-gold-400" />
                        <span>Melhorar (${upgradeCost.toLocaleString('pt-BR')})</span>
                      </Button>
                    </div>
                  </div>

                  {/* Barra de Tempo e Ação de Coleta */}
                  <div className="pt-3 border-t border-noir-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      {isReady ? (
                        <div className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          Receita disponível para recolhimento nos cofres!
                        </div>
                      ) : (
                        <CountdownTimer
                          targetDate={biz.next_collection_at}
                          startDate={biz.last_collected_at}
                        />
                      )}
                    </div>

                    {isReady && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => collectBusinessRevenue(biz.id)}
                      >
                        <Coins className="w-3.5 h-3.5 mr-1" />
                        Recolher Renda (+${currentRevenue.toLocaleString('pt-BR')})
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Catálogo de Estabelecimentos Disponíveis para Compra */}
      <div className="space-y-3 pt-4 border-t border-noir-800">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-gold-400">
            Catálogo de Tipos de Negócio
          </h3>
          <span className="text-[10px] text-noir-400">
            Preços oficiais de alvará
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {INITIAL_BUSINESS_TYPES.map((btype) => {
            let cost = btype.base_cost;
            if (character.style === 'empresario') {
              cost = Math.floor(cost * 0.9);
            }
            const canAfford = character.money >= cost;

            return (
              <div
                key={btype.id}
                className="bg-noir-900/90 border border-noir-700/80 rounded-lg p-3.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-serif-vintage font-bold text-sm text-paper-100">
                      {btype.name}
                    </h4>
                    <span className="font-mono text-xs font-bold text-gold-400">
                      ${cost.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-[11px] text-noir-400 line-clamp-2 mb-2">
                    {btype.description}
                  </p>
                  <div className="text-[10px] font-mono text-paper-300 space-y-0.5 bg-noir-850 p-2 rounded border border-noir-800 mb-3">
                    <div>Renda base: <span className="text-gold-400">${btype.base_revenue}</span> / ciclo</div>
                    <div>Ciclo: {btype.cycle_minutes} minutos</div>
                    <div>Risco policial: {btype.base_risk}%</div>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant={canAfford ? 'primary' : 'secondary'}
                  disabled={!canAfford}
                  onClick={() => handleOpenPurchase(btype)}
                >
                  {canAfford ? 'Adquirir Ponto' : 'Fundos Insuficientes'}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Confirmação de Compra */}
      <Modal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        title={`Adquirir ${selectedType.name}`}
        subtitle="Escolha o endereço e o nome do seu estabelecimento comercial."
        maxWidth="md"
      >
        <div className="space-y-4 my-2">
          <div>
            <label className="block text-xs font-mono uppercase text-gold-400 mb-1">
              Nome do Estabelecimento
            </label>
            <input
              type="text"
              placeholder={`Ex: ${selectedType.name} Aurora`}
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full bg-noir-850 border border-noir-700 rounded px-3 py-2 text-sm text-paper-100 placeholder-noir-500 focus:outline-none focus:border-gold-500"
              maxLength={40}
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gold-400 mb-1">
              Bairro de Localização (Santa Augusta)
            </label>
            <select
              value={selectedDistrictId}
              onChange={(e) => setSelectedDistrictId(e.target.value)}
              className="w-full bg-noir-850 border border-noir-700 rounded px-3 py-2 text-sm text-paper-100 focus:outline-none focus:border-gold-500"
            >
              {INITIAL_DISTRICTS.map((d) => (
                <option key={d.id} value={d.id} className="bg-noir-900 text-paper-100">
                  {d.name} — {d.economic_focus}
                </option>
              ))}
            </select>
          </div>

          {/* Resumo do Investimento */}
          <div className="bg-noir-850 p-3 rounded border border-noir-700 text-xs space-y-1 font-mono">
            <div className="flex justify-between text-noir-400">
              <span>Investimento:</span>
              <span className="text-gold-400 font-bold">
                ${(character.style === 'empresario' ? Math.floor(selectedType.base_cost * 0.9) : selectedType.base_cost).toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex justify-between text-noir-400">
              <span>Renda estimada:</span>
              <span className="text-paper-100">${selectedType.base_revenue} / {selectedType.cycle_minutes} min</span>
            </div>
            {character.style === 'empresario' && (
              <div className="text-[10px] text-emerald-400 pt-1 border-t border-noir-800">
                ★ Bônus de Empresário ativo: 10% de desconto aplicado.
              </div>
            )}
          </div>

          <div className="pt-2 flex gap-2">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => setIsPurchaseModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleConfirmPurchase}
            >
              Confirmar Aquisição
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
