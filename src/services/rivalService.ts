// Serviço de Rivais, Sabotagens, Vingança e Temporadas (1929)
import { 
  Character, RivalTarget, RivalAttack, SabotageType, SabotageTypeId, 
  SeasonData, PlayerDefense, NewspaperArticle 
} from '../types/game';
import { storageService } from './storageService';

const STORAGE_KEYS = {
  RIVALS: '1929_rivals',
  ATTACK_LOGS: '1929_rival_attacks',
  PLAYER_DEFENSE: '1929_player_defense',
  SEASON: '1929_season_data'
};

export const SABOTAGE_TYPES: SabotageType[] = [
  {
    id: 'armazem',
    name: 'Incursão ao Armazém Noturno',
    description: 'Invada os depósitos do rival na calada da noite para saquear cargas e desviar o dinheiro do caixa.',
    energy_cost: 1,
    cost_money: 100,
    success_rate_base: 70,
    risk_police: 25,
    reward_label: 'Rouba até $1.500 réis + Pontos de Glória',
    icon: 'package'
  },
  {
    id: 'denuncia',
    name: 'Suborno da Guarda Fiscal',
    description: 'Pague fiscais corruptos para lacrarem os estabelecimentos do rival e confiscarem mercadorias.',
    energy_cost: 1,
    cost_money: 250,
    success_rate_base: 65,
    risk_police: 15,
    reward_label: 'Confisca $800 réis + 8 Respeito + Paralisação',
    icon: 'shield-alert'
  },
  {
    id: 'gazeta',
    name: 'Dossiê Anônimo na Gazeta',
    description: 'Vaze escândalos e fraudes do rival para a redação da Gazeta da Capital, arruinando sua reputação.',
    energy_cost: 1,
    cost_money: 180,
    success_rate_base: 75,
    risk_police: 10,
    reward_label: 'Transfere 12 Respeito do rival para você + Manchete de Capa',
    icon: 'newspaper'
  }
];

export const INITIAL_SEASON: SeasonData = {
  season_number: 1,
  title: 'Temporada 1: O Crash de Wall Street & A Crise do Café',
  subtitle: 'Novembro de 1929 — As oligarquias balançam e quem domina as ruas define a nova ordem.',
  theme_color: '#c5a059',
  end_date: '1929-12-15',
  days_left: 14,
  current_level: 1,
  current_glory: 120,
  glory_per_level: 200,
  claimed_levels: [],
  rewards: [
    {
      level: 1,
      required_glory: 200,
      title: 'Título: Sobrevivente do Crash',
      reward_type: 'money',
      reward_amount: 500,
      reward_name: 'Bônus de Emergência de $500 réis',
      icon: 'coins'
    },
    {
      level: 2,
      required_glory: 400,
      title: 'Lote de Café Arábica Especial',
      reward_type: 'item',
      reward_amount: 3,
      reward_name: '3 Sacas de Café de Exportação',
      item_id: '44444444-4444-4444-4444-444444444401',
      icon: 'package'
    },
    {
      level: 3,
      required_glory: 600,
      title: 'Reputação nos Bares e Cais',
      reward_type: 'respect',
      reward_amount: 15,
      reward_name: '+15 Pontos de Respeito Social',
      icon: 'award'
    },
    {
      level: 4,
      required_glory: 800,
      title: 'Caixas de Whisky Escocês Nobre',
      reward_type: 'item',
      reward_amount: 2,
      reward_name: '2 Caixas de Whisky Escocês Raro',
      item_id: '44444444-4444-4444-4444-444444444402',
      icon: 'wine'
    },
    {
      level: 5,
      required_glory: 1000,
      title: 'Veículo Ford Modelo A Tudor (1929)',
      reward_type: 'money',
      reward_amount: 2000,
      reward_name: 'Prestígio Automotivo: $2.000 réis em ouro',
      icon: 'truck'
    },
    {
      level: 6,
      required_glory: 1200,
      title: 'Rede de Informantes do Porto',
      reward_type: 'influence',
      reward_amount: 25,
      reward_name: '+25 Pontos de Influência Política',
      icon: 'users'
    },
    {
      level: 7,
      required_glory: 1400,
      title: 'Dossiê Confidencial do Banco Central',
      reward_type: 'item',
      reward_amount: 1,
      reward_name: '1 Dossiê Confidencial Raro',
      item_id: '44444444-4444-4444-4444-444444444405',
      icon: 'file-text'
    },
    {
      level: 8,
      required_glory: 1600,
      title: 'Cofre Blindado Krupp',
      reward_type: 'money',
      reward_amount: 3500,
      reward_name: 'Subvenção de Defesa: $3.500 réis',
      icon: 'shield-check'
    },
    {
      level: 9,
      required_glory: 1800,
      title: 'Acordo com a Cúpula Policial',
      reward_type: 'respect',
      reward_amount: 40,
      reward_name: '+40 Pontos de Respeito Absoluto',
      icon: 'crown'
    },
    {
      level: 10,
      required_glory: 2000,
      title: 'Troféu Lendário: Barão de Santa Augusta',
      reward_type: 'money',
      reward_amount: 10000,
      reward_name: 'Fortuna da Vitória: $10.000 réis + Título Lendário',
      icon: 'trophy'
    }
  ]
};

