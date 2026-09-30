import React from 'react';
import { useGame } from './context/GameContext';
import { TopBar } from './components/common/TopBar';
import { BottomNav } from './components/common/BottomNav';
import { NotificationToast } from './components/common/NotificationToast';
import { WelcomeBackModal } from './components/dashboard/WelcomeBackModal';
import { PWAInstallBanner } from './components/common/PWAInstallBanner';
import { ActionOutcomeModal } from './components/common/ActionOutcomeModal';

// Telas
import { LandingPage } from './pages/LandingPage';
import { CharacterCreationPage } from './pages/CharacterCreationPage';
import { DashboardPage } from './pages/DashboardPage';
import { BusinessesPage } from './pages/BusinessesPage';
import { ActionsPage } from './pages/ActionsPage';
import { MapPage } from './pages/MapPage';
import { MarketPage } from './pages/MarketPage';
import { FamilyPage } from './pages/FamilyPage';
import { NewspaperPage } from './pages/NewspaperPage';
import { RankingPage } from './pages/RankingPage';
import { AdminPage } from './pages/AdminPage';
import { Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const { screen, character, resetGameData, completedActionReport, dismissActionReport } = useGame();

  // Se não tem personagem ou está na landing/criação, exibe as telas dedicadas
  if (screen === 'landing') {
    return <LandingPage />;
  }

  if (screen === 'character_creation' || !character) {
    return <CharacterCreationPage />;
  }

  return (
    <div className="min-h-screen bg-noir-950 text-paper-100 flex flex-col justify-between selection:bg-gold-500 selection:text-noir-950">
      {/* Barra de Notificações Toast */}
      <NotificationToast />

      {/* Modal 'Enquanto você estava fora...' */}
      <WelcomeBackModal />

      {/* Modal Retrô de Desfecho da Ação / Cinema 1929 */}
      {completedActionReport && (
        <ActionOutcomeModal
          isOpen={true}
          onClose={dismissActionReport}
          action={completedActionReport}
        />
      )}

      {/* Banner de Instalação PWA no Celular */}
      <PWAInstallBanner />

      {/* Barra Superior com Recursos */}
      <TopBar />

      {/* Área Central de Conteúdo da Tela Selecionada */}
      <main className="flex-1 w-full animate-fadeIn">
        {screen === 'dashboard' && <DashboardPage />}
        {screen === 'businesses' && <BusinessesPage />}
        {screen === 'actions' && <ActionsPage />}
        {screen === 'map' && <MapPage />}
        {screen === 'market' && <MarketPage />}
        {screen === 'family' && <FamilyPage />}
        {screen === 'newspaper' && <NewspaperPage />}
        {screen === 'ranking' && <RankingPage />}
        {screen === 'admin' && <AdminPage />}
      </main>

      {/* Botão Flutuante de Acesso Rápido para Testar o Onboarding */}
      <div className="fixed bottom-16 right-3 z-50 sm:bottom-20 sm:right-6">
        <button
          onClick={() => resetGameData('character_creation')}
          className="bg-gold-500 hover:bg-gold-400 text-noir-950 font-black text-xs px-3.5 py-2 rounded-full shadow-2xl border-2 border-noir-900 flex items-center gap-1.5 animate-gold-pulse cursor-pointer transition-transform hover:scale-105 active:scale-95"
          title="Reiniciar e Abrir o Novo Onboarding de 21 Páginas"
        >
          <Sparkles className="w-4 h-4 text-noir-950" />
          <span>Testar Onboarding (21 Páginas)</span>
        </button>
      </div>

      {/* Navegação Inferior Mobile-First */}
      <BottomNav />
    </div>
  );
};
