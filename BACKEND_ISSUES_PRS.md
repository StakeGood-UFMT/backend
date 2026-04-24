# StakeGood Backend - Issues & PRs Report

## Issues

### #25 - BE-22 - Auth Refresh (Renovação de Token)
- **State:** OPEN
- **Created at:** 2026-04-23T14:17:14Z
- **Author:** heliocarrara
- **Labels:** area:backend, phase:core, type:feature, priority:medium, sprint:3

#### Description
## Contexto
Essencial para a experiência do usuário (UX), evitando que a sessão expire e peça login a cada poucas horas. O AuthService do frontend já tem a lógica de interceptação pronta.

## Objetivo
Permitir que o frontend obtenha um novo access_token (JWT) usando um refresh_token válido, sem necessidade de nova assinatura com a wallet.

## Módulos/Arquivos
- src/modules/auth/auth.controller.ts
- src/modules/auth/auth.service.ts

## Detalhes Técnicos (Lint AI)
- **Endpoint:** POST /auth/refresh
- **Method:** POST
- **Request Body:**
```json
{
  "refresh_token": "string_do_refresh_token_armazenado"
}
```
- **Response (201 Created):**
```json
{
  "jwt": "novo_jwt_aqui",
  "wallet": "GB...",
  "kyc_status": "none | pending | verified | rejected",
  "kyc_tier": 1,
  "expires_in": 86400,
  "user": {
    "id": "uuid",
    "primary_wallet": "GB...",
    "role": "user",
    "public_visibility": true
  }
}
```

## Plano de implementação (passo a passo)
1. Implementar endpoint POST /auth/refresh.
2. Validar o refresh_token (verificar validade e se não foi revogado).
3. Gerar novo JWT e retornar no formato esperado (similar ao /auth/verify).

## Critérios de aceite / Checklist de QA
- [ ] Retorna 201 Created com novo JWT ao enviar refresh token válido.
- [ ] Retorna 401 Unauthorized para refresh token inválido ou expirado.

---

### #24 - BE-21 - Detalhe do Mercado (Market Details)
- **State:** OPEN
- **Created at:** 2026-04-23T14:17:13Z
- **Author:** heliocarrara
- **Labels:** area:backend, phase:core, type:feature, priority:medium, sprint:3

#### Description
## Contexto
O frontend já tem a página de detalhes pronta (FE-6) e necessita dos dados completos de um mercado específico para preencher o cabeçalho e exibir as regras de resolução.

## Objetivo
Implementar o endpoint para retornar os dados completos de um mercado específico via UUID.

<img width="1716" height="936" alt="Image" src="https://github.com/user-attachments/assets/57794706-6a5a-4ba3-8564-61071c10ae01" />

## Módulos/Arquivos
- src/modules/markets/markets.controller.ts
- src/modules/markets/markets.service.ts

## Detalhes Técnicos (Lint AI)
- **Endpoint:** GET /markets/:id
- **Method:** GET
- **Path Params:** id (UUID)
- **Headers:** Authorization: Bearer <token> (JWT Required)
- **Response (200 OK):**
```json
{
  "id": "uuid",
  "title": "Will SpaceX land Starship on Mars by 2026?",
  "description": "Detailed description of the criteria for success...",
  "category": "SCIENCE",
  "status": "OPEN",
  "image_url": "https://example.com/image.jpg",
  "yes_price": 0.55,
  "no_price": 0.45,
  "total_liquidity": "15000.50",
  "lock_at": "2026-12-31T23:59:59Z",
  "settle_at": "2027-01-05T12:00:00Z",
  "created_at": "2024-04-23T10:00:00Z",
  "resolution_rule": "Official SpaceX announcement or NASA confirmation.",
  "resolution_source": "https://spacex.com",
  "oracle_url": "https://api.oracle.com/v1/check",
  "contract_address": "C...",
  "fee_ngo": 0.02,
  "fee_platform": 0.01,
  "fee_gamification": 0.005
}
```

## Plano de implementação (passo a passo)
1. Criar método no Controller para GET /markets/:id.
2. Implementar lógica no Service para buscar mercado por ID no banco.
3. Garantir que todos os campos do modelo Market sejam retornados.

## Critérios de aceite / Checklist de QA
- [ ] Retorna 200 OK com o objeto completo para um ID válido.
- [ ] Retorna 404 Not Found para ID inexistente.
- [ ] Exige autenticação JWT.

---

### #22 - BE-0 - Project Setup (NestJS + Docker)
- **State:** CLOSED
- **Created at:** 2026-04-18T19:30:56Z
- **Author:** heliocarrara
- **Labels:** area:backend, phase:setup, type:chore, priority:high, sprint:1

#### Description
## Contexto
O projeto backend precisa de uma fundação tecnológica sólida (NestJS) para suportar os endpoints de orquestração.

## Objetivo
Bootstrap do projeto NestJS e ambiente de containerização (Postgres).

## Módulos/Arquivos
- src/main.ts
- docker-compose.yml
- .env.example

## Detalhes Técnicos (Lint AI)
- **Framework:** NestJS 10+
- **Database:** PostgreSQL 15+
- **Commits:** Conventional Commits (chore(setup): ...).

## Plano de implementação (passo a passo)
1. Executar 
px @nestjs/cli new . (npm).
2. Criar docker-compose.yml para banco de dados local.
3. Configurar scripts de lint e prettier.
4. Definir estrutura de pastas core (core/services, features/...).

## Critérios de aceite / Checklist de QA
- [ ] Aplicação inicia com 
pm run start:dev.
- [ ] Conexão com Postgres via TypeORM validada.

