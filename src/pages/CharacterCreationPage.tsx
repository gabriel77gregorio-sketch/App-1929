import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CharacterStyle } from '../types/game';
import { Button } from '../components/common/Button';
import { INITIAL_DISTRICTS } from '../lib/mockData';
import { 
  Briefcase, Crosshair, Anchor, TrendingUp, Check, 
  Coins, Award, Users, Skull, Clock, Building2, 
  Newspaper, ArrowRight, ArrowLeft, Sparkles, MapPin, 
  Coffee, HelpCircle, Shield, FileText, CheckCircle2, 
  AlertTriangle, Flame, Landmark, Ship, Train, Wine, 
  Wrench, Trees, Store, DollarSign, Package, Feather
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StyleOption {
  id: CharacterStyle;
  title: string;
  bonus: string;
  description: string;
  icon: React.ElementType;
  image: string;
}

const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'empresario',
    title: 'Empresário',
    bonus: '+15% de receita contínua e 10% de desconto em novos alvarás',
    description: 'Você sabe como lavar o dinheiro da noite em balcões respeitáveis e abrir portas no comércio oficial.',
    icon: TrendingUp,
    image: '/images/characters/empresario.jpg'
  },
  {
    id: 'negociador',
    title: 'Negociador',
    bonus: '+10% em negociações e maior reserva de Influência política',
    description: 'Palavras afiadas e contatos nos clubes certos resolvem conflitos antes que uma bala precise ser disparada.',
    icon: Briefcase,
    image: '/images/characters/negociador.jpg'
  },
  {
    id: 'contrabandista',
    title: 'Contrabandista',
    bonus: '+10% em transporte e sucesso ampliado nas docas',
    description: 'Você conhece cada escaler e armazém do cais. Se algo chega do mar sem manifesto, passa pelas suas mãos.',
    icon: Anchor,
    image: '/images/characters/contrabandista.jpg'
  },
  {
    id: 'executor',
    title: 'Executor',
    bonus: '+12% em intimidações e maior índice de Medo nas ruas',
    description: 'O silêncio em Santa Augusta é imposto pelo peso da mão. Quem deve, paga; quem vacila, desaparece.',
    icon: Crosshair,
    image: '/images/characters/executor.jpg'
  }
];

const ORIGINS = [
  {
    name: 'Lapa & Brás, São Paulo',
    lore: 'Criado entre o vapor das fábricas de tecido e oficinas mecânicas. Aprendeu cedo que máquinas quebram e grevistas precisam de armas.',
    bonus: 'Bônus: Familiaridade com oficinas mecânicas e desmanches.'
  },
  {
    name: 'Cais do Porto de Santos',
    lore: 'Cresceu ouvindo o chiar das caldeiras e a conversa ríspida dos estivadores. Conhece as rotas que os fiscais da alfândega fingem não ver.',
    bonus: 'Bônus: Facilidade com cargas marítimas e fretes noturnos.'
  },
  {
    name: 'Lapa & Morros do Rio Antigo',
    lore: 'Formado na malandragem dos cabarés e do choro dolente. Sabe exatamente quando elogiar um delegado e quando sumir na neblina.',
    bonus: 'Bônus: Lábia refinada e conexões no Distrito Boêmio.'
  },
  {
    name: 'Fazendas do Sul de Minas',
    lore: 'Homem do interior acostumado ao cheiro de café torrado e à palavra dos coronéis. Sabe que respeito e terras caminham de mãos dadas.',
    bonus: 'Bônus: Contatos valiosos com produtores de café do interior.'
  },
  {
    name: 'Interior Paulista do Café',
    lore: 'Viu cafezais quebrarem da noite para o dia. Fugiu para a metrópole jurando que nunca mais trabalharia sob o sol quente para enriquecer terceiros.',
    bonus: 'Bônus: Visão aguçada para oscilações de preço do café.'
  }
];

const PAGE_TITLES: Record<number, string> = {
  1: '1. O Desembarque em 1929',
  2: '2. As Regras de Ouro',
  3: '3. Nome & Alcunha',
  4: '4. Sua Bagagem & Origem',
  5: '5. A Carta de Chegada',
  6: '6. Primeiro Dilema na Estação',
  7: '7. O 1º Pilar: Dinheiro',
  8: '8. O 2º Pilar: Respeito',
  9: '9. O 3º Pilar: Influência',
  10: '10. O 4º Pilar: Medo',
  11: '11. Seu Estilo de Comando',
  12: '12. A Planta Urbana dos 6 Bairros',
  13: '13. Como Rendem os Negócios',
  14: '14. A Escolha do Distrito',
  15: '15. O Batismo da Fachada',
  16: '16. Ações & Operações de Rua',
  17: '17. Simulação Prática de Ação',
  18: '18. A Bolsa & O Mercado de Café',
  19: '19. A Gazeta da Capital',
  20: '20. O Mundo Offline & Retorno',
  21: '21. Juramento & Entrada na Cidade'
};

