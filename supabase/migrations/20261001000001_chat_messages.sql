-- ==============================================================================
-- CHAT: "A Boca — Telegrama do Submundo"
-- Sistema de chat em tempo real via Supabase Realtime
-- ==============================================================================

-- 1. TABELA DE MENSAGENS DO CHAT
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
    character_name VARCHAR(50) NOT NULL,
    character_nickname VARCHAR(30) NOT NULL,
    character_style VARCHAR(20) NOT NULL,
    character_level INT DEFAULT 1,
    family_tag VARCHAR(5),
    channel VARCHAR(30) DEFAULT 'geral',
    content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 280),
    message_type VARCHAR(20) DEFAULT 'player' CHECK (message_type IN ('player', 'system', 'npc')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_chat_channel_created 
    ON public.chat_messages(channel, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_character 
    ON public.chat_messages(character_id);

-- 3. ROW LEVEL SECURITY
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Qualquer usuário autenticado pode ler mensagens
CREATE POLICY "chat_select_all" ON public.chat_messages
    FOR SELECT USING (true);

-- Apenas o próprio jogador pode inserir mensagens
CREATE POLICY "chat_insert_own" ON public.chat_messages
    FOR INSERT WITH CHECK (
        auth.uid() = (
            SELECT profile_id FROM public.characters WHERE id = character_id
        )
    );

-- Jogadores não podem deletar nem atualizar mensagens
-- (apenas admins via service_role key)

-- 4. HABILITA REALTIME para a tabela
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- 5. FUNÇÃO DE LIMPEZA: remove mensagens com mais de 7 dias
-- Pode ser agendada via pg_cron ou chamada manualmente
CREATE OR REPLACE FUNCTION public.cleanup_old_chat_messages()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
    DELETE FROM public.chat_messages
    WHERE created_at < NOW() - INTERVAL '7 days';
$$;
