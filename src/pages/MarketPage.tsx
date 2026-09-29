import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { INITIAL_MARKET_ITEMS } from '../lib/mockData';
import { MarketItem } from '../types/game';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { GameImage } from '../components/common/GameImage';
import { 
  Store, TrendingUp, TrendingDown, 
  Package, DollarSign, ShoppingCart, ArrowDownRight, ArrowUpRight
} from 'lucide-react';

export const MarketPage: React.FC = () => {
  const { character, inventory, buyMarketItem, sellMarketItem } = useGame();

  const [tradeModalItem, setTradeModalItem] = useState<MarketItem | null>(null);
  const [tradeMode, setTradeMode] = useState<'buy' | 'sell'>('buy');
  const [tradeQuantity, setTradeQuantity] = useState<number>(1);

  if (!character) return null;

  const openTrade = (item: MarketItem, mode: 'buy' | 'sell') => {
    setTradeModalItem(item);
    setTradeMode(mode);
    setTradeQuantity(1);
  };

  const handleConfirmTrade = () => {
    if (!tradeModalItem) return;
    if (tradeMode === 'buy') {
      buyMarketItem(tradeModalItem.id, tradeQuantity);
    } else {
      sellMarketItem(tradeModalItem.id, tradeQuantity);
    }
    setTradeModalItem(null);
  };

  const currentInvItem = tradeModalItem 
    ? inventory.find(i => i.item_id === tradeModalItem.id) 
    : null;

  const ownedQty = currentInvItem ? currentInvItem.quantity : 0;
  const maxAffordable = tradeModalItem 
    ? Math.floor(character.money / tradeModalItem.current_price) 
    : 0;

  const getItemTheme = (slug: string): 'gold' | 'emerald' | 'crimson' | 'purple' | 'blue' => {
    switch (slug) {
      case 'cafe_arabica': return 'gold';
      case 'whisky_escoces': return 'emerald';
      case 'pecas_ford': return 'blue';
      case 'linho_ingles': return 'purple';
      case 'dossie_confidencial': return 'crimson';
      default: return 'gold';
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-5 pb-24">
      {/* Cabeçalho */}
      <div className="pb-3 border-b border-noir-800">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-gold-400 shrink-0" />
          <h2 className="font-display text-xl font-bold text-paper-100">
            Mercado Municipal de Santa Augusta
          </h2>
        </div>
        <p className="text-xs text-noir-400 mt-0.5">
          Comércio de commodities e cargas sob oscilação do mercado. Compre na baixa e revenda na alta.
        </p>
      </div>

      {/* Dica de Arbitragem com visual contrastante */}
      <div className="bg-gradient-to-r from-amber-950/40 via-noir-900 to-noir-900 border border-amber-500/30 rounded-lg p-3 sm:p-3.5 flex items-start gap-3">
        <DollarSign className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-paper-200 leading-relaxed font-serif">
          <strong className="text-amber-400 font-sans uppercase font-bold">Regra de Ouro:</strong> Fique atento às notícias da Gazeta. Secas valorizam o café; fiscalizações nas docas disparam os preços do whisky importado.
        </p>
      </div>

      {/* Cotações Atuais */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-gold-400">
            Cotações do Pregão
          </h3>
          <span className="text-[10px] font-mono text-noir-400">
            Fundos: <strong className="text-paper-100">${character.money.toLocaleString('pt-BR')}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {INITIAL_MARKET_ITEMS.map((item) => {
            const invRecord = inventory.find(i => i.item_id === item.id);
            const inStock = invRecord ? invRecord.quantity : 0;
            const avgCost = invRecord ? invRecord.average_cost : 0;
            const profitPerUnit = inStock > 0 ? item.current_price - avgCost : 0;
            const theme = getItemTheme(item.slug);

            return (
              <div
                key={item.id}
                className="bg-noir-900 border border-noir-750 hover:border-gold-500/40 rounded-lg p-3 sm:p-3.5 transition-all shadow-xl flex flex-col gap-3"
              >
                {/* Linha superior: Thumbnail Ilustrado + Informações */}
                <div className="flex items-center gap-3">
                  {/* Thumbnail com GameImage e tema individual */}
                  <div className="w-18 h-18 sm:w-20 sm:h-20 shrink-0 rounded-md overflow-hidden border border-noir-700">
                    <GameImage
                      src={item.illustration}
                      alt={item.name}
                      theme={theme}
                      iconType={item.slug.includes('cafe') ? 'coffee' : item.slug.includes('whisky') ? 'wine' : item.slug.includes('pecas') ? 'tool' : item.slug.includes('dossie') ? 'document' : 'package'}
                      aspect="w-full h-full"
                    />
                  </div>

                  {/* Detalhes do Item */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-serif-vintage font-bold text-sm sm:text-base text-paper-100 truncate">
                        {item.name}
                      </h4>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-noir-800 text-noir-300 border border-noir-700 shrink-0">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-[11px] text-noir-400 mt-0.5 line-clamp-1 font-serif italic">
                      {item.description}
                    </p>

                    {/* Preço e Estoque com pills de destaque */}
                    <div className="flex items-center gap-2 text-xs font-mono mt-1.5 text-paper-300 flex-wrap">
                      <span className="flex items-center gap-1 bg-noir-850 px-2 py-0.5 rounded border border-noir-700">
                        Preço: <strong className="text-gold-400 font-bold">${item.current_price}</strong>/{item.unit}
                        {item.price_trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-400 inline" />}
                        {item.price_trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-red-400 inline" />}
                      </span>
                      <span className="text-[11px] bg-noir-850 px-2 py-0.5 rounded border border-noir-700">
                        No armazém: <strong className={inStock > 0 ? 'text-gold-400' : 'text-noir-400'}>{inStock}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Linha inferior: Rentabilidade + Botões Semânticos (COMPRAR EM VERDE, VENDER EM ÂMBAR) */}
                <div className="pt-2 border-t border-noir-800/80 flex items-center justify-between gap-2">
                  <div className="text-[11px] font-mono text-noir-400">
                    {inStock > 0 ? (
                      <span>
                        Custo médio: ${avgCost} | Margem:{' '}
                        <strong className={profitPerUnit >= 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                          {profitPerUnit >= 0 ? `+$${profitPerUnit}` : `-$${Math.abs(profitPerUnit)}`}
                        </strong>
                      </span>
                    ) : (
                      <span className="italic text-noir-500">Sem estoque no armazém</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Botão Comprar (Teal/Emerald - Visualmente Claro) */}
                    <Button
                      size="sm"
                      variant="buy"
                      className="text-xs py-1 px-3.5 h-auto min-h-[36px]"
                      onClick={() => openTrade(item, 'buy')}
                    >
                      <ArrowDownRight className="w-3.5 h-3.5 mr-1 text-emerald-200" />
                      Comprar
                    </Button>

                    {/* Botão Vender (Âmbar/Laranja - Visualmente Distinto) */}
                    <Button
                      size="sm"
                      variant="sell"
                      className="text-xs py-1 px-3.5 h-auto min-h-[36px]"
                      disabled={inStock <= 0}
                      onClick={() => openTrade(item, 'sell')}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 mr-1 text-amber-200" />
                      Vender
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Negociação de Compra / Venda com Botão Semântico */}
      {tradeModalItem && (
        <Modal
          isOpen={true}
          onClose={() => setTradeModalItem(null)}
          title={`${tradeMode === 'buy' ? 'Comprar' : 'Vender'} ${tradeModalItem.name}`}
          subtitle={`Preço oficial: $${tradeModalItem.current_price} por ${tradeModalItem.unit}`}
          maxWidth="sm"
        >
          <div className="space-y-4 my-1">
            {/* Banner ilustrado do item no topo do modal com GameImage */}
            <div className="relative w-full h-24 rounded-lg overflow-hidden border border-noir-700 bg-noir-950">
              <GameImage
                src={tradeModalItem.illustration}
                alt={tradeModalItem.name}
                theme={getItemTheme(tradeModalItem.slug)}
                iconType={tradeModalItem.slug.includes('cafe') ? 'coffee' : tradeModalItem.slug.includes('whisky') ? 'wine' : tradeModalItem.slug.includes('pecas') ? 'tool' : tradeModalItem.slug.includes('dossie') ? 'document' : 'package'}
                aspect="w-full h-full"
              />
              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-xs font-mono z-10">
                <span className="px-2 py-0.5 rounded bg-noir-950/90 text-gold-400 border border-gold-500/40 text-[10px] uppercase font-bold">
                  {tradeModalItem.category}
                </span>
                <span className="bg-noir-950/90 px-2 py-0.5 rounded text-paper-100 border border-noir-700 text-[10px] font-bold">
                  ${tradeModalItem.current_price} / {tradeModalItem.unit}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gold-400 mb-1.5">
                Quantidade em {tradeModalItem.unit}(s)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTradeQuantity(Math.max(1, tradeQuantity - 1))}
                  className="w-11 h-11 bg-noir-850 border border-noir-700 rounded text-paper-100 text-lg hover:border-gold-500 font-bold active:bg-noir-800 transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={tradeMode === 'buy' ? Math.max(1, maxAffordable) : ownedQty}
                  value={tradeQuantity}
                  onChange={(e) => setTradeQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 bg-noir-850 border border-noir-700 rounded px-3 py-2 text-center text-sm font-mono text-paper-100 focus:outline-none focus:border-gold-500 h-11"
                />
                <button
                  type="button"
                  onClick={() => setTradeQuantity(tradeQuantity + 1)}
                  className="w-11 h-11 bg-noir-850 border border-noir-700 rounded text-paper-100 text-lg hover:border-gold-500 font-bold active:bg-noir-800 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Botões rápidos de atalho */}
              <div className="flex gap-1.5 mt-2">
                {[1, 5, 10].map(q => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setTradeQuantity(q)}
                    className="flex-1 py-1.5 rounded bg-noir-800 text-[11px] font-mono text-paper-200 border border-noir-700 hover:border-gold-500 active:bg-gold-500 active:text-noir-950 transition-colors"
                  >
                    +{q}
                  </button>
                ))}
                {tradeMode === 'sell' && (
                  <button
                    type="button"
                    onClick={() => setTradeQuantity(ownedQty)}
                    className="flex-1 py-1.5 rounded bg-amber-950/80 text-[11px] font-mono text-amber-300 border border-amber-600 hover:border-amber-400 font-bold active:bg-amber-600 transition-colors"
                  >
                    Tudo ({ownedQty})
                  </button>
                )}
              </div>
            </div>

            {/* Resumo Financeiro */}
            <div className="bg-noir-850 p-3 rounded border border-noir-700 text-xs font-mono space-y-1">
              <div className="flex justify-between text-noir-400">
                <span>Total da Operação:</span>
                <span className="text-gold-400 font-bold text-sm">
                  ${(tradeModalItem.current_price * tradeQuantity).toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between text-noir-400">
                <span>Seus fundos atuais:</span>
                <span className="text-paper-100">${character.money.toLocaleString('pt-BR')}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <Button
                variant="ghost"
                fullWidth
                onClick={() => setTradeModalItem(null)}
                className="min-h-[42px]"
              >
                Cancelar
              </Button>
              <Button
                variant={tradeMode === 'buy' ? 'buy' : 'sell'}
                fullWidth
                className="min-h-[42px]"
                disabled={tradeMode === 'buy' ? character.money < (tradeModalItem.current_price * tradeQuantity) : tradeQuantity > ownedQty}
                onClick={handleConfirmTrade}
              >
                {tradeMode === 'buy' ? 'Confirmar Compra' : 'Confirmar Venda'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