---

### #21 - BE-20 - Propose Market (submissão + moderação)
- **State:** OPEN
- **Created at:** 2026-04-18T16:24:54Z
- **Author:** heliocarrara
- **Labels:** area:backend, phase:core, type:feature, parallel:no, priority:medium, sprint:3

#### Description
## Contexto
Fluxo de moderação para propostas de mercados da comunidade.

## Objetivo
Sistema de submissão e aprovação de mercados sugeridos.

## Módulos/Arquivos
- src/features/proposals/proposal.controller.ts
- src/features/proposals/proposal.service.ts

## Detalhes Técnicos (Lint AI)
- **Logic:** Estado de propostas (PENDING, APPROVED, REJECTED).
- **Admin:** Apenas admins podem aprovar/rejeitar.

## Plano de implementação (passo a passo)
1. Endpoint POST para usuários enviarem propostas.
2. Endpoint PATCH de moderação exclusivo para admins.

## Critérios de aceite / Checklist de QA
- [ ] Propostas aprovadas disparam criação de mercado real.

---

### #20 - BE-19 - Help + Legal (terms versionado)
- **State:** OPEN
- **Created at:** 2026-04-18T16:24:53Z
- **Author:** heliocarrara
- **Labels:** area:backend, type:feature, parallel:yes, priority:medium, sprint:3, phase:ux

#### Description
## Contexto
A plataforma exige clareza legal e suporte ao usuário.

## Objetivo
Endpoints para Help Center e Termos de Uso.

## Módulos/Arquivos
- src/features/legal/legal.controller.ts
- src/features/legal/legal.service.ts

## Detalhes Técnicos (Lint AI)
- **Logic:** Versionamento de Termos de Uso.

## Plano de implementação (passo a passo)
1. Criar repositório para documentos estáticos versionados.
2. Endpoint para retornar FAQ e Termos vigentes.

## Critérios de aceite / Checklist de QA
- [ ] Aceite de termos registrado no perfil do usuário.

---

### #19 - BE-18 - NGOs (directory + profile + timeline)
- **State:** OPEN
- **Created at:** 2026-04-18T16:24:52Z
- **Author:** heliocarrara
- **Labels:** area:backend, phase:core, type:feature, parallel:yes, priority:high, sprint:3

#### Description
## Contexto
O diretório de ONGs é a base para o Voto Quadrático de impacto.

## Objetivo
Expor diretório de ONGs e perfis detalhados.

## Módulos/Arquivos
- src/features/ngos/ngo.controller.ts
- src/features/ngos/ngo.service.ts

## Detalhes Técnicos (Lint AI)
- **Endpoint:** GET /api/v1/ngos.
- **Logic:** Filtros por categoria e status verificado.

## Plano de implementação (passo a passo)
1. Criar entidade e repositório de ONGs.
2. Implementar CRUD (visto por admins) e listagem pública.
3. Adicionar linha do tempo de impacto recebido de cada ONG.

## Critérios de aceite / Checklist de QA
- [ ] Busca por categoria funcionando.

---

### #18 - BE-17 - Leaderboard (snapshots + private mode)
- **State:** OPEN
- **Created at:** 2026-04-18T16:24:52Z
- **Author:** heliocarrara
- **Labels:** area:backend, type:feature, parallel:yes, priority:medium, sprint:3, phase:ux

#### Description
## Contexto
Rankings aumentam o engajamento através da gamificação dos acertos e volume.

## Objetivo
Implementar o motor de Leaderboard (Top Traders).

## Módulos/Arquivos
- src/features/leaderboard/leaderboard.controller.ts
- src/features/leaderboard/leaderboard.service.ts

## Detalhes Técnicos (Lint AI)
- **Logic:** Snapshot periódico do ranking.
- **Privacy:** Ocultar usuários que marcaram private_mode.

## Plano de implementação (passo a passo)
1. Criar Job agendado para calcular scores baseados em P&L e volume.
2. Armazenar snapshots para visualização histórica.
3. Endpoint de consulta filtrado por período.

## Critérios de aceite / Checklist de QA
- [ ] Ranking ordena corretamente por lucro/volume.

---

### #17 - BE-16 - Settings (privacy + wallets + 2FA + report)
- **State:** OPEN
- **Created at:** 2026-04-18T16:24:51Z
- **Author:** heliocarrara
- **Labels:** area:backend, phase:core, type:feature, parallel:yes, priority:high, sprint:3

#### Description
## Contexto
Configurações de conta, privacidade e múltiplas carteiras.

## Objetivo
Implementar o painel de Settings do usuário.

## Módulos/Arquivos
- src/features/settings/settings.controller.ts
- src/features/settings/settings.service.ts

## Detalhes Técnicos (Lint AI)
- **Logic:** Gerenciamento de preferências de privacidade (public_visibility).
- **Security:** 2FA (opcional v2), link_wallet proof (assinatura).

## Plano de implementação (passo a passo)
1. Criar entidade UserDetails para preferências.
2. Endpoint PATCH para atualizar configurações.
3. Implementar lógica para vincular carteiras secundárias através de desafio de assinatura.

## Critérios de aceite / Checklist de QA
- [ ] Alteração de privacidade refletida no leaderboard.

---

### #16 - BE-15 - Notifications (unread/past + triggers)
- **State:** OPEN
- **Created at:** 2026-04-18T16:24:50Z
- **Author:** heliocarrara
- **Labels:** area:backend, type:feature, parallel:yes, priority:medium, sprint:3, phase:ux

#### Description
## Contexto
O usuário deve ser notificado sobre mudanças críticas no estado de seus investimentos ou da plataforma.

