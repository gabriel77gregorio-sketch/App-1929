import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { INITIAL_MARKET_ITEMS } from '../lib/mockData';
import { MarketItem } from '../types/game';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { 
  Store, TrendingUp, TrendingDown, Minus, 
  Package, DollarSign, ArrowRightLeft 
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-6 pb-24">
      {/* Cabeçalho */}
      <div className="pb-3 border-b border-noir-800">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-gold-400" />
          <h2 className="font-display text-xl font-bold text-paper-100">
            Mercado Municipal de Santa Augusta
          </h2>
        </div>
        <p className="text-xs text-noir-400 mt-0.5">
          Comércio de commodities e mercadorias sob oscilação de mercado. Compre na baixa e revenda na alta.
        </p>
      </div>

      {/* Dica de Arbitragem */}
      <div className="bg-noir-900 border border-gold-500/20 rounded-lg p-3.5 flex items-start gap-3">
        <DollarSign className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
        <p className="text-xs text-paper-200 leading-relaxed">
          <strong className="text-gold-400">Regra de Ouro do Comércio:</strong> Fique atento às notícias da Gazeta e eventos nos distritos. Secas encarecem o café; fiscalizações no porto inflam as cotações de bebidas escocesas.
        </p>
      </div>

      {/* Cotações Atuais */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-gold-400">
          Cotações do Pregão
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {INITIAL_MARKET_ITEMS.map((item) => {
            const invRecord = inventory.find(i => i.item_id === item.id);
            const inStock = invRecord ? invRecord.quantity : 0;
            const avgCost = invRecord ? invRecord.average_cost : 0;
            const profitPerUnit = inStock > 0 ? item.current_price - avgCost : 0;

            return (
              <div
                key={item.id}
                className="bg-noir-900 border border-noir-700/80 hover:border-gold-500/30 rounded-lg p-4 transition-all shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif-vintage font-bold text-base text-paper-100">
                      {item.name}
                    </h4>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-noir-800 text-noir-300 border border-noir-700">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-xs text-noir-400 mt-0.5 line-clamp-1">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs font-mono mt-2 text-paper-300">
                    <span className="flex items-center gap-1">
                      Cotação: <strong className="text-gold-400 font-bold">${item.current_price}</strong> / {item.unit}
                      {item.price_trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-400 inline" />}
                      {item.price_trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-red-400 inline" />}
                    </span>
                    <span>•</span>
                    <span>No seu armazém: <strong className="text-paper-100">{inStock} {item.unit}(s)</strong></span>
                  </div>

                  {inStock > 0 && (
                    <div className="text-[11px] font-mono mt-1 text-noir-400">
                      Custo médio: ${avgCost} | Margem: <span className={profitPerUnit >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {profitPerUnit >= 0 ? `+$${profitPerUnit}` : `-$${Math.abs(profitPerUnit)}`} por un.
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openTrade(item, 'buy')}
                  >
                    Comprar
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={inStock <= 0}
                    onClick={() => openTrade(item, 'sell')}
                  >
                    Vender
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Negociação de Compra / Venda */}
      {tradeModalItem && (
        <Modal
          isOpen={true}
          onClose={() => setTradeModalItem(null)}
          title={`${tradeMode === 'buy' ? 'Comprar' : 'Vender'} ${tradeModalItem.name}`}
          subtitle={`Preço atual: $${tradeModalItem.current_price} por ${tradeModalItem.unit}`}
          maxWidth="sm"
        >
          <div className="space-y-4 my-2">
            <div>
              <label className="block text-xs font-mono uppercase text-gold-400 mb-1.5">
                Quantidade em {tradeModalItem.unit}(s)
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTradeQuantity(Math.max(1, tradeQuantity - 1))}
                  className="w-10 h-10 bg-noir-850 border border-noir-700 rounded text-paper-100 text-lg hover:border-gold-500 font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={tradeMode === 'buy' ? Math.max(1, maxAffordable) : ownedQty}
                  value={tradeQuantity}
                  onChange={(e) => setTradeQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 bg-noir-850 border border-noir-700 rounded px-3 py-2 text-center text-sm font-mono text-paper-100 focus:outline-none focus:border-gold-500"
                />
                <button
                  onClick={() => setTradeQuantity(tradeQuantity + 1)}
                  className="w-10 h-10 bg-noir-850 border border-noir-700 rounded text-paper-100 text-lg hover:border-gold-500 font-bold"
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
                    className="flex-1 py-1 rounded bg-noir-800 text-[11px] font-mono text-paper-200 border border-noir-700 hover:border-gold-500"
                  >
                    +{q}
                  </button>
                ))}
                {tradeMode === 'sell' && (
                  <button
                    type="button"
                    onClick={() => setTradeQuantity(ownedQty)}
                    className="flex-1 py-1 rounded bg-noir-800 text-[11px] font-mono text-gold-400 border border-noir-700 hover:border-gold-500 font-bold"
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
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                fullWidth
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
