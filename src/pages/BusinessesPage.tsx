import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { GameImage } from '../components/common/GameImage';
import { INITIAL_BUSINESS_TYPES, INITIAL_DISTRICTS } from '../lib/mockData';
import { BusinessType } from '../types/game';
import { 
  Building2, Plus, ArrowUpCircle, CheckCircle2, 
  Coins, MapPin, Sparkles, TrendingUp, ShieldAlert, Store
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
            <Building2 className="w-5 h-5 text-gold-400 shrink-0" />
            <h2 className="font-display text-xl font-bold text-paper-100">
              Estabelecimentos &amp; Negócios
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
              variant="success"
              onClick={handleCollectAll}
              className="animate-pulse text-xs py-1.5 px-3 min-h-[38px]"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Recolher Todos ({readyBusinesses.length})
            </Button>
          )}

          <Button
            size="sm"
            variant="primary"
            onClick={() => handleOpenPurchase()}
            className="text-xs py-1.5 px-3 min-h-[38px]"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Adquirir Novo
          </Button>
        </div>
      </div>

      {/* Lista de Negócios Próprios */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-gold-400">
            Seus Estabelecimentos ({businesses.length})
          </h3>
          <span className="text-[10px] font-mono text-noir-400">
            {readyBusinesses.length} pronto(s) para recolher
          </span>
        </div>

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
              className="min-h-[42px]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Comprar Primeiro Estabelecimento
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
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
                  className={`rounded-lg p-3.5 sm:p-4 transition-all shadow-xl space-y-3 border-2 ${
                    isReady
                      ? 'bg-gradient-to-b from-emerald-950/20 via-noir-900 to-noir-900 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/40'
                      : 'bg-noir-900 border-noir-750 hover:border-gold-500/30'
                  }`}
                >
                  {/* Linha Principal: Thumbnail Ilustrado + Título + Evolução */}
                  <div className="flex items-start gap-3">
                    {/* Imagem do Estabelecimento com tema visual */}
                    <div className="w-18 h-18 sm:w-20 sm:h-20 shrink-0 rounded-md overflow-hidden border border-noir-700 relative">
                      <GameImage
                        src={btype?.illustration}
                        alt={biz.custom_name}
                        iconType={btype?.slug}
                        theme={isReady ? 'emerald' : 'gold'}
                        aspect="w-full h-full"
                      />
                      <div className="absolute bottom-1 left-1 z-10">
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-noir-950/90 text-gold-400 border border-gold-500/40 font-bold shadow">
                          Nv.{biz.level}
                        </span>
                      </div>
                    </div>

                    {/* Informações de Nome, Bairro e Renda */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-serif-vintage font-bold text-sm sm:text-base text-paper-100 truncate">
                          {biz.custom_name}
                        </h4>
                        {isReady ? (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500 font-bold animate-pulse shrink-0">
                            Pronto
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-noir-800 text-noir-400 border border-noir-700 shrink-0">
                            Produzindo
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-noir-400 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gold-500 shrink-0" />
                          <span className="truncate">{district?.name || 'Santa Augusta'}</span>
                        </span>
                        <span>•</span>
                        <span className="font-mono text-paper-200 text-[11px]">
                          Renda: <strong className="text-emerald-400 font-bold">+${currentRevenue.toLocaleString('pt-BR')}</strong>
                        </span>
                      </div>

                      {/* Botão de Upgrade Púrpura (Visualmente inconfundível) */}
                      <div className="mt-2.5">
                        <Button
                          size="sm"
                          variant="upgrade"
                          disabled={!canAffordUpgrade}
                          onClick={() => upgradeBusiness(biz.id)}
                          className="text-[11px] py-1 px-3 h-auto min-h-[32px]"
                          title={`Evoluir para Nível ${biz.level + 1} por $${upgradeCost.toLocaleString('pt-BR')}`}
                        >
                          <ArrowUpCircle className="w-3.5 h-3.5 mr-1 text-purple-200" />
                          <span>Evoluir Nv.{biz.level + 1} (${upgradeCost.toLocaleString('pt-BR')})</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Barra de Tempo e Ação de Coleta (Mobile First) */}
                  <div className="pt-2.5 border-t border-noir-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex-1">
                      {isReady ? (
                        <div className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
                          <span>Receita nos cofres pronta para recolhimento!</span>
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
                        variant="success"
                        onClick={() => collectBusinessRevenue(biz.id)}
                        className="w-full sm:w-auto min-h-[40px] text-xs font-bold"
                      >
                        <Coins className="w-4 h-4 mr-1.5" />
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
            Catálogo de Negócios Disponíveis
          </h3>
          <span className="text-[10px] text-noir-400 font-mono">
            Licenças Municipais
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {INITIAL_BUSINESS_TYPES.map((btype) => {
            let cost = btype.base_cost;
            if (character.style === 'empresario') {
              cost = Math.floor(cost * 0.9);
            }
            const canAfford = character.money >= cost;

            return (
              <div
                key={btype.id}
                className="bg-noir-900 border border-noir-700 rounded-lg overflow-hidden flex flex-col justify-between shadow-lg hover:border-gold-500/40 transition-colors"
              >
                {/* Banner ilustrado do tipo de negócio com GameImage */}
                <div className="relative w-full h-28 sm:h-32 bg-noir-950 overflow-hidden">
                  <GameImage
                    src={btype.illustration}
                    alt={btype.name}
                    iconType={btype.slug}
                    theme="gold"
                    aspect="w-full h-full"
                    overlayText={btype.name}
                  />
                  
                  {/* Nome e Preço sobre o banner */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between z-10">
                    <h4 className="font-serif-vintage font-bold text-sm text-paper-100 drop-shadow-md">
                      {btype.name}
                    </h4>
                    <span className="font-mono text-xs font-bold text-gold-400 bg-noir-950/90 px-2 py-0.5 rounded border border-gold-500/40 shadow">
                      ${cost.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5">
                  <p className="text-[11px] text-noir-400 line-clamp-2 font-serif italic">
                    {btype.description}
                  </p>

                  <div className="text-[10px] font-mono text-paper-300 space-y-1 bg-noir-850 p-2 rounded border border-noir-800">
                    <div className="flex justify-between">
                      <span className="text-noir-400">Renda por ciclo:</span>
                      <strong className="text-emerald-400">+${btype.base_revenue}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-noir-400">Tempo de produção:</span>
                      <span>{btype.cycle_minutes} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-noir-400">Risco policial:</span>
                      <span className="text-red-400">{btype.base_risk}%</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={canAfford ? 'primary' : 'secondary'}
                    disabled={!canAfford}
                    onClick={() => handleOpenPurchase(btype)}
                    className="w-full min-h-[38px] text-xs font-semibold"
                  >
                    {canAfford ? 'Adquirir Ponto' : 'Fundos Insuficientes'}
                  </Button>
                </div>
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
        <div className="space-y-4 my-1">
          {/* Banner ilustrado do tipo de negócio selecionado */}
          <div className="relative w-full h-24 rounded-lg overflow-hidden border border-noir-700 bg-noir-950">
            <GameImage
              src={selectedType.illustration}
              alt={selectedType.name}
              iconType={selectedType.slug}
              theme="gold"
              aspect="w-full h-full"
            />
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs font-mono z-10">
              <span className="text-paper-100 font-serif-vintage font-bold">
                {selectedType.name}
              </span>
              <span className="text-emerald-400 font-bold bg-noir-950/90 px-2 py-0.5 rounded border border-emerald-500/40">
                Renda: +${selectedType.base_revenue} / {selectedType.cycle_minutes}m
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gold-400 mb-1">
              Nome do Estabelecimento
            </label>
            <input
              type="text"
              placeholder={`Ex: ${selectedType.name} Aurora`}
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full bg-noir-850 border border-noir-700 rounded px-3 py-2 text-sm text-paper-100 placeholder-noir-500 focus:outline-none focus:border-gold-500 h-11"
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
              className="w-full bg-noir-850 border border-noir-700 rounded px-3 py-2 text-sm text-paper-100 focus:outline-none focus:border-gold-500 h-11"
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
              <span className="text-gold-400 font-bold text-sm">
                ${(character.style === 'empresario' ? Math.floor(selectedType.base_cost * 0.9) : selectedType.base_cost).toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex justify-between text-noir-400">
              <span>Renda estimada:</span>
              <span className="text-emerald-400 font-bold">+${selectedType.base_revenue} / {selectedType.cycle_minutes} min</span>
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
              className="min-h-[42px]"
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleConfirmPurchase}
              className="min-h-[42px]"
            >
              Confirmar Aquisição
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
