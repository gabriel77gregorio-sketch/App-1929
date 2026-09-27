// Tipagens TypeScript do Jogo 1929

export type CharacterStyle = 'negociador' | 'contrabandista' | 'executor' | 'empresario';

export type FamilyRole = 'lider' | 'conselheiro' | 'capo' | 'membro' | 'recruta';

export interface Character {
  id: string;
  profile_id?: string;
  name: string;
  nickname: string;
  origin: string;
  style: CharacterStyle;
  avatar_url?: string;
  money: number;
  respect: number;
  influence: number;
  fear: number;
  level: number;
  experience: number;
  family_id?: string | null;
  family_name?: string | null;
  family_role?: FamilyRole | null;
  daily_streak: number;
  last_login_date: string;
  last_offline_check: string;
  created_at: string;
  is_admin?: boolean;
}

export interface District {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  economic_focus: string;
  police_presence: number; // 0 a 100
  base_risk: number; // 0 a 100
  icon: string;
}

export interface BusinessType {
  id: string;
  name: string;
  slug: string;
  description: string;
  base_cost: number;
  base_revenue: number;
  cycle_minutes: number;
  base_risk: number;
  icon: string;
  min_level: number;
  flavor_quote?: string;
}

export interface PlayerBusiness {
  id: string;
  character_id: string;
  business_type_id: string;
  district_id: string;
  custom_name: string;
  level: number;
  last_collected_at: string;
  next_collection_at: string;
  is_raided: boolean;
  // Campos populados
  type?: BusinessType;
  district?: District;
}

export type ActionCategory = 'operacao' | 'investigacao' | 'influencia' | 'violencia' | 'comercio';

export interface ActionType {
  id: string;
  name: string;
  slug: string;
  category: ActionCategory;
  description: string;
  duration_seconds: number;
  cost_money: number;
  cost_influence: number;
  req_level: number;
  req_respect: number;
  reward_money_min: number;
  reward_money_max: number;
  reward_respect: number;
  reward_influence: number;
  reward_fear: number;
  base_risk: number;
  success_chance: number;
}

export type ActionStatus = 'in_progress' | 'completed' | 'claimed' | 'failed' | 'cancelled';
export type ActionOutcome = 'sucesso_total' | 'sucesso_parcial' | 'fracasso' | 'complicacao_policial';

export interface PlayerAction {
  id: string;
  character_id: string;
  action_type_id: string;
  target_character_id?: string | null;
  target_district_id?: string | null;
  started_at: string;
  finish_at: string;
  status: ActionStatus;
  outcome_result?: ActionOutcome | null;
  reward_money_granted?: number;
  reward_respect_granted?: number;
  reward_influence_granted?: number;
  reward_fear_granted?: number;
  result_notes?: string;
  // Populado
  action_type?: ActionType;
}

export interface Family {
  id: string;
  name: string;
  tag: string;
  motto: string;
  leader_id?: string | null;
  leader_name?: string;
  treasury: number;
  reputation: number;
  banner_color: string;
  is_npc: boolean;
  member_count?: number;
}

export interface Territory {
  id: string;
  district_id: string;
  family_id: string;
  influence_percentage: number;
  is_independent: boolean;
  family_name?: string;
  district_name?: string;
}

export interface MarketItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  base_price: number;
  current_price: number;
  min_price: number;
  max_price: number;
  unit: string;
  description: string;
  volatility: number;
  price_trend?: 'up' | 'down' | 'stable';
}

export interface InventoryItem {
  id: string;
  character_id: string;
  item_id: string;
  quantity: number;
  average_cost: number;
  item?: MarketItem;
}

export interface NewspaperArticle {
  id: string;
  edition_number: number;
  headline: string;
  subheadline: string;
  category: 'CIDADE' | 'NEGÓCIOS' | 'POLÍCIA' | 'FAMÍLIAS' | 'MERCADO' | 'RIVAIS';
  content: string;
  district_id?: string | null;
  district_name?: string;
  related_character_name?: string;
  created_at: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  category: string;
  target_type: string;
  target_count: number;
  reward_money: number;
  reward_respect: number;
  reward_influence: number;
  reward_exp: number;
  order_index: number;
}

export interface PlayerMission {
  id: string;
  character_id: string;
  mission_id: string;
  current_count: number;
  completed: boolean;
  claimed: boolean;
  completed_at?: string;
  mission?: Mission;
}

export interface Proposal {
  id: string;
  sender_id: string;
  sender_name?: string;
  receiver_id: string;
  receiver_name?: string;
  offered_money: number;
  offered_item_id?: string;
  offered_item_name?: string;
  offered_item_qty: number;
  requested_money: number;
  requested_item_id?: string;
  requested_item_name?: string;
  requested_item_qty: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'expired';
  created_at: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  district_id?: string;
  affected_type: string;
  modifier_percentage: number;
  starts_at: string;
  expires_at: string;
  is_active: boolean;
}

export interface OfflineSummary {
  ready_businesses: Array<{
    id: string;
    name: string;
    level: number;
    revenue: number;
  }>;
  completed_actions: Array<{
    id: string;
    action_name: string;
    status: string;
  }>;
  recent_articles: Array<{
    id: string;
    headline: string;
    category: string;
  }>;
  pending_proposals_count: number;
}
