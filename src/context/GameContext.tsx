import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Character, PlayerBusiness, PlayerAction, InventoryItem, 
  PlayerMission, NewspaperArticle, Proposal, GameEvent, Territory, Family, OfflineSummary, CharacterStyle,
  RivalTarget, RivalAttack, SeasonData, PlayerDefense, SabotageTypeId, ReferralData 
} from '../types/game';
import { storageService } from '../services/storageService';
import { gameService } from '../services/gameService';
import { authService, AuthUser } from '../services/authService';
import { rivalService } from '../services/rivalService';
import { referralService } from '../services/referralService';
import { INITIAL_BUSINESS_TYPES, INITIAL_DISTRICTS } from '../lib/mockData';

export type Screen = 
  | 'landing' 
  | 'auth' 
  | 'character_creation' 
  | 'dashboard' 
  | 'businesses' 
  | 'actions' 
  | 'map' 
  | 'market' 
  | 'family' 
  | 'newspaper' 
  | 'ranking'
  | 'admin';

interface GameNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
}

interface GameContextType {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  character: Character | null;
  businesses: PlayerBusiness[];
  actions: PlayerAction[];
  activeAction: PlayerAction | null;
  inventory: InventoryItem[];
  missions: PlayerMission[];
  articles: NewspaperArticle[];
  families: Family[];
  territories: Territory[];
  proposals: Proposal[];
  events: GameEvent[];
  offlineSummary: OfflineSummary | null;
  dismissOfflineModal: () => void;
  notifications: GameNotification[];
  notify: (message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  
  // Ações de jogo
  createCharacter: (name: string, nickname: string, origin: string, style: CharacterStyle) => void;
  createCharacterWithFirstBusiness: (
    name: string, 
    nickname: string, 
    origin: string, 
    style: CharacterStyle, 
    firstBusinessName: string, 
    firstDistrictId: string
  ) => void;
  buyBusiness: (businessTypeId: string, districtId: string, customName?: string) => void;
  collectBusinessRevenue: (businessId: string) => void;
  upgradeBusiness: (businessId: string) => void;
  startAction: (actionTypeId: string) => void;
  completeAction: (actionId: string) => void;
  buyMarketItem: (itemId: string, quantity: number) => void;
  sellMarketItem: (itemId: string, quantity: number) => void;
  claimDailyReward: () => void;
  claimMissionReward: (missionId: string) => void;
  respondProposal: (proposalId: string, accept: boolean) => void;
  createFamily: (name: string, tag: string, motto: string) => void;
  joinFamily: (familyId: string) => void;
  resetGameData: (targetScreen?: Screen) => void;

  // Autenticação & Vinculação Google
  authUser: AuthUser | null;
  linkAccountWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logoutGoogle: () => Promise<void>;

  // Rivais, Sabotagens & Temporadas (Retenção / Social)
  rivals: RivalTarget[];
  attackLogs: RivalAttack[];
  playerDefense: PlayerDefense;
  season: SeasonData;
  executeSabotage: (rivalId: string, sabotageType: SabotageTypeId, isRevenge?: boolean) => Promise<{ success: boolean; message: string; lootMoney: number; lootRespect: number }>;
  hireGuard: () => void;
  upgradeSafe: () => void;
  claimSeasonReward: (level: number) => void;
  refreshRivals: () => void;

  // Sistema Viral de Indicação ("Indique 3 Amigos")
  referralData: ReferralData;
  applyReferralCode: (code: string) => Promise<{ success: boolean; message: string }>;
  claimReferralMilestone: () => void;
  simulateFriendInvite: (customName?: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [screen, setScreen] = useState<Screen>('landing');
  const [businesses, setBusinesses] = useState<PlayerBusiness[]>([]);
  const [actions, setActions] = useState<PlayerAction[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [missions, setMissions] = useState<PlayerMission[]>([]);
  const [articles, setArticles] = useState<NewspaperArticle[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [offlineSummary, setOfflineSummary] = useState<OfflineSummary | null>(null);
  const [notifications, setNotifications] = useState<GameNotification[]>([]);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  // Estados de Rivais & Temporadas
  const [rivals, setRivals] = useState<RivalTarget[]>([]);
  const [attackLogs, setAttackLogs] = useState<RivalAttack[]>([]);
  const [playerDefense, setPlayerDefense] = useState<PlayerDefense>({ guards_count: 1, safe_level: 1 });
  const [season, setSeason] = useState<SeasonData>(rivalService.getSeasonData());
  const [referralData, setReferralData] = useState<ReferralData>(referralService.getReferralData());

  const notify = useCallback((message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
    const id = 'notif-' + Date.now() + '-' + Math.random();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4500);
  }, []);

  // Recarrega todos os dados do storage
  const reloadData = useCallback(() => {
    const char = storageService.getCharacter();
    setCharacter(char);

    // Hidrata negócios com seus tipos e distritos
    const rawBizs = storageService.getBusinesses();
    const hydratedBizs = rawBizs.map(b => ({
      ...b,
      type: INITIAL_BUSINESS_TYPES.find(t => t.id === b.business_type_id) || b.type,
      district: INITIAL_DISTRICTS.find(d => d.id === b.district_id) || b.district
    }));
    setBusinesses(hydratedBizs);

    setActions(storageService.getActions());
    setInventory(storageService.getInventory());
    setMissions(storageService.getPlayerMissions());
    setArticles(storageService.getArticles());
    setFamilies(storageService.getFamilies());
    setTerritories(storageService.getTerritories());
    setProposals(storageService.getProposals());
    setEvents(storageService.getEvents());

    // Atualiza Rivais, Defesa e Temporadas
    setRivals(rivalService.getRivals());
    setAttackLogs(rivalService.getAttackLogs());
    setPlayerDefense(rivalService.getPlayerDefense());
    setSeason(rivalService.getSeasonData());
    setReferralData(referralService.getReferralData(char));

    if (char) {
      const summary = gameService.getOfflineSummary(char);
      if (summary.ready_businesses.length > 0 || summary.completed_actions.length > 0 || summary.pending_proposals_count > 0) {
        setOfflineSummary(summary);
      }
    }
  }, []);

  // Inicialização no mount
  useEffect(() => {
    authService.getCurrentUser().then(u => {
      if (u) setAuthUser(u);
    });

    try {
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      if (params && params.has('ref')) {
        const refCode = params.get('ref');
        if (refCode) {
          referralService.setPendingRef(refCode);
        }
      }
      if (params && (params.has('onboarding') || params.has('reset'))) {
        storageService.clearAll();
        setCharacter(null);
        reloadData();
        setScreen('character_creation');
        return;
      }
    } catch {
      // Ignora erro de parsing de URL
    }

    const char = storageService.getCharacter();
    if (char) {
      setCharacter(char);
      setScreen('dashboard');
    } else {
      // Sem personagem salvo, vai diretamente para a criação/onboarding
      setScreen('character_creation');
    }
    reloadData();
  }, [reloadData]);

  // Timer heartbeat a cada segundo para checar ações ativas
  useEffect(() => {
    const interval = setInterval(() => {
      const currentActions = storageService.getActions();
      const inProgress = currentActions.find(a => a.status === 'in_progress');
      if (inProgress) {
        setActions([...currentActions]);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeAction = actions.find(a => a.status === 'in_progress') || null;

  const dismissOfflineModal = () => {
    setOfflineSummary(null);
  };

  // Criação de personagem
  const createCharacter = (name: string, nickname: string, origin: string, style: CharacterStyle) => {
    let newChar = gameService.createCharacter(name, nickname, origin, style);
    const pendingRef = referralService.getPendingRef();
    if (pendingRef) {
      const refRes = referralService.applyReferralCode(newChar, pendingRef);
      if (refRes.success) {
        newChar = refRes.character;
        setReferralData(refRes.referralData);
        notify(`Convite aceito! Você recebeu $1.000 réis e 1 Caixa de Whisky do seu padrinho (${pendingRef})!`, 'success');
      }
    }
    setCharacter(newChar);
    reloadData();
    setScreen('dashboard');
    notify(`Bem-vindo a Santa Augusta, ${nickname}. A cidade aguarda seus passos.`, 'success');
  };

  const createCharacterWithFirstBusiness = (
    name: string, 
    nickname: string, 
    origin: string, 
    style: CharacterStyle,
    firstBusinessName: string,
    firstDistrictId: string
  ) => {
    const res = gameService.createCharacterWithFirstBusiness(
      name, nickname, origin, style, firstBusinessName, firstDistrictId
    );
    let finalChar = res.character;
    const pendingRef = referralService.getPendingRef();
    if (pendingRef) {
      const refRes = referralService.applyReferralCode(finalChar, pendingRef);
      if (refRes.success) {
        finalChar = refRes.character;
        setReferralData(refRes.referralData);
        notify(`Convite aceito! Você recebeu $1.000 réis e 1 Caixa de Whisky do seu padrinho (${pendingRef})!`, 'success');
      }
    }
    setCharacter(finalChar);
    reloadData();
    setScreen('dashboard');
    notify(`Seu nome circula por Santa Augusta, ${nickname}. "${res.business.custom_name}" abriu as portas!`, 'success');
  };

  // Compra de negócio
  const buyBusiness = (businessTypeId: string, districtId: string, customName?: string) => {
    if (!character) return;
    const res = gameService.buyBusiness(character, businessTypeId, districtId, customName);
    if (res.success && res.character) {
      setCharacter(res.character);
      reloadData();
      notify(res.message, 'success');
    } else {
      notify(res.message, 'error');
    }
  };

  // Coleta de renda
  const collectBusinessRevenue = (businessId: string) => {
    if (!character) return;
    const res = gameService.collectBusinessRevenue(character, businessId);
    if (res.success && res.character) {
      setCharacter(res.character);
      reloadData();
      notify(res.message, 'success');
    } else {
      notify(res.message, 'warning');
    }
  };

  // Upgrade
  const upgradeBusiness = (businessId: string) => {
    if (!character) return;
    const res = gameService.upgradeBusiness(character, businessId);
    if (res.success && res.character) {
      setCharacter(res.character);
      reloadData();
      notify(res.message, 'success');
    } else {
      notify(res.message, 'error');
    }
  };

  // Iniciar Ação
  const startAction = (actionTypeId: string) => {
    if (!character) return;
    const res = gameService.startAction(character, actionTypeId);
    if (res.success && res.character) {
      setCharacter(res.character);
      reloadData();
      notify(res.message, 'info');
    } else {
      notify(res.message, 'warning');
    }
  };

  // Concluir Ação
  const completeAction = (actionId: string) => {
    if (!character) return;
    const res = gameService.completeAction(character, actionId);
    if (res.success && res.character) {
      setCharacter(res.character);
      reloadData();
      if (res.outcome === 'sucesso_total') {
        notify(res.message, 'success');
      } else if (res.outcome === 'sucesso_parcial') {
        notify(res.message, 'warning');
      } else {
        notify(res.message, 'error');
      }
    } else {
      notify(res.message, 'warning');
    }
  };

  // Mercado
  const buyMarketItem = (itemId: string, quantity: number) => {
    if (!character) return;
    const res = gameService.buyMarketItem(character, itemId, quantity);
    if (res.success && res.character) {
      setCharacter(res.character);
      reloadData();
      notify(res.message, 'success');
    } else {
      notify(res.message, 'error');
    }
  };

  const sellMarketItem = (itemId: string, quantity: number) => {
    if (!character) return;
    const res = gameService.sellMarketItem(character, itemId, quantity);
    if (res.success && res.character) {
      setCharacter(res.character);
      reloadData();
      notify(res.message, 'success');
    } else {
      notify(res.message, 'error');
    }
  };

  // Login Diário
  const claimDailyReward = () => {
    if (!character) return;
    const res = gameService.claimDailyReward(character);
    if (res.success && res.character) {
      setCharacter(res.character);
      reloadData();
      notify(res.message, 'success');
    } else {
      notify(res.message, 'info');
    }
  };

  // Resgate de Missão
  const claimMissionReward = (missionId: string) => {
    if (!character) return;
    const res = gameService.claimMissionReward(character, missionId);
    if (res.success && res.character) {
      setCharacter(res.character);
      reloadData();
      notify(res.message, 'success');
    } else {
      notify(res.message, 'error');
    }
  };

  // Propostas assíncronas
  const respondProposal = (proposalId: string, accept: boolean) => {
    const currentProposals = storageService.getProposals();
    const prop = currentProposals.find(p => p.id === proposalId);
    if (!prop || !character) return;

    if (accept) {
      // Aceita proposta: transfere mercadoria e dinheiro
      const inv = storageService.getInventory();
      if (prop.requested_item_id && prop.requested_item_qty > 0) {
        const invItem = inv.find(i => i.item_id === prop.requested_item_id);
        if (!invItem || invItem.quantity < prop.requested_item_qty) {
          notify('Você não possui as mercadorias exigidas no acordo.', 'error');
          return;
        }
        invItem.quantity -= prop.requested_item_qty;
        storageService.saveInventory(inv);
      }

      const updatedChar: Character = {
        ...character,
        money: character.money + prop.offered_money - prop.requested_money,
        respect: character.respect + 4
      };
      storageService.saveCharacter(updatedChar);
      setCharacter(updatedChar);

      prop.status = 'accepted';
      storageService.saveProposals(currentProposals);
      reloadData();
      notify(`Acordo com ${prop.sender_name} selado com aperto de mão!`, 'success');
    } else {
      prop.status = 'rejected';
      storageService.saveProposals(currentProposals);
      reloadData();
      notify('Proposta recusada com discrição.', 'info');
    }
  };

  // Criação de Família
  const createFamily = (name: string, tag: string, motto: string) => {
    if (!character) return;
    if (character.money < 10000) {
      notify('São necessários $10.000 nos cofres para oficializar uma família.', 'error');
      return;
    }

    const currentFams = storageService.getFamilies();
    const newFamily: Family = {
      id: 'fam-' + Date.now(),
      name,
      tag: tag.toUpperCase().slice(0, 5),
      motto,
      leader_id: character.id,
      leader_name: character.name,
      treasury: 5000,
      reputation: 25,
      banner_color: '#c5a059',
      is_npc: false,
      member_count: 1
    };

    currentFams.push(newFamily);
    storageService.saveFamilies(currentFams);

    const updatedChar: Character = {
      ...character,
      money: character.money - 10000,
      family_id: newFamily.id,
      family_name: newFamily.name,
      family_role: 'lider',
      respect: character.respect + 20
    };
    storageService.saveCharacter(updatedChar);
    setCharacter(updatedChar);
    reloadData();

    // Notícia na Gazeta
    storageService.addArticle({
      edition_number: 150,
      headline: `NOVA FORÇA NASCE NAS RUAS: A ${newFamily.name.toUpperCase()} SE APRESENTA`,
      subheadline: `${character.name} ergue sua bandeira e convoca aliados para a disputa por Santa Augusta.`,
      category: 'FAMÍLIAS',
      content: `O submundo político de Santa Augusta tem um novo concorrente de peso. Sob a liderança de ${character.name}, a "${newFamily.name}" estabeleceu sua sede e promete disputar a hegemonia com as famílias tradicionais.`,
      related_character_name: character.name
    });

    notify(`A ${newFamily.name} foi fundada! Sua bandeira foi erguida.`, 'success');
  };

  const joinFamily = (familyId: string) => {
    if (!character) return;
    const currentFams = storageService.getFamilies();
    const fam = currentFams.find(f => f.id === familyId);
    if (!fam) return;

    fam.member_count = (fam.member_count || 1) + 1;
    storageService.saveFamilies(currentFams);

    const updatedChar: Character = {
      ...character,
      family_id: fam.id,
      family_name: fam.name,
      family_role: 'membro',
      respect: character.respect + 8
    };
    storageService.saveCharacter(updatedChar);
    setCharacter(updatedChar);
    reloadData();
    notify(`Você prestou juramento à ${fam.name}. Honre seu nome.`, 'success');
  };

  const resetGameData = (targetScreen: Screen = 'character_creation') => {
    storageService.clearAll();
    setCharacter(null);
    reloadData();
    setScreen(targetScreen);
    notify('Jogo reiniciado! Abrindo novo Onboarding...', 'success');
  };

  // Autenticação & Vinculação Google
  const linkAccountWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await authService.signInWithGoogle();
      if (!res.success) return { success: false, error: res.error };

      const user = res.user || (await authService.getCurrentUser());
      if (user) {
        setAuthUser(user);
        if (character) {
          const { character: updatedChar, bonusGranted } = authService.linkCharacterToGoogle(
            character, 
            user.email || 'jogador1929@gmail.com'
          );
          setCharacter(updatedChar);
          if (bonusGranted) {
            notify('Conta vinculada ao Google! Bônus de +$500 réis e +5 Respeito creditados!', 'success');
          } else {
            notify('Conta Google conectada com sucesso.', 'success');
          }
        }
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Falha ao conectar com o Google.' };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await authService.signInWithGoogle();
      if (!res.success) return { success: false, error: res.error };
      const user = res.user || (await authService.getCurrentUser());
      if (user) {
        setAuthUser(user);
        reloadData();
        const char = storageService.getCharacter();
        if (char) {
          setScreen('dashboard');
          notify(`Bem-vindo de volta a Santa Augusta, ${char.nickname}!`, 'success');
        } else {
          setScreen('character_creation');
        }
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Falha ao autenticar com o Google.' };
    }
  };

  const logoutGoogle = async () => {
    await authService.signOut();
    setAuthUser(null);
    if (character) {
      const updatedChar = { ...character, is_cloud_synced: false };
      setCharacter(updatedChar);
      storageService.saveCharacter(updatedChar);
    }
    notify('Desconectado da conta Google.', 'info');
  };

  // Funções de Rivais & Temporadas
  const executeSabotage = async (rivalId: string, sabotageType: SabotageTypeId, isRevenge = false) => {
    if (!character) return { success: false, message: 'Personagem não encontrado.', lootMoney: 0, lootRespect: 0 };
    const res = rivalService.executeSabotage(character, rivalId, sabotageType, isRevenge);
    setCharacter(res.character);
    reloadData();
    if (res.success) {
      notify(res.message, 'success');
    } else {
      notify(res.message, 'warning');
    }
    return {
      success: res.success,
      message: res.message,
      lootMoney: res.lootMoney,
      lootRespect: res.lootRespect
    };
  };

  const hireGuard = () => {
    if (!character) return;
    const res = rivalService.hireGuard(character);
    if (res.success) {
      setCharacter(res.character);
      setPlayerDefense(res.defense);
      reloadData();
      notify(res.message, 'success');
    } else {
      notify(res.message, 'error');
    }
  };

  const upgradeSafe = () => {
    if (!character) return;
    const res = rivalService.upgradeSafe(character);
    if (res.success) {
      setCharacter(res.character);
      setPlayerDefense(res.defense);
      reloadData();
      notify(res.message, 'success');
    } else {
      notify(res.message, 'error');
    }
  };

  const claimSeasonReward = (level: number) => {
    if (!character) return;
    const res = rivalService.claimSeasonReward(character, level);
    if (res.success) {
      setCharacter(res.character);
      setSeason(res.season);
      reloadData();
      notify(res.message, 'success');
    } else {
      notify(res.message, 'info');
    }
  };

  const refreshRivals = () => {
    setRivals(rivalService.getRivals());
  };

  // Sistema Viral de Indicação ("Indique 3 Amigos")
  const applyReferralCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    if (!character) return { success: false, message: 'Personagem não encontrado.' };
    const res = referralService.applyReferralCode(character, code);
    setCharacter(res.character);
    setReferralData(res.referralData);
    reloadData();
    if (res.success) {
      notify(res.message, 'success');
    } else {
      notify(res.message, 'error');
    }
    return { success: res.success, message: res.message };
  };

  const claimReferralMilestone = () => {
    if (!character) return;
    const res = referralService.claimMilestone3(character);
    if (res.success) {
      setCharacter(res.character);
      setReferralData(res.referralData);
      reloadData();
      notify(res.message, 'success');
    } else {
      notify(res.message, 'error');
    }
  };

  const simulateFriendInvite = (customName?: string) => {
    if (!character) return;
    const res = referralService.simulateFriendJoined(character, customName);
    if (res.success) {
      setCharacter(res.character);
      setReferralData(res.referralData);
      reloadData();
      notify(res.message, 'success');
    }
  };

  return (
    <GameContext.Provider
      value={{
        screen,
        setScreen,
        character,
        businesses,
        actions,
        activeAction,
        inventory,
        missions,
        articles,
        families,
        territories,
        proposals,
        events,
        offlineSummary,
        dismissOfflineModal,
        notifications,
        notify,
        createCharacter,
        createCharacterWithFirstBusiness,
        buyBusiness,
        collectBusinessRevenue,
        upgradeBusiness,
        startAction,
        completeAction,
        buyMarketItem,
        sellMarketItem,
        claimDailyReward,
        claimMissionReward,
        respondProposal,
        createFamily,
        joinFamily,
        resetGameData,
        authUser,
        linkAccountWithGoogle,
        loginWithGoogle,
        logoutGoogle,
        rivals,
        attackLogs,
        playerDefense,
        season,
        executeSabotage,
        hireGuard,
        upgradeSafe,
        claimSeasonReward,
        refreshRivals,
        referralData,
        applyReferralCode,
        claimReferralMilestone,
        simulateFriendInvite
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