const DEFAULT_RIVALS: RivalTarget[] = [
  {
    id: 'rival-moretti',
    name: 'Don Vincenzo Moretti',
    nickname: 'O Velho Raposa',
    title: 'Patriarca da Família Moretti',
    family_name: 'Família Moretti',
    family_tag: 'MORTI',
    level: 5,
    fortune: 85000,
    respect: 85,
    defense_rating: 45,
    district_name: 'Porto das Docas',
    avatar_initial: 'V',
    is_player: false,
    online_status: 'online'
  },
  {
    id: 'rival-tiao',
    name: 'Sebastião "Machado" Ferreira',
    nickname: 'Tião Machado',
    title: 'Líder dos Ferroviários do Interior',
    family_name: 'Irmandade dos Trilhos',
    family_tag: 'FERRA',
    level: 4,
    fortune: 62000,
    respect: 74,
    defense_rating: 40,
    district_name: 'Estação Ferroviária',
    avatar_initial: 'T',
    is_player: false,
    online_status: 'recente'
  },
  {
    id: 'rival-bento',
    name: 'Bento de Albuquerque',
    nickname: 'O Barão do Café',
    title: 'Banqueiro e Latifundiário',
    family_name: 'Clã Albuquerque',
    family_tag: 'ALBUQ',
    level: 6,
    fortune: 140000,
    respect: 92,
    defense_rating: 60,
    district_name: 'Centro Histórico',
    avatar_initial: 'B',
    is_player: false,
    online_status: 'online'
  },
  {
    id: 'rival-lili',
    name: 'Madame Lili Cartier',
    nickname: 'A Dama de Ouro',
    title: 'Rainha do Cabaré Imperial',
    family_name: 'Círculo Boêmio',
    family_tag: 'BOEMI',
    level: 3,
    fortune: 28000,
    respect: 52,
    defense_rating: 30,
    district_name: 'Distrito Boêmio',
    avatar_initial: 'L',
    is_player: false,
    online_status: 'recente'
  },
  {
    id: 'rival-silveira',
    name: 'Coronel Silveira Neto',
    nickname: 'Silveira_BR',
    title: 'Concorrente de Santa Augusta',
    family_name: 'Aliança Paulista',
    family_tag: 'PAULI',
    level: 3,
    fortune: 19500,
    respect: 48,
    defense_rating: 35,
    district_name: 'Subúrbio Industrial',
    avatar_initial: 'S',
    is_player: true,
    online_status: 'online'
  },
  {
    id: 'rival-fausto',
    name: 'Dr. Fausto Guimarães',
    nickname: 'O Químico',
    title: 'Dono da Farmácia Central',
    family_name: 'Independente',
    family_tag: 'INDEP',
    level: 2,
    fortune: 12000,
    respect: 38,
    defense_rating: 25,
    district_name: 'Centro Histórico',
    avatar_initial: 'F',
    is_player: true,
    online_status: 'ausente'
  }
];

