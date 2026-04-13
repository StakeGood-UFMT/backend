
# Regras de Negócio e Arquitetura da API (StakeGood Backend)

**Objetivo deste documento:** A API não é um sistema de custódia (ela não guarda o dinheiro) e não é um sistema de banco de dados tradicional. Ela atua como um **Orquestrador de Confiança**. Sua missão é blindar o contrato inteligente contra requisições ilegais (barrando usuários sem biometria), espelhar a blockchain com atraso zero (Worker) e transformar o capital bruto em inteligência de mercado (cálculo de probabilidades epistêmicas).

> Atualização (derivada do mapeamento do frontend): além de mercados/tx/portfolio, o backend precisa cobrir **Diretório de ONGs**, **Perfil de ONG**, **Global Impact Feed + Export**, **Notifications**, **Settings (privacy, wallets, 2FA, compliance report)**, **Leaderboard** e **Help/Legal versionado**. Ao final há o **mapeamento das tabelas** (nomes + props), sem SQL.

## 1. Arquitetura Lógica e Padrões de Design
* **Separação de Responsabilidades (CQRS):** A arquitetura deve dividir estritamente o fluxo de "Leitura" do fluxo de "Escrita".
    * *Leitura (Queries):* Consultas de histórico, portfólio e probabilidades consomem dados unicamente do banco de dados relacional (PostgreSQL), alimentado pelo Indexador, garantindo tempo de resposta em milissegundos. Nenhuma rota "GET" deve consultar a rede Stellar em tempo real.
    * *Escrita (Commands):* Qualquer intenção de mutação de estado (Apostar, Votar, Sacar) aciona o motor de construção de transações XDR, que cruza dados com os provedores de conformidade antes de autorizar a intenção.
* **Stateless Absoluto:** A API não guarda sessão em memória. Toda autenticação e controle de permissões trafega via JWT assinado com tempo de expiração curto, contendo no payload a chave pública do usuário e o seu nível de verificação de identidade.

---

## 2. Regras de Autenticação e Conformidade
A API atua como a fronteira legal do sistema.

* **Login Criptográfico (Sem Senhas):** O sistema rechaça senhas de texto. A regra exige um fluxo de "Desafio e Resposta". O usuário solicita um desafio (Nonce aleatório), assina esse desafio com a sua carteira local (Freighter), e a API valida criptograficamente se a assinatura confere com a chave pública.
* **Gatilho de Identidade Biométrica:** O sistema exige integração com um provedor de KYC (ex: SumSub). O fluxo de apostas é bloqueado até que o provedor dispare um *webhook* para a API confirmando que a face humana atrelada àquela carteira é real, única e não consta em listas de lavagem de dinheiro (AML).
* **Trava de Gastos e Prevenção ao Vício:** A API deve implementar uma janela deslizante (Rolling Window) de 30 dias. Antes de autorizar a montagem de qualquer transação de previsão, a API calcula quanto o usuário já depositou naquele mês. Se o novo depósito romper o teto financeiro legal estabelecido pela regulamentação, a API aborta a operação e retorna um erro de conformidade.

---

## 3. O Motor de Construção de Transações (XDR Builders)
Esta é a regra de segurança anti-fraude mais crítica da arquitetura. O Frontend é proibido de construir a transação que será enviada para a blockchain.

* **Prevenção de Manipulação de Frontend:** Se o frontend construísse a transação, um usuário malicioso poderia interceptar o código e alterar os parâmetros (ex: pedir para apostar 100 USDC na interface, mas enviar uma transação on-chain que custa 1 USDC e registra 100 USDC no contrato).
* **Fluxo Parametrizado:** O Frontend envia apenas a *intenção* ("Quero prever SIM no mercado X com 50 USDC"). A API valida tudo, constrói o envelope binário da rede Stellar (XDR) injetando o contrato inteligente correto e as casas decimais estritas (stroops), e devolve este "contrato digital" para o usuário apenas assinar na extensão do navegador.

> Ajuste importante para bater com as telas: o builder deve ser **asset-agnostic**.
> Trocar “amount_usdc” por “amount_asset” e receber também `asset_code/asset_issuer` (ou inferir do `market_id`).

