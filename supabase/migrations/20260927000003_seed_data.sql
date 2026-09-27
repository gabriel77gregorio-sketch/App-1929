-- ==============================================================================
-- 1929: Seed Inicial de Dados (Santa Augusta, 1929)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. OS 6 DISTRITOS DE SANTA AUGUSTA
-- ------------------------------------------------------------------------------
INSERT INTO public.districts (id, name, slug, tagline, description, economic_focus, police_presence, base_risk, icon)
VALUES 
    (
        '11111111-1111-1111-1111-111111111101',
        'Centro Histórico',
        'centro',
        'Poder, palacetes de mármore e acordos fechados a portas trancadas.',
        'Coração político e financeiro de Santa Augusta. Bancos suntuosos, cafés elegantes e gabinetes governamentais convivem com propinas e jantares de elite.',
        'Bancos, Política e Grandes Hotéis',
        75, 25, 'landmark'
    ),
    (
        '11111111-1111-1111-1111-111111111102',
        'Porto das Docas',
        'porto',
        'O cheiro de salitre, guindastes a vapor e cargas sem manifesto.',
        'Onde os vapores transatlânticos descarregam riquezas e segredos. Controlado por sindicatos combativos, estivadores rudes e contrabandistas da noite.',
        'Contrabando, Cargas e Câmbio Clandestino',
        65, 45, 'ship'
    ),
    (
        '11111111-1111-1111-1111-111111111103',
        'Estação Ferroviária',
        'estacao',
        'O apito dos trens que trazem o ouro verde do interior e viajantes sem nome.',
        'Ponto nevrálgico do transporte do Estado. Galpões de transbordo, telégrafos e pensões baratas onde notícias e fardos trocam de mãos rapidamente.',
        'Transporte, Logística e Informações',
        50, 30, 'train'
    ),
    (
        '11111111-1111-1111-1111-111111111104',
        'Distrito Boêmio',
        'boemio',
        'Luzes de néon fosco, roletas clandestinas e o som distante do choro e do jazz.',
        'A noite de Santa Augusta nunca dorme. Cabarés requintados, tavernas defumadas e cassinos escondidos atrás de fachadas respeitáveis.',
        'Cassinos, Bares, Espetáculos e Jogos',
        40, 50, 'wine'
    ),
    (
        '11111111-1111-1111-1111-111111111105',
        'Subúrbio Industrial',
        'suburbio',
        'Fumaça de chaminés, oficinas mecânicas e vielas fora dos mapas da polícia.',
        'Bairro operário de forte identidade. Fundições, garagens de desmanche e armazéns isolados onde negócios discretos prosperam longe dos jornais.',
        'Oficinas, Depósitos e Mercado Paralelo',
        30, 40, 'wrench'
    ),
    (
        '11111111-1111-1111-1111-111111111106',
        'Interior dos Coronéis',
        'interior',
        'Estradas de terra vermelha, fazendas seculares e a lei dos capatazes.',
        'O cinturão cafeeiro que sustenta a república. Grandes latifúndios, coronéis com jagunços armados e ferrovias particulares que alimentam a metrópole.',
        'Café, Terras, Grãos e Poder Feudal',
        45, 35, 'trees'
    )
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description, economic_focus = EXCLUDED.economic_focus;

-- ------------------------------------------------------------------------------
-- 2. OS 5 TIPOS DE NEGÓCIOS DO MVP
-- ------------------------------------------------------------------------------
INSERT INTO public.business_types (id, name, slug, description, base_cost, base_revenue, cycle_minutes, base_risk, icon, min_level, flavor_quote)
VALUES
    (
        '22222222-2222-2222-2222-222222222201',
        'Bar de Esquina',
        'bar',
        'Ponto de encontro popular, venda de destilados nacionais e fofocas das ruas.',
        5000, 700, 10, 15, 'beer', 1,
        'Um copo de cachaça boa desata línguas e enche a gaveta.'
    ),
    (
        '22222222-2222-2222-2222-222222222202',
        'Oficina Mecânica',
        'oficina',
        'Reparos para caminhões de carga e preparação de veículos velozes para fugas noturnas.',
        8000, 1100, 15, 20, 'tool', 2,
        'O barulho dos motores e das marretas esconde qualquer conversa séria.'
    ),
    (
        '22222222-2222-2222-2222-222222222203',
        'Armazém de Cargas',
        'armazem',
        'Espaço amplo com pé-direito alto para estocar sacarias, caixotes lacrados e suprimentos.',
        12000, 1600, 20, 25, 'warehouse', 2,
        'Se está guardado aqui sob cadeado, ninguém faz perguntas.'
    ),
    (
        '22222222-2222-2222-2222-222222222204',
        'Comércio de Café',
        'cafe',
        'Empório de corretagem e distribuição de sacas do ouro negro para torrefações e exportação.',
        18000, 2400, 25, 30, 'coffee', 3,
        'O café dita o humor dos bancos de Santa Augusta.'
    ),
    (
        '22222222-2222-2222-2222-222222222205',
        'Cassino Clandestino',
        'cassino',
        'Salão refinado com feltro verde, roletas suíças e bebidas finas atrás de uma barbearia.',
        25000, 3800, 30, 45, 'dice', 4,
        'Onde nobres, deputados e damas perdem fortunas antes da alvorada.'
    )
