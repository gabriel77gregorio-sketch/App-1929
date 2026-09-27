import React from 'react';
import { useGame, Screen } from '../../context/GameContext';
import { 
  Building2, Crosshair, MapPin, Store, 
  Newspaper, Users, Home 
} from 'lucide-react';

interface NavItem {
  id: Screen;
  label: string;
  icon: React.ElementType;
  badge?: number | boolean;
}

export const BottomNav: React.FC = () => {
  const { screen, setScreen, activeAction, businesses, proposals } = useGame();

  // Verifica se há algum negócio pronto para coletar
  const now = Date.now();
  const hasReadyBusiness = businesses.some(b => now >= new Date(b.next_collection_at).getTime());
  const pendingProposalsCount = proposals.filter(p => p.status === 'pending').length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { 
      id: 'businesses', 
      label: 'Negócios', 
      icon: Building2, 
      badge: hasReadyBusiness 
    },
    { 
      id: 'actions', 
      label: 'Operações', 
      icon: Crosshair, 
      badge: Boolean(activeAction) 
    },
    { id: 'map', label: 'Mapa', icon: MapPin },
    { id: 'market', label: 'Mercado', icon: Store },
    { id: 'newspaper', label: 'Gazeta', icon: Newspaper },
    { 
      id: 'family', 
      label: 'Famílias', 
      icon: Users, 
      badge: pendingProposalsCount > 0 ? pendingProposalsCount : false 
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-noir-950/95 backdrop-blur-md border-t border-noir-800 pb-safe">
      <div className="max-w-xl mx-auto flex items-center justify-around px-1 py-1.5 sm:py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = screen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 select-none ${
                isActive ? 'text-gold-400 scale-105' : 'text-noir-400 hover:text-paper-300'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2px]' : 'stroke-[1.8px]'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-gold-500 animate-ping" />
                )}
                {item.badge && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-gold-400 ring-2 ring-noir-950" />
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight font-medium ${isActive ? 'text-gold-400 font-semibold' : 'text-noir-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-6 h-0.5 bg-gold-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