---

## 4. O Motor de Indexação e Sincronização (Worker)
Como a API escuta a blockchain e atualiza o banco de dados.

* **Sincronização por Cursor (Idempotência):** A rede Stellar emite milhares de eventos por minuto. O Worker da API usa um "marca-página" (Cursor). A regra dita que o Worker pega os últimos 1000 eventos e os salva no banco de dados. O cursor só é atualizado se a transação do banco for commitada com sucesso. Se a API cair ou reiniciar, ela volta a ler do último cursor salvo, garantindo que nenhuma previsão suma e nenhuma previsão seja salva duas vezes.
* **Backoff Exponencial:** Se o nó RPC da Stellar sair do ar ou demorar a responder, o Worker não deve bombardear o nó com requisições. A regra obriga o uso de esperas crescentes (1s, 2s, 4s, 8s) até a rede voltar.
* **Notificação Otimista (WebSocket):** Assim que o Worker consolida um bloco de eventos no banco, a API dispara um evento em tempo real para os clientes conectados. É isso que faz o status de "Processando" da aposta sumir na tela do usuário.

---

## 5. Mapeamento Exaustivo de Endpoints (REST API)

Todas as rotas requerem o cabeçalho de autenticação JWT, exceto as marcadas como `[Pública]`.

### Domínio: Autenticação e KYC
* **`GET /api/v1/auth/nonce?wallet={public_key}` [Pública]:** Gera e salva temporariamente um código alfanumérico para a carteira solicitante.
* **`POST /api/v1/auth/verify` [Pública]:** Recebe o Nonce assinado criptograficamente. Valida e retorna o token JWT e o status do KYC.
* **`POST /api/v1/auth/kyc/webhook` [Pública - Protegida por HMAC do Provedor]:** Rota cega que recebe os laudos da análise facial do provedor terceirizado (Aprovado/Reprovado) e atualiza o perfil do usuário no banco.

### Domínio: Mercados Preditivos e Inteligência
* **`GET /api/v1/markets` [Pública]:** Retorna a lista de mercados. Regra: Deve suportar filtros complexos (categoria, volume financeiro, mercados em tendência). O payload deve incluir a probabilidade implícita calculada on-the-fly pelo banco de dados.
* **`GET /api/v1/markets/{market_id}` [Pública]:** Detalha um mercado específico. Traz o título, regras de resolução, e a liquidez atualizada de cada cenário (ex: Sim, Não, Empate).
* **`GET /api/v1/markets/{market_id}/history` [Pública]:** Retorna um array de séries temporais. Regra: Usado para montar o gráfico da interface. Mostra como a "crença do mercado" oscilou dia após dia.

### Domínio: Construção de Transações (Comandos de Ação)
* **`POST /api/v1/transactions/build-prediction`:**
    * *Entrada:* `market_id`, `outcome_id`, `amount_asset`.
    * *Regra:* Verifica KYC, verifica Lei de Limite de Perdas, verifica se o mercado ainda está na fase `OPEN`. Constrói o Envelope XDR de "place_prediction" e retorna em Base64.
* **`POST /api/v1/transactions/build-vote`:**
    * *Entrada:* `market_id`, `ong_wallet`, `desired_votes`.
    * *Regra:* Consulta o banco de dados para checar se o usuário possuía dinheiro no lado vencedor. Calcula off-chain se o saldo cobre o custo do Voto Quadrático (apenas para feedback de UI). Constrói o Envelope XDR de "cast_philanthropic_vote".
* **`POST /api/v1/transactions/build-claim`:**
    * *Entrada:* `market_id`.
    * *Regra:* Constrói a transação para o usuário sacar seu prêmio, aplicável apenas se o mercado estiver `RESOLVED` ou `CANCELED`.

### Domínio: Governança e Filantropia
* **`GET /api/v1/governance/organizations` [Pública]:** Retorna a "Whitelist" de ONGs com seus dados de transparência (nome, missão, métricas de impacto).
* **`GET /api/v1/governance/markets/{market_id}/votes` [Pública]:** Retorna o placar em tempo real de como o poder de voto filantrópico está sendo alocado pelos vencedores de um mercado específico.

