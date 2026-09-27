import React from 'react';
import { useGame } from './context/GameContext';
import { TopBar } from './components/common/TopBar';
import { BottomNav } from './components/common/BottomNav';
import { NotificationToast } from './components/common/NotificationToast';
import { WelcomeBackModal } from './components/dashboard/WelcomeBackModal';

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

export const App: React.FC = () => {
  const { screen, character } = useGame();

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

      {/* Navegação Inferior Mobile-First */}
      <BottomNav />
    </div>
  );
};
