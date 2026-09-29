import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { INITIAL_DISTRICTS } from '../lib/mockData';
import { District } from '../types/game';
import { Button } from '../components/common/Button';
import { GameImage } from '../components/common/GameImage';
import { 
  MapPin, ShieldAlert, Users, Building2, 
  Landmark, Ship, Train, Wine, Wrench, Trees, ArrowRight
} from 'lucide-react';

export const MapPage: React.FC = () => {
  const { territories, businesses, setScreen } = useGame();
  const [selectedDistrict, setSelectedDistrict] = useState<District>(INITIAL_DISTRICTS[0]);

  const districtIcons: Record<string, React.ElementType> = {
    landmark: Landmark,
    ship: Ship,
    train: Train,
    wine: Wine,
    wrench: Wrench,
    trees: Trees
  };

  const getDistrictTheme = (slug: string): 'gold' | 'blue' | 'neutral' | 'purple' | 'crimson' | 'emerald' => {
    switch (slug) {
      case 'centro': return 'gold';
      case 'porto': return 'blue';
      case 'estacao': return 'neutral';
      case 'boemio': return 'purple';
      case 'suburbio': return 'crimson';
      case 'interior': return 'emerald';
      default: return 'gold';
    }
  };

  const currentTerritories = territories.filter(t => t.district_id === selectedDistrict.id);
  const districtBusinesses = businesses.filter(b => b.district_id === selectedDistrict.id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-5 pb-24">
      {/* Cabeçalho */}
      <div className="pb-3 border-b border-noir-800">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gold-400 shrink-0" />
          <h2 className="font-display text-xl font-bold text-paper-100">
            Planta Urbana de Santa Augusta
          </h2>
        </div>
        <p className="text-xs text-noir-400 mt-0.5">
          Os 6 distritos sob disputa permanente entre as grandes famílias e a polícia estadual.
        </p>
      </div>

      {/* Grid Interativo dos 6 Bairros Estilizados (Mobile First) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {INITIAL_DISTRICTS.map((dist) => {
          const Icon = districtIcons[dist.icon] || MapPin;
          const isSelected = selectedDistrict.id === dist.id;
          const myBizCount = businesses.filter(b => b.district_id === dist.id).length;
          const theme = getDistrictTheme(dist.slug);

          return (
            <div
              key={dist.id}
              onClick={() => setSelectedDistrict(dist)}
              className={`cursor-pointer rounded-lg border-2 transition-all duration-200 flex flex-col justify-between overflow-hidden select-none relative group ${
                isSelected
                  ? 'border-gold-500 shadow-gold-subtle ring-2 ring-gold-500/50 bg-noir-850'
                  : 'border-noir-800 hover:border-noir-600 bg-noir-900'
              }`}
            >
              {/* Header visual ilustrado com GameImage */}
              <div className="relative h-16 sm:h-20 w-full overflow-hidden">
                <GameImage
                  src={dist.illustration}
                  alt={dist.name}
                  iconType={dist.icon}
                  theme={theme}
                  aspect="w-full h-full"
                />

                {/* Ícone flutuante */}
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
                  <div className={`p-1 rounded backdrop-blur-md border ${
                    isSelected 
                      ? 'bg-gold-500 text-noir-950 border-gold-400 font-bold' 
                      : 'bg-noir-950/85 text-paper-200 border-noir-700'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Badge de estabelecimentos próprios */}
                {myBizCount > 0 && (
                  <div className="absolute top-2 right-2 z-10">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500 text-noir-950 font-black shadow border border-emerald-300">
                      {myBizCount} Ponto{myBizCount > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>

              {/* Informações textuais compactas */}
              <div className="p-2 sm:p-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className={`font-serif-vintage font-bold text-xs sm:text-sm line-clamp-1 ${
                    isSelected ? 'text-gold-400' : 'text-paper-100'
                  }`}>
                    {dist.name}
                  </h4>
                  <p className="text-[10px] text-noir-400 mt-0.5 line-clamp-1 font-serif italic">
                    {dist.economic_focus}
                  </p>
                </div>

                <div className="mt-2 pt-1.5 border-t border-noir-800 text-[9px] sm:text-[10px] font-mono flex items-center justify-between text-noir-400">
                  <span>Risco: <strong className="text-paper-200">{dist.base_risk}%</strong></span>
                  <span>Polícia: <strong className="text-red-400">{dist.police_presence}%</strong></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Painel de Detalhes do Bairro Selecionado */}
      <div className="bg-noir-900 border border-gold-500/40 rounded-lg shadow-2xl overflow-hidden relative">
        {/* Banner Ilustrado do Distrito com GameImage */}
        <div className="relative w-full h-36 sm:h-48 overflow-hidden">
          <GameImage
            src={selectedDistrict.illustration}
            alt={selectedDistrict.name}
            iconType={selectedDistrict.icon}
            theme={getDistrictTheme(selectedDistrict.slug)}
            aspect="w-full h-full"
          />

          {/* Badges superiores sobre a imagem */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 bg-noir-950/90 px-2 py-0.5 rounded border border-gold-500/40 font-bold">
              Distrito sob Análise
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-paper-200 bg-noir-950/90 px-2 py-0.5 rounded border border-red-500/40 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-red-400" />
              <span>Polícia: <strong className="text-red-400">{selectedDistrict.police_presence}%</strong></span>
            </span>
          </div>

          {/* Título e Tagline posicionados na parte inferior da imagem */}
          <div className="absolute bottom-2.5 left-3 sm:left-4 right-3 sm:right-4 z-10">
            <h3 className="font-display text-xl sm:text-2xl font-black text-paper-100 drop-shadow-md">
              {selectedDistrict.name}
            </h3>
            <p className="font-serif italic text-gold-400 text-xs drop-shadow line-clamp-1">
              "{selectedDistrict.tagline}"
            </p>
          </div>
        </div>

        {/* Corpo do Detalhe */}
        <div className="p-4 sm:p-5 space-y-4">
          <p className="text-xs text-paper-300 leading-relaxed font-serif">
            {selectedDistrict.description}
          </p>

          {/* Divisão de Influência das Famílias */}
          <div className="space-y-2.5 pt-3 border-t border-noir-800">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-gold-400">
              <Users className="w-3.5 h-3.5" />
              <span>Domínio Territorial &amp; Influência</span>
            </div>

            <div className="space-y-2">
              {currentTerritories.map((t) => (
                <div key={t.id} className="text-xs">
                  <div className="flex justify-between font-mono mb-1 text-paper-200 text-[11px]">
                    <span className="truncate pr-2">{t.family_name || 'Comerciantes Independentes'}</span>
                    <span className="font-bold text-gold-400 shrink-0">{t.influence_percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 sm:h-2 bg-noir-800 rounded-full overflow-hidden border border-noir-700">
                    <div
                      className="h-full bg-gradient-to-r from-gold-600 to-gold-400"
                      style={{ width: `${t.influence_percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estabelecimentos do Jogador no Bairro */}
          <div className="pt-3 border-t border-noir-800">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-gold-400">
                <Building2 className="w-3.5 h-3.5" />
                <span>Seus Negócios Aqui ({districtBusinesses.length})</span>
              </div>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setScreen('businesses')}
                className="text-xs py-1 px-3 h-auto min-h-[34px] font-bold"
              >
                <span>Abrir Ponto</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>

            {districtBusinesses.length === 0 ? (
              <p className="text-xs text-noir-400 italic">
                Você ainda não fincou sua bandeira comercial no {selectedDistrict.name}.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {districtBusinesses.map((b) => (
                  <div key={b.id} className="p-2.5 bg-noir-850 rounded border border-noir-700 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-serif-vintage font-bold text-paper-100 block">{b.custom_name}</span>
                      <span className="text-[10px] text-gold-400 font-mono">Nível {b.level}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60 font-bold">
                      Ativo
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