### Domínio: Perfil e Reputação On-Chain do Usuário
* **`GET /api/v1/users/me/portfolio`:** Retorna o capital total travado em mercados ativos, o saldo aguardando saque (prêmios) e o poder de voto filantrópico acumulado não utilizado.
* **`GET /api/v1/users/me/history`:** Retorna a trilha de auditoria do usuário: tudo o que ele previu, quando previu, e qual impacto social ele ajudou a direcionar indiretamente.

---

## 5.1 Endpoints adicionados para cobrir as telas novas

### Domínio: Diretório de ONGs + Perfil de ONG
* **`GET /api/v1/ngos` [Pública]:** Lista ONGs/projetos.
  * *Filtros:* `q`, `cause`, `verified`, `sort=(trending|newest|funds_desc)`, paginação.
* **`GET /api/v1/ngos/{ngo_id}` [Pública]:** Detalhe da ONG (descrição, métricas, links de transparência, localização).
* **`GET /api/v1/ngos/{ngo_id}/timeline` [Pública]:** Eventos de impacto + provas (tx_hash quando houver).
* **`GET /api/v1/ngos/{ngo_id}/markets` [Pública]:** Mercados relacionados à ONG (se aplicável).

### Domínio: Global Impact Feed (Ledger) + Export
* **`GET /api/v1/impact/ledger` [Pública]:** Lista de distribuições/entradas do ledger.
  * *Filtros:* `cause`, `q`, `time_range`, `size_min`, `sort=(newest|largest|ngo_az)`, paginação.
* **`POST /api/v1/impact/ledger/export` [Autenticada]:** Cria um job de export (CSV/XLSX/PDF) e retorna `export_id`.
* **`GET /api/v1/impact/ledger/export/{export_id}` [Autenticada]:** Status + URL do arquivo quando pronto.

### Domínio: Notifications
* **`GET /api/v1/notifications` [Autenticada]:** Lista (unread/past) com paginação.
* **`POST /api/v1/notifications/mark-all-read` [Autenticada]:** Marca todas como lidas.
* **`POST /api/v1/notifications/{id}/read` [Autenticada]:** Marca uma como lida.

### Domínio: Settings (Privacidade, Wallets vinculadas, 2FA, Compliance)
* **`GET /api/v1/users/me/settings` [Autenticada]:** Snapshot de configurações (privacy, role, wallets, 2FA status).
* **`PATCH /api/v1/users/me/privacy` [Autenticada]:** Atualiza Public Visibility / Private Mode.
* **`GET /api/v1/users/me/limits` [Autenticada]:** Limites mensais, consumido, reset_at.
* **`POST /api/v1/users/me/wallets/link/build` [Autenticada]:** Retorna XDR para vincular nova wallet (se exigir assinatura).
* **`DELETE /api/v1/users/me/wallets/{wallet_address}` [Autenticada]:** Remove wallet vinculada (com regras de “não remover última”).
* **`POST /api/v1/users/me/2fa/enable` [Autenticada]:** Inicia setup de 2FA (secret/QR).
* **`POST /api/v1/users/me/2fa/verify` [Autenticada]:** Confirma token TOTP e habilita.
* **`POST /api/v1/users/me/compliance-report/export` [Autenticada]:** Exporta relatório de compliance (PDF/CSV).

### Domínio: Leaderboard
* **`GET /api/v1/leaderboard` [Pública]:** Ranking.
  * *Filtros:* `range=(7d|all)`, `q` (address/ENS), paginação.
  * *Regra:* respeitar `private_mode` (ocultar/anonimizar).

### Domínio: Help Center + Legal (versionado)
* **`GET /api/v1/help/topics` [Pública]**
* **`GET /api/v1/help/faqs` [Pública]:** filtros `topic`, `q`.
* **`GET /api/v1/legal/terms/latest` [Pública]**
* **`GET /api/v1/legal/terms/{version}` [Pública]**
* **`GET /api/v1/legal/terms/{version}/pdf` [Pública]**
* **`POST /api/v1/legal/terms/{version}/accept` [Autenticada]:** registra aceite.

