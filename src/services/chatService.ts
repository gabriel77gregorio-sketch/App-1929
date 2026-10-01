/**
 * chatService.ts — "A Boca: Telegrama do Submundo"
 * 
 * Serviço de chat em tempo real usando Supabase Realtime.
 * Quando Supabase não está configurado, opera em modo mock com NPCs.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ChatMessage, Character } from '../types/game';

// =============================================================================
// MENSAGENS MOCK DE NPCs (modo offline / demo)
// =============================================================================

const NPC_PERSONAS = [
  {
    character_id: 'npc-delegado',
    character_name: 'Delegado Peixoto',
    character_nickname: 'Peixoto',
    character_style: 'executor' as const,
    character_level: 15,
    family_tag: null,
  },
  {
    character_id: 'npc-cora',
    character_name: 'Dona Cora',
    character_nickname: 'Cora',
    character_style: 'empresario' as const,
    character_level: 12,
    family_tag: 'SIL',
  },
  {
    character_id: 'npc-ze',
    character_name: 'Zé Navalha',
    character_nickname: 'Navalha',
    character_style: 'contrabandista' as const,
    character_level: 8,
    family_tag: 'CAP',
  },
  {
    character_id: 'npc-barao',
    character_name: 'Barão Fontenelle',
    character_nickname: 'Barão',
    character_style: 'negociador' as const,
    character_level: 20,
    family_tag: 'FON',
  },
  {
    character_id: 'npc-marocas',
    character_name: 'Marocas do Porto',
    character_nickname: 'Marocas',
    character_style: 'contrabandista' as const,
    character_level: 6,
    family_tag: null,
  },
];

const NPC_DIALOGUES: string[] = [
  'Café tá subindo que nem foguete... quem comprou ontem tá rindo à toa.',
  'Ouvi dizer que a polícia vai fazer batida no Porto essa semana. Cuidado.',
  'Alguém sabe quem sabotou meu armazém? Isso não vai ficar assim.',
  'Procurando sócios para uma operação no Bairro Boêmio. Interessados?',
  'A Gazeta tá dizendo que o mercado de whisky vai despencar. Será?',
  'Quem quiser proteção no subúrbio, fala comigo. Tenho contatos.',
  'Acabei de subir pro nível 10! Respeito na rua aumentou demais.',
  'Cuidado com os Fontenelle... eles tão expandindo pro Centro.',
  'Minha oficina mecânica já deu mais lucro que o bar. Vale o investimento.',
  'Tem novato chegando na cidade? Bom sinal. Mais movimento, mais negócio.',
  'Saúde, companheiros! Brindemos aos que sobrevivem nessa cidade.',
  'Vi o Delegado rondando a Estação. Devem ter denunciado alguém.',
  'Quem controla o café, controla Santa Augusta. Sempre foi assim.',
  'Meus guarda-costas já se pagaram três vezes. Investimento essencial.',
  'Alguém mais sentiu o preço do couro cair? Hora de estocar!',
  'A família Silvestri tá recrutando. Dizem que o tesouro tá gordo.',
  'Fiz uma operação no Porto e voltei com os bolsos cheios. 💰',
  'Respeito se conquista na rua, não no papel. Lembrem-se disso.',
  'Quero trocar 5 sacas de café por whisky. Alguém topa?',
  'Novo evento na cidade! Corrida de cavalos no Interior. Apostas abertas!',
  'Minha estratégia? Compra na baixa, vende na alta. Simples assim.',
  'Os tempos estão mudando... mas o dinheiro continua falando mais alto.',
  'Acabei de fundar minha família. Quem quiser jurar lealdade, é bem-vindo.',
  'Não confiem em quem oferece negócio fácil. Sempre tem armadilha.',
  'O submundo de Santa Augusta nunca dorme. E nem nós devemos.',
];

const NPC_RESPONSES: Record<string, string[]> = {
  default: [
    'Concordo plenamente, companheiro.',
    'Interessante... vou pensar nisso.',
    'É assim que funciona nessa cidade.',
    'Você tem razão. Santa Augusta não perdoa os distraídos.',
    'Bem dito! 🥃',
    'Hah! Isso me lembrou dos velhos tempos...',
    'Cuidado com o que fala por aqui... as paredes têm ouvidos.',
  ],
};

// =============================================================================
// CHAT SERVICE
// =============================================================================

const FIRST_MSG_KEY = '1929_chat_first_msg';
const CHAT_MOCK_STORAGE_KEY = '1929_chat_mock_msgs';

class ChatService {
  private subscription: any = null;
  private mockMessages: ChatMessage[] = [];
  private mockListeners: Array<(msg: ChatMessage) => void> = [];
  private mockTimerId: ReturnType<typeof setTimeout> | null = null;
  private onlineCount: number = 0;

  constructor() {
    this.onlineCount = this.generateOnlineCount();
    if (!isSupabaseConfigured) {
      this.initMockMessages();
    }
  }

  // -------------------------------------------------------------------------
  // PÚBLICO: Carregar mensagens recentes
  // -------------------------------------------------------------------------
  async loadRecentMessages(channel: string = 'geral', limit: number = 50): Promise<ChatMessage[]> {
    if (!isSupabaseConfigured) {
      return this.mockMessages.filter(m => m.channel === channel).slice(-limit);
    }

    try {
      const { data, error } = await supabase!
        .from('chat_messages')
        .select('*')
        .eq('channel', channel)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []).reverse() as ChatMessage[];
    } catch (err) {
      console.error('[ChatService] Erro ao carregar mensagens:', err);
      return [];
    }
  }

  // -------------------------------------------------------------------------
  // PÚBLICO: Enviar mensagem
  // -------------------------------------------------------------------------
  async sendMessage(
    character: Character,
    content: string,
    channel: string = 'geral'
  ): Promise<ChatMessage | null> {
    const trimmed = content.trim().slice(0, 280);
    if (!trimmed) return null;

    const msgBase = {
      character_id: character.id,
      character_name: character.name,
      character_nickname: character.nickname,
      character_style: character.style,
      character_level: character.level,
      family_tag: character.family_name
        ? (character.family_name.slice(0, 3).toUpperCase())
        : null,
      channel,
      content: trimmed,
      message_type: 'player' as const,
    };

    if (!isSupabaseConfigured) {
      return this.sendMockMessage(msgBase);
    }

    try {
      const { data, error } = await supabase!
        .from('chat_messages')
        .insert(msgBase)
        .select()
        .single();

      if (error) throw error;
      return data as ChatMessage;
    } catch (err) {
      console.error('[ChatService] Erro ao enviar mensagem:', err);
      return null;
    }
  }

  // -------------------------------------------------------------------------
  // PÚBLICO: Inscrever-se em canal (Supabase Realtime)
  // -------------------------------------------------------------------------
  subscribeToChannel(channel: string, onMessage: (msg: ChatMessage) => void): void {
    this.unsubscribe();

    if (!isSupabaseConfigured) {
      this.mockListeners.push(onMessage);
      this.startMockNPCLoop(channel);
      return;
    }

    this.subscription = supabase!
      .channel(`chat-${channel}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `channel=eq.${channel}`,
        },
        (payload) => {
          onMessage(payload.new as ChatMessage);
        }
      )
      .subscribe();
  }

  // -------------------------------------------------------------------------
  // PÚBLICO: Cancelar inscrição
  // -------------------------------------------------------------------------
  unsubscribe(): void {
    if (this.subscription) {
      supabase?.removeChannel(this.subscription);
      this.subscription = null;
    }
    this.mockListeners = [];
    if (this.mockTimerId) {
      clearTimeout(this.mockTimerId);
      this.mockTimerId = null;
    }
  }

  // -------------------------------------------------------------------------
  // PÚBLICO: Contagem simulada de jogadores online
  // -------------------------------------------------------------------------
  getOnlineCount(): number {
    return this.onlineCount;
  }

  refreshOnlineCount(): number {
    // Varia ±1-3 do valor atual para parecer orgânico
    const delta = Math.floor(Math.random() * 5) - 2;
    this.onlineCount = Math.max(8, Math.min(99, this.onlineCount + delta));
    return this.onlineCount;
  }

  // -------------------------------------------------------------------------
  // PÚBLICO: Verificar se é primeira mensagem do jogador (reward)
  // -------------------------------------------------------------------------
  isFirstMessage(): boolean {
    return localStorage.getItem(FIRST_MSG_KEY) !== 'true';
  }

  markFirstMessageSent(): void {
    localStorage.setItem(FIRST_MSG_KEY, 'true');
  }

  // -------------------------------------------------------------------------
  // MOCK: Inicializa mensagens de NPCs para modo offline
  // -------------------------------------------------------------------------
  private initMockMessages(): void {
    const now = Date.now();
    const shuffled = [...NPC_DIALOGUES].sort(() => Math.random() - 0.5);

    this.mockMessages = shuffled.slice(0, 15).map((content, i) => {
      const npc = NPC_PERSONAS[i % NPC_PERSONAS.length];
      const minutesAgo = (15 - i) * 3 + Math.floor(Math.random() * 5);
      return {
        id: `mock-${i}-${now}`,
        ...npc,
        channel: 'geral',
        content,
        message_type: 'npc' as const,
        created_at: new Date(now - minutesAgo * 60 * 1000).toISOString(),
      };
    });

    // Adiciona uma mensagem de sistema de boas-vindas no topo
    this.mockMessages.unshift({
      id: `sys-welcome-${now}`,
      character_id: 'system',
      character_name: 'Santa Augusta',
      character_nickname: 'Sistema',
      character_style: 'negociador',
      character_level: 0,
      family_tag: null,
      channel: 'geral',
      content: '🏛️ Bem-vindo à Boca! Aqui circulam as fofocas, negócios e alianças de Santa Augusta.',
      message_type: 'system',
      created_at: new Date(now - 60 * 60 * 1000).toISOString(),
    });
  }

  // -------------------------------------------------------------------------
  // MOCK: Envia mensagem localmente e agenda resposta de NPC
  // -------------------------------------------------------------------------
  private sendMockMessage(
    msgBase: Omit<ChatMessage, 'id' | 'created_at'>
  ): ChatMessage {
    const msg: ChatMessage = {
      ...msgBase,
      id: `player-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      created_at: new Date().toISOString(),
    };

    this.mockMessages.push(msg);

    // Dispara para listeners (simula realtime)
    for (const listener of this.mockListeners) {
      listener(msg);
    }

    // NPC responde entre 2-6 segundos depois (engagement)
    const delay = 2000 + Math.random() * 4000;
    setTimeout(() => {
      this.sendNPCResponse(msg.channel);
    }, delay);

    return msg;
  }

  // -------------------------------------------------------------------------
  // MOCK: NPC responde automaticamente
  // -------------------------------------------------------------------------
  private sendNPCResponse(channel: string): void {
    const npc = NPC_PERSONAS[Math.floor(Math.random() * NPC_PERSONAS.length)];
    const responses = NPC_RESPONSES.default;
    const content = responses[Math.floor(Math.random() * responses.length)];

    const msg: ChatMessage = {
      id: `npc-resp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ...npc,
      channel,
      content,
      message_type: 'npc',
      created_at: new Date().toISOString(),
    };

    this.mockMessages.push(msg);
    for (const listener of this.mockListeners) {
      listener(msg);
    }
  }

  // -------------------------------------------------------------------------
  // MOCK: Loop periódico de mensagens NPC (simula atividade)
  // -------------------------------------------------------------------------
  private startMockNPCLoop(channel: string): void {
    const scheduleNext = () => {
      // Nova mensagem de NPC a cada 20-45 segundos
      const interval = 20000 + Math.random() * 25000;
      this.mockTimerId = setTimeout(() => {
        const npc = NPC_PERSONAS[Math.floor(Math.random() * NPC_PERSONAS.length)];
        const dialogue = NPC_DIALOGUES[Math.floor(Math.random() * NPC_DIALOGUES.length)];

        const msg: ChatMessage = {
          id: `npc-auto-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          ...npc,
          channel,
          content: dialogue,
          message_type: 'npc',
          created_at: new Date().toISOString(),
        };

        this.mockMessages.push(msg);
        for (const listener of this.mockListeners) {
          listener(msg);
        }

        this.refreshOnlineCount();
        scheduleNext();
      }, interval);
    };

    scheduleNext();
  }

  // -------------------------------------------------------------------------
  // UTILIDADE: Gera número inicial "realista" de jogadores online
  // -------------------------------------------------------------------------
  private generateOnlineCount(): number {
    const hour = new Date().getHours();
    // Mais jogadores à noite (19-23h), menos de madrugada
    if (hour >= 19 && hour <= 23) return 35 + Math.floor(Math.random() * 30);
    if (hour >= 12 && hour <= 18) return 20 + Math.floor(Math.random() * 20);
    if (hour >= 7 && hour <= 11) return 15 + Math.floor(Math.random() * 15);
    return 8 + Math.floor(Math.random() * 12); // madrugada
  }
}

export const chatService = new ChatService();
