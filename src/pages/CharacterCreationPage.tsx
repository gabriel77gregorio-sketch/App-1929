import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CharacterStyle } from '../types/game';
import { Button } from '../components/common/Button';
import { INITIAL_DISTRICTS } from '../lib/mockData';
import { 
  Briefcase, Crosshair, Anchor, TrendingUp, Check, 
  Coins, Award, Users, Skull, Clock, Building2, 
  Newspaper, ArrowRight, ArrowLeft, Sparkles, MapPin 
} from 'lucide-react';
import confetti from 'canvas-confetti';

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
    bonus: '+15% de receita contínua e 10% de desconto em novos alvarás',
    description: 'Você sabe como lavar o dinheiro da noite em balcões respeitáveis e abrir portas no comércio oficial.',
    icon: TrendingUp
  },
  {
    id: 'negociador',
    title: 'Negociador',
    bonus: '+10% em negociações e maior reserva de Influência política',
    description: 'Palavras afiadas e contatos nos clubes certos resolvem conflitos antes que uma bala precise ser disparada.',
    icon: Briefcase
  },
  {
    id: 'contrabandista',
    title: 'Contrabandista',
    bonus: '+10% em transporte e sucesso ampliado nas docas',
    description: 'Você conhece cada escaler e armazém do cais. Se algo chega do mar sem manifesto, passa pelas suas mãos.',
    icon: Anchor
  },
  {
    id: 'executor',
    title: 'Executor',
    bonus: '+12% em intimidações e maior índice de Medo nas ruas',
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
  const { createCharacterWithFirstBusiness, setScreen } = useGame();

  // Etapa atual do onboarding: 1 a 4
  const [step, setStep] = useState<number>(1);

  // Dados do personagem
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [origin, setOrigin] = useState(ORIGINS[0]);
  const [style, setStyle] = useState<CharacterStyle>('empresario');

  // Primeiro negócio
  const [firstBizName, setFirstBizName] = useState('');
  const [firstDistrictId, setFirstDistrictId] = useState(INITIAL_DISTRICTS[0].id);

  // Simulação interativa no passo 3
  const [testCollected, setTestCollected] = useState(false);

  const [error, setError] = useState('');

  const nextStep = () => {
    if (step === 1) {
      if (!name.trim() || !nickname.trim()) {
        setError('Por favor, informe seu nome e sua alcunha nas ruas.');
        return;
      }
      setError('');
    }
    setStep(prev => Math.min(4, prev + 1));
  };

  const prevStep = () => {
    setError('');
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleFinishOnboarding = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c5a059', '#e5cd93', '#f4ede0']
      });
    } catch {
      // Ignora se confetti não estiver disponível
    }

    const defaultBizName = firstBizName.trim() || `Bar ${nickname}`;
    createCharacterWithFirstBusiness(
      name.trim(),
      nickname.trim(),
      origin,
      style,
      defaultBizName,
      firstDistrictId
    );
  };

  return (
    <div className="min-h-screen bg-noir-950 px-4 py-6 sm:py-10 flex flex-col items-center justify-center relative select-none">
      <div className="absolute inset-0 bg-gradient-radial from-noir-900/60 to-noir-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#c5a0590a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl">
        {/* Barra de Progresso do Onboarding */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-mono text-noir-400 mb-2">
            <span className="text-gold-400 font-bold uppercase tracking-wider">
              {step === 1 && '1. A Identidade'}
              {step === 2 && '2. Os 4 Pilares de Poder'}
              {step === 3 && '3. Seu Primeiro Ponto'}
              {step === 4 && '4. A Lei de Santa Augusta'}
            </span>
            <span>Etapa {step} de 4</span>
          </div>
          <div className="w-full h-1.5 bg-noir-900 rounded-full overflow-hidden border border-noir-800">
            <div 
              className="h-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Card Principal */}
        <div className="bg-noir-900/90 border border-gold-500/30 rounded-lg p-5 sm:p-7 shadow-2xl backdrop-blur-sm relative">
          {error && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded text-xs text-red-200">
              {error}
            </div>
          )}

          {/* =========================================================================
              ETAPA 1: Identidade & Origem
             ========================================================================= */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase font-semibold">
                  Santa Augusta, 1929
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-paper-100 mt-1">
                  Desembarque na Estação
                </h2>
                <p className="text-xs text-noir-400 mt-1 font-serif italic">
                  O vapor apita. Você pisa na calçada de pedra com uma mala de couro desgastada e a ambição de não receber ordens de ninguém.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div>
                  <label className="block text-xs font-mono uppercase text-gold-400 mb-1">
                    Nome de Batismo
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
                  <label className="block text-xs font-mono uppercase text-gold-400 mb-1">
                    Como é chamado nas ruas? (Alcunha)
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

              <div>
                <label className="block text-xs font-mono uppercase text-gold-400 mb-1">
                  De onde você veio? (Origem)
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

              <div className="p-3 bg-noir-850 rounded border border-noir-800 text-[11px] text-paper-300 font-serif italic">
                “Em Santa Augusta, seu passado importa menos do que sua palavra. Quem chega com coragem encontra terreno fértil.”
              </div>
            </div>
          )}

          {/* =========================================================================
              ETAPA 2: Estilo de Operação & Os 4 Pilares de Poder
             ========================================================================= */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase font-semibold">
                  As Leis do Jogo
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-paper-100 mt-0.5">
                  Os 4 Atributos de Poder
                </h2>
                <p className="text-xs text-noir-400 mt-1">
                  Nenhum império se sustenta com apenas um pilar. Entenda como eles funcionam:
                </p>
              </div>

              {/* Guia visual dos 4 Atributos */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-noir-850 rounded border border-gold-500/30">
                  <div className="flex items-center gap-1.5 text-gold-400 font-bold mb-1">
                    <Coins className="w-3.5 h-3.5" />
                    <span>DINHEIRO</span>
                  </div>
                  <p className="text-[10px] text-paper-300 leading-tight">
                    Compra pontos comerciais, melhora instalações, adquire café e financia subornos.
                  </p>
                </div>

                <div className="p-2.5 bg-noir-850 rounded border border-amber-600/30">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>RESPEITO</span>
                  </div>
                  <p className="text-[10px] text-paper-300 leading-tight">
                    Sua honra nas ruas. Abre portas com NPCs e famílias tradicionais sem precisar disparar tiros.
                  </p>
                </div>

                <div className="p-2.5 bg-noir-850 rounded border border-blue-600/30">
                  <div className="flex items-center gap-1.5 text-blue-400 font-bold mb-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>INFLUÊNCIA</span>
                  </div>
                  <p className="text-[10px] text-paper-300 leading-tight">
                    Conexões políticas e policiais. Necessária para operações complexas e abafar queixas.
                  </p>
                </div>

                <div className="p-2.5 bg-noir-850 rounded border border-red-600/30">
                  <div className="flex items-center gap-1.5 text-red-400 font-bold mb-1">
                    <Skull className="w-3.5 h-3.5" />
                    <span>MEDO</span>
                  </div>
                  <p className="text-[10px] text-paper-300 leading-tight">
                    Intimidação. Acelera cobranças, mas valores excessivos atraem fiscalização policial pesada.
                  </p>
                </div>
              </div>

              {/* Escolha do Estilo */}
              <div className="pt-2">
                <label className="block text-xs font-mono uppercase text-gold-400 mb-2">
                  Escolha seu Estilo de Início:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {STYLE_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = style === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setStyle(opt.id)}
                        className={`cursor-pointer p-2.5 rounded border transition-all duration-200 flex flex-col justify-between ${
                          isSelected
                            ? 'bg-noir-800 border-gold-500 shadow-gold-subtle ring-1 ring-gold-500/40'
                            : 'bg-noir-850/80 border-noir-700 hover:border-noir-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <Icon className="w-3.5 h-3.5 text-gold-400" />
                            <h4 className="font-serif-vintage font-bold text-xs text-paper-100">
                              {opt.title}
                            </h4>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-gold-400" />}
                        </div>
                        <p className="text-[10px] font-mono text-gold-400 font-semibold mb-0.5">
                          {opt.bonus}
                        </p>
                        <p className="text-[9px] text-noir-400 leading-tight">
                          {opt.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              ETAPA 3: Seu Primeiro Ponto Comercial & Ciclos Automáticos
             ========================================================================= */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase font-semibold">
                  Fincando Raízes
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-paper-100 mt-0.5">
                  Seu Primeiro Estabelecimento
                </h2>
                <p className="text-xs text-noir-400 mt-1">
                  Um velho parceiro da Lapa guardou as chaves de um ponto para você começar.
                </p>
              </div>

              {/* Explicação dos Ciclos de Renda */}
              <div className="p-3 bg-noir-850 rounded border border-gold-500/20 text-xs font-mono space-y-1.5">
                <div className="flex items-center gap-1.5 text-gold-400 font-bold">
                  <Clock className="w-4 h-4" />
                  <span>Como funcionam os seus Negócios:</span>
                </div>
                <p className="text-[11px] text-paper-300 font-sans leading-relaxed">
                  Cada estabelecimento possui um <strong>ciclo de produção automático</strong>. Ele acumula dinheiro nos cofres mesmo com o jogo fechado. Quando estiver pronto, basta entrar e tocar em <em>Recolher</em>.
                </p>
              </div>

              {/* Configuração do primeiro negócio */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-mono uppercase text-gold-400 mb-1">
                    Nome do seu Ponto Comercial
                  </label>
                  <input
                    type="text"
                    placeholder={`Ex: Bar ${nickname || 'Aurora'}`}
                    value={firstBizName}
                    onChange={(e) => setFirstBizName(e.target.value)}
                    className="w-full bg-noir-850 border border-noir-700 rounded px-3 py-2 text-sm text-paper-100 placeholder-noir-500 focus:outline-none focus:border-gold-500"
                    maxLength={40}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gold-400 mb-1">
                    Bairro de Abertura
                  </label>
                  <select
                    value={firstDistrictId}
                    onChange={(e) => setFirstDistrictId(e.target.value)}
                    className="w-full bg-noir-850 border border-noir-700 rounded px-3 py-2 text-sm text-paper-100 focus:outline-none focus:border-gold-500"
                  >
                    {INITIAL_DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id} className="bg-noir-900 text-paper-100">
                        {d.name} ({d.economic_focus})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Simulação Interativa da Coleta */}
              <div className="bg-noir-950 p-3.5 rounded border border-noir-800 text-center space-y-2">
                <div className="text-[11px] font-mono text-paper-200">
                  {testCollected ? (
                    <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
                      <Check className="w-4 h-4" />
                      Receita inaugural de +$700 creditada na sua conta!
                    </span>
                  ) : (
                    <span>Experimente simular a abertura das portas e o primeiro caixa:</span>
                  )}
                </div>

                {!testCollected && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setTestCollected(true);
                      try {
                        confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
                      } catch {}
                    }}
                  >
                    <Coins className="w-3.5 h-3.5 mr-1.5" />
                    Abrir Portas & Recolher $700
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              ETAPA 4: As Ruas, Timers e a Gazeta da Capital
             ========================================================================= */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase font-semibold">
                  A Lei das Ruas
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-paper-100 mt-0.5">
                  Operações, Tempo & Jornais
                </h2>
                <p className="text-xs text-noir-400 mt-1">
                  Três regras fundamentais para prosperar no submundo de Santa Augusta:
                </p>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="p-3 bg-noir-850 rounded border border-noir-700/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-gold-400 font-bold">
                    <Crosshair className="w-4 h-4" />
                    <span>1. OPERAÇÕES REAIS (TIMERS NO SERVIDOR)</span>
                  </div>
                  <p className="text-[11px] text-paper-300 font-sans leading-relaxed">
                    Você pode mandar homens transportarem cargas, investigar rivais ou subornar policiais. Cada ação leva alguns minutos reais. <strong>Você pode fechar o aplicativo</strong> e retornar quando o trabalho estiver pronto.
                  </p>
                </div>

                <div className="p-3 bg-noir-850 rounded border border-noir-700/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-gold-400 font-bold">
                    <Newspaper className="w-4 h-4" />
                    <span>2. A GAZETA DA CAPITAL</span>
                  </div>
                  <p className="text-[11px] text-paper-300 font-sans leading-relaxed">
                    A Gazeta é o jornal que noticia grandes feitos e escândalos. Quando você compra um grande estabelecimento ou conclui uma jogada arriscada, seu nome vai parar na primeira página.
                  </p>
                </div>

                <div className="p-3 bg-noir-850 rounded border border-noir-700/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-gold-400 font-bold">
                    <Building2 className="w-4 h-4" />
                    <span>3. RETORNO DIÁRIO</span>
                  </div>
                  <p className="text-[11px] text-paper-300 font-sans leading-relaxed">
                    Ao abrir o jogo a cada novo dia, a tela <em>“Enquanto você estava fora...”</em> resume tudo o que acumulou, e você resgata recompensas diárias progressivas.
                  </p>
                </div>
              </div>

              <div className="pt-2 text-center">
                <p className="font-serif italic text-gold-400 text-sm font-bold">
                  “Qual será o seu próximo passo em Santa Augusta?”
                </p>
              </div>
            </div>
          )}

          {/* =========================================================================
              Controles de Navegação do Onboarding
             ========================================================================= */}
          <div className="mt-6 pt-4 border-t border-noir-800 flex items-center justify-between gap-3">
            {step > 1 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={prevStep}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setScreen('landing')}
              >
                Voltar ao Início
              </Button>
            )}

            {step < 4 ? (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={nextStep}
              >
                <span>Próximo Passo</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={handleFinishOnboarding}
                className="shadow-gold-glow animate-gold-pulse font-bold"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                ASSUMIR O CONTROLE DE SANTA AUGUSTA
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