export const CharacterCreationPage: React.FC = () => {
  const { createCharacterWithFirstBusiness, setScreen } = useGame();

  // Etapa atual do onboarding: 1 a 21
  const [step, setStep] = useState<number>(1);

  // Dados do personagem
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [originIndex, setOriginIndex] = useState(0);
  const [style, setStyle] = useState<CharacterStyle>('empresario');

  // Primeiro negócio
  const [firstBizName, setFirstBizName] = useState('');
  const [firstDistrictId, setFirstDistrictId] = useState(INITIAL_DISTRICTS[0].id);

  // Decisão narrativa do passo 6
  const [stationChoice, setStationChoice] = useState<'suborno' | 'labia' | 'frieza' | null>(null);

  // Simulação da ação do passo 17
  const [simState, setSimState] = useState<'idle' | 'running' | 'done'>('idle');

  const [error, setError] = useState('');

  const currentOrigin = ORIGINS[originIndex] || ORIGINS[0];
  const selectedDistrict = INITIAL_DISTRICTS.find(d => d.id === firstDistrictId) || INITIAL_DISTRICTS[0];

  const displayName = name.trim() || 'Viajante Sem Nome';
  const displayNickname = nickname.trim() || 'O Forasteiro';
  const displayBizName = firstBizName.trim() || `Bar ${displayNickname}`;

  const nextStep = () => {
    // Validação na página 3 (Identidade)
    if (step === 3) {
      if (!name.trim() || !nickname.trim()) {
        setError('Por favor, informe seu nome de batismo e a sua alcunha das ruas.');
        return;
      }
      setError('');
    }
    setError('');
    setStep(prev => Math.min(21, prev + 1));
  };

  const prevStep = () => {
    setError('');
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSkipToReview = () => {
    if (!name.trim()) setName('Antônio Fagundes');
    if (!nickname.trim()) setNickname('O Barão');
    setStep(21);
  };

  const handleFinishOnboarding = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#c5a059', '#e5cd93', '#f4ede0', '#10b981']
      });
    } catch {
      // Confetti opcional
    }

    createCharacterWithFirstBusiness(
      displayName,
      displayNickname,
      currentOrigin.name,
      style,
      displayBizName,
      firstDistrictId
    );
  };

  // Páginas com estética Full Screen imersiva
  const isFullScreen = [1, 5, 12, 19, 21].includes(step);

  return (
    <div className="min-h-screen bg-noir-950 px-3 py-4 sm:px-6 sm:py-8 flex flex-col items-center justify-between relative select-none">
      {/* Luzes e texturas de fundo */}
      <div className="absolute inset-0 bg-gradient-radial from-noir-900/70 via-noir-950 to-noir-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#c5a0590a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* =========================================================================
          BARRA SUPERIOR DE PROGRESSO (1 A 21)
         ========================================================================= */}
      <header className="relative z-20 w-full max-w-4xl mb-4 sm:mb-6">
        <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-noir-400 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-gold-400 font-bold uppercase tracking-wider">
              {PAGE_TITLES[step] || `Página ${step} de 21`}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-bold text-paper-200">
              {step} / 21
            </span>
            {step < 21 && (
              <button
                type="button"
                onClick={handleSkipToReview}
                className="text-[10px] text-noir-500 hover:text-gold-400 underline transition-colors"
                title="Pular direto para a decisão final"
              >
                Pular Introdução
              </button>
            )}
          </div>
        </div>

        {/* Linha de Progresso Visual Suave */}
        <div className="w-full h-1.5 sm:h-2 bg-noir-900 rounded-full overflow-hidden border border-noir-800">
          <div 
            className="h-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 transition-all duration-300 shadow-[0_0_10px_rgba(197,160,89,0.3)]"
            style={{ width: `${(step / 21) * 100}%` }}
          />
        </div>
      </header>

      {/* =========================================================================
          CONTEÚDO DINÂMICO DA PÁGINA ATUAL (1 A 21)
         ========================================================================= */}
      <main className={`relative z-10 w-full transition-all duration-300 ${
        isFullScreen ? 'max-w-4xl' : 'max-w-2xl'
      }`}>
        {error && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-700/80 rounded text-xs text-red-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* =========================================================================
            PÁGINA 1 (FULL SCREEN): ABERTURA CINEMÁTICA
           ========================================================================= */}
        {step === 1 && (
          <div className="bg-gradient-to-b from-noir-900 via-noir-900/95 to-noir-950 border-2 border-gold-500/40 rounded-xl p-6 sm:p-10 shadow-2xl space-y-6 text-center animate-fadeIn relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 font-mono text-xs uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Santa Augusta • Outubro de 1929</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-black text-paper-100 tracking-tight leading-tight">
              A República do Café &amp; das Sombras
            </h1>

            <p className="font-serif italic text-paper-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              O vapor do trem apita cortando a neblina da manhã. Enquanto os jornais anunciam a crise na Bolsa de Nova York e o café amontoado nas fazendas, nos bastidores de Santa Augusta uma nova ordem está prestes a nascer.
            </p>

            <div className="p-4 bg-noir-850/90 rounded-lg border border-gold-500/20 max-w-xl mx-auto text-left space-y-2">
              <div className="flex items-center gap-2 text-gold-400 font-mono text-xs uppercase font-bold">
                <HelpCircle className="w-4 h-4" />
                <span>Primeira vez jogando? Não se preocupe!</span>
              </div>
              <p className="text-xs text-noir-300 leading-relaxed font-sans">
                Este é um jogo de <strong>estratégia, diplomacia e negócios</strong>. Não é necessário ter reflexos rápidos de videogame: suas decisões têm peso, seus bares produzem dinheiro sozinhos em tempo real e o império funciona mesmo com o jogo fechado.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={nextStep}
                className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold shadow-gold-glow animate-gold-pulse"
              >
                <span>Desembarcar na Estação</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* =========================================================================
            PÁGINA 2: O QUE É ESTE JOGO? (GUIA DIDÁTICO PARA LEIGOS)
           ========================================================================= */}
        {step === 2 && (
          <div className="bg-noir-900 border border-gold-500/30 rounded-lg p-5 sm:p-7 shadow-2xl space-y-5 animate-fadeIn">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase font-semibold">
                Guia Básico para Leigos
              </span>
              <h2 className="font-display text-2xl font-bold text-paper-100 mt-0.5">
                Como Funciona Santa Augusta?
              </h2>
              <p className="text-xs text-noir-400 mt-1">
                Você assume o papel de um operador que chega à cidade sem padrinhos, mas com ambição de comandar tudo.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans text-xs">
              <div className="p-3.5 bg-noir-850 rounded border border-noir-750 space-y-2">
                <div className="w-8 h-8 rounded bg-gold-500/10 text-gold-400 flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-bold text-paper-100 font-serif-vintage text-sm">Estabelecimentos</h3>
                <p className="text-noir-300 text-[11px] leading-relaxed">
                  Adquira bares, oficinas e armazéns. Eles geram dinheiro a cada poucos minutos sozinhos.
                </p>
              </div>

              <div className="p-3.5 bg-noir-850 rounded border border-noir-750 space-y-2">
                <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-bold text-paper-100 font-serif-vintage text-sm">Ações de Rua</h3>
                <p className="text-noir-300 text-[11px] leading-relaxed">
                  Envie comparsas para coletar informações, interceptar cartas ou transportar cargas secretas.
                </p>
              </div>

              <div className="p-3.5 bg-noir-850 rounded border border-noir-750 space-y-2">
                <div className="w-8 h-8 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-bold text-paper-100 font-serif-vintage text-sm">Poder &amp; Família</h3>
                <p className="text-noir-300 text-[11px] leading-relaxed">
                  Acumule respeito, controle territórios e alie-se às grandes famílias da República Velha.
                </p>
              </div>
            </div>

            <div className="p-3 bg-noir-850 rounded border border-gold-500/20 text-xs text-paper-300 font-serif italic">
              “Em Santa Augusta, quem tem paciência constrói um império; quem tem pressa cava a própria cova.”
            </div>
          </div>
        )}

        {/* =========================================================================
            PÁGINA 3: IDENTIDADE (NOME & ALCUNHA)
           ========================================================================= */}
        {step === 3 && (
          <div className="bg-noir-900 border border-gold-500/30 rounded-lg p-5 sm:p-7 shadow-2xl space-y-5 animate-fadeIn">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase font-semibold">
                Registro de Entrada
              </span>
              <h2 className="font-display text-2xl font-bold text-paper-100 mt-0.5">
                Quem é Você nas Ruas?
              </h2>
              <p className="text-xs text-noir-400 mt-1 font-serif italic">
                A polícia fiscaliza passaportes na entrada da cidade. O que você declarou no guichê da estação?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-gold-400 mb-1">
                  Nome de Batismo Completo
                </label>
                <input
                  type="text"
                  placeholder="Ex: Bento de Vasconcelos, João Batista, Salvatore Moretti..."
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(''); }}
                  className="w-full bg-noir-850 border border-noir-700 rounded px-3 py-2.5 text-sm text-paper-100 placeholder-noir-500 focus:outline-none focus:border-gold-500 transition-colors"
                  maxLength={40}
                  autoFocus
                />
                <span className="text-[10px] text-noir-500 mt-1 block">
                  Como você será citado nas notícias de negócios da Gazeta da Capital.
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gold-400 mb-1">
                  Alcunha das Ruas (Como te chamam no submundo)
                </label>
                <input
                  type="text"
                  placeholder="Ex: O Barão, Mão de Ferro, Navalha, Doutor Café, Sombra..."
                  value={nickname}
                  onChange={(e) => { setNickname(e.target.value); setError(''); }}
                  className="w-full bg-noir-850 border border-noir-700 rounded px-3 py-2.5 text-sm text-paper-100 placeholder-noir-500 focus:outline-none focus:border-gold-500 transition-colors"
                  maxLength={25}
                />
                <span className="text-[10px] text-noir-500 mt-1 block">
                  Seu apelido entre capangas, contrabandistas e apostadores.
                </span>
              </div>

              {name.trim() && nickname.trim() && (
                <div className="p-3 bg-noir-850 rounded border border-gold-500/30 text-xs text-gold-400 font-mono animate-fadeIn flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>
                    Identidade Registrada: <strong>{name}</strong>, vulgo <strong>"{nickname}"</strong>.
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            PÁGINA 4: SUA ORIGEM & HISTÓRIA PREGRESSA
           ========================================================================= */}
        {step === 4 && (
          <div className="bg-noir-900 border border-gold-500/30 rounded-lg p-5 sm:p-7 shadow-2xl space-y-4 animate-fadeIn">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase font-semibold">
                Passado &amp; Bagagem • {displayName}
              </span>
              <h2 className="font-display text-2xl font-bold text-paper-100 mt-0.5">
                De Onde Você Veio?
              </h2>
              <p className="text-xs text-noir-400 mt-1">
                Cada região do Brasil em 1929 moldou seu caráter e suas habilidades nas ruas. Escolha sua história:
              </p>
            </div>

            <div className="space-y-2.5">
              {ORIGINS.map((orig, idx) => {
                const isSelected = originIndex === idx;
                return (
                  <div
                    key={orig.name}
                    onClick={() => setOriginIndex(idx)}
                    className={`cursor-pointer p-3 rounded border transition-all text-xs select-none ${
                      isSelected
                        ? 'bg-noir-800 border-gold-500 shadow-gold-subtle ring-1 ring-gold-500/40'
                        : 'bg-noir-850/80 border-noir-750 hover:border-noir-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-paper-100 font-serif-vintage text-sm">
                        {orig.name}
                      </span>
                      {isSelected && <span className="text-gold-400 font-mono font-bold text-[11px]">✓ Selecionado</span>}
                    </div>
                    <p className="text-noir-300 font-serif italic mt-1 leading-relaxed text-[11px]">
                      {orig.lore}
                    </p>
                    <div className="mt-1.5 font-mono text-[10px] text-gold-500 font-semibold">
                      {orig.bonus}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            PÁGINA 5 (FULL SCREEN): A CARTA DE BOAS-VINDAS PERSONALIZADA
           ========================================================================= */}
        {step === 5 && (
          <div className="bg-[#f7f2e7] text-noir-950 border-4 border-[#2b251e] rounded-lg p-6 sm:p-10 shadow-2xl font-serif space-y-5 animate-fadeIn relative">
            {/* Carimbo de Época */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 border-2 border-red-800 text-red-800 uppercase px-3 py-1 font-mono text-[10px] sm:text-xs font-black tracking-widest -rotate-6 opacity-85">
              ESTAÇÃO CENTRAL • CONFIDENCIAL • 1929
            </div>

            <div className="border-b-2 border-noir-800 pb-2">
              <span className="text-xs font-mono tracking-widest uppercase font-bold text-noir-700">
                Correspondência Particular Entregue por Estafeta
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-serif-vintage mt-1 text-noir-900">
                Ao Ilmo. Sr. {displayName}, vulgo "{displayNickname}"
              </h2>
              <p className="text-[11px] text-noir-600 italic">
                Aos cuidados do Guarda-Volumes da Gare Central de Santa Augusta
              </p>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-noir-850 leading-relaxed font-serif">
              <p>
                <em>Prezado {displayNickname},</em>
              </p>
              <p>
                Se este telegrama chegou aos seus dedos, você conseguiu descer do comboio vindo de <strong>{currentOrigin.name}</strong> sem que a polícia estadual confiscasse sua bagagem. Santa Augusta não é para os fracos. Aqui, a lei é feita em conversas de café e executada ao cair da noite.
              </p>
              <p>
                Os velhos coronéis do café estão desesperados com a quebra das bolsas internacionais. Há um vácuo de poder nas esquinas, nos portos e nos cabarés. O primeiro que souber fincar bandeira e lavar seu dinheiro conquistará esta cidade.
              </p>
              <p className="font-bold">
                Consegui reservar uma pequena herança em seu nome: um ponto comercial pronto para abrir as portas. Escolha bem sua postura.
              </p>
            </div>

            <div className="pt-2 border-t border-noir-400 flex items-center justify-between text-xs font-mono text-noir-700">
              <span className="italic">— Um velho aliado das sombras</span>
              <span className="font-bold">Santa Augusta, 1929</span>
            </div>
          </div>
        )}

        {/* =========================================================================
            PÁGINA 6: O PRIMEIRO DILEMA NA ESTAÇÃO (STORYTELLING DE CHEGADA)
           ========================================================================= */}
        {step === 6 && (
          <div className="bg-noir-900 border border-gold-500/30 rounded-lg p-5 sm:p-7 shadow-2xl space-y-5 animate-fadeIn">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase font-semibold">
                Dilema Inicial • Decisão das Ruas
              </span>
              <h2 className="font-display text-2xl font-bold text-paper-100 mt-0.5">
                O Guarda da Alfândega
              </h2>
              <p className="text-xs text-noir-400 mt-1 font-serif italic">
                Ao sair da gare com sua mala, um fiscal corpulento com bigode cerrado barra a passagem e pergunta o que você veio fazer na capital.
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setStationChoice('suborno')}
                className={`w-full text-left p-3.5 rounded border transition-all text-xs ${
                  stationChoice === 'suborno'
                    ? 'bg-noir-800 border-gold-500 text-paper-100 ring-1 ring-gold-500'
                    : 'bg-noir-850 border-noir-700 text-noir-300 hover:border-noir-600'
                }`}
              >
                <div className="flex items-center gap-2 font-bold font-serif-vintage text-sm text-gold-400">
                  <Coins className="w-4 h-4" />
                  <span>A) Entregar discretamente uma cédula de 20 mil réis</span>
                </div>
                <p className="mt-1 text-[11px] text-paper-300">
                  O dinheiro amacia qualquer fiscal. Ele guarda a cédula no bolso do colete e abre o caminho sem perguntas.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setStationChoice('labia')}
                className={`w-full text-left p-3.5 rounded border transition-all text-xs ${
                  stationChoice === 'labia'
                    ? 'bg-noir-800 border-gold-500 text-paper-100 ring-1 ring-gold-500'
                    : 'bg-noir-850 border-noir-700 text-noir-300 hover:border-noir-600'
                }`}
              >
                <div className="flex items-center gap-2 font-bold font-serif-vintage text-sm text-blue-400">
                  <Briefcase className="w-4 h-4" />
                  <span>B) Dizer com firmeza que veio a mando de um Coronel</span>
                </div>
                <p className="mt-1 text-[11px] text-paper-300">
                  A influência política fala mais alto. O guarda empalidece ao ouvir nomes ilustres e pede desculpas pelo incômodo.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setStationChoice('frieza')}
                className={`w-full text-left p-3.5 rounded border transition-all text-xs ${
                  stationChoice === 'frieza'
                    ? 'bg-noir-800 border-gold-500 text-paper-100 ring-1 ring-gold-500'
                    : 'bg-noir-850 border-noir-700 text-noir-300 hover:border-noir-600'
                }`}
              >
                <div className="flex items-center gap-2 font-bold font-serif-vintage text-sm text-rose-400">
                  <Skull className="w-4 h-4" />
                  <span>C) Encará-lo com olhar frio e passar sem dizer nada</span>
                </div>
                <p className="mt-1 text-[11px] text-paper-300">
                  O instinto do medo. Ele percebe a postura pesada de {displayNickname} e decide que não ganha o suficiente para arrumar encrenca.
                </p>
              </button>
            </div>

            {stationChoice && (
              <div className="p-3 bg-noir-850 rounded border border-gold-500/30 text-xs text-gold-400 font-mono animate-fadeIn">
                ✓ Postura escolhida! Isso ilustra os <strong>4 Pilares de Poder</strong> que governam cada ação do jogo.
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            PÁGINA 7: O 1º PILAR DE PODER - DINHEIRO ($)
           ========================================================================= */}
        {step === 7 && (
          <div className="bg-noir-900 border border-gold-500/40 rounded-lg p-5 sm:p-7 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded bg-gold-500/20 text-gold-400 border border-gold-500/40 flex items-center justify-center shrink-0">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase font-semibold">
                  Mecânica Básica • O 1º Pilar
                </span>
                <h2 className="font-display text-2xl font-bold text-paper-100">
                  DINHEIRO: A Engrenagem
                </h2>
              </div>
            </div>

            <div className="space-y-3 text-xs text-paper-300 leading-relaxed font-sans">
              <p>
                O dinheiro em Santa Augusta não é para guardar debaixo do colchão. Ele é a ferramenta para <strong>financiar a expansão do seu império</strong>.
              </p>

              <div className="p-3.5 bg-noir-850 rounded border border-noir-750 space-y-2 text-xs">
                <h4 className="font-bold text-gold-400 font-serif-vintage">Para que serve o Dinheiro no jogo?</h4>
                <ul className="list-disc list-inside space-y-1 text-noir-300">
                  <li><strong>Comprar novos estabelecimentos:</strong> Bares, oficinas, armazéns e cassinos.</li>
                  <li><strong>Evoluir seus pontos comerciais:</strong> Quanto maior o nível, mais dinheiro por ciclo eles geram.</li>
                  <li><strong>Financiar operações de rua:</strong> Pagamento de informantes, gasolina de calhambeques e subornos.</li>
                  <li><strong>Comprar mercadorias no Mercado:</strong> Sacas de café e whisky na baixa para revender na alta.</li>
                </ul>
              </div>

              <p className="text-[11px] text-noir-400 font-serif italic">
                *Dica: Você começa com $1.000 em dinheiro vivo para inaugurar seu primeiro negócio.*
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            PÁGINA 8: O 2º PILAR DE PODER - RESPEITO
           ========================================================================= */}
        {step === 8 && (
          <div className="bg-noir-900 border border-amber-600/40 rounded-lg p-5 sm:p-7 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-semibold">
                  Mecânica Básica • O 2º Pilar
                </span>
                <h2 className="font-display text-2xl font-bold text-paper-100">
                  RESPEITO: A Sua Honra
                </h2>
              </div>
            </div>

            <div className="space-y-3 text-xs text-paper-300 leading-relaxed font-sans">
              <p>
                Nas ruas de Santa Augusta, ninguém faz negócios com quem não tem palavra. O <strong>Respeito</strong> mede sua autoridade moral e peso no submundo.
              </p>

              <div className="p-3.5 bg-noir-850 rounded border border-noir-750 space-y-2 text-xs">
                <h4 className="font-bold text-amber-400 font-serif-vintage">Como funciona o Respeito?</h4>
                <ul className="list-disc list-inside space-y-1 text-noir-300">
                  <li><strong>Destrava novos negócios:</strong> Pontos de prestígio (como Cassinos e Armazéns de Grande Porte) exigem respeito mínimo.</li>
                  <li><strong>Abre missões de honra:</strong> Famílias nobres só conversam com quem já provou valor.</li>
                  <li><strong>Como conquistar:</strong> Cumprindo missões, entregando cargas pontualmente e inaugurando negócios bem administrados.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PÁGINA 9: O 3º PILAR DE PODER - INFLUÊNCIA
           ========================================================================= */}
        {step === 9 && (
          <div className="bg-noir-900 border border-blue-600/40 rounded-lg p-5 sm:p-7 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-blue-500 uppercase font-semibold">
                  Mecânica Básica • O 3º Pilar
                </span>
                <h2 className="font-display text-2xl font-bold text-paper-100">
                  INFLUÊNCIA: As Portas Fechadas
                </h2>
              </div>
            </div>

            <div className="space-y-3 text-xs text-paper-300 leading-relaxed font-sans">
              <p>
                A <strong>Influência</strong> representa suas amizades com juízes, escrivães da delegacia, inspetores da alfândega e vereadores de Santa Augusta.
              </p>

              <div className="p-3.5 bg-noir-850 rounded border border-noir-750 space-y-2 text-xs">
                <h4 className="font-bold text-blue-400 font-serif-vintage">Por que a Influência é indispensável?</h4>
                <ul className="list-disc list-inside space-y-1 text-noir-300">
                  <li><strong>Subornos estratégicos:</strong> Faz com que queixas de comerciantes desapareçam das gavetas da delegacia.</li>
                  <li><strong>Autorização de cargas noturnas:</strong> Permite transbordo no porto sem fiscalização da Marinha.</li>
                  <li><strong>Como conquistar:</strong> Coletando informações no Café Central, interceptando telegramas e articulando favores com políticos.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PÁGINA 10: O 4º PILAR DE PODER - MEDO
           ========================================================================= */}
        {step === 10 && (
          <div className="bg-noir-900 border border-rose-600/40 rounded-lg p-5 sm:p-7 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center shrink-0">
                <Skull className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-rose-500 uppercase font-semibold">
                  Mecânica Básica • O 4º Pilar
                </span>
                <h2 className="font-display text-2xl font-bold text-paper-100">
                  MEDO: A Lâmina Afiada
                </h2>
              </div>
            </div>

            <div className="space-y-3 text-xs text-paper-300 leading-relaxed font-sans">
              <p>
                O <strong>Medo</strong> é a reputação da sua mão armada. Em um submundo impiedoso, quem não é respeitado pela honra precisa ser respeitado pelo receio do revólver.
              </p>

              <div className="p-3.5 bg-noir-850 rounded border border-noir-750 space-y-2 text-xs">
                <h4 className="font-bold text-rose-400 font-serif-vintage">Benefícios e Perigos do Medo:</h4>
                <ul className="list-disc list-inside space-y-1 text-noir-300">
                  <li><strong>Cobrança acelerada:</strong> Devedores inadimplentes pagam de joelhos quando o Medo está alto.</li>
                  <li><strong>Intimidação de rivais:</strong> Quadrilhas menores hesitam antes de invadir seus pontos.</li>
                  <li><strong>⚠️ Alerta de Risco:</strong> Medo em excesso atrai a atenção dos jornais e da Cavalaria da Polícia, que pode fazer batidas em seus negócios!</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PÁGINA 11: O SEU ESTILO DE COMANDO (ARQUÉTIPOS)
           ========================================================================= */}
        {step === 11 && (
          <div className="bg-noir-900 border border-gold-500/30 rounded-lg p-5 sm:p-7 shadow-2xl space-y-4 animate-fadeIn">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase font-semibold">
                Especialização • {displayNickname}
              </span>
              <h2 className="font-display text-2xl font-bold text-paper-100 mt-0.5">
                Escolha seu Estilo de Início
              </h2>
              <p className="text-xs text-noir-400 mt-1">
                Qual é a vocação primária do seu império? Isso define seus bônus permanentes:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STYLE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = style === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setStyle(opt.id)}
                    className={`cursor-pointer p-3 rounded border transition-all flex flex-col justify-between select-none ${
                      isSelected
                        ? 'bg-noir-800 border-gold-500 shadow-gold-subtle ring-1 ring-gold-500/40'
                        : 'bg-noir-850/80 border-noir-750 hover:border-noir-600'
                    }`}
                  >
                    <div>
                      {/* Retrato do Arquétipo em Pixel Art */}
                      <div className="relative w-full h-32 rounded overflow-hidden mb-2 border border-noir-700 bg-noir-950">
                        <img
                          src={opt.image}
                          alt={opt.title}
                          className="w-full h-full object-cover"
                          style={{ imageRendering: 'pixelated' }}
                        />
                        <div className="absolute top-2 right-2">
                          {isSelected && (
                            <span className="bg-gold-500 text-noir-950 font-mono text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                              ✓ SELECIONADO
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded ${isSelected ? 'bg-gold-500 text-noir-950 font-bold' : 'bg-noir-700 text-gold-400'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-serif-vintage font-bold text-sm text-paper-100">
                            {opt.title}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-noir-300 font-serif italic leading-relaxed">
                        {opt.description}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-noir-750 text-[10px] font-mono text-gold-400 font-semibold">
                      {opt.bonus}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            PÁGINA 12 (FULL SCREEN): A PLANTA URBANA DOS 6 BAIRROS
           ========================================================================= */}
        {step === 12 && (
          <div className="bg-gradient-to-b from-noir-900 to-noir-950 border-2 border-gold-500/40 rounded-xl p-5 sm:p-8 shadow-2xl space-y-5 animate-fadeIn">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase font-semibold">
                Geografia de Santa Augusta
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-paper-100 mt-1">
                Os 6 Distritos em Disputa
              </h2>
              <p className="text-xs text-noir-400 mt-1 font-serif italic">
                A cidade é dividida em territórios com atmosferas, riscos policiais e economias distintas.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              {INITIAL_DISTRICTS.map((dist) => (
                <div key={dist.id} className="p-2.5 bg-noir-850/90 rounded border border-noir-750 space-y-1.5 flex flex-col justify-between overflow-hidden">
                  <div>
                    <div className="w-full h-16 rounded overflow-hidden mb-1.5 border border-noir-750 bg-noir-950">
                      <img src={dist.illustration} alt={dist.name} className="w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
                    </div>
                    <span className="font-serif-vintage font-bold text-xs sm:text-sm text-gold-400 block truncate">
                      {dist.name}
                    </span>
                    <p className="text-[10px] text-noir-400 font-serif italic line-clamp-1 mt-0.5">
                      "{dist.tagline}"
                    </p>
                  </div>
                  <div className="pt-2 border-t border-noir-800 text-[9px] font-mono flex justify-between text-noir-400">
                    <span>Risco: <strong className="text-paper-200">{dist.base_risk}%</strong></span>
                    <span>Polícia: <strong className="text-red-400">{dist.police_presence}%</strong></span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-paper-300 font-serif italic max-w-lg mx-auto">
              Você pode expandir seus pontos comerciais para qualquer um desses bairros e disputar a hegemonia territorial com outras famílias.
            </p>
          </div>
        )}

        {/* =========================================================================
            PÁGINA 13: COMO FUNCIONAM OS NEGÓCIOS (CICLOS DE RENDA)
           ========================================================================= */}
        {step === 13 && (
          <div className="bg-noir-900 border border-gold-500/30 rounded-lg p-5 sm:p-7 shadow-2xl space-y-5 animate-fadeIn">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase font-semibold">
                Mecânica Central • Economia Automática
              </span>
              <h2 className="font-display text-2xl font-bold text-paper-100 mt-0.5">
                Como Rendem os Estabelecimentos?
              </h2>
              <p className="text-xs text-noir-400 mt-1">
                A base do jogo é muito simples: seus negócios trabalham para você em ciclos contínuos de tempo.
              </p>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="p-3.5 bg-noir-850 rounded border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold font-serif-vintage text-sm">
                  <Clock className="w-4 h-4" />
                  <span>1. Ciclos Automáticos de Produção</span>
                </div>
                <p className="text-noir-300 text-[11px] leading-relaxed">
                  Um Bar de Esquina gera cerca de $700 a cada 5 minutos. Você não precisa ficar olhando para a tela: o servidor calcula a renda segundo a segundo.
                </p>
              </div>

              <div className="p-3.5 bg-noir-850 rounded border border-gold-500/30 space-y-1.5">
                <div className="flex items-center gap-2 text-gold-400 font-bold font-serif-vintage text-sm">
                  <Coins className="w-4 h-4" />
                  <span>2. O Botão Fica Verde: Hora de Recolher!</span>
                </div>
                <p className="text-noir-300 text-[11px] leading-relaxed">
                  Quando o cronômetro chega a zero, um botão <strong>"Recolher Renda"</strong> fica pronto. Basta um toque para transferir o lucro para os seus cofres.
                </p>
              </div>

              <div className="p-3.5 bg-noir-850 rounded border border-purple-500/30 space-y-1.5">
                <div className="flex items-center gap-2 text-purple-400 font-bold font-serif-vintage text-sm">
                  <Building2 className="w-4 h-4" />
                  <span>3. Evolução de Nível</span>
                </div>
                <p className="text-noir-300 text-[11px] leading-relaxed">
                  Ao acumular dinheiro, você pode clicar em <strong>"Evoluir"</strong> para subir o bar para Nível 2, 3 e além, aumentando o faturamento permanentemente.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PÁGINA 14: ESCOLHA DO DISTRITO DO 1º NEGÓCIO
           ========================================================================= */}
        {step === 14 && (
          <div className="bg-noir-900 border border-gold-500/30 rounded-lg p-5 sm:p-7 shadow-2xl space-y-4 animate-fadeIn">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase font-semibold">
                Sua Primeira Bandeira • {displayName}
              </span>
              <h2 className="font-display text-2xl font-bold text-paper-100 mt-0.5">
                Onde Abrir seu Primeiro Ponto?
              </h2>
              <p className="text-xs text-noir-400 mt-1">
                Você recebeu alvará e chaves de um Bar de Esquina. Em qual bairro deseja inaugurá-lo?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {INITIAL_DISTRICTS.map((d) => {
                const isSelected = firstDistrictId === d.id;
                return (
                  <div
                    key={d.id}
                    onClick={() => setFirstDistrictId(d.id)}
                    className={`cursor-pointer p-3 rounded border transition-all flex flex-col justify-between select-none ${
                      isSelected
                        ? 'bg-noir-800 border-gold-500 shadow-gold-subtle ring-1 ring-gold-500'
                        : 'bg-noir-850 border-noir-750 hover:border-noir-600'
                    }`}
                  >
                    <div>
                      <div className="w-full h-16 rounded overflow-hidden mb-2 border border-noir-700 bg-noir-950">
                        <img src={d.illustration} alt={d.name} className="w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-serif-vintage font-bold text-sm text-paper-100">
                          {d.name}
                        </span>
                        {isSelected && <span className="text-gold-400 font-mono text-[10px] font-bold">✓ Escolhido</span>}
                      </div>
                      <p className="text-noir-400 font-serif italic text-[11px] mt-1 line-clamp-1">
                        {d.economic_focus}
                      </p>
                    </div>

                    <div className="mt-2 text-[10px] font-mono text-noir-500 flex justify-between">
                      <span>Risco: {d.base_risk}%</span>
                      <span>Polícia: {d.police_presence}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            PÁGINA 15: O NOME DA FACHADA (BATISMO DO ESTABELECIMENTO)
           ========================================================================= */}
        {step === 15 && (
          <div className="bg-noir-900 border border-gold-500/30 rounded-lg p-5 sm:p-7 shadow-2xl space-y-5 animate-fadeIn">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase font-semibold">
                Identidade Comercial no {selectedDistrict.name}
              </span>
              <h2 className="font-display text-2xl font-bold text-paper-100 mt-0.5">
                O Nome da Sua Fachada
              </h2>
              <p className="text-xs text-noir-400 mt-1 font-serif italic">
                O pintor de cavalete está na calçada aguardando as letras que estamparão a placa de madeira do seu bar.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-gold-400 mb-1">
                  Nome do Seu Primeiro Bar
                </label>
                <input
                  type="text"
                  placeholder={`Ex: Bar ${displayNickname}, Taverna Santa Augusta, Botequim Central...`}
                  value={firstBizName}
                  onChange={(e) => setFirstBizName(e.target.value)}
                  className="w-full bg-noir-850 border border-noir-700 rounded px-3 py-2.5 text-sm text-paper-100 placeholder-noir-500 focus:outline-none focus:border-gold-500 transition-colors"
                  maxLength={35}
                />
              </div>

              {/* Botões de sugestão rápida */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-noir-400 block">
                  Sugestões Rápidas de Nome:
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    `Bar ${displayNickname}`,
                    `Taverna do ${displayName.split(' ')[0]}`,
                    `Café & Bilhar 1929`,
                    `Botequim do Porto`,
                    `Bar Estrela da Noite`
                  ].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setFirstBizName(sug)}
                      className="px-2.5 py-1 rounded bg-noir-850 text-gold-400 border border-noir-700 hover:border-gold-500 text-[11px] font-mono transition-colors"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-noir-850 rounded border border-noir-750 text-xs text-paper-300 font-serif italic">
                “Sob a placa de <strong>'{displayBizName}'</strong>, você lavará seus primeiros rendimentos e reunirá seus informantes.”
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PÁGINA 16: AS AÇÕES E OPERAÇÕES NAS RUAS
           ========================================================================= */}
        {step === 16 && (
          <div className="bg-noir-900 border border-gold-500/30 rounded-lg p-5 sm:p-7 shadow-2xl space-y-4 animate-fadeIn">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase font-semibold">
                Mecânica de Ações • Movimentações Noturnas
              </span>
              <h2 className="font-display text-2xl font-bold text-paper-100 mt-0.5">
                Ações &amp; Operações nas Ruas
              </h2>
              <p className="text-xs text-noir-400 mt-1">
                Além dos estabelecimentos fixos, você comanda manobras ativas pelas ruelas de Santa Augusta.
              </p>
            </div>

            <div className="space-y-3 font-sans text-xs text-paper-300">
              <div className="p-3 bg-noir-850 rounded border border-noir-750 space-y-1">
                <span className="font-bold text-gold-400 font-serif-vintage block text-sm">
                  1. Cada Ação Tem um Objetivo Real
                </span>
                <p className="text-noir-300 text-[11px] leading-relaxed">
                  Não são botões genéricos: você escolhe <strong>"Coletar Informações"</strong>, <strong>"Transportar Carga"</strong>, <strong>"Subornar Escrivão"</strong> ou <strong>"Operar Banca de Roleta"</strong>.
                </p>
              </div>

              <div className="p-3 bg-noir-850 rounded border border-noir-750 space-y-1">
                <span className="font-bold text-emerald-400 font-serif-vintage block text-sm">
                  2. Tempo Real &amp; Chance de Sucesso
                </span>
                <p className="text-noir-300 text-[11px] leading-relaxed">
                  Uma operação leva de 1 a 5 minutos. Cada ação indica sua chance de sucesso (ex: 85%). Você comanda a ordem e seus contatos vão para as ruas.
                </p>
              </div>

              <div className="p-3 bg-noir-850 rounded border border-noir-750 space-y-1">
                <span className="font-bold text-blue-400 font-serif-vintage block text-sm">
                  3. Recompensas &amp; Relatórios
                </span>
                <p className="text-noir-300 text-[11px] leading-relaxed">
                  Ao concluir, você recebe o relatório do trabalho com dinheiro, respeito, influência ou medo conquistado.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PÁGINA 17: SIMULAÇÃO PRÁTICA DE UMA AÇÃO (MINI-TESTE)
           ========================================================================= */}
        {step === 17 && (
          <div className="bg-noir-900 border border-gold-500/30 rounded-lg p-5 sm:p-7 shadow-2xl space-y-5 animate-fadeIn">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase font-semibold">
                Treinamento Prático Interativo
              </span>
              <h2 className="font-display text-2xl font-bold text-paper-100 mt-0.5">
                Faça Seu Primeiro Teste Agora
              </h2>
              <p className="text-xs text-noir-400 mt-1 font-serif italic">
                Experimente o fluxo de uma ação para ver como é fácil comandar uma jogada nas ruas:
              </p>
            </div>

            <div className="p-4 bg-noir-850 rounded-lg border border-gold-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-paper-100 font-bold">Missão: Ouvir Conversas no Café Central</span>
                <span className="text-emerald-400 font-bold">Chance: 95%</span>
              </div>
              <p className="text-xs text-noir-300 font-serif italic">
                Pagar um café forte e charuto para um informante descobrir quais cargas chegam no trem das três.
              </p>

              {simState === 'idle' && (
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    setSimState('running');
                    setTimeout(() => setSimState('done'), 1200);
                  }}
                  className="font-bold text-xs py-2.5"
                >
                  <Crosshair className="w-4 h-4 mr-2" />
                  Mandar Informante ao Café
                </Button>
              )}

              {simState === 'running' && (
                <div className="p-3 bg-noir-950 rounded text-center text-xs font-mono text-gold-400 animate-pulse border border-gold-500/30">
                  ⏳ O informante está no balcão escutando a conversa dos corretores...
                </div>
              )}

              {simState === 'done' && (
                <div className="p-3.5 bg-emerald-950/80 border border-emerald-600 rounded text-xs space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>✓ SUCESSO TOTAL NA OPERAÇÃO!</span>
                  </div>
                  <p className="text-[11px] text-paper-200">
                    O informante descobriu que uma carga de whisky escocês entrará pelo armazém 4 esta noite.
                  </p>
                  <div className="pt-2 border-t border-emerald-800/80 flex items-center justify-between font-mono text-[10px] text-emerald-300">
                    <span>Recompensa: +$250 em réis</span>
                    <span>+3 Respeito</span>
                    <span>+2 Influência</span>
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-noir-400 text-center font-serif italic">
              É exatamente assim que funciona: você dá a ordem, aguarda o cronômetro e embolsa os lucros.
            </p>
          </div>
        )}

        {/* =========================================================================
            PÁGINA 18: O MERCADO MUNICIPAL & A BOLSA DE MERCADORIAS
           ========================================================================= */}
        {step === 18 && (
          <div className="bg-noir-900 border border-gold-500/30 rounded-lg p-5 sm:p-7 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-semibold">
                  Mecânica de Comércio • Bolsa Mercantil
                </span>
                <h2 className="font-display text-2xl font-bold text-paper-100">
                  O Mercado Municipal
                </h2>
              </div>
            </div>

            <div className="space-y-3 text-xs text-paper-300 leading-relaxed font-sans">
              <p>
                Em 1929, fortunas nascem na <strong>arbitragem de commodities</strong>. Você pode negociar mercadorias com cotações que mudam com o tempo:
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2.5 bg-noir-850 rounded border border-noir-750">
                  <span className="text-gold-400 font-bold block">☕ Café Arábica Especial</span>
                  <span className="text-noir-400 text-[10px]">O ouro verde do interior paulista.</span>
                </div>
                <div className="p-2.5 bg-noir-850 rounded border border-noir-750">
                  <span className="text-emerald-400 font-bold block">🍾 Whisky Escocês</span>
                  <span className="text-noir-400 text-[10px]">Contrabandeado das docas inglesas.</span>
                </div>
                <div className="p-2.5 bg-noir-850 rounded border border-noir-750">
                  <span className="text-blue-400 font-bold block">⚙️ Peças Automotivas Ford</span>
                  <span className="text-noir-400 text-[10px]">Para calhambeques velozes.</span>
                </div>
                <div className="p-2.5 bg-noir-850 rounded border border-noir-750">
                  <span className="text-purple-400 font-bold block">📜 Dossiês Confidenciais</span>
                  <span className="text-noir-400 text-[10px]">Documentos que compram silêncios.</span>
                </div>
              </div>

              <div className="p-3 bg-noir-850 rounded border border-gold-500/20 text-[11px] text-paper-300 font-serif italic">
                <strong>A Regra de Ouro do Comerciante:</strong> Compre quando o preço estiver verde e em queda; revenda quando uma notícia na Gazeta disparar o valor do produto!
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PÁGINA 19 (FULL SCREEN): A GAZETA DA CAPITAL PERSONALIZADA
           ========================================================================= */}
        {step === 19 && (
          <div className="bg-[#f2efe9] text-noir-950 border-4 border-noir-900 rounded-lg p-6 sm:p-10 shadow-2xl space-y-5 animate-fadeIn font-serif">
            {/* Cabeçalho do Jornal */}
            <div className="border-b-4 border-noir-900 pb-3 text-center">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-widest text-noir-700 border-b border-noir-400 pb-1 mb-2">
                <span>Edição Extraordinária #148</span>
                <span>Preço: 200 Réis</span>
                <span>Santa Augusta • Terça-Feira, Outubro de 1929</span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-noir-950">
                Gazeta da Capital
              </h1>
              <p className="text-xs italic font-serif text-noir-700 mt-0.5">
                O Maior e Mais Imparcial Órgão Noticioso do Estado
              </p>
            </div>

            {/* Manchete Principal com o Nome do Jogador */}
            <div className="space-y-2 border-b-2 border-noir-800 pb-4">
              <span className="text-[10px] font-mono uppercase bg-noir-950 text-paper-100 px-2 py-0.5 font-bold tracking-wider">
                NEGÓCIOS &amp; POLÍTICA
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase leading-tight font-serif-vintage">
                FORASTEIRO DE {currentOrigin.name.toUpperCase()} DESEMBARCA E PROMETE MOVIMENTAR SANTA AUGUSTA
              </h2>
              <p className="text-xs sm:text-sm italic text-noir-800 leading-snug">
                Sob a alcunha de "{displayNickname}", {displayName} assume ponto comercial no {selectedDistrict.name} e atrai os olhares de comerciantes e delegados.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs leading-relaxed text-noir-850">
              <p>
                As rodas de café do Centro Histórico comentam com espanto a rapidez com que a nova figura registrou o <strong>"{displayBizName}"</strong>. Comerciantes locais afirmam que a movimentação de moedas e fardos no bairro já registrou aumento imediato nesta manhã.
              </p>
              <div className="p-3 bg-[#e8e3d8] rounded border border-noir-400 space-y-1">
                <span className="font-mono text-[10px] font-bold uppercase block text-noir-700">
                  💡 Mecânica da Gazeta no Jogo:
                </span>
                <p className="text-[11px] text-noir-800">
                  O jornal é atualizado com notícias reais do mundo do jogo. Grandes conquistas, quedas de preço e disputas de família saem na primeira página!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PÁGINA 20: O MUNDO OFFLINE & RETORNO DIÁRIO
           ========================================================================= */}
        {step === 20 && (
          <div className="bg-noir-900 border border-gold-500/30 rounded-lg p-5 sm:p-7 shadow-2xl space-y-4 animate-fadeIn">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase font-semibold">
                Simulação Contínua • Vida Real
              </span>
              <h2 className="font-display text-2xl font-bold text-paper-100 mt-0.5">
                O Que Acontece Quando Você Sai do Jogo?
              </h2>
              <p className="text-xs text-noir-400 mt-1">
                Você não precisa ficar conectado o dia todo. Santa Augusta continua viva no servidor:
              </p>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="p-3.5 bg-noir-850 rounded border border-noir-750 flex items-start gap-3">
                <div className="p-2 rounded bg-gold-500/10 text-gold-400 shrink-0 mt-0.5">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-paper-100 font-serif-vintage text-sm">Seus Lucros se Acumulam</h4>
                  <p className="text-noir-300 text-[11px] mt-0.5 leading-relaxed">
                    Seus negócios completam seus ciclos de produção e deixam a receita esperando no cofre. Basta entrar no jogo e recolher.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-noir-850 rounded border border-noir-750 flex items-start gap-3">
                <div className="p-2 rounded bg-blue-500/10 text-blue-400 shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-paper-100 font-serif-vintage text-sm">Ações Concluem Sozinhas</h4>
                  <p className="text-noir-300 text-[11px] mt-0.5 leading-relaxed">
                    Se você mandou um capanga fazer uma viagem ou cobrança de 3 minutos, ela será concluída mesmo com o celular desligado.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-noir-850 rounded border border-noir-750 flex items-start gap-3">
                <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-paper-100 font-serif-vintage text-sm">Tela "Enquanto Você Estava Fora..."</h4>
                  <p className="text-noir-300 text-[11px] mt-0.5 leading-relaxed">
                    Ao abrir o jogo a cada novo dia, um relatório elegante resume todas as rendas e avança seus bônus diários consecutivos!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PÁGINA 21 (FULL SCREEN): JURAMENTO FINAL & ENTRADA NA CIDADE
           ========================================================================= */}
        {step === 21 && (
          <div className="bg-gradient-to-b from-noir-900 via-noir-900 to-noir-950 border-2 border-gold-500/60 rounded-xl p-6 sm:p-10 shadow-2xl space-y-6 animate-fadeIn relative overflow-hidden text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/40 text-gold-400 font-mono text-xs uppercase tracking-widest font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Ficha Pronta • Autorização Concedida</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-black text-paper-100 uppercase tracking-tight">
              A Sua História Começa Agora
            </h1>

            {/* Ficha Síntese do Personagem */}
            <div className="max-w-xl mx-auto bg-noir-850/90 rounded-lg border border-gold-500/30 p-4 sm:p-5 text-left font-mono text-xs space-y-2.5 shadow-inner">
              <div className="flex justify-between border-b border-noir-750 pb-1.5">
                <span className="text-noir-400">Patrão:</span>
                <strong className="text-paper-100">{displayName}</strong>
              </div>
              <div className="flex justify-between border-b border-noir-750 pb-1.5">
                <span className="text-noir-400">Alcunha nas Ruas:</span>
                <strong className="text-gold-400">"{displayNickname}"</strong>
              </div>
              <div className="flex justify-between border-b border-noir-750 pb-1.5">
                <span className="text-noir-400">Origem:</span>
                <span className="text-paper-200">{currentOrigin.name}</span>
              </div>
              <div className="flex justify-between border-b border-noir-750 pb-1.5">
                <span className="text-noir-400">Estilo de Comando:</span>
                <span className="text-gold-400 capitalize font-bold">{style}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-noir-400">Primeiro Estabelecimento:</span>
                <strong className="text-emerald-400">{displayBizName} ({selectedDistrict.name})</strong>
              </div>
            </div>

            <p className="font-serif italic text-paper-300 text-sm max-w-lg mx-auto">
              “As portas de Santa Augusta estão abertas. O café está servido nas mesas de mármore e os calhambeques aceleram na calada da noite.”
            </p>

            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleFinishOnboarding}
                className="w-full sm:w-auto px-10 py-4 text-sm sm:text-base font-black shadow-gold-glow animate-gold-pulse"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                COMEÇAR MINHA HISTÓRIA EM SANTA AUGUSTA
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          CONTROLES DE NAVEGAÇÃO INFERIOR (VOLTAR / AVANÇAR)
         ========================================================================= */}
      <footer className="relative z-20 w-full max-w-4xl mt-6 pt-4 border-t border-noir-800/80 flex items-center justify-between gap-3">
        {step > 1 ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={prevStep}
            className="text-xs text-noir-400 hover:text-paper-100"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Voltar</span>
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setScreen('landing')}
            className="text-xs text-noir-400 hover:text-paper-100"
          >
            Sair ao Início
          </Button>
        )}

        <div className="text-[11px] font-mono text-noir-500 hidden sm:block">
          Página {step} de 21
        </div>

        {step < 21 ? (
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={nextStep}
            className="text-xs font-bold px-5"
          >
            <span>Continuar</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="success"
            size="md"
            onClick={handleFinishOnboarding}
            className="text-xs font-bold px-6 shadow-lg animate-bounce"
          >
            <span>Concluir</span>
            <Check className="w-4 h-4 ml-1.5" />
          </Button>
        )}
      </footer>
    </div>
  );
};