ON CONFLICT (slug) DO UPDATE
SET base_cost = EXCLUDED.base_cost, base_revenue = EXCLUDED.base_revenue, cycle_minutes = EXCLUDED.cycle_minutes;

-- ------------------------------------------------------------------------------
-- 3. TIPOS DE AÇÕES E OPERAÇÕES NAS RUAS
-- ------------------------------------------------------------------------------
INSERT INTO public.action_types (
    id, name, slug, category, description, duration_seconds, 
    cost_money, cost_influence, req_level, req_respect, 
    reward_money_min, reward_money_max, reward_respect, reward_influence, reward_fear, 
    base_risk, success_chance
)
VALUES
    (
        '33333333-3333-3333-3333-333333333301',
        'Coletar Informações no Café',
        'coletar_info',
        'influencia',
        'Pagar rodadas de café e charutos para ouvir os boatos sobre remessas e rivais.',
        120, 150, 0, 1, 0,
        250, 450, 2, 3, 0,
        15, 85
    ),
    (
        '33333333-3333-3333-3333-333333333302',
        'Transportar Fardo Discreto',
        'transporte_fardo',
        'operacao',
        'Conduzir uma charrete com caixas lacradas pela rota secundária até a Estação.',
        240, 300, 0, 1, 5,
        600, 950, 3, 1, 1,
        25, 75
    ),
    (
        '33333333-3333-3333-3333-333333333303',
        'Intimidar Comerciante Inadimplente',
        'intimidar_comerciante',
        'violencia',
        'Fazer uma visita firme acompanhado de dois capangas para cobrar atrasados.',
        300, 200, 0, 1, 5,
        700, 1200, 2, 0, 4,
        35, 70
    ),
    (
        '33333333-3333-3333-3333-333333333304',
        'Subornar Escrivão da Polícia',
        'subornar_escrivao',
        'influencia',
        'Garantir que relatórios policiais sobre o seu bairro sumam das gavetas.',
        360, 500, 2, 2, 10,
        0, 300, 5, 6, 0,
        20, 80
    ),
    (
        '33333333-3333-3333-3333-333333333305',
        'Descarregar Contrabando no Porto',
        'descarregar_porto',
        'operacao',
        'Receber um escaler vindo de um cargueiro estrangeiro na calada da madrugada.',
        480, 800, 1, 2, 15,
        1800, 2600, 6, 2, 2,
        40, 68
    ),
    (
        '33333333-3333-3333-3333-333333333306',
        'Operação no Cassino Clandestino',
        'operacao_cassino',
        'comercio',
        'Organizar uma mesa de bacará de altas apostas para cavalheiros abastados.',
        600, 1200, 3, 3, 25,
        2800, 4500, 8, 5, 2,
        45, 65
    ),
    (
        '33333333-3333-3333-3333-333333333307',
        'Interceptar Correspondência Rival',
        'interceptar_carta',
        'investigacao',
        'Pagar um estafeta dos Correios para copiar telegramas confidenciais de outras famílias.',
        300, 400, 1, 2, 12,
        300, 700, 4, 7, 0,
        25, 78
    ),
    (
        '33333333-3333-3333-3333-333333333308',
        'Cobrar Pedágio das Carroças',
        'pedagio_carrocas',
        'violencia',
        'Estabelecer um posto de vigilância informal na saída da estrada do interior.',
        420, 350, 0, 2, 15,
        900, 1600, 3, 0, 5,
        35, 72
    )
