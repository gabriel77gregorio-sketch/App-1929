import { District, BusinessType, ActionType, MarketItem, Family, Territory, NewspaperArticle, Mission, GameEvent } from '../types/game';

export const INITIAL_DISTRICTS: District[] = [
  {
    id: '11111111-1111-1111-1111-111111111101',
    name: 'Centro Histórico',
    slug: 'centro',
    tagline: 'Poder, palacetes de mármore e acordos a portas trancadas.',
    description: 'Coração político e financeiro de Santa Augusta. Bancos suntuosos, cafés elegantes e gabinetes governamentais convivem com propinas e jantares de elite.',
    economic_focus: 'Bancos, Política e Grandes Hotéis',
    police_presence: 75,
    base_risk: 25,
    icon: 'landmark',
    illustration: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80&fit=crop'
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    name: 'Porto das Docas',
    slug: 'porto',
    tagline: 'O cheiro de salitre, guindastes a vapor e cargas sem manifesto.',
    description: 'Onde os vapores transatlânticos descarregam riquezas e segredos. Controlado por sindicatos combativos, estivadores rudes e contrabandistas da noite.',
    economic_focus: 'Contrabando, Cargas e Câmbio Clandestino',
    police_presence: 65,
    base_risk: 45,
    icon: 'ship',
    illustration: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80&fit=crop'
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    name: 'Estação Ferroviária',
    slug: 'estacao',
    tagline: 'O apito dos trens com o ouro verde e viajantes sem nome.',
    description: 'Ponto nevrálgico do transporte do Estado. Galpões de transbordo, telégrafos e pensões baratas onde notícias e fardos trocam de mãos rapidamente.',
    economic_focus: 'Transporte, Logística e Informações',
    police_presence: 50,
    base_risk: 30,
    icon: 'train',
    illustration: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&q=80&fit=crop'
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    name: 'Distrito Boêmio',
    slug: 'boemio',
    tagline: 'Luzes de néon fosco, roletas clandestinas e o choro ao longe.',
    description: 'A noite de Santa Augusta nunca dorme. Cabarés requintados, tavernas defumadas e cassinos escondidos atrás de fachadas respeitáveis.',
    economic_focus: 'Cassinos, Bares, Espetáculos e Jogos',
    police_presence: 40,
    base_risk: 50,
    icon: 'wine',
    illustration: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80&fit=crop'
  },
  {
    id: '11111111-1111-1111-1111-111111111105',
    name: 'Subúrbio Industrial',
    slug: 'suburbio',
    tagline: 'Fumaça de chaminés, oficinas mecânicas e vielas fora dos mapas.',
    description: 'Bairro operário de forte identidade. Fundições, garagens de desmanche e armazéns isolados onde negócios discretos prosperam longe dos jornais.',
    economic_focus: 'Oficinas, Depósitos e Mercado Paralelo',
    police_presence: 30,
    base_risk: 40,
    icon: 'wrench',
    illustration: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80&fit=crop'
  },
  {
    id: '11111111-1111-1111-1111-111111111106',
    name: 'Interior dos Coronéis',
    slug: 'interior',
    tagline: 'Estradas de terra vermelha, fazendas seculares e a lei dos capatazes.',
    description: 'O cinturão cafeeiro que sustenta a república. Grandes latifúndios, coronéis com jagunços armados e ferrovias particulares que alimentam a metrópole.',
    economic_focus: 'Café, Terras, Grãos e Poder Feudal',
    police_presence: 45,
    base_risk: 35,
    icon: 'trees',
    illustration: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80&fit=crop'
  }
];

