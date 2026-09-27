import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { 
  Users, Shield, Crown, MessageSquare, 
  Plus, Check, X, ArrowRight, DollarSign 
} from 'lucide-react';

export const FamilyPage: React.FC = () => {
  const { 
    character, families, proposals, 
    createFamily, joinFamily, respondProposal 
  } = useGame();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [familyName, setFamilyName] = useState('');
  const [familyTag, setFamilyTag] = useState('');
  const [familyMotto, setFamilyMotto] = useState('');

  if (!character) return null;

  const currentFamily = families.find(f => f.id === character.family_id);
  const pendingProposals = proposals.filter(p => p.status === 'pending');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyName.trim() || !familyTag.trim()) return;
    createFamily(familyName.trim(), familyTag.trim(), familyMotto.trim());
    setIsCreateModalOpen(false);
    setFamilyName('');
    setFamilyTag('');
    setFamilyMotto('');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-6 pb-24">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-noir-800">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gold-400" />
            <h2 className="font-display text-xl font-bold text-paper-100">
              Famílias & Facções
            </h2>
          </div>
          <p className="text-xs text-noir-400 mt-0.5">
            Ninguém comanda Santa Augusta sozinho. Alie-se ou erga sua própria dinastia.
          </p>
        </div>

        {!currentFamily && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Fundar Família ($10.000)
          </Button>
        )}
      </div>

      {/* Sua Família / Situação Atual */}
      {currentFamily ? (
        <div className="bg-noir-900 border-2 border-gold-500/40 rounded-lg p-5 shadow-2xl relative">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-500/20 text-gold-400 font-bold border border-gold-500/30">
                  [{currentFamily.tag}]
                </span>
                <h3 className="font-display text-xl font-bold text-paper-100">
                  {currentFamily.name}
                </h3>
              </div>
              <p className="text-xs text-paper-300 font-serif italic mt-1">
                "{currentFamily.motto || 'Poder, honra e lealdade.'}"
              </p>
            </div>

            <div className="flex items-center gap-1 text-gold-400 text-xs font-mono">
              <Crown className="w-4 h-4" />
              <span>{character.family_role === 'lider' ? 'Patrão / Líder' : 'Membro'}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-noir-800 text-center font-mono text-xs">
            <div className="p-2 bg-noir-850 rounded">
              <span className="text-noir-400 block text-[10px]">Tesouraria</span>
              <span className="font-bold text-gold-400">${currentFamily.treasury.toLocaleString('pt-BR')}</span>
            </div>
            <div className="p-2 bg-noir-850 rounded">
              <span className="text-noir-400 block text-[10px]">Reputação</span>
              <span className="font-bold text-paper-100">{currentFamily.reputation} pts</span>
            </div>
            <div className="p-2 bg-noir-850 rounded">
              <span className="text-noir-400 block text-[10px]">Membros</span>
              <span className="font-bold text-paper-100">{currentFamily.member_count || 1}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-noir-900/60 border border-noir-800 rounded-lg p-4 text-center">
          <p className="text-xs text-noir-300 font-serif italic mb-2">
            Você é um operador independente nas ruas. Pode filiar-se a uma das grandes famílias ou acumular capital para erguer sua própria bandeira.
          </p>
        </div>
      )}

      {/* Propostas de Negociação Recebidas (Assíncronas) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-gold-400" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-gold-400">
            Correspondência & Propostas Comerciais ({pendingProposals.length})
          </h3>
        </div>

        {pendingProposals.length === 0 ? (
          <div className="p-4 bg-noir-900/60 rounded border border-noir-800 text-xs text-noir-400 italic">
            Nenhuma proposta comercial pendente de resposta.
          </div>
        ) : (
          <div className="space-y-2.5">
            {pendingProposals.map((prop) => (
              <div
                key={prop.id}
                className="bg-noir-900 border border-gold-500/30 rounded-lg p-4 shadow-lg space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gold-500 font-bold">
                      Proposta de {prop.sender_name}
                    </span>
                    <p className="text-xs text-paper-200 mt-0.5 font-serif italic">
                      "{prop.message}"
                    </p>
                  </div>
                </div>

                <div className="p-2 bg-noir-850 rounded border border-noir-700/80 text-xs font-mono flex items-center justify-between text-paper-200">
                  <div>
                    Oferece: <strong className="text-emerald-400">${prop.offered_money.toLocaleString('pt-BR')}</strong>
                  </div>
                  <div>
                    Exige: <strong className="text-gold-400">{prop.requested_item_qty}x {prop.requested_item_name}</strong>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => respondProposal(prop.id, false)}
                  >
                    <X className="w-3.5 h-3.5 mr-1 text-red-400" />
                    Recusar
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => respondProposal(prop.id, true)}
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Aceitar Proposta
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lista de Famílias em Santa Augusta */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-mono uppercase tracking-wider text-gold-400">
          Grandes Famílias de Santa Augusta
        </h3>

        <div className="space-y-3">
          {families.map((fam) => {
            const isMine = character.family_id === fam.id;

            return (
              <div
                key={fam.id}
                className="bg-noir-900 border border-noir-700/80 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: fam.banner_color }} 
                    />
                    <h4 className="font-serif-vintage font-bold text-base text-paper-100">
                      {fam.name}
                    </h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-noir-800 text-noir-400 border border-noir-700">
                      [{fam.tag}]
                    </span>
                  </div>
                  <p className="text-xs text-noir-400 mt-1 italic font-serif">
                    "{fam.motto}"
                  </p>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-paper-300 mt-2">
                    <span>Líder: {fam.leader_name || 'Desconhecido'}</span>
                    <span>•</span>
                    <span>Reputação: <strong className="text-gold-400">{fam.reputation}</strong></span>
                  </div>
                </div>

                {!character.family_id && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => joinFamily(fam.id)}
                  >
                    Prestar Juramento
                  </Button>
                )}

                {isMine && (
                  <span className="text-xs font-mono text-gold-400 font-bold px-3 py-1 bg-noir-850 rounded border border-gold-500/30">
                    Sua Família
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Criação de Família */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Fundar Nova Família"
        subtitle="Erga seu brasão e reúna aliados para a hegemonia em Santa Augusta."
        maxWidth="sm"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 my-2">
          <div>
            <label className="block text-xs font-mono uppercase text-gold-400 mb-1">
              Nome da Família / Clã
            </label>
            <input
              type="text"
              placeholder="Ex: Clã Silveira"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="w-full bg-noir-850 border border-noir-700 rounded px-3 py-2 text-sm text-paper-100 placeholder-noir-500 focus:outline-none focus:border-gold-500"
              maxLength={40}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gold-400 mb-1">
              Sigla / Tag (até 5 letras)
            </label>
            <input
              type="text"
              placeholder="Ex: SILV"
              value={familyTag}
              onChange={(e) => setFamilyTag(e.target.value.toUpperCase())}
              className="w-full bg-noir-850 border border-noir-700 rounded px-3 py-2 text-sm text-paper-100 placeholder-noir-500 focus:outline-none focus:border-gold-500 uppercase font-mono"
              maxLength={5}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gold-400 mb-1">
              Lema da Família
            </label>
            <input
              type="text"
              placeholder="Ex: A lealdade paga o dobro."
              value={familyMotto}
              onChange={(e) => setFamilyMotto(e.target.value)}
              className="w-full bg-noir-850 border border-noir-700 rounded px-3 py-2 text-sm text-paper-100 placeholder-noir-500 focus:outline-none focus:border-gold-500 italic font-serif"
              maxLength={80}
            />
          </div>

          <div className="bg-noir-850 p-3 rounded border border-noir-700 text-xs font-mono text-noir-400 space-y-1">
            <div className="flex justify-between">
              <span>Custo de Fundação:</span>
              <span className="text-gold-400 font-bold">$10.000</span>
            </div>
            <div className="flex justify-between">
              <span>Seus fundos:</span>
              <span className="text-paper-100">${character.money.toLocaleString('pt-BR')}</span>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <Button
              type="button"
              variant="ghost"
              fullWidth
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={character.money < 10000}
            >
              Oficializar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