ON CONFLICT (slug) DO UPDATE
SET cost_money = EXCLUDED.cost_money, reward_money_max = EXCLUDED.reward_money_max, duration_seconds = EXCLUDED.duration_seconds;

-- ------------------------------------------------------------------------------
-- 4. ITENS DO MERCADO MUNICIPAL (ARBITRAGEM)
-- ------------------------------------------------------------------------------
INSERT INTO public.market_items (id, name, slug, category, base_price, current_price, min_price, max_price, unit, description, volatility)
VALUES
    (
        '44444444-4444-4444-4444-444444444401',
        'Café Arábica Especial',
        'cafe_arabica',
        'Commodity',
        180, 195, 120, 320, 'saca',
        'Grãos selecionados das colheitas de alta altitude. A espinha dorsal da economia.',
        15
    ),
    (
        '44444444-4444-4444-4444-444444444402',
        'Whisky Importado Escocês',
        'whisky_escoces',
        'Bebida',
        350, 340, 220, 600, 'caixa',
        'Bebida destilada refinada que entra pelas docas e abastece a alta sociedade.',
        20
    ),
    (
        '44444444-4444-4444-4444-444444444403',
        'Peças Automotivas Ford',
        'pecas_ford',
        'Industrial',
        520, 560, 350, 850, 'lote',
        'Engrenagens e velas de ignição importadas dos EUA, essenciais para as oficinas.',
        18
    ),
    (
        '44444444-4444-4444-4444-444444444404',
        'Tecido de Linho Inglês',
        'linho_ingles',
        'Manufatura',
        280, 270, 180, 480, 'fardo',
        'Matéria-prima disputada pelos alfaiates de elite do Centro.',
        12
    ),
    (
        '44444444-4444-4444-4444-444444444405',
        'Dossiê Confidencial',
        'dossie_confidencial',
        'Informação',
        900, 950, 600, 1800, 'pasta',
        'Documentos com podres de juízes e deputados. Valem ouro no xadrez político.',
        25
    )
ON CONFLICT (slug) DO UPDATE
SET current_price = EXCLUDED.current_price, base_price = EXCLUDED.base_price;

-- ------------------------------------------------------------------------------
-- 5. FAMÍLIAS RIVAIS HISTÓRICAS (NPCs de Ambientação)
-- ------------------------------------------------------------------------------
INSERT INTO public.families (id, name, tag, motto, treasury, reputation, banner_color, is_npc)
VALUES
    (
        '55555555-5555-5555-5555-555555555501',
        'Família Moretti',
        'MORTI',
        'Sangue, honra e negócios à moda antiga.',
        85000, 85, '#991b1b', true
    ),
    (
        '55555555-5555-5555-5555-555555555502',
        'Família Albuquerque',
        'ALBUQ',
        'As leis mudam; as nossas conexões permanecem.',
        140000, 92, '#1e3a8a', true
    ),
    (
        '55555555-5555-5555-5555-555555555503',
        'Clã Ferreira das Docas',
        'FERRA',
        'Pelo ferro ou pelo ouro, a cidade precisa de nós.',
        62000, 74, '#065f46', true
    )
ON CONFLICT (name) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 6. DIVISÃO INICIAL DE INFLUÊNCIA TERRITORIAL NOS 6 DISTRITOS
-- ------------------------------------------------------------------------------
INSERT INTO public.territories (district_id, family_id, influence_percentage, is_independent)
VALUES
    -- Centro Histórico: Domínio de Albuquerque com presença Moretti
    ('11111111-1111-1111-1111-111111111101', '55555555-5555-5555-5555-555555555502', 55, false),
    ('11111111-1111-1111-1111-111111111101', '55555555-5555-5555-5555-555555555501', 25, false),
    
    -- Porto das Docas: Domínio Ferreira
    ('11111111-1111-1111-1111-111111111102', '55555555-5555-5555-5555-555555555503', 60, false),
    ('11111111-1111-1111-1111-111111111102', '55555555-5555-5555-5555-555555555501', 20, false),

    -- Distrito Boêmio: Bastião Moretti
    ('11111111-1111-1111-1111-111111111104', '55555555-5555-5555-5555-555555555501', 58, false),
    ('11111111-1111-1111-1111-111111111104', '55555555-5555-5555-5555-555555555502', 22, false),

    -- Subúrbio: Ferreira e Oficinas
    ('11111111-1111-1111-1111-111111111105', '55555555-5555-5555-5555-555555555503', 45, false),
    ('11111111-1111-1111-1111-111111111105', '55555555-5555-5555-5555-555555555501', 30, false),

    -- Interior dos Coronéis: Albuquerque e cafeicultores
    ('11111111-1111-1111-1111-111111111106', '55555555-5555-5555-5555-555555555502', 65, false)