## Objetivo
Implementar o sistema de notificações persistentes e gatilhos.

## Módulos/Arquivos
- src/features/notifications/notification.controller.ts
- src/features/notifications/notification.service.ts
- src/features/notifications/entities/notification.entity.ts

## Detalhes Técnicos (Lint AI)
- **Endpoints:**
  - GET /api/v1/notifications
  - PATCH /api/v1/notifications/:id/read
- **Real-time:** Integração opcional com WebSocket no futuro (v1 é polling/DB-driven).

## Plano de implementação (passo a passo)
1. Criar tabela 
otifications (message, type, read_at, user_id).
2. Implementar gatilhos no Worker (ex: lucro creditado) para gerar registros na tabela.
3. Criar a API de consulta.

## Critérios de aceite / Checklist de QA
- [ ] Notificações marcadas como 'lidas' desaparecem da contagem de pendentes.
- [ ] Listagem respeita o usuário autenticado.

---

### #15 - BE-14 - Impact Ledger + Export Jobs
- **State:** OPEN
- **Created at:** 2026-04-18T16:24:50Z
- **Author:** heliocarrara
- **Labels:** area:backend, phase:core, type:feature, parallel:yes, priority:high, sprint:3

#### Description
## Contexto
Transparência social requer um feed auditável de todas as doações de impacto.

## Objetivo
Implementar o Impact Ledger e exportação de dados.

## Módulos/Arquivos
- src/features/impact/impact.controller.ts
- src/features/impact/impact.service.ts

## Detalhes Técnicos (Lint AI)
- **Endpoints:**
  - GET /api/v1/impact/ledger
  - POST /api/v1/impact/ledger/export
- **Export:** Job assíncrono (BullMQ) para gerar CSV/PDF.

## Plano de implementação (passo a passo)
1. Criar entidade ImpactLedgerEntry mapeada no DB.
2. Implementar endpoint de listagem com filtros de data e ONG.
3. Integrar com serviço de geração de arquivos para exportação.
4. Armazenar arquivos exportados e retornar URL.

## Critérios de aceite / Checklist de QA
- [ ] Feed retorna dados corretos de doação.
- [ ] Download de arquivo CSV funcional.

---

### #14 - BE-13 - Keeper: batch bump TTL
- **State:** OPEN
- **Created at:** 2026-04-18T16:24:49Z
- **Author:** heliocarrara
- **Labels:** area:backend, phase:setup, type:feature, parallel:yes, priority:medium, sprint:3

#### Description
## Contexto
Dados persistent on-chain expiram se não houver bump de TTL. O backend automatiza isso para mercados ativos.

## Objetivo
Implementar o serviço Keeper para manutenção de TTL do contrato.

## Módulos/Arquivos
- src/features/keeper/keeper.service.ts
- src/features/keeper/keeper.module.ts

## Detalhes Técnicos (Lint AI)
- **Signature:** `batch_bump_ttl(market_ids: u64[])` no Smart Contract.
- **Schedule:** Executar uma vez por dia (Cron).
- **Invariante:** Apenas mercados com status OPEN ou LOCKED recebem o bump.

## Plano de implementação (passo a passo)
1. Configurar @nestjs/schedule no projeto.
2. Criar KeeperService com um @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT).
3. Selecionar mercados ativos do DB.
4. Chamar o contrato Soroban via Stellar SDK.

## Critérios de aceite / Checklist de QA
- [ ] Logs confirmam execução do job diário.
- [ ] Teste de integração valida chamada ao contrato com lista de IDs.

---

### #13 - BE-12 - Admin Market Lifecycle (create/resolve/cancel/distribute)
- **State:** OPEN
- **Created at:** 2026-04-18T16:24:48Z
- **Author:** heliocarrara
- **Labels:** area:backend, phase:core, type:feature, parallel:no, priority:high, sprint:3

#### Description
**Contexto**
- V3 introduz ciclo admin/oracle e distribuição de impacto.

**Objetivo**
- Endpoints admin para operar o contrato e registrar auditoria.

**Escopo**
- Endpoints protegidos por role + logs.

**Objetivo detalhado**
- Criar market (espelha `create_market`).
- Resolver via oracle flow.
- Cancelar.
- Distribute impact.

**Eventos/tabelas tocadas**
- **Tabelas:** `markets`, `impact_ledger_entries`, `tx_intents`, `tx_receipts`, `audit_logs` (recomendado).
- **Eventos WS:** `impact_distributed` (se exposto), `market_resolved`.

**API**
- `POST /api/v1/admin/markets`
- `POST /api/v1/admin/markets/{id}/resolve`
- `POST /api/v1/admin/markets/{id}/cancel`
- `POST /api/v1/admin/markets/{id}/distribute-impact`

**Critérios de Aceite**
- Somente admin executa.
- Logs/auditoria registrados.

**Checklist**
- [ ] AuthZ admin
- [ ] Logs
- [ ] Ledger update

**Git (Branch e PR)**
- **Branch:** `feature/BE-12-admin-lifecycle`
- **Commits:** `feat(backend): ...`, `test(backend): ...`
- **PR:** `develop`

**Dependências**
- **Pode fazer em paralelo?** Não
- **Depende de:** SC distribute_impact_funds + resolve_market

---

### #12 - BE-11 - Endpoints: Portfolio/History/Claims
- **State:** OPEN
- **Created at:** 2026-04-18T16:24:47Z
- **Author:** heliocarrara
- **Labels:** area:backend, phase:core, type:feature, parallel:yes, priority:medium, sprint:2

