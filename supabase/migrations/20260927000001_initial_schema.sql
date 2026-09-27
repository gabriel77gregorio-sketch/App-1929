-- ==============================================================================
-- 1929: Dinheiro. Poder. Silêncio.
-- Schema Inicial PostgreSQL para Supabase
-- ==============================================================================

-- Habilita extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. TABELA DE PERFIS (Vinculada ao auth.users do Supabase)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. TABELA DE FAMÍLIAS / GANGUES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.families (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    tag VARCHAR(5) NOT NULL UNIQUE,
    motto TEXT,
    leader_id UUID, -- Será referenciado a characters após criação
    treasury BIGINT DEFAULT 0 CHECK (treasury >= 0),
    reputation INT DEFAULT 10 CHECK (reputation >= 0),
    banner_color VARCHAR(10) DEFAULT '#c5a059',
    is_npc BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. TABELA DE PERSONAGENS (O avatar do jogador no mundo de 1929)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    nickname VARCHAR(30) NOT NULL,
    origin VARCHAR(40) NOT NULL, -- Ex: 'Lapa, São Paulo', 'Porto de Santos', 'Morros do Rio', 'Sertão Mineiro'
    style VARCHAR(20) NOT NULL CHECK (style IN ('negociador', 'contrabandista', 'executor', 'empresario')),
    avatar_url TEXT,
    
    -- Atributos Principais de Poder
    money BIGINT DEFAULT 1500 CHECK (money >= 0),
    respect INT DEFAULT 10 CHECK (respect >= 0),
    influence INT DEFAULT 5 CHECK (influence >= 0),
    fear INT DEFAULT 2 CHECK (fear >= 0),
    
    -- Progressão
    level INT DEFAULT 1 CHECK (level >= 1),
    experience INT DEFAULT 0 CHECK (experience >= 0),
    
    -- Família
    family_id UUID REFERENCES public.families(id) ON DELETE SET NULL,
    family_role VARCHAR(20) DEFAULT 'membro' CHECK (family_role IN ('lider', 'conselheiro', 'capo', 'membro', 'recruta')),
    
    -- Retenção e Login
    daily_streak INT DEFAULT 1,
    last_login_date DATE DEFAULT CURRENT_DATE,
    last_offline_check TIMESTAMPTZ DEFAULT NOW(),
    
    is_npc BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adiciona a FK do líder na tabela families agora que characters existe
ALTER TABLE public.families 
DROP CONSTRAINT IF EXISTS fk_family_leader;

ALTER TABLE public.families 
ADD CONSTRAINT fk_family_leader 
FOREIGN KEY (leader_id) REFERENCES public.characters(id) ON DELETE SET NULL;

-- ------------------------------------------------------------------------------
-- 4. TABELA DE DISTRITOS / BAIRROS (Santa Augusta)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.districts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(30) NOT NULL UNIQUE,
    tagline VARCHAR(100),
    description TEXT,
    economic_focus VARCHAR(50),
    police_presence INT DEFAULT 50 CHECK (police_presence BETWEEN 0 AND 100),
    base_risk INT DEFAULT 30 CHECK (base_risk BETWEEN 0 AND 100),
    icon VARCHAR(30) DEFAULT 'landmark',
    svg_coords TEXT, -- Coordenadas visuais no mapa
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. TABELA DE TERRITÓRIOS (Disputa de Influência por Bairro)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.territories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_id UUID NOT NULL REFERENCES public.districts(id) ON DELETE CASCADE,
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    influence_percentage INT NOT NULL DEFAULT 0 CHECK (influence_percentage BETWEEN 0 AND 100),
    is_independent BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(district_id, family_id)
);

-- ------------------------------------------------------------------------------
-- 6. TABELA DE TIPOS DE NEGÓCIOS & CONFIGURAÇÕES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.business_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(30) NOT NULL UNIQUE,
    description TEXT,
    base_cost BIGINT NOT NULL CHECK (base_cost > 0),
    base_revenue BIGINT NOT NULL CHECK (base_revenue > 0),
    cycle_minutes INT NOT NULL DEFAULT 15,
    base_risk INT DEFAULT 15 CHECK (base_risk BETWEEN 0 AND 100),
    icon VARCHAR(30) DEFAULT 'building',
    min_level INT DEFAULT 1,
    flavor_quote TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. TABELA DE NEGÓCIOS DO JOGADOR
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
    business_type_id UUID NOT NULL REFERENCES public.business_types(id) ON DELETE RESTRICT,
    district_id UUID NOT NULL REFERENCES public.districts(id) ON DELETE RESTRICT,
    custom_name VARCHAR(60) NOT NULL,
    level INT NOT NULL DEFAULT 1 CHECK (level >= 1),
    last_collected_at TIMESTAMPTZ DEFAULT NOW(),
    next_collection_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '15 minutes'),
    is_raided BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. TABELA DE TIPOS DE AÇÕES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.action_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(60) NOT NULL UNIQUE,
    slug VARCHAR(40) NOT NULL UNIQUE,
    category VARCHAR(30) NOT NULL CHECK (category IN ('operacao', 'investigacao', 'influencia', 'violencia', 'comercio')),
    description TEXT,
    duration_seconds INT NOT NULL DEFAULT 300, -- 5 minutos padrão
    cost_money BIGINT DEFAULT 0 CHECK (cost_money >= 0),
    cost_influence INT DEFAULT 0 CHECK (cost_influence >= 0),
    cost_fear INT DEFAULT 0,
    req_level INT DEFAULT 1,
    req_respect INT DEFAULT 0,
    reward_money_min BIGINT DEFAULT 0,
    reward_money_max BIGINT DEFAULT 0,
    reward_respect INT DEFAULT 0,
    reward_influence INT DEFAULT 0,
    reward_fear INT DEFAULT 0,
    base_risk INT DEFAULT 20 CHECK (base_risk BETWEEN 0 AND 100),
    success_chance INT DEFAULT 75 CHECK (success_chance BETWEEN 1 AND 100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. TABELA DE AÇÕES DO JOGADOR (Fila com Timers Reais no Servidor)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.player_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
    action_type_id UUID NOT NULL REFERENCES public.action_types(id) ON DELETE RESTRICT,
    target_character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
    target_district_id UUID REFERENCES public.districts(id) ON DELETE SET NULL,
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    finish_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'claimed', 'failed', 'cancelled')),
    outcome_result VARCHAR(30), -- 'sucesso_total', 'sucesso_parcial', 'fracasso', 'complicacao_policial'
    reward_money_granted BIGINT DEFAULT 0,
    reward_respect_granted INT DEFAULT 0,
    reward_influence_granted INT DEFAULT 0,
    reward_fear_granted INT DEFAULT 0,
    result_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. TABELA DO MERCADO & ITENS (Economia de Arbitragem)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.market_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(30) NOT NULL UNIQUE,
    category VARCHAR(30) NOT NULL,
    base_price BIGINT NOT NULL,
    current_price BIGINT NOT NULL,
    min_price BIGINT NOT NULL,
    max_price BIGINT NOT NULL,
    unit VARCHAR(20) DEFAULT 'saca',
    description TEXT,
    volatility INT DEFAULT 10, -- % de oscilação
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.player_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.market_items(id) ON DELETE RESTRICT,
    quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    average_cost BIGINT DEFAULT 0,
    UNIQUE(character_id, item_id)
);

