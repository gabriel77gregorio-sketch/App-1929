import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CharacterStyle } from '../types/game';
import { Button } from '../components/common/Button';
import { Briefcase, Crosshair, Anchor, TrendingUp, Check } from 'lucide-react';

interface StyleOption {
  id: CharacterStyle;
  title: string;
  bonus: string;
  description: string;
  icon: React.ElementType;
}

const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'empresario',
    title: 'Empresário',
    bonus: '+15% em receita de negócios e desconto na compra',
    description: 'Você sabe como lavar o dinheiro da noite em balcões respeitáveis e abrir portas no comércio oficial.',
    icon: TrendingUp
  },
  {
    id: 'negociador',
    title: 'Negociador',
    bonus: '+10% em negociações e mais Influência inicial',
    description: 'Palavras afiadas e contatos nos clubes certos resolvem conflitos antes que uma bala precise ser disparada.',
    icon: Briefcase
  },
  {
    id: 'contrabandista',
    title: 'Contrabandista',
    bonus: '+10% em transporte e operações portuárias',
    description: 'Você conhece cada escaler e armazém das docas. Se algo chega do mar sem imposto, passa pelas suas mãos.',
    icon: Anchor
  },
  {
    id: 'executor',
    title: 'Executor',
    bonus: '+12% em intimidações e maior Medo inicial',
    description: 'O silêncio em Santa Augusta é imposto pelo peso da mão. Quem deve, paga; quem vacila, desaparece.',
    icon: Crosshair
  }
];

const ORIGINS = [
  'Lapa & Brás, São Paulo',
  'Cais do Porto de Santos',
  'Lapa & Morros do Rio Antigo',
  'Fazendas do Sul de Minas',
  'Interior Paulista do Café'
];

export const CharacterCreationPage: React.FC = () => {
  const { createCharacter, setScreen } = useGame();

  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [origin, setOrigin] = useState(ORIGINS[0]);
  const [style, setStyle] = useState<CharacterStyle>('empresario');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !nickname.trim()) {
      setError('Informe seu nome e como é conhecido nas ruas.');
      return;
    }
    createCharacter(name.trim(), nickname.trim(), origin, style);
  };

  return (
    <div className="min-h-screen bg-noir-950 px-4 py-8 sm:py-12 flex flex-col items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-radial from-noir-900/60 to-noir-950 pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Cabeçalho */}
        <div className="text-center mb-6">
          <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase font-semibold">
            Passaporte para Santa Augusta
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-paper-100 mt-1">
            Quem é você nas ruas?
          </h2>
          <p className="text-xs text-noir-400 mt-1">
            Todo império começa com uma mala, algumas notas e uma identidade.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-noir-900/90 border border-gold-500/30 rounded-lg p-5 sm:p-7 shadow-2xl backdrop-blur-sm space-y-5">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800/80 rounded text-xs text-red-200">
              {error}
            </div>
          )}

          {/* Nome e Apelido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gold-400 mb-1.5">
                Nome de Registro
              </label>
              <input
                type="text"
                placeholder="Ex: João da Silva"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                className="w-full bg-noir-850 border border-noir-700 rounded px-3 py-2 text-sm text-paper-100 placeholder-noir-500 focus:outline-none focus:border-gold-500 transition-colors"
                maxLength={40}
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gold-400 mb-1.5">
                Alcunha / Apelido
              </label>
              <input
                type="text"
                placeholder="Ex: O Barão"
                value={nickname}
                onChange={(e) => { setNickname(e.target.value); setError(''); }}
                className="w-full bg-noir-850 border border-noir-700 rounded px-3 py-2 text-sm text-paper-100 placeholder-noir-500 focus:outline-none focus:border-gold-500 transition-colors"
                maxLength={25}
              />
            </div>
          </div>

          {/* Origem */}
          <div>
            <label className="block text-xs font-mono uppercase text-gold-400 mb-1.5">
              Cidade / Origem
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-noir-850 border border-noir-700 rounded px-3 py-2 text-sm text-paper-100 focus:outline-none focus:border-gold-500 transition-colors"
            >
              {ORIGINS.map((o) => (
                <option key={o} value={o} className="bg-noir-900 text-paper-100">
                  {o}
                </option>
              ))}
            </select>
          </div>

          {/* Estilo do Personagem */}
          <div>
            <label className="block text-xs font-mono uppercase text-gold-400 mb-2">
              Seu Estilo de Operação
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STYLE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = style === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setStyle(opt.id)}
                    className={`cursor-pointer p-3 rounded border transition-all duration-200 relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-noir-800 border-gold-500 shadow-gold-subtle ring-1 ring-gold-500/40'
                        : 'bg-noir-850/80 border-noir-700 hover:border-noir-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded ${isSelected ? 'bg-gold-500/20 text-gold-400' : 'bg-noir-700 text-noir-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="font-serif-vintage font-bold text-sm text-paper-100">
                          {opt.title}
                        </h4>
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-gold-500 flex items-center justify-center text-noir-950">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] font-mono text-gold-400 mb-1 font-semibold">
                      {opt.bonus}
                    </p>
                    <p className="text-[10px] text-noir-400 leading-tight">
                      {opt.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="pt-3 flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setScreen('landing')}
              className="px-3"
            >
              Voltar
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
            >
              DESEMBARCAR EM SANTA AUGUSTA
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
