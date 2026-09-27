-- ==============================================================================
-- 1929: Funções SQL, RPCs Atômicas e Políticas RLS (Row Level Security)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. HABILITAR RLS NAS TABELAS
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Tabelas públicas de leitura (todos jogadores autenticados ou anônimos podem ler)
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newspaper_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_configs ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura Pública
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Permitir leitura publica de distritos" ON public.districts;
    CREATE POLICY "Permitir leitura publica de distritos" ON public.districts FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Permitir leitura publica de tipos de negocios" ON public.business_types;
    CREATE POLICY "Permitir leitura publica de tipos de negocios" ON public.business_types FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Permitir leitura publica de tipos de acoes" ON public.action_types;
    CREATE POLICY "Permitir leitura publica de tipos de acoes" ON public.action_types FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Permitir leitura publica de itens de mercado" ON public.market_items;
    CREATE POLICY "Permitir leitura publica de itens de mercado" ON public.market_items FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Permitir leitura publica de familias" ON public.families;
    CREATE POLICY "Permitir leitura publica de familias" ON public.families FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Permitir leitura publica de territorios" ON public.territories;
    CREATE POLICY "Permitir leitura publica de territorios" ON public.territories FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Permitir leitura publica de eventos" ON public.events;
    CREATE POLICY "Permitir leitura publica de eventos" ON public.events FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Permitir leitura publica do jornal" ON public.newspaper_articles;
    CREATE POLICY "Permitir leitura publica do jornal" ON public.newspaper_articles FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Permitir leitura publica de missoes" ON public.missions;
    CREATE POLICY "Permitir leitura publica de missoes" ON public.missions FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Permitir leitura publica de configs" ON public.game_configs;
    CREATE POLICY "Permitir leitura publica de configs" ON public.game_configs FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Permitir leitura publica de perfis e personagens" ON public.characters;
    CREATE POLICY "Permitir leitura publica de perfis e personagens" ON public.characters FOR SELECT USING (true);
END $$;

-- Políticas de segurança do jogador
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Usuarios gerenciam seu proprio perfil" ON public.profiles;
    CREATE POLICY "Usuarios gerenciam seu proprio perfil" ON public.profiles 
        FOR ALL USING (auth.uid() = id);

    DROP POLICY IF EXISTS "Usuarios gerenciam seus proprios personagens" ON public.characters;
    CREATE POLICY "Usuarios gerenciam seus proprios personagens" ON public.characters 
        FOR ALL USING (auth.uid() = profile_id);

    DROP POLICY IF EXISTS "Usuarios visualizam seus proprios negocios" ON public.businesses;
    CREATE POLICY "Usuarios visualizam seus proprios negocios" ON public.businesses 
        FOR SELECT USING (character_id IN (SELECT id FROM public.characters WHERE profile_id = auth.uid()));

    DROP POLICY IF EXISTS "Usuarios visualizam suas proprias acoes" ON public.player_actions;
    CREATE POLICY "Usuarios visualizam suas proprias acoes" ON public.player_actions 
        FOR SELECT USING (character_id IN (SELECT id FROM public.characters WHERE profile_id = auth.uid()));

    DROP POLICY IF EXISTS "Usuarios visualizam seu inventario" ON public.player_inventory;
    CREATE POLICY "Usuarios visualizam seu inventario" ON public.player_inventory 
        FOR SELECT USING (character_id IN (SELECT id FROM public.characters WHERE profile_id = auth.uid()));

    DROP POLICY IF EXISTS "Usuarios visualizam suas transacoes" ON public.transactions;
    CREATE POLICY "Usuarios visualizam suas transacoes" ON public.transactions 
        FOR SELECT USING (character_id IN (SELECT id FROM public.characters WHERE profile_id = auth.uid()));

    DROP POLICY IF EXISTS "Usuarios visualizam suas notificacoes" ON public.notifications;
    CREATE POLICY "Usuarios visualizam suas notificacoes" ON public.notifications 
        FOR ALL USING (character_id IN (SELECT id FROM public.characters WHERE profile_id = auth.uid()));
END $$;