export const INITIAL_BUSINESS_TYPES: BusinessType[] = [
  {
    id: '22222222-2222-2222-2222-222222222201',
    name: 'Bar de Esquina',
    slug: 'bar',
    description: 'Ponto de encontro popular, venda de cachaça de alambique e fofocas quentes das ruas.',
    base_cost: 5000,
    base_revenue: 700,
    cycle_minutes: 5,
    base_risk: 15,
    icon: 'beer',
    min_level: 1,
    flavor_quote: 'Um copo de cachaça boa desata línguas e enche a gaveta.',
    illustration: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&q=80&fit=crop'
  },
  {
    id: '22222222-2222-2222-2222-222222222202',
    name: 'Oficina Mecânica',
    slug: 'oficina',
    description: 'Reparos para caminhões de carga e preparação de calhambeques velozes para desovas noturnas.',
    base_cost: 8000,
    base_revenue: 1100,
    cycle_minutes: 8,
    base_risk: 20,
    icon: 'tool',
    min_level: 2,
    flavor_quote: 'O barulho dos motores e marretas abafa qualquer conversa sigilosa.',
    illustration: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&q=80&fit=crop'
  },
  {
    id: '22222222-2222-2222-2222-222222222203',
    name: 'Armazém de Cargas',
    slug: 'armazem',
    description: 'Espaço amplo com pé-direito alto para estocar sacarias, caixotes lacrados e suprimentos sem nota.',
    base_cost: 12000,
    base_revenue: 1600,
    cycle_minutes: 12,
    base_risk: 25,
    icon: 'warehouse',
    min_level: 2,
    flavor_quote: 'Se está trancado sob cadeado no armazém, ninguém faz perguntas.',
    illustration: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80&fit=crop'
  },
  {
    id: '22222222-2222-2222-2222-222222222204',
    name: 'Comércio de Café',
    slug: 'cafe',
    description: 'Empório de corretagem e distribuição de sacas do grão nobre para torrefações e exportação.',
    base_cost: 18000,
    base_revenue: 2400,
    cycle_minutes: 15,
    base_risk: 30,
    icon: 'coffee',
    min_level: 3,
    flavor_quote: 'O café dita o pulso financeiro dos grandes homens de Santa Augusta.',
    illustration: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80&fit=crop'
  },
  {
    id: '22222222-2222-2222-2222-222222222205',
    name: 'Cassino Clandestino',
    slug: 'cassino',
    description: 'Salão refinado com feltro verde, roletas suíças e bebidas caras escondido atrás de uma alfaiataria.',
    base_cost: 25000,
    base_revenue: 3800,
    cycle_minutes: 20,
    base_risk: 45,
    icon: 'dice',
    min_level: 4,
    flavor_quote: 'Onde nobres, deputados e damas perdem fortunas antes da alvorada.',
    illustration: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=600&q=80&fit=crop'
  }
];