-- ------------------------------------------------------------------------------
-- 11. TABELA DE PROPOSTAS ASSÍNCRONAS ENTRE JOGADORES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.player_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
    offered_money BIGINT DEFAULT 0 CHECK (offered_money >= 0),
    offered_item_id UUID REFERENCES public.market_items(id),
    offered_item_qty INT DEFAULT 0,
    requested_money BIGINT DEFAULT 0 CHECK (requested_money >= 0),
    requested_item_id UUID REFERENCES public.market_items(id),
    requested_item_qty INT DEFAULT 0,
    message VARCHAR(250),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled', 'expired')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '48 hours')
);

-- ------------------------------------------------------------------------------
-- 12. TABELA DE MISSÕES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(80) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(30) DEFAULT 'iniciacao',
    target_type VARCHAR(40) NOT NULL, -- 'buy_business', 'perform_actions', 'earn_money', 'reach_respect', 'join_family', 'market_trade'
    target_count INT NOT NULL DEFAULT 1,
    reward_money BIGINT DEFAULT 0,
    reward_respect INT DEFAULT 0,
    reward_influence INT DEFAULT 0,
    reward_exp INT DEFAULT 50,
    order_index INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.player_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
    current_count INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    claimed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    UNIQUE(character_id, mission_id)
);

-- ------------------------------------------------------------------------------
-- 13. TABELA DE EVENTOS GLOBAIS DE SANTA AUGUSTA
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    district_id UUID REFERENCES public.districts(id) ON DELETE SET NULL,
    affected_type VARCHAR(40), -- 'business_revenue', 'police_risk', 'market_price', 'action_duration'
    modifier_percentage INT NOT NULL DEFAULT 0, -- Ex: +25% ou -30%
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '2 hours'),
    is_active BOOLEAN DEFAULT TRUE
);

-- ------------------------------------------------------------------------------
-- 14. TABELA DO JORNAL: GAZETA DA CAPITAL
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.newspaper_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    edition_number INT DEFAULT 1,
    headline VARCHAR(140) NOT NULL,
    subheadline VARCHAR(200),
    category VARCHAR(30) DEFAULT 'CIDADE' CHECK (category IN ('CIDADE', 'NEGÓCIOS', 'POLÍCIA', 'FAMÍLIAS', 'MERCADO', 'RIVAIS')),
    content TEXT NOT NULL,
    district_id UUID REFERENCES public.districts(id) ON DELETE SET NULL,
    related_character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
    related_character_name VARCHAR(60),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 15. TRANSAÇÕES E NOTIFICAÇÕES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
    amount BIGINT NOT NULL, -- Pode ser positivo (ganho) ou negativo (custo)
    balance_after BIGINT NOT NULL,
    category VARCHAR(40) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(30) DEFAULT 'sistema',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 16. TABELA DE CONFIGURAÇÕES DE BALANCEAMENTO (GAME CONFIGS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.game_configs (
    key VARCHAR(60) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- ÍNDICES PARA PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_characters_profile ON public.characters(profile_id);
CREATE INDEX IF NOT EXISTS idx_characters_family ON public.characters(family_id);
CREATE INDEX IF NOT EXISTS idx_businesses_character ON public.businesses(character_id);
CREATE INDEX IF NOT EXISTS idx_businesses_district ON public.businesses(district_id);
CREATE INDEX IF NOT EXISTS idx_player_actions_char_status ON public.player_actions(character_id, status);
CREATE INDEX IF NOT EXISTS idx_player_actions_finish ON public.player_actions(finish_at) WHERE status = 'in_progress';
CREATE INDEX IF NOT EXISTS idx_newspaper_created ON public.newspaper_articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_char ON public.notifications(character_id, is_read);
CREATE INDEX IF NOT EXISTS idx_territories_district ON public.territories(district_id);
