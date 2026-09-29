// Serviço de Indicação Viral ("Indique 3 Amigos") de 1929
import { Character, ReferralData, ReferralInvite } from '../types/game';
import { storageService } from './storageService';
import { rivalService } from './rivalService';

const STORAGE_KEYS = {
  REFERRAL_DATA: '1929_referral_data',
  PENDING_REF: '1929_pending_ref'
};

const sanitizeCode = (name: string): string => {
  const clean = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const prefix = clean.slice(0, 4).padEnd(4, 'X');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `1929-${prefix}-${randomNum}`;
};

export const referralService = {
  // Carrega ou inicializa os dados de indicação do jogador
  getReferralData(character?: Character | null): ReferralData {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REFERRAL_DATA);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Erro ao ler referral data:', e);
    }

    const myCode = sanitizeCode(character?.nickname || character?.name || 'DOM');
    const defaultData: ReferralData = {
      my_code: myCode,
      referred_by: null,
      referrals: [],
      target_goal: 3,
      milestone_claimed: false
    };

    this.saveReferralData(defaultData);
    return defaultData;
  },

  saveReferralData(data: ReferralData): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REFERRAL_DATA, JSON.stringify(data));
    } catch (e) {
      console.warn('Erro ao salvar referral data:', e);
    }
  },

  // Token pendente da URL (?ref=...)
  getPendingRef(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.PENDING_REF);
    } catch {
      return null;
    }
  },

  setPendingRef(code: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PENDING_REF, code.trim().toUpperCase());
    } catch {}
  },

  clearPendingRef(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PENDING_REF);
    } catch {}
  },

  // Gera o link de compartilhamento
  getShareUrl(myCode: string): string {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://1929game.app';
    return `${origin}/?ref=${myCode}`;
  },

  // Gera a mensagem temática para o WhatsApp
  getWhatsAppShareUrl(myCode: string, nickname: string): string {
    const shareUrl = this.getShareUrl(myCode);
    const message = `🏛️ *CONVITE CONFIDENCIAL DE SANTA AUGUSTA (1929)*\n\n` +
      `O chefão *${nickname}* convocou você para reforçar a aliança na cidade!\n\n` +
      `Entre pelo link abaixo para iniciar seu império com *$1.000 réis de ajuda de custo*, *+5 de Respeito* e *1 Caixa de Whisky Escocês* nos seus armazéns:\n\n` +
      `🔗 ${shareUrl}\n\n` +
      `Token de Padrinho: *${myCode}*`;

    return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  },

  // Resgata o código de um padrinho que te convidou
  applyReferralCode(
    player: Character,
    rawCode: string
  ): { success: boolean; character: Character; referralData: ReferralData; message: string } {
    const referralData = this.getReferralData(player);
    const code = rawCode.trim().toUpperCase();

    if (!code) {
      return { success: false, character: player, referralData, message: 'Digite um código de indicação válido.' };
    }

    if (code === referralData.my_code.toUpperCase()) {
      return { success: false, character: player, referralData, message: 'Você não pode utilizar o seu próprio código de indicação.' };
    }

    if (referralData.referred_by) {
      return { success: false, character: player, referralData, message: `Você já recebeu o bônus do padrinho (${referralData.referred_by}) anteriormente.` };
    }

    // Códigos válidos: precisam ter pelo menos 4 caracteres
    if (code.length < 4) {
      return { success: false, character: player, referralData, message: 'Código inválido. Verifique o token recebido pelo seu amigo.' };
    }

    // Bônus concedido ao novo jogador:
    // +$1.000 réis, +5 Respeito e 1 Caixa de Whisky Escocês
    const bonusMoney = 1000;
    const bonusRespect = 5;

    const updatedChar: Character = {
      ...player,
      money: player.money + bonusMoney,
      respect: player.respect + bonusRespect
    };
    storageService.saveCharacter(updatedChar);

    // Adiciona 1 caixa de whisky escocês ao inventário
    const inv = storageService.getInventory();
    const whiskyId = '44444444-4444-4444-4444-444444444402';
    const existing = inv.find(i => i.item_id === whiskyId);
    if (existing) {
      existing.quantity += 1;
    } else {
      inv.push({
        id: 'inv-' + Date.now(),
        character_id: player.id,
        item_id: whiskyId,
        quantity: 1,
        average_cost: 0
      });
    }
    storageService.saveInventory(inv);

    referralData.referred_by = code;
    this.saveReferralData(referralData);
    this.clearPendingRef();

    return {
      success: true,
      character: updatedChar,
      referralData,
      message: `Pacto selado! Você recebeu +$1.000 réis, +5 Respeito e 1 Caixa de Whisky Escocês cortesia do padrinho (${code})!`
    };
  },

  // Simula ou registra a entrada de um amigo que usou seu código
  simulateFriendJoined(
    player: Character,
    customFriendName?: string
  ): { success: boolean; character: Character; referralData: ReferralData; message: string } {
    const referralData = this.getReferralData(player);

    const friendNames = [
      'Coronel_Barbosa', 'Tião_Navalha', 'Don_Luciano', 
      'Madame_Renée', 'Fausto_Cais', 'Sargento_Melo', 
      'Barão_Júnior', 'Augusto_Silva'
    ];
    const friendName = customFriendName || friendNames[referralData.referrals.length % friendNames.length] + `_${Math.floor(10 + Math.random() * 90)}`;

    const newInvite: ReferralInvite = {
      id: 'inv-' + Date.now(),
      friend_name: friendName,
      date: new Date().toLocaleDateString('pt-BR'),
      reward_claimed: true
    };

    referralData.referrals.push(newInvite);
    this.saveReferralData(referralData);

    // Bônus por amigo indicado: +$1.500 réis, +10 de Respeito e +100 Pontos de Glória da Temporada
    const bonusMoney = 1500;
    const bonusRespect = 10;
    const updatedChar: Character = {
      ...player,
      money: player.money + bonusMoney,
      respect: player.respect + bonusRespect
    };
    storageService.saveCharacter(updatedChar);

    // Pontos de glória no Passe da Temporada
    rivalService.addGlory(100);

    const totalFriends = referralData.referrals.length;
    let message = `Novo aliado nas ruas! ${friendName} utilizou seu token! Você recebeu +$1.500 réis, +10 Respeito e +100 Pontos de Glória! (${totalFriends}/3)`;

    if (totalFriends === 3) {
      message += ' 🎉 VOCÊ ATINGIU A META DE 3 AMIGOS! Resgate sua Recompensa Lendária do Padrinho!';
    }

    return {
      success: true,
      character: updatedChar,
      referralData,
      message
    };
  },

  // Resgate da grande recompensa dos 3 amigos
  claimMilestone3(
    player: Character
  ): { success: boolean; character: Character; referralData: ReferralData; message: string } {
    const referralData = this.getReferralData(player);

    if (referralData.referrals.length < 3) {
      return { 
        success: false, 
        character: player, 
        referralData, 
        message: `Você precisa de 3 amigos indicados para resgatar o prêmio do Padrinho (Atualmente: ${referralData.referrals.length}/3).` 
      };
    }

    if (referralData.milestone_claimed) {
      return { 
        success: false, 
        character: player, 
        referralData, 
        message: 'A Recompensa Lendária dos 3 Amigos já foi resgatada!' 
      };
    }

    // Grande Prêmio de Conexão:
    // +$5.000 réis, +25 de Influência Política, +20 de Respeito
    const updatedChar: Character = {
      ...player,
      money: player.money + 5000,
      influence: player.influence + 25,
      respect: player.respect + 20
    };
    storageService.saveCharacter(updatedChar);

    referralData.milestone_claimed = true;
    this.saveReferralData(referralData);

    // Registra notícia de prestígio no Jornal
    storageService.addArticle({
      edition_number: 162,
      headline: `REDE DE INFLUÊNCIA: ${player.name.toUpperCase()} CONSOLIDA ALIANÇA HISTÓRICA EM SANTA AUGUSTA`,
      subheadline: 'Novos comparsas e aliados chegam à cidade sob a bênção do influente líder.',
      category: 'CIDADE',
      content: `A crescente rede de contatos e apadrinhamento de ${player.nickname} chamou a atenção dos salões políticos e das docas de Santa Augusta. Com uma base fiel de aliados recém-chegados, seu nome desponta como um dos maiores articuladores do submundo.`,
      district_name: 'Centro Histórico',
      related_character_name: player.name
    });

    return {
      success: true,
      character: updatedChar,
      referralData,
      message: '👑 RECOMPENSA LENDÁRIA DO PADRINHO RESGATADA: +$5.000 réis, +25 de Influência Política e +20 de Respeito creditados!'
    };
  }
};