export const rivalService = {
  // Lista de Rivais
  getRivals(): RivalTarget[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RIVALS);
      if (!raw) {
        this.saveRivals(DEFAULT_RIVALS);
        return DEFAULT_RIVALS;
      }
      return JSON.parse(raw);
    } catch {
      return DEFAULT_RIVALS;
    }
  },

  saveRivals(rivals: RivalTarget[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.RIVALS, JSON.stringify(rivals));
    } catch (e) {
      console.warn('Erro ao salvar rivais:', e);
    }
  },

  // Histórico de Ataques / Vinganças
  getAttackLogs(): RivalAttack[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ATTACK_LOGS);
      if (!raw) {
        // Mock inicial com um ataque sofrido para demonstrar o botão de vingança imediatamente!
        const initialLogs: RivalAttack[] = [
          {
            id: 'atk-init-1',
            attacker_id: 'rival-moretti',
            attacker_name: 'Don Vincenzo Moretti',
            victim_id: 'player',
            victim_name: 'Seu Negócio',
            sabotage_type: 'armazem',
            success: true,
            loot_money: 320,
            loot_respect: 4,
            created_at: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
            can_revenge: true,
            revenge_executed: false,
            details: 'Homens de Don Moretti invadiram seu armazém secundário e levaram sacas de café e $320 réis do cofre.'
          }
        ];
        this.saveAttackLogs(initialLogs);
        return initialLogs;
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveAttackLogs(logs: RivalAttack[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ATTACK_LOGS, JSON.stringify(logs.slice(0, 30)));
    } catch (e) {
      console.warn('Erro ao salvar histórico de ataques:', e);
    }
  },

  // Defesa do Jogador
  getPlayerDefense(): PlayerDefense {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PLAYER_DEFENSE);
      if (!raw) {
        const def: PlayerDefense = { guards_count: 1, safe_level: 1 };
        this.savePlayerDefense(def);
        return def;
      }
      return JSON.parse(raw);
    } catch {
      return { guards_count: 1, safe_level: 1 };
    }
  },

  savePlayerDefense(def: PlayerDefense): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYER_DEFENSE, JSON.stringify(def));
    } catch (e) {
      console.warn('Erro ao salvar defesa:', e);
    }
  },

  // Temporada & Passe de Glória
  getSeasonData(): SeasonData {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SEASON);
      if (!raw) {
        this.saveSeasonData(INITIAL_SEASON);
        return INITIAL_SEASON;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_SEASON;
    }
  },

  saveSeasonData(season: SeasonData): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SEASON, JSON.stringify(season));
    } catch (e) {
      console.warn('Erro ao salvar temporada:', e);
    }
  },

  // Adiciona Glória ao Passe da Temporada
  addGlory(amount: number): SeasonData {
    const season = this.getSeasonData();
    season.current_glory += amount;
    
    // Calcula novo nível da temporada
    const calculatedLevel = Math.min(10, Math.floor(season.current_glory / season.glory_per_level) + 1);
    if (calculatedLevel > season.current_level) {
      season.current_level = calculatedLevel;
    }
    
    this.saveSeasonData(season);
    return season;
  },

  // Executa Sabotagem / Incursão contra um Rival
  executeSabotage(
    player: Character,
    rivalId: string,
    sabotageType: SabotageTypeId,
    isRevenge = false
  ): {
    success: boolean;
    character: Character;
    lootMoney: number;
    lootRespect: number;
    gloryGained: number;
    message: string;
    headline?: string;
  } {
    const rivals = this.getRivals();
    const rival = rivals.find(r => r.id === rivalId);
    if (!rival) {
      return {
        success: false,
        character: player,
        lootMoney: 0,
        lootRespect: 0,
        gloryGained: 0,
        message: 'Alvo não localizado nas ruas de Santa Augusta.'
      };
    }

    const sabConfig = SABOTAGE_TYPES.find(s => s.id === sabotageType) || SABOTAGE_TYPES[0];

    // Custo de execução
    if (player.money < sabConfig.cost_money) {
      return {
        success: false,
        character: player,
        lootMoney: 0,
        lootRespect: 0,
        gloryGained: 0,
        message: `Você precisa de $${sabConfig.cost_money} réis para preparar a operação.`
      };
    }

    // Cálculo de chance de sucesso
    // Base - Defesa do rival + Bônus de estilo ou nível
    const styleBonus = player.style === 'contrabandista' || player.style === 'executor' ? 10 : 0;
    const levelDiffBonus = Math.max(-20, Math.min(20, (player.level - rival.level) * 5));
    const effectiveChance = Math.max(25, Math.min(90, sabConfig.success_rate_base - rival.defense_rating + styleBonus + levelDiffBonus));
    const roll = Math.random() * 100;
    const isSuccess = roll <= effectiveChance;

    let updatedMoney = player.money - sabConfig.cost_money;
    let updatedRespect = player.respect;
    let lootMoney = 0;
    let lootRespect = 0;
    let gloryGained = isSuccess ? (isRevenge ? 100 : 50) : 15;
    let message = '';
    let headline = '';

    if (isSuccess) {
      // Sucesso!
      const multiplier = isRevenge ? 2 : 1;

      if (sabotageType === 'armazem') {
        lootMoney = Math.floor((Math.random() * 600 + 400) * multiplier);
        lootRespect = 4 * multiplier;
        updatedMoney += lootMoney;
        updatedRespect += lootRespect;
        message = isRevenge 
          ? `VINGANÇA CUMPRIDA! Você saqueou $${lootMoney.toLocaleString('pt-BR')} réis do armazém de ${rival.nickname} (Bônus 2x de Vingança)!`
          : `Incursão bem-sucedida! Seus homens saquearam $${lootMoney.toLocaleString('pt-BR')} réis e cargas do armazém de ${rival.nickname}!`;
        
        headline = `INCURSÃO NOTURNA: Armazém de ${rival.name} é saqueado nas Docas; suspeita recai sobre o grupo de ${player.nickname}!`;
      } else if (sabotageType === 'denuncia') {
        lootMoney = Math.floor((Math.random() * 400 + 350) * multiplier);
        lootRespect = 8 * multiplier;
        updatedMoney += lootMoney;
        updatedRespect += lootRespect;
        message = isRevenge
          ? `GOLPE DUPLO! A Guarda Fiscal lacrou os depósitos de ${rival.nickname} e você embolsou $${lootMoney.toLocaleString('pt-BR')} de confisco!`
          : `Fiscalização comprada! Estabelecimentos de ${rival.nickname} foram lacrados e você recolheu $${lootMoney.toLocaleString('pt-BR')} de propina.`;
        
        headline = `DELEGACIA FISCAL EMBARGA NEGÓCIOS DE ${rival.name.toUpperCase()} POR IRREGULARIDADES GRAVES`;
      } else if (sabotageType === 'gazeta') {
        lootMoney = Math.floor(150 * multiplier);
        lootRespect = 14 * multiplier;
        updatedMoney += lootMoney;
        updatedRespect += lootRespect;
        message = isRevenge
          ? `ESCÂNDALO PUBLICADO! A reputação de ${rival.nickname} ruiu e você ganhou +${lootRespect} de Respeito pelas ruas de Santa Augusta!`
          : `Dossiê publicado na primeira página! O nome de ${rival.nickname} foi manchado e seu prestígio subiu +${lootRespect}!`;
        
        headline = `DOCUMENTOS SECRETOS EXPÕEM ESQUEMA ILÍCITO DE ${rival.name.toUpperCase()} EM SANTA AUGUSTA`;
      }

      // Adiciona notícia de escândalo na Gazeta
      storageService.addArticle({
        edition_number: 140 + Math.floor(Math.random() * 20),
        headline: headline,
        subheadline: `Ação audaciosa sacode a disputa territorial no ${rival.district_name}.`,
        category: 'RIVAIS',
        content: `Na calada da madrugada, uma operação clandestina atribuída a aliados de ${player.nickname} atingiu os interesses de ${rival.name}. Testemunhas relatam movimentações suspeitas e prejuízos calculados em milhares de réis. A polícia abriu inquérito, mas o submundo já conhece o recado.`,
        district_name: rival.district_name,
        related_character_name: player.name
      });
    } else {
      // Fracasso
      message = `A operação contra ${rival.nickname} falhou! Os vigias do rival estavam alertas e seus homens tiveram que recuar.`;
      updatedRespect = Math.max(1, updatedRespect - 2);
    }

    const updatedChar: Character = {
      ...player,
      money: updatedMoney,
      respect: updatedRespect
    };
    storageService.saveCharacter(updatedChar);

    // Registra no histórico de ataques
    const logs = this.getAttackLogs();
    const newAttack: RivalAttack = {
      id: 'atk-' + Date.now(),
      attacker_id: player.id,
      attacker_name: player.name,
      victim_id: rival.id,
      victim_name: rival.name,
      sabotage_type: sabotageType,
      success: isSuccess,
      loot_money: lootMoney,
      loot_respect: lootRespect,
      created_at: new Date().toISOString(),
      can_revenge: false,
      revenge_executed: isRevenge,
      headline_generated: isSuccess ? headline : undefined,
      details: message
    };

    // Se foi vingança, marca o log anterior como vingado
    if (isRevenge) {
      const pendingRevenge = logs.find(l => l.attacker_id === rival.id && l.can_revenge && !l.revenge_executed);
      if (pendingRevenge) {
        pendingRevenge.revenge_executed = true;
        pendingRevenge.can_revenge = false;
      }
    }

    logs.unshift(newAttack);
    this.saveAttackLogs(logs);

    // Adiciona pontos de glória ao passe
    this.addGlory(gloryGained);

    return {
      success: isSuccess,
      character: updatedChar,
      lootMoney,
      lootRespect,
      gloryGained,
      message,
      headline: isSuccess ? headline : undefined
    };
  },

  // Contratação de Guarda-Costas para defesa passiva
  hireGuard(player: Character): { success: boolean; character: Character; defense: PlayerDefense; message: string } {
    const cost = 500;
    const defense = this.getPlayerDefense();
    if (defense.guards_count >= 5) {
      return { success: false, character: player, defense, message: 'Você já possui o contingente máximo de guarda-costas (5).' };
    }
    if (player.money < cost) {
      return { success: false, character: player, defense, message: `Você precisa de $${cost} réis para contratar um novo guarda-costas.` };
    }

    defense.guards_count += 1;
    this.savePlayerDefense(defense);

    const updatedChar = { ...player, money: player.money - cost, respect: player.respect + 2 };
    storageService.saveCharacter(updatedChar);

    return {
      success: true,
      character: updatedChar,
      defense,
      message: `Guarda-costas armado contratado! Sua defesa contra invasões aumentou para ${defense.guards_count * 15}%.`
    };
  },

  // Melhoria de Cofre para proteger patrimônio
  upgradeSafe(player: Character): { success: boolean; character: Character; defense: PlayerDefense; message: string } {
    const defense = this.getPlayerDefense();
    if (defense.safe_level >= 3) {
      return { success: false, character: player, defense, message: 'Seu cofre já está no nível máximo de blindagem (Cofre Suíço Krupp).' };
    }
    const cost = defense.safe_level === 1 ? 1200 : 2500;
    if (player.money < cost) {
      return { success: false, character: player, defense, message: `Você precisa de $${cost} réis para reforçar a blindagem do cofre.` };
    }

    defense.safe_level += 1;
    this.savePlayerDefense(defense);

    const updatedChar = { ...player, money: player.money - cost, respect: player.respect + 5 };
    storageService.saveCharacter(updatedChar);

    return {
      success: true,
      character: updatedChar,
      defense,
      message: `Cofre reforçado para o Nível ${defense.safe_level}! Agora até ${defense.safe_level * 25}% do seu dinheiro está imune a assaltos.`
    };
  },

  // Resgate de Recompensa do Passe de Temporada
  claimSeasonReward(player: Character, targetLevel: number): { success: boolean; character: Character; season: SeasonData; message: string } {
    const season = this.getSeasonData();
    if (season.claimed_levels.includes(targetLevel)) {
      return { success: false, character: player, season, message: 'Recompensa deste nível já foi resgatada!' };
    }
    if (season.current_level < targetLevel) {
      return { success: false, character: player, season, message: `Você precisa alcançar o Nível ${targetLevel} de Glória da Temporada para resgatar.` };
    }

    const reward = season.rewards.find(r => r.level === targetLevel);
    if (!reward) {
      return { success: false, character: player, season, message: 'Recompensa não encontrada.' };
    }

    let updatedChar = { ...player };

    if (reward.reward_type === 'money') {
      updatedChar.money += reward.reward_amount;
    } else if (reward.reward_type === 'respect') {
      updatedChar.respect += reward.reward_amount;
    } else if (reward.reward_type === 'influence') {
      updatedChar.influence += reward.reward_amount;
    } else if (reward.reward_type === 'item' && reward.item_id) {
      const inv = storageService.getInventory();
      const existing = inv.find(i => i.item_id === reward.item_id);
      if (existing) {
        existing.quantity += reward.reward_amount;
      } else {
        inv.push({
          id: 'inv-' + Date.now(),
          character_id: player.id,
          item_id: reward.item_id,
          quantity: reward.reward_amount,
          average_cost: 0
        });
      }
      storageService.saveInventory(inv);
    }

    season.claimed_levels.push(targetLevel);
    this.saveSeasonData(season);
    storageService.saveCharacter(updatedChar);

    return {
      success: true,
      character: updatedChar,
      season,
      message: `Recompensa da Temporada Nível ${targetLevel} resgatada: ${reward.reward_name}!`
    };
  }
};