#### Description
## Contexto
O frontend necessita de dados de portfólio e histórico de forma rápida, espelhados do blockchain no banco local.

## Objetivo
Implementar os endpoints de leitura do perfil do usuário autenticado.

## Módulos/Arquivos
- src/features/users/users.controller.ts
- src/features/users/users.service.ts
- src/features/users/entities/user-position.entity.ts

## Detalhes Técnicos (Lint AI)
- **API:**
  - GET /api/v1/users/me/portfolio
  - GET /api/v1/users/me/history
- **Auth:** JWT Guard (sub = wallet_address).
- **Cache:** Cache-Aside no Redis (opcional v1).

## Plano de implementação (passo a passo)
1. Criar rotas no UsersController.
2. Implementar queries no UsersService consultando as tabelas de posições e histórico.
3. Garantir que os dados coincidam com o estado on-chain indexado pelo Worker.
4. Adicionar tratamento de erros para usuários não encontrados.

## Critérios de aceite / Checklist de QA
- [ ] Endpoints retornam JSON conforme especificação técnica.
- [ ] Paginação funcional no histórico (limit/offset).

---

### #11 - BE-10 - Worker v2 (stake/resolve/claim/vote + WS publish)
- **State:** OPEN
- **Created at:** 2026-04-18T16:24:47Z
- **Author:** heliocarrara
- **Labels:** area:backend, phase:core, type:feature, parallel:no, priority:high, sprint:2

#### Description
## Labels
- ^Grea:backend
- phase:core
- 	ype:feature
- priority:medium
- sprint:2

## Contexto
O frontend precisa de endpoints de leitura rápida (read-model) para exibir o portfólio do usuário, histórico de transações e recompensas disponíveis (claims). Esses dados devem vir do PostgreSQL (indexado pelo Worker).

## Objetivo
Implementar os endpoints de consulta do usuário autenticado.

## Escopo
- Endpoints GET para Portfolio, History e Claims.
- Integração com o banco de dados (Repository layer).

## Módulos/Arquivos
- UserController / UserService.
- UserPositionEntity.
- TxHistoryRepository.

