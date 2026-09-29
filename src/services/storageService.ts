// Serviço de armazenamento e persistência com fallback local seguro
import { 
  Character, PlayerBusiness, PlayerAction, InventoryItem, 
  PlayerMission, NewspaperArticle, Proposal, GameEvent, Territory, Family 
} from '../types/game';
import { 
  INITIAL_DISTRICTS, INITIAL_BUSINESS_TYPES, INITIAL_ACTION_TYPES, 
  INITIAL_MARKET_ITEMS, INITIAL_FAMILIES, INITIAL_TERRITORIES, 
  INITIAL_ARTICLES, INITIAL_MISSIONS, INITIAL_EVENTS 
} from '../lib/mockData';

const STORAGE_KEYS = {
  CHARACTER: '1929_character',
  BUSINESSES: '1929_businesses',
  ACTIONS: '1929_actions',
  INVENTORY: '1929_inventory',
  MISSIONS: '1929_missions',
  ARTICLES: '1929_articles',
  PROPOSALS: '1929_proposals',
  FAMILIES: '1929_families',
  TERRITORIES: '1929_territories',
  EVENTS: '1929_events',
  LAST_SEEN: '1929_last_seen',
};

// Funções seguras de acesso ao localStorage (evita crashes em iframes, modo anônimo estrito ou bloqueio de cookies)
const safeGetItem = (key: string): string | null => {
  try {
    return typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem(key) : null;
  } catch (e) {
    console.warn(`[1929 Storage] Falha ao ler "${key}":`, e);
    return null;
  }
};

const safeSetItem = (key: string, value: string): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch (e) {
    console.warn(`[1929 Storage] Falha ao gravar "${key}":`, e);
  }
};

const safeRemoveItem = (key: string): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch (e) {
    console.warn(`[1929 Storage] Falha ao remover "${key}":`, e);
  }
};

export const storageService = {
  // Carrega ou inicializa o personagem local
  getCharacter(): Character | null {
    const raw = safeGetItem(STORAGE_KEYS.CHARACTER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  saveCharacter(char: Character): void {
    safeSetItem(STORAGE_KEYS.CHARACTER, JSON.stringify(char));
  },

  clearCharacter(): void {
    safeRemoveItem(STORAGE_KEYS.CHARACTER);
  },

  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach((k) => safeRemoveItem(k));
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch (e) {
      console.warn('[1929 Storage] Falha ao limpar storage:', e);
    }
  },

  // Negócios do jogador
  getBusinesses(): PlayerBusiness[] {
    const raw = safeGetItem(STORAGE_KEYS.BUSINESSES);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveBusinesses(businesses: PlayerBusiness[]): void {
    safeSetItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
  },

  // Ações do jogador
  getActions(): PlayerAction[] {
    const raw = safeGetItem(STORAGE_KEYS.ACTIONS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveActions(actions: PlayerAction[]): void {
    safeSetItem(STORAGE_KEYS.ACTIONS, JSON.stringify(actions));
  },

  // Inventário
  getInventory(): InventoryItem[] {
    const raw = safeGetItem(STORAGE_KEYS.INVENTORY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveInventory(inv: InventoryItem[]): void {
    safeSetItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inv));
  },

  // Missões
  getPlayerMissions(): PlayerMission[] {
    const raw = safeGetItem(STORAGE_KEYS.MISSIONS);
    if (!raw) {
      const initial = INITIAL_MISSIONS.map(m => ({
        id: `pm-${m.id}`,
        character_id: 'local-char',
        mission_id: m.id,
        current_count: 0,
        completed: false,
        claimed: false,
        mission: m
      }));
      this.savePlayerMissions(initial);
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  savePlayerMissions(missions: PlayerMission[]): void {
    safeSetItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
  },

  // Gazeta da Capital (Notícias)
  getArticles(): NewspaperArticle[] {
    const raw = safeGetItem(STORAGE_KEYS.ARTICLES);
    if (!raw) {
      this.saveArticles(INITIAL_ARTICLES);
      return INITIAL_ARTICLES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ARTICLES;
    }
  },

  saveArticles(articles: NewspaperArticle[]): void {
    safeSetItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  },

  addArticle(article: Omit<NewspaperArticle, 'id' | 'created_at'>): NewspaperArticle {
    const articles = this.getArticles();
    const newArt: NewspaperArticle = {
      ...article,
      id: 'art-' + Date.now(),
      created_at: new Date().toISOString()
    };
    articles.unshift(newArt);
    const trimmed = articles.slice(0, 50);
    this.saveArticles(trimmed);
    return newArt;
  },

  // Famílias
  getFamilies(): Family[] {
    const raw = safeGetItem(STORAGE_KEYS.FAMILIES);
    if (!raw) {
      this.saveFamilies(INITIAL_FAMILIES);
      return INITIAL_FAMILIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_FAMILIES;
    }
  },

  saveFamilies(fams: Family[]): void {
    safeSetItem(STORAGE_KEYS.FAMILIES, JSON.stringify(fams));
  },

  // Territórios
  getTerritories(): Territory[] {
    const raw = safeGetItem(STORAGE_KEYS.TERRITORIES);
    if (!raw) {
      this.saveTerritories(INITIAL_TERRITORIES);
      return INITIAL_TERRITORIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_TERRITORIES;
    }
  },

  saveTerritories(terrs: Territory[]): void {
    safeSetItem(STORAGE_KEYS.TERRITORIES, JSON.stringify(terrs));
  },

  // Propostas de negociação
  getProposals(): Proposal[] {
    const raw = safeGetItem(STORAGE_KEYS.PROPOSALS);
    if (!raw) {
      const defaultProposals: Proposal[] = [
        {
          id: 'prop-1',
          sender_id: '55555555-5555-5555-5555-555555555501',
          sender_name: 'Don Vincenzo Moretti',
          receiver_id: 'current-char',
          receiver_name: 'Você',
          offered_money: 1800,
          offered_item_qty: 0,
          requested_money: 0,
          requested_item_id: '44444444-4444-4444-4444-444444444401',
          requested_item_name: 'Café Arábica Especial',
          requested_item_qty: 5,
          message: 'Preciso de 5 sacas de café para o Distrito Boêmio até amanhã cedo. Pago bem à vista.',
          status: 'pending',
          created_at: new Date(Date.now() - 3600000 * 4).toISOString()
        }
      ];
      this.saveProposals(defaultProposals);
      return defaultProposals;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveProposals(props: Proposal[]): void {
    safeSetItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(props));
  },

  // Eventos
  getEvents(): GameEvent[] {
    const raw = safeGetItem(STORAGE_KEYS.EVENTS);
    if (!raw) {
      this.saveEvents(INITIAL_EVENTS);
      return INITIAL_EVENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_EVENTS;
    }
  },

  saveEvents(evts: GameEvent[]): void {
    safeSetItem(STORAGE_KEYS.EVENTS, JSON.stringify(evts));
  },

  // Registro de último acesso
  getLastSeen(): string {
    return safeGetItem(STORAGE_KEYS.LAST_SEEN) || new Date().toISOString();
  },

  updateLastSeen(): void {
    safeSetItem(STORAGE_KEYS.LAST_SEEN, new Date().toISOString());
  }
};