---

## 5.2 WebSocket/SSE — Eventos que o frontend precisa para UI otimista
O WS deve publicar, no mínimo:
* `tx_submitted`, `tx_confirmed`, `tx_failed` (com `client_correlation_id`)
* `market_resolved`, `market_canceled`
* `claim_available`, `claim_confirmed`
* `vote_submitted`, `vote_confirmed`
* `notification_created`

---

## 6. Modelo de Dados (PostgreSQL) — Tabelas a serem mapeadas (sem SQL)

> Listagem por nome + principais propriedades. Tipos podem ser inferidos (uuid, text, numeric, timestamp, jsonb).

### Núcleo de Identidade/Autenticação
* **users**
  - `id`, `created_at`, `updated_at`
  - `primary_wallet_address`
  - `role` (user|ngo_partner|admin)
  - `kyc_status` (not_started|pending|approved|rejected)
  - `kyc_tier` (tier0|tier1|tier2)
  - `terms_version_accepted`
  - `public_visibility` (bool)
  - `private_mode` (bool)
* **auth_nonces**
  - `id`, `wallet_address`, `nonce`, `expires_at`, `consumed_at`
* **user_wallets**
  - `id`, `user_id`, `wallet_address`, `network` (mainnet/testnet), `label`
  - `is_primary`, `linked_at`, `unlinked_at`
* **kyc_profiles**
  - `id`, `user_id`, `provider` (sumsub), `provider_applicant_id`
  - `status`, `submitted_at`, `reviewed_at`, `rejection_reason`
  - `aml_flags` (json)
* **user_security**
  - `user_id`, `twofa_enabled`, `twofa_secret_ref` (referência segura), `twofa_enabled_at`

### Mercados e Probabilidades
* **markets**
  - `id`, `created_at`, `updated_at`
  - `title`, `description`, `category`
  - `status` (open|locked|resolving|resolved|canceled)
  - `lock_at`, `resolve_at`
  - `asset_code`, `asset_issuer`, `asset_decimals`
  - `resolution_source_label`, `resolution_source_url`
  - `oracle_contract_ref` (tx/contract id/url)
* **market_outcomes**
  - `id`, `market_id`
  - `code` (YES/NO), `label`
* **market_snapshots**
  - `id`, `market_id`, `timestamp`
  - `yes_pool_amount`, `no_pool_amount`
  - `implied_probability_yes`
  - `volume_total`

### Posições, Claims e Transações
* **user_positions**
  - `id`, `user_id`, `market_id`
  - `outcome_code` (YES/NO)
  - `amount_staked`
  - `created_at`, `updated_at`
  - `status` (open|settled|canceled)
* **claims**
  - `id`, `user_id`, `market_id`
  - `principal_amount`, `payout_amount`
  - `claimable_at`, `claimed_at`
  - `status` (claimable|claimed|failed)
  - `tx_hash`, `explorer_url`
  - `impact_contribution_amount` (quanto foi destinado a impacto por este evento/claim)
* **tx_intents**
  - `id`, `user_id`, `type` (stake|vote|claim|link_wallet|ttl_extend)
  - `payload` (json), `client_correlation_id`
  - `created_at`, `expires_at`
* **tx_receipts**
  - `id`, `tx_intent_id`
  - `status` (submitted|confirmed|failed|unknown)
  - `tx_hash`, `ledger`, `error_message`, `confirmed_at`

### Governança / Votação / ONGs
* **ngos**
  - `id`, `created_at`, `updated_at`
  - `name`, `slug`, `short_description`, `long_description`
  - `verified` (bool), `verification_level`
  - `wallet_address` (se aplicável)
  - `logo_url`, `hero_image_url`
  - `operations_base_city`, `operations_base_country`, `location_lat`, `location_lng`
  - `transparency_links` (json: audit_url, treasury_url, certification_url)
  - `total_funds_received`, `projects_funded_count`
* **ngo_causes**
  - `id`, `name` (Reforestation/Ocean Cleanup/Clean Water/Education etc.), `icon`
