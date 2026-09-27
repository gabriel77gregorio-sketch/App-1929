import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { 
  Coins, Award, Users, Skull, Clock, Building2, 
  Store, Newspaper, Shield, Crosshair, ArrowRight 
} from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manual de Santa Augusta"
      subtitle="Guia oficial de regras, economia e sobrevivência no submundo de 1929."
      maxWidth="lg"
    >
      <div className="space-y-5 my-2 text-xs">
        {/* 1. Os 4 Atributos */}
        <div>
          <h4 className="font-serif-vintage font-bold text-sm text-gold-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-gold-500" />
            <span>1. Os Quatro Atributos de Poder</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
            <div className="p-2.5 bg-noir-850 rounded border border-noir-700">
              <span className="text-gold-400 font-bold block mb-0.5">💰 DINHEIRO</span>
              <p className="text-[11px] text-noir-300 font-sans">
                Seu oxigênio. Compra estabelecimentos, financia operações de rua e adquire mercadorias no mercado.
              </p>
            </div>
            <div className="p-2.5 bg-noir-850 rounded border border-noir-700">
              <span className="text-amber-400 font-bold block mb-0.5">🏆 RESPEITO</span>
              <p className="text-[11px] text-noir-300 font-sans">
                Sua credibilidade. Destrava negócios refinados, convites de famílias e colaboração de NPCs.
              </p>
            </div>
            <div className="p-2.5 bg-noir-850 rounded border border-noir-700">
              <span className="text-blue-400 font-bold block mb-0.5">🤝 INFLUÊNCIA</span>
              <p className="text-[11px] text-noir-300 font-sans">
                Contatos com juízes, vereadores e comissários. Necessária para articular manobras silenciosas.
              </p>
            </div>
            <div className="p-2.5 bg-noir-850 rounded border border-noir-700">
              <span className="text-red-400 font-bold block mb-0.5">💀 MEDO</span>
              <p className="text-[11px] text-noir-300 font-sans">
                Intimidação. Acelera extorsões e cobranças, mas valores altos atraem batidas policiais severas.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Negócios e Ciclos Automáticos */}
        <div className="pt-3 border-t border-noir-800">
          <h4 className="font-serif-vintage font-bold text-sm text-gold-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-gold-500" />
            <span>2. Estabelecimentos & Renda Contínua</span>
          </h4>
          <div className="p-3 bg-noir-850 rounded border border-noir-700 space-y-1">
            <p className="text-[11px] text-paper-200 leading-relaxed">
              Cada bar, armazém, oficina ou cassino produz receita em ciclos de minutos.
            </p>
            <p className="text-[11px] text-paper-300 leading-relaxed font-mono">
              ★ <strong>Você não precisa ficar online:</strong> o relógio corre no servidor. Feche o navegador e volte quando quiser para coletar os lucros acumulados!
            </p>
          </div>
        </div>

        {/* 3. Operações nas Ruas */}
        <div className="pt-3 border-t border-noir-800">
          <h4 className="font-serif-vintage font-bold text-sm text-gold-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <Crosshair className="w-4 h-4 text-gold-500" />
            <span>3. Operações nas Ruas (Timers Reais)</span>
          </h4>
          <div className="p-3 bg-noir-850 rounded border border-noir-700 space-y-1">
            <p className="text-[11px] text-paper-200 leading-relaxed">
              Envie homens para descarregar contrabando no porto, intimidar cobradores ou interceptar telegramas.
            </p>
            <p className="text-[11px] text-paper-300 leading-relaxed">
              Cada operação possui risco, chance de sucesso e consequências no seu Medo ou Respeito.
            </p>
          </div>
        </div>

        {/* 4. Mercado e Arbitragem */}
        <div className="pt-3 border-t border-noir-800">
          <h4 className="font-serif-vintage font-bold text-sm text-gold-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <Store className="w-4 h-4 text-gold-500" />
            <span>4. Mercado Municipal (Arbitragem)</span>
          </h4>
          <div className="p-3 bg-noir-850 rounded border border-noir-700">
            <p className="text-[11px] text-paper-200 leading-relaxed">
              Compre café arábica, whisky escocês e peças importadas quando o preço estiver baixo e revenda quando os eventos do mundo fizerem a cotação disparar.
            </p>
          </div>
        </div>

        {/* 5. A Gazeta da Capital */}
        <div className="pt-3 border-t border-noir-800">
          <h4 className="font-serif-vintage font-bold text-sm text-gold-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <Newspaper className="w-4 h-4 text-gold-500" />
            <span>5. A Gazeta da Capital</span>
          </h4>
          <div className="p-3 bg-noir-850 rounded border border-noir-700">
            <p className="text-[11px] text-paper-200 leading-relaxed">
              O jornal registra notícias dinâmicas sobre suas façanhas e as disputas de famílias por bairros. Seus grandes passos aparecem nas manchetes!
            </p>
          </div>
        </div>

        <div className="pt-2">
          <Button fullWidth variant="primary" onClick={onClose}>
            Entendido, Voltar ao Jogo
          </Button>
        </div>
      </div>
    </Modal>
  );
};
