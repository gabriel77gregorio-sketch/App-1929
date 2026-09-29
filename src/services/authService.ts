// Serviço de Autenticação (Google OAuth via Supabase + Fallback Simulado)
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Character } from '../types/game';
import { storageService } from './storageService';

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

const AUTH_STORAGE_KEY = '1929_auth_user';

export const authService = {
  // Retorna se o Supabase real está ativo ou se estamos em modo simulação
  isRealAuth(): boolean {
    return isSupabaseConfigured;
  },

  // Obtém o usuário atual (da sessão do Supabase ou do storage local de simulação)
  async getCurrentUser(): Promise<AuthUser | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) return null;
        return {
          id: data.user.id,
          email: data.user.email,
          user_metadata: data.user.user_metadata
        };
      } catch {
        return null;
      }
    }

    // Modo desenvolvimento / simulação local
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  // Inicia o fluxo de Login / Vinculação com o Google
  async signInWithGoogle(): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) throw error;
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Falha ao autenticar com o Google.' };
      }
    }

    // Modo Simulado: Simula conexão instantânea com Google em desenvolvimento
    const mockUser: AuthUser = {
      id: 'google-user-' + Date.now(),
      email: 'jogador1929@gmail.com',
      user_metadata: {
        full_name: 'Negociante de Santa Augusta',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80'
      }
    };
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
    } catch {
      // Ignora erro de localStorage
    }
    return { success: true, user: mockUser };
  },

  // Vincula o personagem convidado (Guest) à conta Google com bônus de recompensa
  linkCharacterToGoogle(char: Character, userEmail: string = 'jogador1929@gmail.com'): { character: Character; bonusGranted: boolean } {
    const wasAlreadyLinked = Boolean(char.google_email);

    const bonusMoney = wasAlreadyLinked ? 0 : 500;
    const bonusRespect = wasAlreadyLinked ? 0 : 5;

    const updatedChar: Character = {
      ...char,
      google_email: userEmail,
      is_cloud_synced: true,
      money: char.money + bonusMoney,
      respect: char.respect + bonusRespect
    };

    storageService.saveCharacter(updatedChar);

    // Se Supabase estiver conectado, sincroniza no banco
    if (isSupabaseConfigured && supabase && updatedChar.profile_id) {
      supabase.from('characters').upsert(updatedChar).then();
    }

    return {
      character: updatedChar,
      bonusGranted: !wasAlreadyLinked
    };
  },

  // Desconecta a conta Google
  async signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Erro ao deslogar do Supabase:', err);
      }
    }
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Ignora
    }
  }
};