-- ------------------------------------------------------------------------------
-- 2. RPC ATÔMICA: COMPRA DE NEGÓCIO (buy_business)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.rpc_buy_business(
    p_character_id UUID,
    p_business_type_id UUID,
    p_district_id UUID,
    p_custom_name TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_char RECORD;
    v_btype RECORD;
    v_cost BIGINT;
    v_business_id UUID;
    v_style_mult NUMERIC := 1.0;
BEGIN
    -- Busca e trava a linha do personagem para prevenir race conditions
    SELECT * INTO v_char FROM public.characters WHERE id = p_character_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Personagem não encontrado.');
    END IF;

    -- Busca o tipo de negócio
    SELECT * INTO v_btype FROM public.business_types WHERE id = p_business_type_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Tipo de negócio inválido.');
    END IF;

    -- Bônus de classe: Empresário paga 10% menos ou ganha vantagens
    IF v_char.style = 'empresario' THEN
        v_style_mult := 0.90;
    END IF;

    v_cost := FLOOR(v_btype.base_cost * v_style_mult);

    IF v_char.money < v_cost THEN
        RETURN jsonb_build_object('success', false, 'message', 'Fundos insuficientes para adquirir este estabelecimento.');
    END IF;

    -- Desconta dinheiro
    UPDATE public.characters 
    SET money = money - v_cost,
        experience = experience + 25,
        updated_at = NOW()
    WHERE id = p_character_id;

    -- Registra transação
    INSERT INTO public.transactions (character_id, amount, balance_after, category, description)
    VALUES (p_character_id, -v_cost, v_char.money - v_cost, 'compra_negocio', 'Aquisição de ' || COALESCE(p_custom_name, v_btype.name));

    -- Insere o negócio
    INSERT INTO public.businesses (
        character_id, business_type_id, district_id, custom_name, level, 
        last_collected_at, next_collection_at
    )
    VALUES (
        p_character_id, p_business_type_id, p_district_id, 
        COALESCE(NULLIF(TRIM(p_custom_name), ''), v_btype.name), 1, 
        NOW(), NOW() + (v_btype.cycle_minutes || ' minutes')::INTERVAL
    )
    RETURNING id INTO v_business_id;

    -- Notícia na Gazeta da Capital se o negócio for de destaque
    INSERT INTO public.newspaper_articles (
        headline, subheadline, category, content, district_id, related_character_id, related_character_name
    )
    VALUES (
        'NOVO ESTABELECIMENTO ABERTO EM SANTA AUGUSTA',
        v_char.name || ' investe pesado e firma raízes na cidade.',
        'NEGÓCIOS',
        'Fontes do comércio local confirmam que ' || v_char.name || ' assumiu as operações de "' || COALESCE(p_custom_name, v_btype.name) || '". Comerciantes locais observam atentos o crescimento da nova força.',
        p_district_id, p_character_id, v_char.name
    );

    -- Atualiza missão de adquirir negócio se houver
    UPDATE public.player_missions pm
    SET current_count = current_count + 1,
        completed = CASE WHEN current_count + 1 >= m.target_count THEN true ELSE completed END,
        completed_at = CASE WHEN current_count + 1 >= m.target_count AND completed_at IS NULL THEN NOW() ELSE completed_at END
    FROM public.missions m
    WHERE pm.mission_id = m.id AND pm.character_id = p_character_id AND m.target_type = 'buy_business';

    RETURN jsonb_build_object(
        'success', true, 
        'message', 'Estabelecimento adquirido com sucesso.', 
        'business_id', v_business_id,
        'remaining_money', v_char.money - v_cost
    );
END;
$$;

-- ------------------------------------------------------------------------------
-- 3. RPC ATÔMICA: COLETAR RENDA DE NEGÓCIO (collect_business_revenue)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.rpc_collect_business_revenue(
    p_character_id UUID,
    p_business_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_char RECORD;
    v_biz RECORD;
    v_btype RECORD;
    v_revenue BIGINT;
    v_level_mult NUMERIC;
    v_style_mult NUMERIC := 1.0;
BEGIN
    SELECT * INTO v_char FROM public.characters WHERE id = p_character_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Personagem não encontrado.');
    END IF;

    SELECT * INTO v_biz FROM public.businesses WHERE id = p_business_id AND character_id = p_character_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Negócio não pertence a este personagem.');
    END IF;

    -- Validação do servidor: o ciclo terminou?
    IF NOW() < v_biz.next_collection_at THEN
        RETURN jsonb_build_object(
            'success', false, 
            'message', 'A receita ainda está sendo gerada. Aguarde o ciclo terminar.',
            'seconds_remaining', EXTRACT(EPOCH FROM (v_biz.next_collection_at - NOW()))::INT
        );
    END IF;

    SELECT * INTO v_btype FROM public.business_types WHERE id = v_biz.business_type_id;

    -- Bônus de estilo
    IF v_char.style = 'empresario' THEN
        v_style_mult := 1.15; -- +15% de receita
    END IF;

    v_level_mult := 1.0 + ((v_biz.level - 1) * 0.45); -- +45% de renda por nível
    v_revenue := FLOOR(v_btype.base_revenue * v_level_mult * v_style_mult);

    -- Atualiza saldo e experiência
    UPDATE public.characters
    SET money = money + v_revenue,
        experience = experience + (10 * v_biz.level),
        updated_at = NOW()
    WHERE id = p_character_id;

    -- Atualiza timestamp do negócio para próximo ciclo
    UPDATE public.businesses
    SET last_collected_at = NOW(),
        next_collection_at = NOW() + (v_btype.cycle_minutes || ' minutes')::INTERVAL
    WHERE id = p_business_id;

    -- Registro no histórico
    INSERT INTO public.transactions (character_id, amount, balance_after, category, description)
    VALUES (p_character_id, v_revenue, v_char.money + v_revenue, 'receita_negocio', 'Receita coletada de: ' || v_biz.custom_name);

    RETURN jsonb_build_object(
        'success', true,
        'revenue', v_revenue,
        'new_balance', v_char.money + v_revenue,
        'message', 'Receita de $' || v_revenue || ' recolhida nos cofres.'
    );
END;
$$;

-- ------------------------------------------------------------------------------
-- 4. RPC ATÔMICA: INICIAR AÇÃO (start_player_action)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.rpc_start_player_action(
    p_character_id UUID,
    p_action_type_id UUID,
    p_target_character_id UUID DEFAULT NULL,
    p_target_district_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_char RECORD;
    v_atype RECORD;
    v_active_action RECORD;
    v_action_id UUID;
    v_finish_time TIMESTAMPTZ;
BEGIN
    SELECT * INTO v_char FROM public.characters WHERE id = p_character_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Personagem não encontrado.');
    END IF;

    -- Verifica se já possui ação em andamento
    SELECT * INTO v_active_action 
    FROM public.player_actions 
    WHERE character_id = p_character_id AND status = 'in_progress';

    IF FOUND THEN
        RETURN jsonb_build_object(
            'success', false, 
            'message', 'Você já possui uma operação em andamento nas ruas.',
            'action_in_progress', v_active_action.id
        );
    END IF;

    SELECT * INTO v_atype FROM public.action_types WHERE id = p_action_type_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Tipo de ação inválido.');
    END IF;

    -- Checa requisitos
    IF v_char.money < v_atype.cost_money THEN
        RETURN jsonb_build_object('success', false, 'message', 'Dinheiro insuficiente para financiar a operação.');
    END IF;

    IF v_char.influence < v_atype.cost_influence THEN
        RETURN jsonb_build_object('success', false, 'message', 'Influência insuficiente para articular esta jogada.');
    END IF;

    -- Deduz custos
    UPDATE public.characters
    SET money = money - v_atype.cost_money,
        influence = influence - v_atype.cost_influence,
        updated_at = NOW()
    WHERE id = p_character_id;

    IF v_atype.cost_money > 0 THEN
        INSERT INTO public.transactions (character_id, amount, balance_after, category, description)
        VALUES (p_character_id, -v_atype.cost_money, v_char.money - v_atype.cost_money, 'custo_acao', 'Financiamento: ' || v_atype.name);
    END IF;

    -- Calcula timer no servidor
    v_finish_time := NOW() + (v_atype.duration_seconds || ' seconds')::INTERVAL;

    INSERT INTO public.player_actions (
        character_id, action_type_id, target_character_id, target_district_id,
        started_at, finish_at, status
    )
    VALUES (
        p_character_id, p_action_type_id, p_target_character_id, p_target_district_id,
        NOW(), v_finish_time, 'in_progress'
    )
    RETURNING id INTO v_action_id;

    RETURN jsonb_build_object(
        'success', true,
        'action_id', v_action_id,
        'started_at', NOW(),
        'finish_at', v_finish_time,
        'duration_seconds', v_atype.duration_seconds,
        'message', 'Operação iniciada. Seus homens já estão em movimento.'
    );
END;
$$;

-- ------------------------------------------------------------------------------
-- 5. RPC ATÔMICA: CONCLUIR/RESOLVER AÇÃO (complete_player_action)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.rpc_complete_player_action(
    p_action_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_act RECORD;
    v_char RECORD;
    v_atype RECORD;
    v_roll INT;
    v_success_chance INT;
    v_outcome VARCHAR(30);
    v_reward_money BIGINT := 0;
    v_reward_resp INT := 0;
    v_reward_inf INT := 0;
    v_reward_fear INT := 0;
    v_notes TEXT;
    v_headline TEXT;
BEGIN
    SELECT * INTO v_act FROM public.player_actions WHERE id = p_action_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Ação não encontrada.');
    END IF;

    IF v_act.status != 'in_progress' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Esta ação já foi resolvida anteriormente.');
    END IF;

    -- Validação do timer no backend
    IF NOW() < v_act.finish_at THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'A operação ainda está em andamento nas ruas de Santa Augusta.',
            'seconds_remaining', EXTRACT(EPOCH FROM (v_act.finish_at - NOW()))::INT
        );
    END IF;

    SELECT * INTO v_char FROM public.characters WHERE id = v_act.character_id FOR UPDATE;
    SELECT * INTO v_atype FROM public.action_types WHERE id = v_act.action_type_id;

    -- Calcula chance de sucesso considerando estilo
    v_success_chance := v_atype.success_chance;
    IF v_char.style = 'contrabandista' AND v_atype.category = 'operacao' THEN
        v_success_chance := v_success_chance + 10;
    ELSIF v_char.style = 'executor' AND v_atype.category = 'violencia' THEN
        v_success_chance := v_success_chance + 12;
    ELSIF v_char.style = 'negociador' AND (v_atype.category = 'influencia' OR v_atype.category = 'comercio') THEN
        v_success_chance := v_success_chance + 10;
    END IF;

    -- Rola D100
    v_roll := FLOOR(RANDOM() * 100) + 1;

    IF v_roll <= v_success_chance THEN
        -- SUCESSO TOTAL
        v_outcome := 'sucesso_total';
        v_reward_money := v_atype.reward_money_min + FLOOR(RANDOM() * (v_atype.reward_money_max - v_atype.reward_money_min + 1));
        v_reward_resp := v_atype.reward_respect;
        v_reward_inf := v_atype.reward_influence;
        v_reward_fear := v_atype.reward_fear;
        v_notes := 'A operação transcorreu conforme o planejado. Nenhum rastro deixado para a polícia.';
    ELSIF v_roll <= v_success_chance + 15 THEN
        -- SUCESSO PARCIAL COM ATENÇÃO
        v_outcome := 'sucesso_parcial';
        v_reward_money := FLOOR(v_atype.reward_money_min * 0.7);
        v_reward_resp := GREATEST(1, v_atype.reward_respect - 1);
        v_reward_fear := v_atype.reward_fear + 2; -- Gera mais medo/atenção
        v_notes := 'O objetivo foi cumprido pela metade. Houve contratempos e olhares curiosos.';
    ELSE
        -- FRACASSO
        v_outcome := 'fracasso';
        v_reward_money := 0;
        v_reward_resp := 0;
        v_reward_inf := 0;
        v_reward_fear := 1;
        v_notes := 'A movimentação deu errado. Os homens recuaram para evitar flagrante.';
    END IF;

    -- Atualiza personagem
    UPDATE public.characters
    SET money = money + v_reward_money,
        respect = respect + v_reward_resp,
        influence = influence + v_reward_inf,
        fear = fear + v_reward_fear,
        experience = experience + (CASE WHEN v_outcome = 'sucesso_total' THEN 30 ELSE 10 END),
        updated_at = NOW()
    WHERE id = v_char.id;

    -- Registra transação se houve ganho
    IF v_reward_money > 0 THEN
        INSERT INTO public.transactions (character_id, amount, balance_after, category, description)
        VALUES (v_char.id, v_reward_money, v_char.money + v_reward_money, 'recompensa_acao', 'Resultado de ' || v_atype.name);
    END IF;

    -- Atualiza status da ação
    UPDATE public.player_actions
    SET status = 'completed',
        outcome_result = v_outcome,
        reward_money_granted = v_reward_money,
        reward_respect_granted = v_reward_resp,
        reward_influence_granted = v_reward_inf,
        reward_fear_granted = v_reward_fear,
        result_notes = v_notes
    WHERE id = p_action_id;

    -- Se for fracasso com complicação ou sucesso retumbante, gera notícia
    IF v_outcome = 'sucesso_total' AND v_reward_money > 2000 THEN
        INSERT INTO public.newspaper_articles (
            headline, subheadline, category, content, district_id, related_character_id, related_character_name
        )
        VALUES (
            'MOVIMENTAÇÃO MISTERIOSA GERA LUCROS EXPRESSIVOS NA NOITE',
            'Relatos de carregamentos rápidos chamam atenção de investigadores.',
            'CIDADE',
            'Fontes anônimas relatam que um grupo associado a ' || v_char.nickname || ' realizou uma manobra silenciosa em Santa Augusta, consolidando seu poderio.',
            v_act.target_district_id, v_char.id, v_char.name
        );
    END IF;

    -- Notificação interna
    INSERT INTO public.notifications (character_id, title, message, category)
    VALUES (
        v_char.id,
        'Operação Concluída: ' || v_atype.name,
        v_notes || ' Recompensas: $' || v_reward_money || ' | +' || v_reward_resp || ' Respeito.',
        'operacao'
    );

    -- Atualiza missões relacionadas a ações
    UPDATE public.player_missions pm
    SET current_count = current_count + 1,
        completed = CASE WHEN current_count + 1 >= m.target_count THEN true ELSE completed END,
        completed_at = CASE WHEN current_count + 1 >= m.target_count AND completed_at IS NULL THEN NOW() ELSE completed_at END
    FROM public.missions m
    WHERE pm.mission_id = m.id AND pm.character_id = v_char.id AND m.target_type = 'perform_actions';

    RETURN jsonb_build_object(
        'success', true,
        'outcome', v_outcome,
        'reward_money', v_reward_money,
        'reward_respect', v_reward_resp,
        'reward_influence', v_reward_inf,
        'reward_fear', v_reward_fear,
        'notes', v_notes,
        'message', 'Operação finalizada e recompensas consolidadas.'
    );
END;
$$;

-- ------------------------------------------------------------------------------
-- 6. RPC: RESUMO DE RETORNO DO JOGADOR (process_offline_catchup)
-- Retorna tudo o que aconteceu enquanto o jogador esteve offline:
-- - Lucros pendentes de estabelecimentos
-- - Ações que completaram
-- - Notícias recentes
-- - Propostas pendentes
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.rpc_get_offline_summary(
    p_character_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_char RECORD;
    v_ready_businesses JSONB;
    v_completed_actions JSONB;
    v_recent_articles JSONB;
    v_pending_proposals INT;
    v_total_pending_revenue BIGINT := 0;
BEGIN
    SELECT * INTO v_char FROM public.characters WHERE id = p_character_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Personagem não encontrado.');
    END IF;

    -- Negócios prontos para coleta
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', b.id,
        'name', b.custom_name,
        'level', b.level,
        'ready', true,
        'revenue', FLOOR(bt.base_revenue * (1.0 + ((b.level - 1) * 0.45)))
    )), '[]'::jsonb)
    INTO v_ready_businesses
    FROM public.businesses b
    JOIN public.business_types bt ON b.business_type_id = bt.id
    WHERE b.character_id = p_character_id AND NOW() >= b.next_collection_at;

    -- Ações prontas para resolução
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', pa.id,
        'action_name', at.name,
        'status', pa.status,
        'finished_at', pa.finish_at
    )), '[]'::jsonb)
    INTO v_completed_actions
    FROM public.player_actions pa
    JOIN public.action_types at ON pa.action_type_id = at.id
    WHERE pa.character_id = p_character_id AND pa.status = 'in_progress' AND NOW() >= pa.finish_at;

    -- Últimas notícias da Gazeta
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', n.id,
        'headline', n.headline,
        'category', n.category,
        'created_at', n.created_at
    )), '[]'::jsonb)
    INTO v_recent_articles
    FROM (
        SELECT id, headline, category, created_at 
        FROM public.newspaper_articles 
        ORDER BY created_at DESC 
        LIMIT 3
    ) n;

    -- Propostas pendentes de outros jogadores
    SELECT COUNT(*) INTO v_pending_proposals
    FROM public.player_proposals
    WHERE receiver_id = p_character_id AND status = 'pending';

    -- Atualiza último check offline do personagem
    UPDATE public.characters SET last_offline_check = NOW() WHERE id = p_character_id;

    RETURN jsonb_build_object(
        'success', true,
        'ready_businesses', v_ready_businesses,
        'completed_actions', v_completed_actions,
        'recent_articles', v_recent_articles,
        'pending_proposals_count', v_pending_proposals
    );
END;
$$;