* **ngo_cause_map**
  - `ngo_id`, `cause_id`
* **ngo_timeline_events**
  - `id`, `ngo_id`, `date`, `title`, `description`
  - `image_url`
  - `market_id` (nullable)
  - `tx_hash` (nullable), `verification_badge` (bool)
* **votes**
  - `id`, `market_id`, `user_id`
  - `total_credits_available`, `total_credits_spent`
  - `submitted_at`, `tx_hash`
  - `status` (submitted|confirmed|failed)
* **vote_allocations**
  - `id`, `vote_id`, `ngo_id`
  - `votes` (integer), `cost` (votes^2)

### Ledger de Impacto (Global Impact Feed)
* **impact_ledger_entries**
  - `id`, `created_at`
  - `date` (para exibição), `market_id`, `ngo_id`
  - `cause_id`
  - `amount`, `asset_code`, `asset_issuer`, `asset_decimals`
  - `outcome_code` (YES/NO/INSURANCE_TRIGGER etc.)
  - `tx_hash`, `explorer_url`
  - `source` (market_settlement|manual_adjustment|insurance_trigger)

### Notificações
* **notifications**
  - `id`, `user_id`
  - `type` (market_resolved|claim_ready|kyc_approved|vote_round_open|generic)
  - `title`, `body`
  - `cta_primary` (json: label, deep_link)
  - `cta_secondary` (json)
  - `created_at`, `read_at`
  - `entity_ref` (json: market_id, claim_id, ngo_id)

### Leaderboard / Reputação
* **user_reputation_snapshots**
  - `id`, `user_id`, `timestamp`
  - `brier_score`, `win_rate`, `total_staked`, `total_earned`
  - `tier_label` (Torcedor/Oráculo/Lenda)
* **leaderboard_snapshots**
  - `id`, `range` (7d|all), `generated_at`
* **leaderboard_rows**
  - `id`, `snapshot_id`, `rank`
  - `user_id` (nullable se anon), `display_name`
  - `brier_score`, `social_impact`, `accuracy`, `markets_won`

### Help/Legal/Conteúdo
* **help_topics**
  - `id`, `name`, `sort_order`
* **help_faqs**
  - `id`, `topic_id`
  - `question`, `answer_md`, `sort_order`
* **legal_terms_versions**
  - `id`, `version`, `published_at`
  - `content_md`, `pdf_url` (opcional)
* **legal_acceptances**
  - `id`, `user_id`, `terms_version`, `accepted_at`, `ip_hash` (opcional)

### Exports (assíncrono)
* **export_jobs**
  - `id`, `user_id`, `type` (impact_ledger|compliance_report)
  - `filters` (json), `format` (csv|xlsx|pdf)
  - `status` (queued|running|done|failed)
  - `file_url`, `created_at`, `completed_at`, `error_message`

---

## 7. Arquitetura de Testes Exigida (QA Backend)
A suíte de testes do NestJS deve cobrir rigorosamente as bordas do sistema:

* **Teste de Idempotência do Indexador:** Simular a queda do Worker no meio de um lote de 500 eventos. O teste deve provar que, ao religar, a API retoma a leitura sem inserir transações duplicadas e sem pular nenhum registro.
* **Teste de Barreira de Conformidade:** Tentar forçar o motor de construção de XDR (`build-prediction`) a gerar uma transação para um usuário cujo limite legal de depósito daquele mês já foi atingido. A suíte deve esperar uma rejeição HTTP 403 antes que qualquer biblioteca da rede Stellar seja importada na memória.
* **Teste de Lógica Epistêmica (Cálculo de Odds):** Injetar dados sintéticos no banco de dados (Ex: 300 USDC no Sim, 700 USDC no Não) e garantir que a rota de mercado `/markets/{id}` retorna exatamente a string/JSON garantindo que a "Probabilidade Implícita de 'Sim' é 30%".
* **Teste Anti-Spoofing Criptográfico:** Enviar um Nonce válido, porém assinado com uma chave privada genérica diferente da declarada. A API deve rejeitar imediatamente a geração do JWT.
