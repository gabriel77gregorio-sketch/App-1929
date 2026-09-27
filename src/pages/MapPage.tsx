import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { INITIAL_DISTRICTS } from '../lib/mockData';
import { District } from '../types/game';
import { Button } from '../components/common/Button';
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

  const currentTerritories = territories.filter(t => t.district_id === selectedDistrict.id);
  const districtBusinesses = businesses.filter(b => b.district_id === selectedDistrict.id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-6 pb-24">
      {/* Cabeçalho */}
      <div className="pb-3 border-b border-noir-800">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gold-400" />
          <h2 className="font-display text-xl font-bold text-paper-100">
            Planta Urbana de Santa Augusta
          </h2>
        </div>
        <p className="text-xs text-noir-400 mt-0.5">
          Os 6 distritos sob disputa permanente entre as grandes famílias e a polícia estadual.
        </p>
      </div>

      {/* Grid Interativo dos 6 Bairros Estilizados */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {INITIAL_DISTRICTS.map((dist) => {
          const Icon = districtIcons[dist.icon] || MapPin;
          const isSelected = selectedDistrict.id === dist.id;
          const myBizCount = businesses.filter(b => b.district_id === dist.id).length;

          return (
            <div
              key={dist.id}
              onClick={() => setSelectedDistrict(dist)}
              className={`cursor-pointer p-3 rounded-lg border transition-all duration-200 flex flex-col justify-between select-none relative ${
                isSelected
                  ? 'bg-noir-850 border-gold-500 shadow-gold-subtle ring-1 ring-gold-500/50'
                  : 'bg-noir-900 border-noir-800 hover:border-noir-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded ${isSelected ? 'bg-gold-500/20 text-gold-400' : 'bg-noir-800 text-noir-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {myBizCount > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-400 border border-gold-500/30 font-bold" title="Seus estabelecimentos">
                      {myBizCount} Ponto(s)
                    </span>
                  )}
                </div>
                <h4 className="font-serif-vintage font-bold text-sm text-paper-100">
                  {dist.name}
                </h4>
                <p className="text-[10px] text-noir-400 mt-0.5 line-clamp-1">
                  {dist.economic_focus}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-noir-800 text-[10px] font-mono flex items-center justify-between text-paper-300">
                <span>Risco: {dist.base_risk}%</span>
                <span>Polícia: {dist.police_presence}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Painel de Detalhes do Bairro Selecionado */}
      <div className="bg-noir-900 border border-gold-500/30 rounded-lg p-5 shadow-2xl relative">
        <div className="border-b border-noir-800 pb-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-500 font-semibold">
              Distrito sob Análise
            </span>
            <span className="text-xs font-mono text-noir-400">
              Presença Policial: <strong className="text-red-400">{selectedDistrict.police_presence}%</strong>
            </span>
          </div>

          <h3 className="font-display text-2xl font-bold text-paper-100 mt-1">
            {selectedDistrict.name}
          </h3>
          <p className="font-serif italic text-gold-400 text-xs mt-0.5">
            "{selectedDistrict.tagline}"
          </p>
          <p className="text-xs text-noir-300 mt-2 leading-relaxed">
            {selectedDistrict.description}
          </p>
        </div>

        {/* Divisão de Influência das Famílias */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-gold-400">
            <Users className="w-3.5 h-3.5" />
            <span>Domínio Territorial & Influência</span>
          </div>

          <div className="space-y-2">
            {currentTerritories.map((t) => (
              <div key={t.id} className="text-xs">
                <div className="flex justify-between font-mono mb-1 text-paper-200">
                  <span>{t.family_name || 'Comerciantes Independentes'}</span>
                  <span className="font-bold text-gold-400">{t.influence_percentage}%</span>
                </div>
                <div className="w-full h-2 bg-noir-800 rounded-full overflow-hidden border border-noir-700">
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
        <div className="pt-4 border-t border-noir-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-gold-400">
              <Building2 className="w-3.5 h-3.5" />
              <span>Seus Negócios Aqui ({districtBusinesses.length})</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setScreen('businesses')}
            >
              <span>Abrir Estabelecimento</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          {districtBusinesses.length === 0 ? (
            <p className="text-xs text-noir-400 italic">
              Você ainda não fincou sua bandeira comercial no {selectedDistrict.name}.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {districtBusinesses.map((b) => (
                <div key={b.id} className="p-2.5 bg-noir-850 rounded border border-noir-700 text-xs">
                  <span className="font-serif-vintage font-bold text-paper-100">{b.custom_name}</span>
                  <span className="text-[10px] text-gold-400 block font-mono">Nível {b.level}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