ON CONFLICT (district_id, family_id) DO UPDATE 
SET influence_percentage = EXCLUDED.influence_percentage;

-- ------------------------------------------------------------------------------
-- 7. MISSÕES DE INTRODUÇÃO E PROGRESSÃO
-- ------------------------------------------------------------------------------
INSERT INTO public.missions (id, title, description, category, target_type, target_count, reward_money, reward_respect, reward_influence, reward_exp, order_index)
VALUES
    (
        '66666666-6666-6666-6666-666666666601',
        'Fincando Raízes',
        'Adquira seu primeiro estabelecimento comercial em Santa Augusta para gerar fluxo de caixa constante.',
        'iniciacao',
        'buy_business',
        1,
        1000, 5, 2, 50, 1
    ),
    (
        '66666666-6666-6666-6666-666666666602',
        'Pés no Asfalto',
        'Realize 3 operações nas ruas da cidade para fazer seu nome circular entre os negociantes.',
        'iniciacao',
        'perform_actions',
        3,
        1500, 8, 4, 80, 2
    ),
    (
        '66666666-6666-6666-6666-666666666603',
        'A Força do Café',
        'Compre ou venda mercadorias no Mercado Municipal para tirar proveito das variações de preço.',
        'comercio',
        'market_trade',
        2,
        2000, 10, 5, 100, 3
    ),
    (
        '66666666-6666-6666-6666-666666666604',
        'Reconhecimento das Ruas',
        'Atinja 25 pontos de Respeito em Santa Augusta para ser convidado para mesas reservadas.',
        'reputacao',
        'reach_respect',
        25,
        3500, 15, 10, 150, 4
    )
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title, description = EXCLUDED.description;

-- ------------------------------------------------------------------------------
-- 8. MANCHETES INICIAIS DA GAZETA DA CAPITAL
-- ------------------------------------------------------------------------------
INSERT INTO public.newspaper_articles (headline, subheadline, category, content, created_at)
VALUES
    (
        'TENSÃO NAS DOCAS: CARREGAMENTO DE VAPOR SUMIU ANTES DO DESEMBARQUE',
        'Delegacia de Costas e Portos promete inquérito rigoroso sobre desvio.',
        'POLÍCIA',
        'Na madrugada de ontem, um carregamento avaliado em dezenas de contos de réis simplesmente não constou na alfândega ao amanhecer. Testemunhas relatam movimentação incomum de carroças sob o nevoeiro portuário.',
        NOW() - INTERVAL '3 hours'
    ),
    (
        'BOLSA DO CAFÉ EM ALERTA COM BOATO DE REGULAÇÃO DE PREÇOS',
        'Corretores de Santa Augusta debatem impacto das novas safras de Minas e São Paulo.',
        'MERCADO',
        'Os grandes negociantes do centro financeiro manifestaram apreensão com a volatilidade dos preços internacionais. Especialistas recomendam estocagem estratégica nos armazéns da Estação.',
        NOW() - INTERVAL '8 hours'
    ),
    (
        'NOVA CASA DE JOGO É VISTA NO DISTRITO BOÊMIO',
        'Cavalheiros e madames da sociedade frequentam endereço com fachada de barbearia.',
        'FAMÍLIAS',
        'A noite de Santa Augusta ganhou mais um ponto de entretenimento clandestino. O delegado titular do 3º distrito declarou desconhecer qualquer atividade ilegal no local.',
        NOW() - INTERVAL '14 hours'
    ),
    (
        'CIDADE CRESCE EM RITMO VERTIGINOSO: FORTUNAS NASCEM NA PENUMBRA',
        'Comércio e indústria impulsionam novas lideranças em todos os bairros.',
        'CIDADE',
        'Santa Augusta consolida sua posição como o maior entreposto de oportunidades do sudeste. Quem possui dinheiro e determinação encontra caminho aberto para construir verdadeiros impérios.',
        NOW() - INTERVAL '1 day'
    );
