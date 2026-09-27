// Serviço de Regras de Negócio, Timers no Servidor e Transações do 1929
import { 
  Character, CharacterStyle, PlayerBusiness, PlayerAction, 
  ActionType, BusinessType, MarketItem, InventoryItem, 
  OfflineSummary, Proposal, Family 
} from '../types/game';
import { storageService } from './storageService';
import { 
  INITIAL_BUSINESS_TYPES, INITIAL_DISTRICTS, INITIAL_ACTION_TYPES, 
  INITIAL_MARKET_ITEMS 
} from '../lib/mockData';

export const gameService = {
  // ----------------------------------------------------------------------------
  // 1. Criação do Personagem
  // ----------------------------------------------------------------------------
  createCharacter(name: string, nickname: string, origin: string, style: CharacterStyle): Character {
    let money = 2000;
    let respect = 10;
    let influence = 5;
    let fear = 2;

    // Bônus iniciais por perfil escolhido
    switch (style) {
      case 'empresario':
        money = 3000; // Começa com mais capital
        break;
      case 'negociador':
        influence = 12; // Começa com mais conexões
        break;
      case 'contrabandista':
        money = 2400;
        respect = 14;
        break;
      case 'executor':
        fear = 8;
        respect = 15;
        break;
    }

    const newChar: Character = {
      id: 'char-' + Date.now(),
      name,
      nickname,
      origin,
      style,
      money,
      respect,
      influence,
      fear,
      level: 1,
      experience: 0,
      family_id: null,
      family_role: null,
      daily_streak: 1,
      last_login_date: new Date().toISOString().split('T')[0],
      last_offline_check: new Date().toISOString(),
      created_at: new Date().toISOString(),
      is_admin: false
    };

    storageService.saveCharacter(newChar);

    // Notícia de boas-vindas na Gazeta
    storageService.addArticle({
      edition_number: 148,
      headline: `NOVO NOME DESEMBARCA EM SANTA AUGUSTA: ${nickname.toUpperCase()}`,
      subheadline: `${name}, vindo de ${origin}, promete movimentar o comércio da cidade.`,
      category: 'CIDADE',
      content: `A chegada de ${name}, conhecido nos círculos reservados como "${nickname}", chamou a atenção de veteranos e informantes locais. O recém-chegado declarou ter planos audaciosos para a capital paulista da café-indústria.`,
      related_character_name: name
    });

    return newChar;
  },

  // ----------------------------------------------------------------------------
  // 1.1 Criação do Personagem com Primeiro Negócio e Onboarding Completo
  // ----------------------------------------------------------------------------
  createCharacterWithFirstBusiness(
    name: string, 
    nickname: string, 
    origin: string, 
    style: CharacterStyle,
    firstBusinessName: string,
    firstDistrictId: string
  ): { character: Character; business: PlayerBusiness } {
    const newChar = this.createCharacter(name, nickname, origin, style);
    
    // Adiciona o primeiro negócio de herança/chegada
    const btype = INITIAL_BUSINESS_TYPES[0]; // Bar de Esquina
    const district = INITIAL_DISTRICTS.find(d => d.id === firstDistrictId) || INITIAL_DISTRICTS[0];
    
    const bizName = firstBusinessName.trim() || `Bar ${nickname}`;
    const initialRevenue = btype.base_revenue * (style === 'empresario' ? 1.15 : 1);

    const firstBiz: PlayerBusiness = {
      id: 'biz-' + Date.now(),
      character_id: newChar.id,
      business_type_id: btype.id,
      district_id: district.id,
      custom_name: bizName,
      level: 1,
      last_collected_at: new Date().toISOString(),
      next_collection_at: new Date(Date.now() + btype.cycle_minutes * 60 * 1000).toISOString(),
      is_raided: false,
      type: btype,
      district: district
    };

    // Atualiza saldo do personagem com a primeira receita colhida de inauguração
    const updatedChar: Character = {
      ...newChar,
      money: Math.floor(newChar.money + initialRevenue),
      experience: newChar.experience + 50,
      respect: newChar.respect + 5
    };

    const currentBizs = storageService.getBusinesses();
    currentBizs.push(firstBiz);
    storageService.saveBusinesses(currentBizs);
    storageService.saveCharacter(updatedChar);

    // Marca primeira missão 'Fincando Raízes' como completada e pronta
    this.incrementMissionProgress(updatedChar.id, 'buy_business', 1);

    // Notícia na Gazeta
    storageService.addArticle({
      edition_number: 148,
      headline: `PORTAS ABERTAS: "${bizName.toUpperCase()}" INAUGURA NO ${district.name.toUpperCase()}`,
      subheadline: `${name} firma raízes e já movimenta o comércio de Santa Augusta.`,
      category: 'NEGÓCIOS',
      content: `O novo estabelecimento "${bizName}", sob comando do recém-chegado ${nickname}, abriu suas portas com grande movimento no ${district.name}. Moradores e negociantes comemoram o novo ponto de encontro.`,
      district_id: district.id,
      district_name: district.name,
      related_character_name: name
    });

    return { character: updatedChar, business: firstBiz };
  },

  // ----------------------------------------------------------------------------
  // 2. Compra de Negócios
  // ----------------------------------------------------------------------------
  buyBusiness(char: Character, businessTypeId: string, districtId: string, customName?: string): { success: boolean; message: string; character?: Character; business?: PlayerBusiness } {
    const btype = INITIAL_BUSINESS_TYPES.find(b => b.id === businessTypeId);
    if (!btype) return { success: false, message: 'Tipo de negócio inválido.' };

    const district = INITIAL_DISTRICTS.find(d => d.id === districtId);
    if (!district) return { success: false, message: 'Bairro inválido.' };

    let cost = btype.base_cost;
    // Bônus do estilo Empresário: 10% de desconto inicial
    if (char.style === 'empresario') {
      cost = Math.floor(cost * 0.9);
    }

    if (char.money < cost) {
      return { success: false, message: `Fundos insuficientes. São necessários $${cost.toLocaleString('pt-BR')}.` };
    }

    const businessName = customName && customName.trim().length > 0 
      ? customName.trim() 
      : `${btype.name} da ${char.nickname}`;

    const newBiz: PlayerBusiness = {
      id: 'biz-' + Date.now(),
      character_id: char.id,
      business_type_id: btype.id,
      district_id: district.id,
      custom_name: businessName,
      level: 1,
      last_collected_at: new Date().toISOString(),
      next_collection_at: new Date(Date.now() + btype.cycle_minutes * 60 * 1000).toISOString(),
      is_raided: false,
      type: btype,
      district: district
    };

    const updatedChar: Character = {
      ...char,
      money: char.money - cost,
      experience: char.experience + 35,
      respect: char.respect + 2
    };

    // Salva negócios e personagem
    const currentBizs = storageService.getBusinesses();
    currentBizs.push(newBiz);
    storageService.saveBusinesses(currentBizs);
    storageService.saveCharacter(updatedChar);

    // Atualiza missões
    this.incrementMissionProgress(char.id, 'buy_business', 1);

    // Notícia na Gazeta
    storageService.addArticle({
      edition_number: 148,
      headline: `EXPANSÃO COMERCIAL: "${businessName.toUpperCase()}" ABRE AS PORTAS NO ${district.name.toUpperCase()}`,
      subheadline: `${char.name} consolida sua presença no bairro com novo investimento.`,
      category: 'NEGÓCIOS',
      content: `O cenário econômico do ${district.name} foi agitado pela inauguração de "${businessName}". O investimento de ${char.name} foi bem recebido por comerciantes e frequentadores da região.`,
      district_id: district.id,
      district_name: district.name,
      related_character_name: char.name
    });

    return {
      success: true,
      message: `Estabelecimento "${businessName}" adquirido com sucesso!`,
      character: updatedChar,
      business: newBiz
    };
  },

  // ----------------------------------------------------------------------------
  // 3. Coleta de Renda dos Negócios
  // ----------------------------------------------------------------------------
  collectBusinessRevenue(char: Character, businessId: string): { success: boolean; message: string; revenue?: number; character?: Character; business?: PlayerBusiness } {
    const businesses = storageService.getBusinesses();
    const index = businesses.findIndex(b => b.id === businessId && b.character_id === char.id);
    if (index === -1) return { success: false, message: 'Negócio não encontrado.' };

    const biz = businesses[index];
    const btype = INITIAL_BUSINESS_TYPES.find(t => t.id === biz.business_type_id) || biz.type;
    if (!btype) return { success: false, message: 'Dados do negócio corrompidos.' };

    const now = Date.now();
    const nextCollection = new Date(biz.next_collection_at).getTime();

    if (now < nextCollection) {
      const remainingSeconds = Math.ceil((nextCollection - now) / 1000);
      return { 
        success: false, 
        message: `A renda ainda está em produção. Aguarde mais ${Math.floor(remainingSeconds / 60)}m ${remainingSeconds % 60}s.` 
      };
    }

    // Cálculo da receita com nível e estilo
    let styleBonus = 1.0;
    if (char.style === 'empresario') {
      styleBonus = 1.15; // +15% de receita
    }

    const levelMultiplier = 1.0 + (biz.level - 1) * 0.45;
    const revenue = Math.floor(btype.base_revenue * levelMultiplier * styleBonus);

    // Atualiza próximo ciclo
    biz.last_collected_at = new Date().toISOString();
    biz.next_collection_at = new Date(now + btype.cycle_minutes * 60 * 1000).toISOString();
    businesses[index] = biz;
    storageService.saveBusinesses(businesses);

    // Atualiza personagem
    const updatedChar: Character = {
      ...char,
      money: char.money + revenue,
      experience: char.experience + (15 * biz.level)
    };
    storageService.saveCharacter(updatedChar);

    return {
      success: true,
      message: `Receita de $${revenue.toLocaleString('pt-BR')} recolhida de "${biz.custom_name}".`,
      revenue,
      character: updatedChar,
      business: biz
    };
  },

  // ----------------------------------------------------------------------------
  // 4. Upgrade de Negócio
  // ----------------------------------------------------------------------------
  upgradeBusiness(char: Character, businessId: string): { success: boolean; message: string; character?: Character; business?: PlayerBusiness } {
    const businesses = storageService.getBusinesses();
    const index = businesses.findIndex(b => b.id === businessId && b.character_id === char.id);
    if (index === -1) return { success: false, message: 'Negócio não encontrado.' };

    const biz = businesses[index];
    const btype = INITIAL_BUSINESS_TYPES.find(t => t.id === biz.business_type_id);
    if (!btype) return { success: false, message: 'Tipo de negócio inválido.' };

    const upgradeCost = Math.floor(btype.base_cost * 0.8 * biz.level);

    if (char.money < upgradeCost) {
      return { success: false, message: `Saldo insuficiente. O aprimoramento custa $${upgradeCost.toLocaleString('pt-BR')}.` };
    }

    biz.level += 1;
    businesses[index] = biz;
    storageService.saveBusinesses(businesses);

    const updatedChar: Character = {
      ...char,
      money: char.money - upgradeCost,
      respect: char.respect + 3,
      experience: char.experience + 40
    };
    storageService.saveCharacter(updatedChar);

    return {
      success: true,
      message: `"${biz.custom_name}" ampliado para o Nível ${biz.level}! A produção aumentou significativamente.`,
      character: updatedChar,
      business: biz
    };
  },

  // ----------------------------------------------------------------------------
  // 5. Iniciar Ação / Operação nas Ruas
  // ----------------------------------------------------------------------------
  startAction(char: Character, actionTypeId: string): { success: boolean; message: string; character?: Character; action?: PlayerAction } {
    const atype = INITIAL_ACTION_TYPES.find(a => a.id === actionTypeId);
    if (!atype) return { success: false, message: 'Operação desconhecida.' };

    const actions = storageService.getActions();
    const active = actions.find(a => a.character_id === char.id && a.status === 'in_progress');
    if (active) {
      return { success: false, message: 'Você já possui uma operação em andamento nas ruas de Santa Augusta.' };
    }

    if (char.money < atype.cost_money) {
      return { success: false, message: `Fundos insuficientes para financiar esta jogada ($${atype.cost_money}).` };
    }

    if (char.influence < atype.cost_influence) {
      return { success: false, message: `Você precisa de ${atype.cost_influence} de Influência para articular esta ação.` };
    }

    const now = Date.now();
    const finishAt = new Date(now + atype.duration_seconds * 1000).toISOString();

    const newAction: PlayerAction = {
      id: 'act-' + Date.now(),
      character_id: char.id,
      action_type_id: atype.id,
      started_at: new Date(now).toISOString(),
      finish_at: finishAt,
      status: 'in_progress',
      action_type: atype
    };

    actions.push(newAction);
    storageService.saveActions(actions);

    const updatedChar: Character = {
      ...char,
      money: char.money - atype.cost_money,
      influence: char.influence - atype.cost_influence
    };
    storageService.saveCharacter(updatedChar);

    return {
      success: true,
      message: `Operação "${atype.name}" iniciada. Seus contatos já estão nas ruas.`,
      character: updatedChar,
      action: newAction
    };
  },

  // ----------------------------------------------------------------------------
  // 6. Concluir / Resolver Ação (Validação estrita de Timer e Dados)
  // ----------------------------------------------------------------------------
  completeAction(char: Character, actionId: string): { success: boolean; message: string; outcome?: string; character?: Character; action?: PlayerAction } {
    const actions = storageService.getActions();
    const index = actions.findIndex(a => a.id === actionId && a.character_id === char.id);
    if (index === -1) return { success: false, message: 'Operação não encontrada.' };

    const act = actions[index];
    if (act.status !== 'in_progress') {
      return { success: false, message: 'Esta operação já foi resolvida anteriormente.' };
    }

    const now = Date.now();
    const finishTime = new Date(act.finish_at).getTime();

    if (now < finishTime) {
      const remainingSeconds = Math.ceil((finishTime - now) / 1000);
      return {
        success: false,
        message: `A operação ainda está acontecendo. Aguarde ${remainingSeconds} segundos.`
      };
    }

    const atype = INITIAL_ACTION_TYPES.find(a => a.id === act.action_type_id) || act.action_type;
    if (!atype) return { success: false, message: 'Tipo de ação inválido.' };

    // Cálculo da probabilidade com estilo
    let successChance = atype.success_chance;
    if (char.style === 'contrabandista' && atype.category === 'operacao') successChance += 10;
    if (char.style === 'executor' && atype.category === 'violencia') successChance += 12;
    if (char.style === 'negociador' && (atype.category === 'influencia' || atype.category === 'comercio')) successChance += 10;

    const roll = Math.floor(Math.random() * 100) + 1;
    let outcome: 'sucesso_total' | 'sucesso_parcial' | 'fracasso' = 'sucesso_total';
    let rewardMoney = 0;
    let rewardRespect = 0;
    let rewardInfluence = 0;
    let rewardFear = 0;
    let notes = '';

    if (roll <= successChance) {
      // Sucesso Total
      outcome = 'sucesso_total';
      const range = atype.reward_money_max - atype.reward_money_min;
      rewardMoney = atype.reward_money_min + Math.floor(Math.random() * (range + 1));
      rewardRespect = atype.reward_respect;
      rewardInfluence = atype.reward_influence;
      rewardFear = atype.reward_fear;
      notes = 'A operação transcorreu com precisão cirúrgica. Nenhum rastro deixado para a polícia.';
    } else if (roll <= successChance + 18) {
      // Sucesso Parcial
      outcome = 'sucesso_parcial';
      rewardMoney = Math.floor(atype.reward_money_min * 0.7);
      rewardRespect = Math.max(1, atype.reward_respect - 1);
      rewardInfluence = Math.max(0, atype.reward_influence - 1);
      rewardFear = atype.reward_fear + 2; // Chamou atenção
      notes = 'O objetivo foi cumprido, porém houve contratempos e olhares curiosos dos moradores.';
    } else {
      // Fracasso
      outcome = 'fracasso';
      rewardMoney = 0;
      rewardRespect = 0;
      rewardInfluence = 0;
      rewardFear = 1;
      notes = 'A movimentação falhou. Os capangas tiveram que recuar para não serem apanhados em flagrante.';
    }

    act.status = 'completed';
    act.outcome_result = outcome;
    act.reward_money_granted = rewardMoney;
    act.reward_respect_granted = rewardRespect;
    act.reward_influence_granted = rewardInfluence;
    act.reward_fear_granted = rewardFear;
    act.result_notes = notes;
    actions[index] = act;
    storageService.saveActions(actions);

    // Atualiza personagem
    const updatedChar: Character = {
      ...char,
      money: char.money + rewardMoney,
      respect: char.respect + rewardRespect,
      influence: char.influence + rewardInfluence,
      fear: char.fear + rewardFear,
      experience: char.experience + (outcome === 'sucesso_total' ? 35 : 12)
    };

    // Checa subida de nível
    const newLevel = Math.floor(updatedChar.experience / 100) + 1;
    if (newLevel > updatedChar.level) {
      updatedChar.level = newLevel;
    }

    storageService.saveCharacter(updatedChar);

    // Missões
    this.incrementMissionProgress(char.id, 'perform_actions', 1);
    if (updatedChar.respect >= 20) {
      this.incrementMissionProgress(char.id, 'reach_respect', updatedChar.respect);
    }

    // Manchete na Gazeta se a recompensa for alta
    if (outcome === 'sucesso_total' && rewardMoney >= 1000) {
      storageService.addArticle({
        edition_number: 149,
        headline: `MANOBRA ARRISCADA AGITA OS BASTIDORES DE SANTA AUGUSTA`,
        subheadline: `Fontes das ruas apontam movimentação de homens ligados a ${char.nickname}.`,
        category: 'POLÍCIA',
        content: `Relatos colhidos nos botecos e pensões confirmam que uma operação rápida e discreta rendeu cifras substanciais a um grupo emergente liderado por ${char.name}. A polícia diz investigar o caso com discrição.`,
        related_character_name: char.name
      });
    }

    return {
      success: true,
      message: notes,
      outcome,
      character: updatedChar,
      action: act
    };
  },

  // ----------------------------------------------------------------------------
  // 7. Compra e Venda no Mercado Municipal (Arbitragem)
  // ----------------------------------------------------------------------------
  buyMarketItem(char: Character, itemId: string, quantity: number): { success: boolean; message: string; character?: Character; inventory?: InventoryItem[] } {
    if (quantity <= 0) return { success: false, message: 'Quantidade inválida.' };

    const item = INITIAL_MARKET_ITEMS.find(m => m.id === itemId);
    if (!item) return { success: false, message: 'Mercadoria não encontrada.' };

    const totalCost = item.current_price * quantity;
    if (char.money < totalCost) {
      return { success: false, message: `Você não tem fundos suficientes ($${totalCost.toLocaleString('pt-BR')}).` };
    }

    const inventory = storageService.getInventory();
    const itemIndex = inventory.findIndex(inv => inv.item_id === itemId && inv.character_id === char.id);

    if (itemIndex >= 0) {
      const existing = inventory[itemIndex];
      const newQty = existing.quantity + quantity;
      const newAvgCost = Math.round(((existing.average_cost * existing.quantity) + totalCost) / newQty);
      existing.quantity = newQty;
      existing.average_cost = newAvgCost;
      inventory[itemIndex] = existing;
    } else {
      inventory.push({
        id: 'inv-' + Date.now(),
        character_id: char.id,
        item_id: item.id,
        quantity,
        average_cost: item.current_price,
        item
      });
    }

    storageService.saveInventory(inventory);

    const updatedChar: Character = {
      ...char,
      money: char.money - totalCost,
      experience: char.experience + 15
    };
    storageService.saveCharacter(updatedChar);

    this.incrementMissionProgress(char.id, 'market_trade', 1);

    return {
      success: true,
      message: `Você adquiriu ${quantity} ${item.unit}(s) de ${item.name} por $${totalCost.toLocaleString('pt-BR')}.`,
      character: updatedChar,
      inventory
    };
  },

  sellMarketItem(char: Character, itemId: string, quantity: number): { success: boolean; message: string; character?: Character; inventory?: InventoryItem[] } {
    if (quantity <= 0) return { success: false, message: 'Quantidade inválida.' };

    const inventory = storageService.getInventory();
    const itemIndex = inventory.findIndex(inv => inv.item_id === itemId && inv.character_id === char.id);
    if (itemIndex === -1 || inventory[itemIndex].quantity < quantity) {
      return { success: false, message: 'Você não possui essa quantidade no armazém.' };
    }

    const item = INITIAL_MARKET_ITEMS.find(m => m.id === itemId);
    if (!item) return { success: false, message: 'Item desconhecido.' };

    const totalEarned = item.current_price * quantity;
    const invItem = inventory[itemIndex];
    invItem.quantity -= quantity;

    if (invItem.quantity <= 0) {
      inventory.splice(itemIndex, 1);
    } else {
      inventory[itemIndex] = invItem;
    }
    storageService.saveInventory(inventory);

    const updatedChar: Character = {
      ...char,
      money: char.money + totalEarned,
      experience: char.experience + 20
    };
    storageService.saveCharacter(updatedChar);

    this.incrementMissionProgress(char.id, 'market_trade', 1);

    return {
      success: true,
      message: `Você vendeu ${quantity} ${item.unit}(s) de ${item.name} por $${totalEarned.toLocaleString('pt-BR')}.`,
      character: updatedChar,
      inventory
    };
  },

  // ----------------------------------------------------------------------------
  // 8. Recompensa Diária (Daily Login)
  // ----------------------------------------------------------------------------
  claimDailyReward(char: Character): { success: boolean; message: string; character?: Character; rewardMoney?: number } {
    const today = new Date().toISOString().split('T')[0];
    if (char.last_login_date === today) {
      return { success: false, message: 'Você já recolheu a mesada diária de hoje. Volte amanhã!' };
    }

    const streak = char.daily_streak + 1;
    // Escala progressiva: Dia 1: $500, Dia 2: $700, Dia 3: $1.000, Dia 4+: $1.400
    const rewards = [500, 700, 1000, 1400, 1800, 2400, 3200];
    const rewardMoney = rewards[Math.min(streak - 1, rewards.length - 1)];

    const updatedChar: Character = {
      ...char,
      money: char.money + rewardMoney,
      respect: char.respect + 2,
      daily_streak: streak,
      last_login_date: today
    };
    storageService.saveCharacter(updatedChar);

    return {
      success: true,
      message: `Bônus do Dia ${streak} resgatado: +$${rewardMoney.toLocaleString('pt-BR')} e +2 Respeito!`,
      rewardMoney,
      character: updatedChar
    };
  },

  // ----------------------------------------------------------------------------
  // 9. Missões e Progresso
  // ----------------------------------------------------------------------------
  incrementMissionProgress(charId: string, targetType: string, amount: number = 1): void {
    const missions = storageService.getPlayerMissions();
    let updated = false;

    missions.forEach(pm => {
      if (pm.mission && pm.mission.target_type === targetType && !pm.completed) {
        pm.current_count = Math.min(pm.mission.target_count, pm.current_count + amount);
        if (pm.current_count >= pm.mission.target_count) {
          pm.completed = true;
          pm.completed_at = new Date().toISOString();
        }
        updated = true;
      }
    });

    if (updated) {
      storageService.savePlayerMissions(missions);
    }
  },

  claimMissionReward(char: Character, missionId: string): { success: boolean; message: string; character?: Character } {
    const missions = storageService.getPlayerMissions();
    const pm = missions.find(m => m.mission_id === missionId && !m.claimed);

    if (!pm || !pm.completed || !pm.mission) {
      return { success: false, message: 'Missão ainda não concluída ou já resgatada.' };
    }

    pm.claimed = true;
    storageService.savePlayerMissions(missions);

    const updatedChar: Character = {
      ...char,
      money: char.money + pm.mission.reward_money,
      respect: char.respect + pm.mission.reward_respect,
      influence: char.influence + pm.mission.reward_influence,
      experience: char.experience + pm.mission.reward_exp
    };
    storageService.saveCharacter(updatedChar);

    return {
      success: true,
      message: `Missão "${pm.mission.title}" resgatada! +$${pm.mission.reward_money.toLocaleString('pt-BR')}, +${pm.mission.reward_respect} Respeito!`,
      character: updatedChar
    };
  },

  // ----------------------------------------------------------------------------
  // 10. Resumo Offline ("Enquanto você estava fora...")
  // ----------------------------------------------------------------------------
  getOfflineSummary(char: Character): OfflineSummary {
    const businesses = storageService.getBusinesses();
    const actions = storageService.getActions();
    const articles = storageService.getArticles();
    const proposals = storageService.getProposals();

    const now = Date.now();

    const readyBizs = businesses
      .filter(b => b.character_id === char.id && now >= new Date(b.next_collection_at).getTime())
      .map(b => {
        const btype = INITIAL_BUSINESS_TYPES.find(t => t.id === b.business_type_id);
        const rev = btype ? Math.floor(btype.base_revenue * (1 + (b.level - 1) * 0.45)) : 500;
        return {
          id: b.id,
          name: b.custom_name,
          level: b.level,
          revenue: rev
        };
      });

    const completedActions = actions
      .filter(a => a.character_id === char.id && a.status === 'in_progress' && now >= new Date(a.finish_at).getTime())
      .map(a => {
        const atype = INITIAL_ACTION_TYPES.find(t => t.id === a.action_type_id);
        return {
          id: a.id,
          action_name: atype?.name || 'Operação Secreta',
          status: 'ready'
        };
      });

    const pendingProposalsCount = proposals.filter(p => p.receiver_id === char.id && p.status === 'pending').length;

    return {
      ready_businesses: readyBizs,
      completed_actions: completedActions,
      recent_articles: articles.slice(0, 3).map(a => ({ id: a.id, headline: a.headline, category: a.category })),
      pending_proposals_count: pendingProposalsCount
    };
  }
};