export const INITIAL_ACTION_TYPES: ActionType[] = [
  {
    id: '33333333-3333-3333-3333-333333333301',
    name: 'Coletar Informações no Café Central',
    slug: 'coletar_info',
    category: 'influencia',
    description: 'Pagar rodadas de café forte e charutos finos para ouvir os boatos de remessas e rivais.',
    duration_seconds: 60,
    cost_money: 150,
    cost_influence: 0,
    req_level: 1,
    req_respect: 0,
    reward_money_min: 250,
    reward_money_max: 450,
    reward_respect: 2,
    reward_influence: 3,
    reward_fear: 0,
    base_risk: 15,
    success_chance: 85,
    illustration: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80&fit=crop'
  },
  {
    id: '33333333-3333-3333-3333-333333333302',
    name: 'Transportar Fardo Discreto',
    slug: 'transporte_fardo',
    category: 'operacao',
    description: 'Conduzir uma charrete com caixas lacradas pela rota secundária até a Estação Ferroviária.',
    duration_seconds: 120,
    cost_money: 300,
    cost_influence: 0,
    req_level: 1,
    req_respect: 5,
    reward_money_min: 600,
    reward_money_max: 950,
    reward_respect: 3,
    reward_influence: 1,
    reward_fear: 1,
    base_risk: 25,
    success_chance: 78,
    illustration: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80&fit=crop'
  },
  {
    id: '33333333-3333-3333-3333-333333333303',
    name: 'Intimidar Comerciante Inadimplente',
    slug: 'intimidar_comerciante',
    category: 'violencia',
    description: 'Fazer uma visita firme acompanhado de dois capangas bem vestidos para cobrar dívidas pendentes.',
    duration_seconds: 150,
    cost_money: 200,
    cost_influence: 0,
    req_level: 1,
    req_respect: 5,
    reward_money_min: 700,
    reward_money_max: 1200,
    reward_respect: 2,
    reward_influence: 0,
    reward_fear: 4,
    base_risk: 35,
    success_chance: 72,
    illustration: 'https://images.unsplash.com/photo-1509803874385-db7c23652552?w=600&q=80&fit=crop'
  },
  {
    id: '33333333-3333-3333-3333-333333333304',
    name: 'Subornar Escrivão da Polícia',
    slug: 'subornar_escrivao',
    category: 'influencia',
    description: 'Garantir que relatórios e queixas sobre as suas redondezas sumam das gavetas da delegacia.',
    duration_seconds: 180,
    cost_money: 500,
    cost_influence: 2,
    req_level: 2,
    req_respect: 10,
    reward_money_min: 100,
    reward_money_max: 300,
    reward_respect: 5,
    reward_influence: 6,
    reward_fear: 0,
    base_risk: 20,
    success_chance: 80,
    illustration: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=600&q=80&fit=crop'
  },
  {
    id: '33333333-3333-3333-3333-333333333305',
    name: 'Descarregar Contrabando no Porto',
    slug: 'descarregar_porto',
    category: 'operacao',
    description: 'Receber um escaler com bebidas e relógios vindo de um cargueiro inglês na madrugada.',
    duration_seconds: 240,
    cost_money: 800,
    cost_influence: 1,
    req_level: 2,
    req_respect: 15,
    reward_money_min: 1800,
    reward_money_max: 2600,
    reward_respect: 6,
    reward_influence: 2,
    reward_fear: 2,
    base_risk: 40,
    success_chance: 70,
    illustration: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80&fit=crop'
  },
  {
    id: '33333333-3333-3333-3333-333333333306',
    name: 'Operação de Roleta de Alta Renda',
    slug: 'operacao_cassino',
    category: 'comercio',
    description: 'Receber fazendeiros ricos e deputados para uma noitada de apostas pesadas a portas fechadas.',
    duration_seconds: 300,
    cost_money: 1200,
    cost_influence: 3,
    req_level: 3,
    req_respect: 25,
    reward_money_min: 2800,
    reward_money_max: 4500,
    reward_respect: 8,
    reward_influence: 5,
    reward_fear: 2,
    base_risk: 45,
    success_chance: 65,
    illustration: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=600&q=80&fit=crop'
  },
  {
    id: '33333333-3333-3333-3333-333333333307',
    name: 'Interceptar Telegramas Rivais',
    slug: 'interceptar_carta',
    category: 'investigacao',
    description: 'Pagar um estafeta dos Correios para vazar transcrições de mensagens sigilosas entre coronéis.',
    duration_seconds: 160,
    cost_money: 400,
    cost_influence: 1,
    req_level: 2,
    req_respect: 12,
    reward_money_min: 300,
    reward_money_max: 750,
    reward_respect: 4,
    reward_influence: 7,
    reward_fear: 0,
    base_risk: 25,
    success_chance: 78,
    illustration: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80&fit=crop'
  },
  {
    id: '33333333-3333-3333-3333-333333333308',
    name: 'Cobrar Pedágio nas Estradas do Café',
    slug: 'pedagio_carrocas',
    category: 'violencia',
    description: 'Estabelecer guarda armada na bifurcação de terra vermelha que liga as fazendas à ferrovia.',
    duration_seconds: 220,
    cost_money: 350,
    cost_influence: 0,
    req_level: 2,
    req_respect: 15,
    reward_money_min: 900,
    reward_money_max: 1600,
    reward_respect: 3,
    reward_influence: 0,
    reward_fear: 5,
    base_risk: 35,
    success_chance: 72,
    illustration: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80&fit=crop'
  }
];


export const INITIAL_MARKET_ITEMS: MarketItem[] = [
  {
    id: '44444444-4444-4444-4444-444444444401',
    name: 'Café Arábica Especial',
    slug: 'cafe_arabica',
    category: 'Agrícola',
    base_price: 180,
    current_price: 195,
    min_price: 120,
    max_price: 320,
    unit: 'saca',
    description: 'Grãos nobres das melhores lavouras de altitude. A moeda de troca mais forte do país.',
    volatility: 15,
    price_trend: 'up',
    illustration: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80&fit=crop'
  },
  {
    id: '44444444-4444-4444-4444-444444444402',
    name: 'Whisky Importado Escocês',
    slug: 'whisky_escoces',
    category: 'Bebidas',
    base_price: 350,
    current_price: 340,
    min_price: 220,
    max_price: 600,
    unit: 'caixa',
    description: 'Garrafas refinadas contrabandeadas das docas, requisitadas pelos clubes nobres.',
    volatility: 20,
    price_trend: 'down',
    illustration: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&q=80&fit=crop'
  },
  {
    id: '44444444-4444-4444-4444-444444444403',
    name: 'Peças Automotivas Ford',
    slug: 'pecas_ford',
    category: 'Industrial',
    base_price: 520,
    current_price: 560,
    min_price: 350,
    max_price: 850,
    unit: 'lote',
    description: 'Pistões, carburadores e engrenagens cruciais para a frota de calhambeques.',
    volatility: 18,
    price_trend: 'up',
    illustration: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&q=80&fit=crop'
  },
  {
    id: '44444444-4444-4444-4444-444444444404',
    name: 'Tecido de Linho Inglês',
    slug: 'linho_ingles',
    category: 'Manufatura',
    base_price: 280,
    current_price: 270,
    min_price: 180,
    max_price: 480,
    unit: 'fardo',
    description: 'Tecido nobre para os ternos dos chefões e senhoras da alta sociedade de Santa Augusta.',
    volatility: 12,
    price_trend: 'stable',
    illustration: 'https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?w=600&q=80&fit=crop'
  },
  {
    id: '44444444-4444-4444-4444-444444444405',
    name: 'Dossiê Político Confidencial',
    slug: 'dossie_confidencial',
    category: 'Informações',
    base_price: 900,
    current_price: 950,
    min_price: 600,
    max_price: 1800,
    unit: 'pasta',
    description: 'Documentos comprometedores sobre desvios de verbas e conchavos eleitorais.',
    volatility: 25,
    price_trend: 'up',
    illustration: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80&fit=crop'
  }
];