## Plano de implementação (passo a passo)
1. Criar UserController e registrar rotas sob /api/v1/users/me/*.
2. Implementar getPortfolio(userId): faz join entre user_positions e markets.
3. Implementar getHistory(userId): consulta 	x_history ordenada por data decrescente.
4. Implementar getClaims(userId): filtra posições em mercados resolvidos onde o usuário foi vencedor e claimed == false.
5. Adicionar paginação padrão (limit/offset).

## Detalhes Técnicos (Lint AI)
- **Auth:** Exige JWT (sub = wallet_address).
- **Invariante:** Resposta sempre em milissegundos (leitura de DB local).
- **Testes:** `GET /me/portfolio` deve retornar lista vazia para usuários novos.

## Critérios de aceite
- Endpoints retornando JSON conforme especificado na sepcBack.md.

---

### #10 - BE-9 - XDR Builder: build-vote (V3 quadratic)
- **State:** OPEN
- **Created at:** 2026-04-18T16:24:46Z
- **Author:** heliocarrara
- **Labels:** area:backend, phase:core, type:feature, parallel:no, priority:high, sprint:2

#### Description
**Contexto**
- V3 define credits = floor(sqrt(stake_stroops)) e custo = votos².

**Objetivo**
- Montar XDR de voto com validação de elegibilidade e créditos.

**Escopo**
- Endpoint build-vote e validações.

**Eventos/tabelas tocadas**
- **Tabelas:** `votes`, `vote_allocations`, `user_positions`, `tx_intents`.

**API**
- `POST /api/v1/transactions/build-vote`

**Critérios de Aceite**
- Bloqueia se `cost>credits`.
- Bloqueia se já votou/não elegível.

**Detalhes Técnicos (Lint AI)**
- **Endpoint:** `POST /api/v1/transactions/build-vote`
- **Payload:** `{ market_id, ngo_id, allocated_votes }`
- **Validações:** 
  - `market.state == 'RESOLVED'`
  - `user_positions.outcome == market.winning_outcome`
  - `has_voted == false`
  - **Quadratic:** `credits = floor(sqrt(position.amount_stroops))`. `allocated_votes^2 <= credits`.
- **XDR:** Soroban `cast_philanthropic_vote` call.
- **Testes:** `test_build_vote_ok`, `test_insufficient_credits_fails`.

**Checklist**
- [ ] sqrt correto
- [ ] v² correto
- [ ] erros padronizados

**Git (Branch e PR)**
- **Branch:** `feature/BE-9-build-vote-v3`
- **Commits:** `feat(backend): ...`, `test(backend): ...`
- **PR:** `develop`

**Dependências**
- **Pode fazer em paralelo?** Não
- **Depende de:** BE-10

---

### #9 - BE-8 - XDR Builder: build-claim
- **State:** OPEN
- **Created at:** 2026-04-18T16:24:45Z
- **Author:** heliocarrara
- **Labels:** area:backend, phase:core, type:feature, parallel:yes, priority:high, sprint:2

#### Description
**Contexto**
- Pull-over-push: usuário aciona claim; backend monta XDR.

**Objetivo**
- Gerar XDR para `claim_reward` com pré-checks.

**Escopo**
- Endpoint build-claim.

**Eventos/tabelas tocadas**
- **Tabelas:** `claims`, `markets`, `tx_intents`.

**API**
- `POST /api/v1/transactions/build-claim`

**Critérios de Aceite**
- Não gerar XDR se não claimable.
- Evitar double-claim.

**Detalhes Técnicos (Lint AI)**
- **Endpoint:** `POST /api/v1/transactions/build-claim`
- **Payload:** `{ market_id }`
- **Validações:** 
  - `market.state IN ('RESOLVED', 'CANCELED')`
  - `user_positions.claimed == false`
- **XDR:** Soroban `claim_reward` call.
- **Testes:** `test_build_claim_ok`, `test_double_claim_pre_check`.

**Checklist**
- [ ] Pré-checks
- [ ] XDR ok

**Git (Branch e PR)**
- **Branch:** `feature/BE-8-build-claim`
- **Commits:** `feat(backend): ...`, `test(backend): ...`
- **PR:** `develop`

**Dependências**
- **Pode fazer em paralelo?** Sim
- **Depende de:** BE-10 (claims indexados)

---

### #8 - BE-7 - XDR Builder: build-prediction (V3) + pré-check anti-hedge
- **State:** OPEN
- **Created at:** 2026-04-18T16:24:44Z
- **Author:** heliocarrara
- **Labels:** area:backend, phase:core, type:feature, parallel:no, priority:high, sprint:2

#### Description
**Contexto**
- Regra de ouro: frontend não monta tx; backend constrói XDR.

**Objetivo**
- Construir XDR de stake com validações de conformidade + anti-hedge.

**Escopo**
- Endpoint build-prediction e camada de validação.

**Objetivo detalhado**
- Validar KYC/limits/market OPEN/now<lock_ts.
- Verificar hedge lock (posição existente).
- Retornar XDR + summary.

**Eventos/tabelas tocadas**
- **Tabelas:** `tx_intents`, `users`, `user_positions` (para check), `markets`.

**API**
- `POST /api/v1/transactions/build-prediction`

**Critérios de Aceite**
- Retorna erro descritivo para UI.
- Não permite tentativa de hedge (409/422).

**Detalhes Técnicos (Lint AI)**
- **Endpoint:** `POST /api/v1/transactions/build-prediction`
- **Payload:** `{ market_id, outcome, amount }`
- **Validações:** 
  - `user.kyc_status == 'verified'`
  - `BE-6A` (Rolling Window)
  - `market.lock_ts > now`
  - **Hedge Lock:** `SELECT outcome FROM user_positions WHERE user_id = ? AND market_id = ?` -> deve ser null ou igual ao `outcome` solicitado.
- **XDR:** Soroban `place_prediction` call.
- **Testes:** `test_build_prediction_ok`, `test_hedge_lock_violation_fails`.

**Checklist**
- [ ] Validações
- [ ] XDR válido
- [ ] Summary para UI

**Git (Branch e PR)**
- **Branch:** `feature/BE-7-build-prediction-v3`
- **Commits:** `feat(backend): ...`, `test(backend): ...`
- **PR:** `develop`
- **Revisor:** 1+

**Dependências**
- **Pode fazer em paralelo?** Não
- **Depende de:** BE-6A, BE-4, worker/DB com posições

---

### #7 - BE-6A - Motor de Limites (Rolling Window 30d)
- **State:** OPEN
- **Created at:** 2026-04-18T16:24:44Z
- **Author:** heliocarrara
- **Labels:** area:backend, phase:quality, type:feature, parallel:yes, priority:high, sprint:2

#### Description
**Contexto**
- Regra regulatória anti-vício exige bloquear build-transaction antes da chain.

**Objetivo**
- Implementar cálculo de depósitos confirmados nos últimos 30 dias e bloquear quando exceder limite.

**Escopo**
- Apenas cálculo e enforcement na camada de build-*.

**Objetivo detalhado**
- Somar depósitos confirmados por user (via tabela deposits ou via stakes indexados).
- Retornar erro 403 com `remaining`.

**Validações**
- Considerar apenas confirmados.
- Configurável por user (`spending_limit`, `spending_window_days`).

**Eventos/tabelas tocadas**
- **Tabelas:** `users` (limites), `deposits` (se existir) ou `user_positions`/`tx_receipts`.

**Critérios de Aceite**
- Build-prediction bloqueia corretamente com payload amigável.

**Detalhes Técnicos (Lint AI)**
- **Lógica de Cálculo:** `SELECT SUM(amount) FROM user_positions WHERE user_id = ? AND status = 'confirmed' AND created_at >= NOW() - INTERVAL '30 days'`.
- **Enforcement:** Bloquear se `sum + current_amount > user.spending_limit`.
- **Configuração:** Default limit: 500 USDC (conforme spec).
- **Testes:** `test_limit_not_exceeded`, `test_limit_exceeded_returns_403`, `test_limit_reset_after_window`.

**Checklist**
- [ ] Soma correta
- [ ] Pendentes fora do cálculo
- [ ] Erro com remaining

**Git (Branch e PR)**
- **Branch:** `feature/BE-6A-rolling-window-limits`
- **Commits:** `feat(backend): ...`, `test(backend): ...`
- **PR:** `develop`
- **Revisor:** 1+

**Dependências**
- **Pode fazer em paralelo?** Sim
- **Depende de:** BE-10 (se usar stakes indexados) ou tabela deposits

---

### #6 - BE-6 - WebSocket infra (auth + handshake)
- **State:** CLOSED
- **Created at:** 2026-04-18T16:24:43Z
- **Author:** heliocarrara
- **Labels:** area:backend, phase:setup, type:feature, parallel:yes, priority:medium, sprint:1

#### Description
**Contexto**
- Front exige canal realtime para optimistic UI e mudanças de status.

**Objetivo**
- Implementar WS autenticado via JWT e handshake.

**Escopo**
- Infra WS; sem publicar eventos de produto ainda (isso entra no worker v2).

**Objetivo detalhado**
- Validar JWT na conexão.
- Emitir evento `connected`.

**API**
- WS endpoint (ex.: `/ws`).

**Critérios de Aceite**
- Token válido conecta; inválido rejeita.

**Checklist**
- [ ] Auth WS ok
- [ ] Handshake ok

**Git (Branch e PR)**
- **Branch:** `feature/BE-6-websocket-base`
- **Commits:** `feat(backend): ...`, `test(backend): ...`
- **PR:** `develop`
- **Revisor:** 1+

**Dependências**
- **Pode fazer em paralelo?** Sim
- **Depende de:** BE-2

---

### #5 - BE-5 - Worker v1 (Market/NGO ingest + idempotência)
- **State:** CLOSED
- **Created at:** 2026-04-18T16:24:42Z
- **Author:** heliocarrara
- **Labels:** area:backend, phase:setup, type:feature, parallel:no, priority:high, sprint:1

#### Description
**Contexto**
- Worker espelha chain no Postgres e é base do CQRS.

**Objetivo**
- Indexar eventos mínimos (NGO e Market) com cursor/idempotência.

**Escopo**
- Somente ingest e persistência; sem stake/claim/vote ainda.

**Objetivo detalhado**
- Consumir stream de eventos.
- Salvar no Postgres.
- Cursor transacional.
- Backoff exponencial.

**Eventos/tabelas tocadas**
- **Eventos (SC):** `("NGO","Registered")`, `("NGO","Deactivated")`, `("Market","Created")`
- **Tabelas:** `worker_cursors`, `ngos`, `markets`

**Critérios de Aceite**
- Replay não duplica.
- Cursor consistente.

**Detalhes Técnicos (Lint AI)**
- **Mecanismo:** Horizon `Stream` para o Contrato V3.
- **Idempotência:** Tabela `processed_transactions` (campos: `tx_hash`, `op_index`).
- **Cursor:** Tabela `worker_cursors` (campo: `last_ledger_id`).
- **Update Logic:** 
  - `MarketCreated` -> `INSERT INTO markets ...`
  - `NGORegistered` -> `INSERT INTO ngos ...`
- **Testes:** `test_worker_deduplication`, `test_worker_cursor_persistence`.

**Checklist**
- [ ] Dedupe
- [ ] Cursor
- [ ] Backoff

**Git (Branch e PR)**
- **Branch:** `feature/BE-5-worker-v1`
- **Commits:** `feat(backend): ...`, `test(backend): ...`
- **PR:** `develop`
- **Revisor:** 1+

**Dependências**
- **Pode fazer em paralelo?** Não
- **Depende de:** SC eventos base (SC-2/SC-3)

---

### #4 - BE-4 - Markets Queries (CQRS) + derived_status LOCKED
- **State:** CLOSED
- **Created at:** 2026-04-18T16:24:42Z
- **Author:** heliocarrara
- **Labels:** area:backend, phase:core, type:feature, parallel:yes, priority:high, sprint:1

#### Description
**Contexto**
- GETs devem ler do Postgres (sem chamar chain).
- Spec do SC permite `state=OPEN` mesmo após `lock_ts`, então UI precisa de status derivado.

**Objetivo**
- Entregar endpoints de leitura completos para Markets + History.

**Escopo**
- Somente leitura (CQRS).

**Objetivo detalhado**
- Listar markets com filtros/paginação.
- Detalhar market com fees/asset/oracle.
- History para gráfico.
- `derived_status` para UI.

**Componentes/Arquivos**
- Query controllers/services + repos SQL.

**Validações**
- Nenhuma call à chain em GET.

**API**
- `GET /api/v1/markets`
- `GET /api/v1/markets/{id}`
- `GET /api/v1/markets/{id}/history`

**Critérios de Aceite**
- Respostas rápidas.
- Payload completo para front.

**Detalhes Técnicos (Lint AI)**
- **Endpoints:** 
  - `GET /api/v1/markets?status=...`
  - `GET /api/v1/markets/:id`
  - `GET /api/v1/markets/:id/history`
- **Derived Logic:** `if (now >= market.lock_ts && market.state == 'OPEN') status = 'LOCKED'`.
- **Tabelas:** `markets`, `market_snapshots` (market_id, yes_prob, no_prob, volume, timestamp).
- **Testes:** `test_list_markets`, `test_market_detail_with_prices`, `test_derived_status_logic`.

**Checklist**
- [ ] derived_status
- [ ] filtros
- [ ] history

**Git (Branch e PR)**
- **Branch:** `feature/BE-4-markets-queries`
- **Commits:** `feat(backend): ...`, `test(backend): ...`
- **PR:** `develop`
- **Revisor:** 1+

**Dependências**
- **Pode fazer em paralelo?** Sim
- **Depende de:** BE-5 (se não houver seed)

---

### #3 - BE-3 - KYC webhook + atualização de perfil + WS
- **State:** CLOSED
- **Created at:** 2026-04-18T16:24:41Z
- **Author:** heliocarrara
- **Labels:** area:backend, phase:setup, type:feature, parallel:yes, priority:high, sprint:1

#### Description
**Contexto**
- KYC é barreira legal. Webhook do provedor atualiza `users.kyc_status`.

**Objetivo**
- Processar webhook KYC (SumSub) e notificar usuário via WS.

**Racional (por que isso existe)**
- **Obrigação regulatória:** bloquear apostas sem verificação biométrica/AML.
- **Tempo real:** o usuário não deve ficar “preso” sem saber quando foi aprovado.
- **Auditabilidade:** trilha de status KYC precisa estar persistida (para compliance).

**Escopo**
- Endpoint protegido por HMAC + atualização de DB.

**Objetivo detalhado**
- Validar assinatura do webhook.
- Atualizar `kyc_profiles` e `users.kyc_status`.
- Emitir WS `kyc_status_updated`.

**Páginas e Componentes**
- **Módulos/Arquivos:** KycWebhookController, KycService, HmacVerifier.

**Validações**
- HMAC válido.
- Idempotência (webhook duplicado não quebra estado).

**API**
- `POST /api/v1/auth/kyc/webhook`

**Critérios de Aceite**
- Status aprovado desbloqueia usuário.
- Cliente recebe evento WS.

**Detalhes Técnicos (Lint AI)**
- **Endpoint:** `POST /api/v1/auth/kyc/webhook`
- **Auth:** Validação de cabeçalho `X-Sumsub-Signature` (HMAC-SHA256).
- **Mapeamento Status:** `approved` -> `verified`, `rejected` -> `rejected`.
- **WebSocket:** Emitir `kyc_status_updated` para a sala do usuário.
- **Testes:** `test_webhook_hmac_ok`, `test_user_status_update`, `test_ws_notification`.

**Checklist**
- [ ] HMAC ok
- [ ] DB atualizado
- [ ] WS ok

**Git (Branch e PR)**
- **Branch:** `feature/BE-3-kyc-webhook`
- **Commits:** `feat(backend): ...`, `test(backend): ...`
- **PR:** `develop`
- **Revisor:** 1+

**Dependências**
- **Pode fazer em paralelo?** Sim
- **Depende de:** BE-2 (users)

---

### #2 - BE-2 - Authenticate (verify signature) + JWT + Refresh
- **State:** CLOSED
- **Created at:** 2026-04-18T16:24:40Z
- **Author:** heliocarrara
- **Labels:** area:backend, phase:setup, type:feature, parallel:no, priority:high, sprint:1

#### Description
**Contexto**
- Backend é stateless e emite JWT + refresh token (spec do front exige refresh).

**Objetivo**
- Validar assinatura Ed25519 do nonce e emitir tokens + profile snapshot.

**Racional (por que isso existe)**
- **Não custódia e não senha:** login é prova criptográfica, não credencial armazenada.
- **UX/continuidade:** refresh token evita quedas durante stake/claim/vote.
- **Compliance:** o JWT carrega KYC/tier/terms/role para gating consistente.

**Escopo**
- Auth endpoints e persistência mínima de refresh (ou mecanismo equivalente).

**Objetivo detalhado**
- `verify(sig, nonce, public_key)` e emitir JWT com KYC/tier/role.
- Emitir refresh token e endpoint de refresh.

**Páginas e Componentes**
- **Módulos/Arquivos:** AuthController/AuthService, JwtService, RefreshTokenStore.

**Padrão de Layout e Cores**
- N/A.

**Validações**
- Nonce existente e não expirado.
- Assinatura válida.
- Bloqueio `WALLET_BLOCKED`.

**API**
- `POST /api/v1/auth/verify` (ou `/api/auth/authenticate`)
- `POST /api/auth/refresh`

**Critérios de Aceite**
- Login retorna tokens + profile.
- Refresh retorna novo access token.

**Detalhes Técnicos (Lint AI)**
- **Endpoints:** 
  - `POST /api/v1/auth/verify` -> Payload: `{ wallet, nonce, signature }`
  - `POST /api/v1/auth/refresh` -> Payload: `{ refresh_token }`
- **Assinatura:** Ed25519 (Stellar SDK).
- **Payload JWT:** `{ sub: wallet, role, kyc_status, exp, iat }`.
- **Tabelas:** `users`, `refresh_tokens` (id, user_id, token, expires_at, revoked).
- **Testes:** `test_verify_ok`, `test_verify_invalid_sig_fails`, `test_refresh_token_ok`.

**Checklist**
- [ ] Verify ok
- [ ] Refresh ok
- [ ] Erros padronizados

**Git (Branch e PR)**
- **Branch:** `feature/BE-2-auth-jwt-refresh`
- **Commits:** `feat(backend): ...`, `fix(backend): ...`, `test(backend): ...`
- **PR:** `develop`
- **Revisor:** 1+

**Dependências**
- **Pode fazer em paralelo?** Não
- **Depende de:** BE-1

---

### #1 - BE-1 - Nonce (Challenge) + Rate limit
- **State:** CLOSED
- **Created at:** 2026-04-18T16:24:40Z
- **Author:** heliocarrara
- **Labels:** area:backend, phase:setup, type:feature, parallel:yes, priority:high, sprint:1

#### Description
**Contexto**
- Autenticação é challenge-response (wallet assina um nonce).

**Objetivo**
- Criar endpoint de nonce com TTL e rate-limit.

**Racional (por que isso existe)**
- **Segurança:** impede replay e reduz superfície de ataque (nonce único e expira).
- **Resiliência:** evita abuso/bot que derruba autenticação.
- **Base do login Web3:** sem nonce, não existe prova criptográfica de posse da wallet.

**Escopo**
- Somente geração/armazenamento de nonce + políticas de abuso.

**Objetivo detalhado**
- Gerar `nonce=random_hex(32)`.
- Persistir com TTL 5min.
- Implementar rate-limit por wallet/IP.

**Páginas e Componentes**
- **Módulos/Arquivos:** AuthController/AuthService (ou equivalente), camada de storage para nonce.

**Padrão de Layout e Cores**
- N/A (backend).

**Validações**
- Wallet format válido.
- Nonce expira e não pode ser reusado.

**API**
- `GET /api/v1/auth/nonce?wallet=...` (ou rota padronizada)

**Critérios de Aceite**
- Retorna nonce com expires_at.
- Rate limit retorna 429.

**Detalhes Técnicos (Lint AI)**
- **Endpoint:** `GET /api/v1/auth/nonce?wallet=G...`
- **Storage:** Tabela `auth_nonces` (campos: `wallet`, `nonce`, `expires_at`). TTL 5 min.
- **Segurança:** Rate-limit de 5 requisições por minuto por IP/Wallet.
- **Validações:** Formato da wallet (Stellar G-address).
- **Testes:** `test_nonce_generation`, `test_nonce_expiration`, `test_rate_limit`.

**Checklist**
- [ ] TTL 5min
- [ ] Rate limit
- [ ] Erros padronizados

**Git (Branch e PR)**
- **Branch:** `feature/BE-1-auth-nonce`
- **Commits:** Conventional Commits (`feat(backend): ...`, `test(backend): ...`)
- **PR:** para `develop`
- **Revisor:** 1+

**Dependências**
- **Pode fazer em paralelo?** Sim
- **Depende de:** nenhuma

---

## Pull Requests

### PR #28 - feat: transaction submission integration
- **State:** MERGED
- **Created at:** 2026-04-23T20:34:19Z
- **Merged at:** 2026-04-23T20:34:25Z
- **Author:** heliocarrara
- **URL:** https://github.com/StakeGood-UFMT/backend/pull/28

#### Description
## Technical Changes
- Created SubmitTransactionDto to handle signed XDR payload.
- Added POST /transactions/submit endpoint in TransactionsController.
- Implemented submit method in TransactionsService with placeholder logic for Stellar network integration.
- Updated TransactionsService.buildPrediction to include a placeholder txHash in the response for frontend tracking.

## Motivation
Enable frontend integration for the end-to-end stake flow by providing a target endpoint for signed transactions.

## Tests performed
- Verified DTO validation using NestJS pipes.
- Manual verification of endpoint response via Postman/local testing.
- Verified successful compilation and startup.

---

### PR #27 - feat(BE-21): Implement Market Details and History Charts
- **State:** MERGED
- **Created at:** 2026-04-23T19:19:41Z
- **Merged at:** 2026-04-23T19:19:50Z
- **Author:** heliocarrara
- **URL:** https://github.com/StakeGood-UFMT/backend/pull/27

#### Description
## Overview
This PR implements the full backend support for the Market Details feature (BE-21/Issue #24). It includes the necessary API endpoints, database schema updates, and real-time integration via WebSockets.

## Key Changes
- **Market Details API**: Added \GET /markets/:id\ returning full details, including images, resolution rules, fees, and real-time prices.
- **Enhanced Seeding**: Updated \seed-db.sql\ to generate 168 hours (7 days) of snapshots for all markets using a 'random walk' algorithm for realistic chart visualization.
- **Refined Logic**: 
    - Safety checks for \impliedProbYes\ calculation.
    - Consistency in snake_case response mapping.
    - Added \ange\ query support (\1D\, \1W\, \ALL\) for history filtering.
- **WebSocket Migration**: Switched from Socket.io to native \WsAdapter\ on the \/ws\ path to perfectly match the frontend's RealtimeService implementation.

## Verification
- Project builds successfully (\
pm run build\).
- WebSocket connection confirmed in logs.
- Seed data correctly populated and visible on charts.

---

### PR #26 - feat: massive seed script and admin promotion
- **State:** MERGED
- **Created at:** 2026-04-23T15:01:15Z
- **Merged at:** 2026-04-23T15:01:23Z
- **Author:** heliocarrara
- **URL:** https://github.com/StakeGood-UFMT/backend/pull/26

#### Description
## Descrição
Este PR adiciona ferramentas essenciais para o desenvolvimento local e testes de integração.

### Mudanças principais:
- **Script de Seed Massivo (scripts/seed-db.sql):** Popula todas as 9 tabelas do banco de dados com dados realistas (Mercados, ONGs, Usuários, Apostas, Histórico de Preços, etc.).
- **Promoção de Admin:** Define a carteira GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4 como administradora global no banco de dados local.
- **Script de Automação (scripts/seed.sh):** Facilita a execução do seed dentro do container Docker com um único comando.

Essas mudanças garantem que o ambiente de desenvolvimento reflita um estado real do produto, permitindo testar fluxos complexos como a Arena de Mercados e o Painel de Admin sem precisar criar dados manualmente.

---

### PR #23 - Fix: Docker Healthcheck and API Documentation
- **State:** MERGED
- **Created at:** 2026-04-23T14:03:36Z
- **Merged at:** 2026-04-23T14:03:43Z
- **Author:** heliocarrara
- **URL:** https://github.com/StakeGood-UFMT/backend/pull/23

#### Description
This PR addresses issues with the Docker environment and adds comprehensive API documentation.

### Changes:
- **Docker & DB Config**:
  - Updated \DB_PORT\ to \5433\ in \.env\ to avoid local port conflicts.
  - Improved \docker-compose.yml\ healthcheck command to specifically check the target database \stakegood_dev\.
- **Documentation**:
  - Created \API_DOCUMENTATION.md\ which lists all available endpoints, request/response formats, and authentication requirements.
  - Documented \/auth\, \/markets\, \/ngos\, \/impact\, and \/transactions\ modules.

### Status:
- Verified that the container starts correctly and health checks pass.
- API documentation reflects the current state of the NestJS controllers.

---

