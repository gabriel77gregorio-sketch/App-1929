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
  google_email?: string;
  is_cloud_synced?: boolean;
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
  illustration?: string; // Imagem panorâmica/temática do distrito
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
  illustration?: string; // Imagem do estabelecimento comercial
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
  illustration?: string; // URL da imagem ilustrativa da ação
  button_label?: string; // Texto específico e contextual do botão de ação
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
  illustration?: string; // Imagem da mercadoria/commodity
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

// === SISTEMA SOCIAL, RIVAIS E RETENÇÃO ASSÍNCRONA ===

export type SabotageTypeId = 'armazem' | 'denuncia' | 'gazeta';

export interface SabotageType {
  id: SabotageTypeId;
  name: string;
  description: string;
  energy_cost: number;
  cost_money: number;
  success_rate_base: number; // 0 a 100
  risk_police: number; // 0 a 100
  reward_label: string;
  icon: string;
}

export interface RivalTarget {
  id: string;
  name: string;
  nickname: string;
  title: string;
  family_name: string;
  family_tag: string;
  level: number;
  fortune: number;
  respect: number;
  defense_rating: number; // 10 a 80 (%)
  district_name: string;
  avatar_initial: string;
  is_player: boolean;
  online_status: 'online' | 'recente' | 'ausente';
  last_attacked_at?: string;
}

export interface RivalAttack {
  id: string;
  attacker_id: string;
  attacker_name: string;
  victim_id: string;
  victim_name: string;
  sabotage_type: SabotageTypeId;
  success: boolean;
  loot_money: number;
  loot_respect: number;
  created_at: string;
  can_revenge: boolean; // Se verdadeiro, jogador pode dar troco em dobro
  revenge_executed?: boolean;
  headline_generated?: string;
  details: string;
}

export interface PlayerDefense {
  guards_count: number; // 0 a 5 guarda-costas (cada um reduz 10% do sucesso de invasores)
  safe_level: number; // 1 a 3 (protege % de dinheiro contra assaltos)
  bribe_police_active_until?: string; // Imunidade contra denúncias por X horas
}

export interface SeasonReward {
  level: number;
  required_glory: number;
  title: string;
  reward_type: 'money' | 'respect' | 'influence' | 'item';
  reward_amount: number;
  reward_name: string;
  item_id?: string;
  icon: string;
}

export interface SeasonData {
  season_number: number;
  title: string;
  subtitle: string;
  theme_color: string;
  end_date: string; // Ex: '1929-12-15'
  days_left: number;
  current_level: number;
  current_glory: number;
  glory_per_level: number;
  claimed_levels: number[];
  rewards: SeasonReward[];
}

// === SISTEMA VIRAL DE INDICAÇÃO ("INDIQUE 3 AMIGOS") ===

export interface ReferralInvite {
  id: string;
  friend_name: string;
  date: string;
  reward_claimed: boolean;
}

export interface ReferralData {
  my_code: string;
  referred_by: string | null;
  referrals: ReferralInvite[];
  target_goal: number;
  milestone_claimed: boolean;
}