export const INITIAL_FAMILIES: Family[] = [
  {
    id: '55555555-5555-5555-5555-555555555501',
    name: 'Família Moretti',
    tag: 'MORTI',
    motto: 'Sangue, honra e negócios à moda antiga.',
    leader_name: 'Don Vincenzo Moretti',
    treasury: 85000,
    reputation: 85,
    banner_color: '#991b1b',
    is_npc: true,
    member_count: 14
  },
  {
    id: '55555555-5555-5555-5555-555555555502',
    name: 'Família Albuquerque',
    tag: 'ALBUQ',
    motto: 'As leis mudam; as nossas conexões permanecem.',
    leader_name: 'Coronel Bento de Albuquerque',
    treasury: 140000,
    reputation: 92,
    banner_color: '#1e3a8a',
    is_npc: true,
    member_count: 22
  },
  {
    id: '55555555-5555-5555-5555-555555555503',
    name: 'Clã Ferreira das Docas',
    tag: 'FERRA',
    motto: 'Pelo ferro ou pelo ouro, a cidade precisa de nós.',
    leader_name: 'Tião "Machado" Ferreira',
    treasury: 62000,
    reputation: 74,
    banner_color: '#065f46',
    is_npc: true,
    member_count: 18
  }
];

export const INITIAL_TERRITORIES: Territory[] = [
  {
    id: 't-1',
    district_id: '11111111-1111-1111-1111-111111111101',
    family_id: '55555555-5555-5555-5555-555555555502',
    influence_percentage: 58,
    is_independent: false,
    family_name: 'Família Albuquerque',
    district_name: 'Centro Histórico'
  },
  {
    id: 't-2',
    district_id: '11111111-1111-1111-1111-111111111101',
    family_id: '55555555-5555-5555-5555-555555555501',
    influence_percentage: 26,
    is_independent: false,
    family_name: 'Família Moretti',
    district_name: 'Centro Histórico'
  },
  {
    id: 't-3',
    district_id: '11111111-1111-1111-1111-111111111102',
    family_id: '55555555-5555-5555-5555-555555555503',
    influence_percentage: 64,
    is_independent: false,
    family_name: 'Clã Ferreira das Docas',
    district_name: 'Porto das Docas'
  },
  {
    id: 't-4',
    district_id: '11111111-1111-1111-1111-111111111104',
    family_id: '55555555-5555-5555-5555-555555555501',
    influence_percentage: 60,
    is_independent: false,
    family_name: 'Família Moretti',
    district_name: 'Distrito Boêmio'
  },
  {
    id: 't-5',
    district_id: '11111111-1111-1111-1111-111111111105',
    family_id: '55555555-5555-5555-5555-555555555503',
    influence_percentage: 46,
    is_independent: false,
    family_name: 'Clã Ferreira das Docas',
    district_name: 'Subúrbio Industrial'
  },
  {
    id: 't-6',
    district_id: '11111111-1111-1111-1111-111111111106',
    family_id: '55555555-5555-5555-5555-555555555502',
    influence_percentage: 68,
    is_independent: false,
    family_name: 'Família Albuquerque',
    district_name: 'Interior dos Coronéis'
  }
];

