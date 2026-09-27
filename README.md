# 1929 — Dinheiro. Poder. Silêncio.

> Jogo de estratégia social assíncrona, gestão de império e controle territorial ambientado no submundo do Brasil dos anos 1920 e 1930. Desenvolvido em React + TypeScript + Tailwind CSS como PWA mobile-first, integrado ao PostgreSQL via Supabase.

---

## 🏛️ 1. Visão Geral do Jogo

Em **1929**, o jogador desembarca na fictícia e pulsante **Santa Augusta** com uma mala, algumas notas de mil-réis amassadas e uma identidade a construir.

### Os 4 Atributos de Poder
* **Dinheiro**: Utilizado para adquirir pontos comerciais, contratar operações, estocar café e financiar subornos.
* **Respeito**: Reputação nas ruas. Abre portas com NPCs e famílias tradicionais.
* **Influência**: Conexões políticas, comissários e juízes para viabilizar acordos sem intervenção da lei.
* **Medo**: Reputação de força e violência. Facilita intimidações, mas valores elevados atraem a atenção da polícia.

### Os 6 Distritos de Santa Augusta
1. **Centro Histórico**: Bancos, palacetes de mármore e grandes hotéis.
2. **Porto das Docas**: Vapores ingleses, guindastes a vapor, cargas sem manifesto e contrabando noturno.
3. **Estação Ferroviária**: Transporte do ouro verde do interior, telégrafos e galpões de transbordo.
4. **Distrito Boêmio**: Cabarés, feltro verde, roletas suíças e noitadas clandestinas.
5. **Subúrbio Industrial**: Fábricas, garagens de desmanche, oficinas e mercado paralelo.
6. **Interior dos Coronéis**: Cafezais, terra vermelha, ferrovias privadas e jagunços.

### Os 5 Negócios do MVP
* **Bar de Esquina**
* **Oficina Mecânica**
* **Armazém de Cargas**
* **Comércio de Café**
* **Cassino Clandestino**

### A Gazeta da Capital
O jornal interno de Santa Augusta gera notícias em tempo real baseadas nos acontecimentos dos jogadores (compras de estabelecimentos, grandes operações e disputas entre famílias).

---

## 🚀 2. Como Executar Localmente

### Pré-requisitos
* **Node.js** v18+ (recomendado v20 ou v24)
* **npm** v9+

### Instalação
```bash
# Clone ou acesse o diretório do projeto
cd "1929 game"

# Instale as dependências
npm install
```

### Executar em Desenvolvimento
```bash
npm run dev
```
O jogo estará rodando em `http://localhost:5173`.

> **Nota:** O jogo possui um sistema de persistência com fallback automático. Ele roda perfeitamente em modo local imediato (salvando progresso, timers e compras) mesmo antes de vincular uma conta do Supabase!

### Compilar para Produção (Build)
```bash
npm run build
```

---

## 🗄️ 3. Configuração do Supabase (Banco de Dados)

### Passo 1: Criar o Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto gratuito.
2. No menu do projeto, acesse **SQL Editor**.

### Passo 2: Executar as Migrations
Copie e cole o conteúdo dos arquivos da pasta `supabase/migrations/` na ordem:
1. `supabase/migrations/20260927000001_initial_schema.sql` (Criação de tabelas, FKs e índices)
2. `supabase/migrations/20260927000002_functions_and_rpc.sql` (Funções de Anti-Cheat, RPCs atômicas e políticas RLS)
3. `supabase/migrations/20260927000003_seed_data.sql` (Semente com os 6 distritos, 5 negócios, 8 ações, mercado e famílias)

### Passo 3: Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

---

## 📱 4. PWA (Progressive Web App)

O 1929 foi construído especificamente para **celular (Mobile-First)**:
* **Instalação na Tela Inicial**: No Safari do iOS toque em *Compartilhar > Adicionar à Tela de Início*. No Chrome/Android toque em *Instalar Aplicativo*.
* **Suporte Offline**: O Service Worker (`public/sw.js`) armazena os recursos estáticos e o manifest.
* **Layout Adaptativo**: Barra de navegação inferior tátil para celulares e visualização ampla e imersiva para computadores.

---

## 🛡️ 5. Princípios de Segurança & Anti-Cheat

* Nenhuma recompensa financeira, transação de mercado ou temporizador de operação é confiada ao relógio do cliente.
* O servidor armazena `started_at` e `finish_at`. Tentativas de concluir operações antes do tempo estipulado são rejeitadas pelo backend.
* As transações financeiras utilizam travas condicionais (`FOR UPDATE`) para prevenir ataques de condição de corrida (*race conditions*).

---

## 📦 6. Deploy (Hospedagem Recomendada)

O frontend pode ser publicado com 1 clique em serviços estáticos com suporte a PWA:
* **Vercel**: Importe o repositório, configure as variáveis de ambiente do Supabase e clique em Deploy.
* **Netlify**: Build command: `npm run build`, Publish directory: `dist`.
* **Cloudflare Pages**: Conecte ao GitHub e selecione o framework preset `Vite`.

---

© 1929 — Dinheiro. Poder. Silêncio. Desenvolvido para navegadores móveis e web moderna.