export const INITIAL_ARTICLES: NewspaperArticle[] = [
  {
    id: 'art-1',
    edition_number: 147,
    headline: 'DESAPARECIMENTO DE CARGA NO PORTO ALVOROÇA A ALFÂNDEGA',
    subheadline: 'Vapor inglês atraca com fardos a menos e fiscais prometem devassa.',
    category: 'POLÍCIA',
    content: 'Na calada da noite anterior, um importante lote de caixas lacradas com o selo da coroa britânica não foi localizado no armazém 4 do cais santista. Testemunhas mencionam calhambeques sem placa avistados em alta velocidade pelas ruelas estreitas.',
    district_name: 'Porto das Docas',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'art-2',
    edition_number: 147,
    headline: 'CORRETORES DE CAFÉ DISPUTAM SACAS NA BOLSA COM BOATOS DE ALTA',
    subheadline: 'Grandes cafeicultores do interior reforçam segurança em comboios ferroviários.',
    category: 'MERCADO',
    content: 'Com o tempo seco no interior e o aumento na demanda europeia, as cotações do café arábica registraram forte valorização. Comerciantes audazes têm feito fortunas estocando grãos e aguardando as melhores propostas.',
    district_name: 'Interior dos Coronéis',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: 'art-3',
    edition_number: 146,
    headline: 'MÚSICA, ROLETAS E CHARUTOS: A NOITE FERVE NO DISTRITO BOÊMIO',
    subheadline: 'Delegacia do bairro fecha os olhos enquanto fortunas trocam de mãos no feltro verde.',
    category: 'FAMÍLIAS',
    content: 'Figuras proeminentes de Santa Augusta foram vistas adentrando uma discreta alfaiataria que dá acesso aos luxuosos salões de bacará e roleta. O fluxo de dinheiro e alianças políticas nos bastidores redesenha o mapa do poder da cidade.',
    district_name: 'Distrito Boêmio',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString()
  }
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: '66666666-6666-6666-6666-666666666601',
    title: 'Fincando Raízes',
    description: 'Adquira seu primeiro estabelecimento comercial em Santa Augusta para gerar fluxo de caixa constante e estabelecer respeito.',
    category: 'iniciacao',
    target_type: 'buy_business',
    target_count: 1,
    reward_money: 1000,
    reward_respect: 5,
    reward_influence: 2,
    reward_exp: 50,
    order_index: 1
  },
  {
    id: '66666666-6666-6666-6666-666666666602',
    title: 'Pés no Asfalto',
    description: 'Realize 2 operações nas ruas da cidade para fazer seu nome circular entre os informantes e policiais.',
    category: 'iniciacao',
    target_type: 'perform_actions',
    target_count: 2,
    reward_money: 1500,
    reward_respect: 8,
    reward_influence: 4,
    reward_exp: 80,
    order_index: 2
  },
  {
    id: '66666666-6666-6666-6666-666666666603',
    title: 'A Lei do Mercado',
    description: 'Compre ou venda mercadorias no Mercado Municipal para acumular capital com a arbitragem de preços.',
    category: 'comercio',
    target_type: 'market_trade',
    target_count: 2,
    reward_money: 2000,
    reward_respect: 10,
    reward_influence: 5,
    reward_exp: 100,
    order_index: 3
  },
  {
    id: '66666666-6666-6666-6666-666666666604',
    title: 'Respeito Conquistado',
    description: 'Acumule 20 pontos de Respeito para ser convidado para as conversas fechadas no Clube dos Empresários.',
    category: 'reputacao',
    target_type: 'reach_respect',
    target_count: 20,
    reward_money: 3000,
    reward_respect: 15,
    reward_influence: 10,
    reward_exp: 150,
    order_index: 4
  }
];

export const INITIAL_EVENTS: GameEvent[] = [
  {
    id: 'ev-1',
    title: 'Operação da Polícia Marítima',
    description: 'Fiscalização redobrada no Porto das Docas. Operações arriscadas enfrentam maior vigilância nesta hora.',
    district_id: '11111111-1111-1111-1111-111111111102',
    affected_type: 'police_risk',
    modifier_percentage: 20,
    starts_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 3600000 * 3).toISOString(),
    is_active: true
  },
  {
    id: 'ev-2',
    title: 'Demanda Alta por Café na Capital',
    description: 'Compradores internacionais oferecem ágio nas sacas estocadas. Momento ideal para negociar grãos.',
    affected_type: 'market_price',
    modifier_percentage: 15,
    starts_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 3600000 * 4).toISOString(),
    is_active: true
  }
];
