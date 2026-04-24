# StakeGood SMARTCONTRACT - Issues & PRs Report

## Issues

### #12 - SC-0 - Project Setup (Soroban + Rust)
- **State:** CLOSED
- **Created at:** 2026-04-18T19:30:49Z
- **Author:** heliocarrara
- **Labels:** area:smart-contract, phase:setup, type:chore, priority:high, sprint:1

#### Description
## Contexto
O repositório smartcontract atualmente contém apenas documentação. É necessário inicializar o ambiente de desenvolvimento Soroban.

## Objetivo
Bootstrap do ambiente de desenvolvimento Rust + Soroban CLI.

## Módulos/Arquivos
- Cargo.toml
- contracts/stakegood/src/lib.rs
- Makefile

## Detalhes Técnicos (Lint AI)
- **Environment:** Rust 1.70+, Soroban CLI 20.0.0+
- **Network:** Futurenet (Stellar)
- **Contract Type:** Workspace cargo.

## Plano de implementação (passo a passo)
1. Instalar Rust e target wasm32-unknown-unknown.
2. Executar soroban contract init ..
3. Adicionar o contrato stakegood ao workspace.
4. Configurar bibliotecas necessárias (soroban-sdk).

## Critérios de aceite / Checklist de QA
- [ ] cargo build compila o contrato vazio com sucesso.
- [ ] soroban contract deploy funcional em rede local/futurenet.

---

### #11 - SC-11 - batch_bump_ttl (keeper)
- **State:** CLOSED
- **Created at:** 2026-04-18T16:27:41Z
- **Author:** heliocarrara
- **Labels:** area:smart-contract, phase:setup, type:feature, parallel:yes, priority:medium, sprint:1, sprint:3

#### Description
**Objetivo**
- Estender TTL em lote para múltiplos markets.

**Escopo**
- batch_bump_ttl + comportamento com markets inexistentes.

**Detalhes Técnicos (Lint AI)**
- **Signature:** `pub fn batch_bump_ttl(env: &Env, market_ids: Vec<u64>) -> Result<(), Error>`
- **Auth:** Nenhuma (Permissionless).
- **Invariantes:** `market_ids.len() <= 100`.
- **Lógica:** Chama `env.storage().persistent().extend_ttl(...)` para cada Market e suas chaves associadas.
- **Testes:** `test_batch_bump_ok`, `test_batch_bump_limit_exceeded`.

**Git (Branch e PR)**
- **Branch:** `feature/SC-11-batch-bump-ttl`
- **Commits:** `feat(sc): ...`, `test(sc): ...`
- **PR:** `develop`

**Dependências**
- **Pode fazer em paralelo?** Sim
- **Depende de:** SC-3

---

### #9 - SC-9 - distribute_impact_funds (admin) + Impact Distributed
- **State:** CLOSED
- **Created at:** 2026-04-18T16:27:39Z
- **Author:** heliocarrara
- **Labels:** area:smart-contract, phase:core, type:feature, parallel:no, priority:high, sprint:1, sprint:3

#### Description
## Labels
- ^Grea:smart-contract
- phase:core
- 	ype:feature
- priority:high
- sprint:3

## Contexto
Após a resolução de um mercado e cômputo dos votos, o protocolo deve transferir a taxa acumulada (ee_ngo) para a ONG vencedora e marcar o mercado como finalizado. Simultaneamente, para economizar custos de armazenamento (Rent Recovery), os dados temporários devem ser limpos.

## Objetivo
Implementar a distribuição de fundos de impacto e a limpeza de storage associada.

## Escopo
- Função distribute_impact_funds.
- Transferência de tokens para ONG.
- Remoção definitiva de UserStake, NGOTally e VoteRecord do storage on-chain.

## Plano de implementação (passo a passo)
1. Identificar a ONG vencedora no NGOTally.
2. Transferir o saldo de tokens da conta do mercado para o endereço da ONG.
3. Marcar flag impact_distributed = true.
4. Iterar sobre as chaves de storage (conforme spec) e chamar env.storage().persistent().remove().
5. Emitir evento (Impact, Distributed, market_id, winner_ngo_id, amount).

## Detalhes Técnicos (Lint AI)
- **Signature:** `pub fn distribute_impact_funds(env: &Env, admin: Address, market_id: u64) -> Result<(), Error>`
- **Invariante:** Não permitir redistribuição se já marcado como 	rue.
- **Rent Recovery:** Limpeza agressiva para recuperar XLMs de reserva.

## Critérios de aceite
- ONG vencedora recebe os fundos.
- Dados de votos são removidos (não ocupam mais espaço).
- Mercado bloqueado para nova distribuição.

---

### #8 - SC-8 - cast_philanthropic_vote (quadratic: sqrt credits + v² cost)
- **State:** CLOSED
- **Created at:** 2026-04-18T16:27:39Z
- **Author:** heliocarrara
- **Labels:** area:smart-contract, phase:core, type:feature, parallel:no, priority:high, sprint:1, sprint:2

#### Description
**Objetivo**
- Implementar voto quadrático com credits sqrt e tally por ONG.

**Detalhes Técnicos (Lint AI)**
- **Signature:** `cast_philanthropic_vote(env: &Env, user: Address, market_id: u64, ngo_id: u32, allocated_votes: u32) -> Result<(), Error>`
- **Storage Keys:** `DataKey::NGOTally(market_id, ngo_id)`, `DataKey::UserStake(user, market_id)`.
- **Validações:** 
  - `user.require_auth()`
  - `market.state == STATE_RESOLVED`
  - `stake.outcome == market.winning_outcome`
  - `!stake.has_voted`
  - **Quadratic:** `cost = votes^2`, `credits = floor(sqrt(stake.amount))`. `cost <= credits`.
- **Eventos:** `("Vote", "Cast", market_id, user, ngo_id, quadratic_cost)`
- **Testes:** `test_vote_ok`, `test_vote_insufficient_credits_fails`, `test_vote_not_winner_fails`.

**Eventos/tabelas tocadas**
- **On-chain:** vote flags + tally
- **Eventos:** `("Vote","Cast", allocated_votes, quadratic_cost)`

**Git (Branch e PR)**
- **Branch:** `feature/SC-8-cast-vote`
- **Commits:** `feat(sc): ...`, `test(sc): ...`
- **PR:** `develop`

**Dependências**
- **Pode fazer em paralelo?** Não
- **Depende de:** SC-7

---

### #7 - SC-7 - claim_reward (payout + impact_contribution event)
- **State:** CLOSED
- **Created at:** 2026-04-18T16:27:38Z
- **Author:** heliocarrara
- **Labels:** area:smart-contract, phase:core, type:feature, parallel:no, priority:high, sprint:1, sprint:2

#### Description
**Objetivo**
- Implementar claim pull-model com cálculo de ROI e impacto.

**Eventos/tabelas tocadas**
- **On-chain:** claim flags + token transfer
- **Eventos:** `("Stake","Claimed", payout_total, impact_contribution)`

**Detalhes Técnicos (Lint AI)**
- **Signature:** `claim_reward(env: &Env, user: Address, market_id: u64) -> Result<ClaimPayout, Error>`
- **Storage Keys:** `DataKey::UserStake(user, market_id)`, `DataKey::ClaimFlag(user, market_id)`.
- **Validações:** 
  - `user.require_auth()`
  - `market.state in {STATE_RESOLVED, STATE_CANCELED}`
  - `!claimed`
- **Fórmulas:**
  - `ROI = share * (losing_pool * (100 - fees) / 100)`
  - `impact_contribution = share * (losing_pool * fee_ngo / 100)`
- **Eventos:** `("Stake", "Claimed", market_id, user, payout_total, impact_contribution)`
- **Testes:** `test_claim_winner_ok`, `test_claim_loser_ok`, `test_claim_double_fails`.

**Git (Branch e PR)**
- **Branch:** `feature/SC-7-claim-reward`
- **Commits:** `feat(sc): ...`, `test(sc): ...`
- **PR:** `develop`

**Dependências**
- **Pode fazer em paralelo?** Não
- **Depende de:** SC-6

---

### #6 - SC-6 - resolve_market (oracle.require_auth) + fee_platform
- **State:** CLOSED
- **Created at:** 2026-04-18T16:27:37Z
- **Author:** heliocarrara
- **Labels:** area:smart-contract, phase:core, type:feature, parallel:no, priority:high, sprint:1, sprint:2

#### Description
**Objetivo**
- Resolver market com `oracle.require_auth()` e transferir fee_platform.

**Escopo**
- resolve_market + evento + TTL.

**Eventos/tabelas tocadas**
- **On-chain:** Market state/winning_outcome
- **Eventos:** `("Market","Resolved")`

**Detalhes Técnicos (Lint AI)**
- **Signature:** `resolve_market(env: &Env, oracle: Address, market_id: u64, winning_outcome: u32) -> Result<(), Error>`
- **Storage Keys:** `DataKey::Market(market_id)`.
- **Validações:** 
  - `oracle.require_auth()`
  - `market.oracle == oracle`
  - `market.state == STATE_OPEN`
  - `winning_outcome in {1, 2}`
- **Transferência Imediata:** `fee_platform` calculada sobre o pool perdedor.
- **Eventos:** `("Market", "Resolved", market_id, winning_outcome)`
- **Testes:** `test_resolve_ok`, `test_resolve_unauthorized_fails`, `test_resolve_invalid_outcome_fails`.

**Git (Branch e PR)**
- **Branch:** `feature/SC-6-resolve-market`
- **Commits:** `feat(sc): ...`, `test(sc): ...`
- **PR:** `develop`

**Dependências**
- **Pode fazer em paralelo?** Não
- **Depende de:** SC-5

---

### #5 - SC-5 - place_prediction (stake) + anti-hedge panic
- **State:** CLOSED
- **Created at:** 2026-04-18T16:27:35Z
- **Author:** heliocarrara
- **Labels:** area:smart-contract, phase:core, type:feature, parallel:no, priority:high, sprint:1, sprint:2

#### Description
**Objetivo**
- Implementar stake com token transfer e hedge lock (panic).

**Escopo**
- place_prediction + eventos + TTL.

**Eventos/tabelas tocadas**
- **On-chain:** Market pools; UserStake record
- **Eventos:** `("Stake","Placed")`

**Detalhes Técnicos (Lint AI)**
- **Signature:** `place_prediction(env: &Env, user: Address, market_id: u64, outcome: u32, amount: i128) -> Result<(), Error>`
- **Storage Keys:** `DataKey::UserStake(user, market_id)` (Persistent), `DataKey::Market(market_id)` (Persistent).
- **Validações:** 
  - `user.require_auth()`
  - `market.state == STATE_OPEN`
  - `env.ledger().timestamp() < market.lock_ts`
  - **Hedge Lock:** `if existing_stake.is_some() { assert!(existing_stake.outcome == outcome) }`
- **Eventos:** `("Stake", "Placed", market_id, user, outcome, amount)`
- **Testes:** `test_stake_ok`, `test_stake_different_outcome_fails`, `test_stake_after_lock_fails`.

**Git (Branch e PR)**
- **Branch:** `feature/SC-5-place-prediction`
- **Commits:** `feat(sc): ...`, `test(sc): ...`
- **PR:** `develop`

**Dependências**
- **Pode fazer em paralelo?** Não
- **Depende de:** SC-3

---

### #4 - SC-4 - Event Dictionary v1 (baseline worker)
- **State:** CLOSED
- **Created at:** 2026-04-18T16:27:34Z
- **Author:** heliocarrara
- **Labels:** area:smart-contract, phase:setup, type:chore, parallel:yes, priority:medium, sprint:1

#### Description
## Labels
- ^Grea:smart-contract
- phase:setup
- 	ype:chore
- priority:medium
- sprint:1

## Contexto
O Worker (indexador) depende de topics e payloads estáveis para espelhar o estado da chain no Postgres. Esta issue define o dicionário base de eventos que todas as funções devem emitir.

## Objetivo
Implementar a emissão de eventos padronizados conforme especificação técnica.

## Escopo
- Definição dos tópicos (Symbols).
- Implementação da emissão nas funções de Setup, Market e NGO.

## Dicionário de Eventos (Baseline)
- **NGO Registry:**
    - (NGO, Registered) -> { ngo_id: u32, wallet: Address }
    - (NGO, Deactivated) -> { ngo_id: u32 }
- **Market Lifecycle:**
    - (Market, Created) -> { market_id: u64 }
    - (Market, Locked) -> { market_id: u64 }
    - (Market, Resolved) -> { market_id: u64, winning_outcome: u32 }
    - (Market, Canceled) -> { market_id: u64 }
- **Financial & Activity:**
    - (Stake, Placed) -> { market_id: u64, user: Address, outcome: u32, amount: i128 }
    - (Reward, Claimed) -> { market_id: u64, user: Address, amount: i128 }
    - (Impact, Distributed) -> { market_id: u64, winner_ngo_id: u32, amount: i128 }

## Plano de implementação (passo a passo)
1. Criar struct ou constantes para os tópicos em src/events.rs.
2. Adicionar chamadas env.events().publish(...) nas funções correspondentes em lib.rs.
3. Garantir que os dados emitidos coincidem com o esperado pelo Worker (ver sepcBack.md).

## Critérios de aceite
- Todos os eventos acima são emitidos corretamente nos testes unitários.
- Payloads são consistentes."

---

### #3 - SC-3 - create_market (V3: asset+oracle+fees)
- **State:** CLOSED
- **Created at:** 2026-04-18T16:27:34Z
- **Author:** heliocarrara
- **Labels:** area:smart-contract, phase:core, type:feature, parallel:no, priority:high, sprint:1

#### Description
**Contexto**
- V3: market tem `asset: Address`, `oracle: Address` e fees dinâmicas.

**Objetivo**
- Criar markets com validações e evento.

**Racional (por que isso existe)**
- **Asset-agnostic:** cada mercado define seu token (XLM/USDC/etc.) via contrato do ativo.
- **Fees dinâmicas por mercado:** permite mercados com políticas distintas mantendo on-chain como fonte da verdade.
- **Oracle segregado:** reduz risco operacional e permite oráculos por tipo de mercado.

**Escopo**
- Apenas create_market + persistência do Market struct.

**Objetivo detalhado**
- Validar fees < 100 e lock_ts futuro.
- Persistir pools 0 e state OPEN.

**Eventos/tabelas tocadas**
- **On-chain storage:** `Market(market_id)` persistent
- **Eventos:** `("Market","Created")`

**Detalhes Técnicos (Lint AI)**
- **Signature:** `create_market(env: &Env, admin: Address, market_id: u64, asset: Address, oracle: Address, lock_ts: u64, fee_ngo: u32, fee_platform: u32, fee_gamification: u32) -> Result<(), Error>`
- **Storage Keys:** `DataKey::Market(market_id)` (Persistent).
- **Validações:** 
  - `admin.require_auth()`
  - `fee_ngo + fee_platform + fee_gamification < 100`
  - `lock_ts > env.ledger().timestamp()`
- **Eventos:** `("Market", "Created", market_id)` (Data: `market_id`)
- **Testes:** `test_create_market_ok`, `test_create_market_invalid_fees_fails`, `test_create_market_past_lock_fails`.

**Checklist**
- [ ] fees validation
- [ ] lock_ts validation
- [ ] evento emitido

**Git (Branch e PR)**
- **Branch:** `feature/SC-3-create-market`
- **Commits:** `feat(sc): ...`, `test(sc): ...`
- **PR:** `develop`

**Dependências**
- **Pode fazer em paralelo?** Não
- **Depende de:** SC-1

---

### #2 - SC-2 - NGO Registry (add/remove) + eventos
- **State:** CLOSED
- **Created at:** 2026-04-18T16:27:33Z
- **Author:** heliocarrara
- **Labels:** area:smart-contract, phase:core, type:feature, parallel:no, priority:high, sprint:1

#### Description
**Contexto**
- Registry on-chain de ONGs (Map<u32, Address>).

**Objetivo**
- Implementar whitelist auditável com eventos.

**Racional (por que isso existe)**
- **Segurança/anti-fraude:** votação/distribuição só pode apontar para ONGs aprovadas.
- **Auditabilidade:** registry on-chain + eventos permitem prova pública de elegibilidade.
- **Estabilidade de UI:** frontend/back podem listar ONGs de uma fonte confiável.

**Escopo**
- add/remove (deactivate) com `admin.require_auth()`.

**Objetivo detalhado**
- Validar duplicidade e wallet.
- Emitir eventos padronizados.

**Eventos/tabelas tocadas**
- **On-chain storage:** NGO records / mapping
- **Eventos:** `("NGO","Registered")`, `("NGO","Deactivated")`

**Critérios de Aceite**
- Somente admin altera.
- Eventos emitidos corretamente.

**Detalhes Técnicos (Lint AI)**
- **Signatures:**
  - `add_ngo(env: &Env, admin: Address, ngo_id: u32, wallet: Address) -> Result<(), Error>`
  - `remove_ngo(env: &Env, admin: Address, ngo_id: u32) -> Result<(), Error>`
- **Storage Keys:** `DataKey::NGO(ngo_id)` (Persistent).
- **Validações:** `admin.require_auth()`, `ngo_id` must not exist (for add), must exist (for remove).
- **Eventos:** 
  - `("NGO", "Registered", ngo_id, wallet)`
  - `("NGO", "Deactivated", ngo_id)`
- **Testes:** `test_add_ngo_ok`, `test_add_ngo_unauthorized_fails`, `test_add_ngo_duplicate_fails`.

**Checklist**
- [ ] Auth admin
- [ ] Eventos
- [ ] Idempotência/consistência

**Git (Branch e PR)**
- **Branch:** `feature/SC-2-ngo-registry`
- **Commits:** `feat(sc): ...`, `test(sc): ...`
- **PR:** `develop`

**Dependências**
- **Pode fazer em paralelo?** Não
- **Depende de:** SC-1

---

### #1 - SC-1 - initialize(admin) + storage base
- **State:** CLOSED
- **Created at:** 2026-04-18T16:27:32Z
- **Author:** heliocarrara
- **Labels:** area:smart-contract, phase:setup, type:feature, parallel:yes, priority:high, sprint:1

#### Description
## Contexto
Toda lógica do protocolo depende de um administrador inicial configurado no deploy.

## Objetivo
Implementar a função initialize para persistir o admin e estruturas base.

## Módulos/Arquivos
- contracts/stakegood/src/lib.rs
- contracts/stakegood/src/storage.rs

## Detalhes Técnicos (Lint AI)
- **Signature:** `pub fn initialize(env: &Env, admin: Address) -> Result<(), Error>`
- **Storage Keys:** DataKey::Admin (Instance Storage).
- **Invariantes:** Impedir re-inicialização (env.storage().instance().has(...)).

## Plano de implementação (passo a passo)
1. Definir o enum DataKey para chaves de storage.
2. Implementar initialize verificando se o Admin já existe.
3. Gravar o ^Gdmin Address no storage de instância.
4. Inicializar mapas vazios se necessário para mercados e ONGs.

## Critérios de aceite / Checklist de QA
- [ ] Teste unitário verifica que admin foi gravado.
- [ ] Teste unitário garante que chamar initialize duas vezes retorna erro.

---

## Pull Requests

### PR #22 - Issue04
- **State:** MERGED
- **Created at:** 2026-04-23T14:15:52Z
- **Merged at:** 2026-04-23T22:02:04Z
- **Author:** davicf400
- **URL:** https://github.com/StakeGood-UFMT/smartcontract/pull/22

#### Description
adiicionei os eventos

---

### PR #21 - Issue011
- **State:** MERGED
- **Created at:** 2026-04-23T13:38:57Z
- **Merged at:** 2026-04-23T22:02:06Z
- **Author:** davicf400
- **URL:** https://github.com/StakeGood-UFMT/smartcontract/pull/21

#### Description
Este PR introduz a funcionalidade de renovação de aluguel de armazenamento (State Expiration / TTL) em lote para os mercados. A função permite que administradores ou bots de manutenção prolonguem a vida útil de múltiplos mercados ativos simultaneamente, garantindo que os dados não sejam arquivados pela rede Stellar. A implementação foi desenhada com foco em segurança de execução e otimização de limites de Gas.

Closes #11

🏗️ Mudanças Realizadas
Implementação Principal (admin.rs / Utilitários):

Criação da função batch_bump_ttl recebendo um vetor de IDs (Vec<u64>).

Definição dos parâmetros de threshold (100.000 ledgers) e extend_to (518.400 ledgers / ~30 dias).

Segurança e Invariantes:

Trava de proteção de Gas: Limite máximo de 100 mercados por chamada, retornando o novo erro LimitExceeded caso ultrapassado.

Resiliência de execução: A função lida graciosamente com mercados inexistentes (usando has()), ignorando-os sem causar panic no contrato, permitindo que a renovação em lote continue para os IDs válidos.

Testes Unitários (bump_ttl_tests):

test_batch_bump_ok: Valida a extensão bem-sucedida e o comportamento de tolerância a IDs inválidos na mesma chamada.

test_batch_bump_limit_exceeded: Garante que a trava de limite de 100 itens bloqueia transações abusivas.

✅ Checklist
[x] O código compila sem erros ou warnings.

[x] A proteção contra vetores massivos de inputs está ativa e testada.

[x] O macro customizado vec! do Soroban foi importado e utilizado corretamente.

[x] Todos os testes unitários passaram localmente (cargo test).

[x] Os snapshots do estado da rede (JSON) foram atualizados e commitados.

---

### PR #20 - Issue09
- **State:** MERGED
- **Created at:** 2026-04-23T12:16:38Z
- **Merged at:** 2026-04-23T22:02:06Z
- **Author:** davicf400
- **URL:** https://github.com/StakeGood-UFMT/smartcontract/pull/20

#### Description
Este PR finaliza o ciclo de vida do contrato inteligente implementando a liquidação do mercado filantrópico (distribute_impact_funds). A função permite que a plataforma repasse a fração do pool perdedor diretamente para a carteira da ONG que venceu a votação quadrática. Além disso, implementa rotinas de segurança de estado e otimização de custos operacionais (gas/rent) na rede Stellar.

Closes #9

🏗️ Mudanças Realizadas
Implementação Financeira (admin.rs / Gateway):

Criação da função de distribuição de fundos roteada e protegida por admin.require_auth().

Cálculo dinâmico da taxa da ONG sobre o Losing Pool e transferência via token::Client.

Segurança de Estado (types.rs):

Adição da flag impact_distributed à struct Market para travar o mercado definitivamente e impedir ataques de Double Spend (saque duplo do Admin).

Criação de novos tratamentos de erro (AlreadyDistributed, MarketNotFinished).

Otimização de Custos (Rent Recovery):

Exclusão proativa de chaves de estado que não são mais necessárias (env.storage().persistent().remove), como a urna NGOTally, liberando espaço on-chain e recuperando XLMs de aluguel da rede para o contrato.

Eventos: Publicação do evento on-chain ("Impact", "Dist") com os dados do repasse.

Testes Unitários (distribute_tests):

test_distribute_ok: Valida a transferência exata, a trava do mercado e a deleção dos dados (Critérios de Aceite).

test_distribute_twice_fails: Garante que o contrato recusa uma segunda tentativa de distribuição.

test_distribute_not_resolved_fails: Garante que a distribuição não pode ocorrer antes da resolução do mercado.

✅ Checklist
[x] O código compila sem erros.

[x] A transferência de tokens funciona corretamente para a carteira da ONG.

[x] O Rent Recovery está funcionando e os dados obsoletos são excluídos.

[x] Todos os novos testes unitários passaram localmente.

[x] Os snapshots do estado da rede (JSON) foram atualizados e commitados.

---

### PR #19 - feat(08): implementação de voto quadrático otimizado para doações
- **State:** MERGED
- **Created at:** 2026-04-22T21:15:02Z
- **Merged at:** 2026-04-23T22:02:06Z
- **Author:** davicf400
- **URL:** https://github.com/StakeGood-UFMT/smartcontract/pull/19

#### Description
Este PR introduz o mecanismo de governança filantrópica finalizando o ciclo do dApp. Os usuários vencedores agora podem alocar "créditos de impacto" para as ONGs cadastradas utilizando Voto Quadrático (Quadratic Voting). A implementação foca em altíssima eficiência de Gas (WASM) ao refatorar a fórmula matemática para evitar o custo computacional de raízes quadradas on-chain.

Closes #8
 Mudanças Realizadas
Governança & Votos (stake.rs):Criação da função cast_philanthropic_vote roteada no Gateway
.Otimização Matemática (Gas Saving): Substituição da verificação tradicional $cost \le \sqrt{amount}$ pela equação equivalente e nativa $votes^4 \le amount$, economizando processamento no Soroban.
Storage & Estado (types.rs):Adição da flag booleana has_voted na struct UserStake para evitar múltiplos votos fragmentados da mesma carteira.
Criação da chave Datakey::NGOTally para atuar como urna descentralizada, acumulando os votos recebidos por cada ONG.
Novos retornos de erro semânticos: CanNotVote, AlreadyVoted, InsufficientCredits
.Eventos: * Publicação do evento ("Vote", "Cast") contendo os dados de rastreio de auditoria (quem votou, em quem, e o custo quadrático cobrado).
Testes Unitários (vote_tests):Cobertura do caminho feliz (test_vote_ok) garantindo a precisão da matemática $x^4$.
Cobertura de limites de saldo (test_vote_insufficient_credits_fails).
Cobertura de regras de negócio (test_vote_not_winner_fails).
Proteção contra ataques de repetição e governança (test_vote_twice_fails).
✅ Checklist
[x] O código compila sem erros.
[x] O fluxo foi protegido contra re-votos e acesso não autorizado de perdedores.[
x] Todos os novos testes unitários passaram localmente.[
x] Os snapshots do estado da rede (JSON) foram atualizados e commitados.

---

### PR #18 - feat(07): implementação do claim_reward com cálculo de ROI e impacto
- **State:** MERGED
- **Created at:** 2026-04-22T20:23:02Z
- **Merged at:** 2026-04-23T22:02:06Z
- **Author:** davicf400
- **URL:** https://github.com/StakeGood-UFMT/smartcontract/pull/18

#### Description
Este PR introduz a funcionalidade final do ciclo de vida do mercado: o saque de recompensas (claim_reward). A arquitetura utiliza o modelo pull-based (o usuário solicita o saque), garantindo maior segurança contra ataques de reentrada e falhas de execução em lote. Além do prêmio, o contrato agora calcula dinamicamente o ROI líquido do usuário e a sua contribuição de impacto para a ONG.

Closes #7

🏗️ Mudanças Realizadas
Implementação Principal (stake.rs):

Criação da função claim_reward roteada via API Gateway (lib.rs).

Matemática Segura: Cálculo de fração (Share) utilizando a regra de "multiplicar antes de dividir" para evitar perda de precisão e arredondamento a zero no WASM.

Cálculo dinâmico do payout_total (Aposta + ROI sobre o pool perdedor líquido de taxas).

Cálculo proporcional da impact_contribution (Fração da taxa da ONG gerada por este usuário específico).

Segurança & Storage (types.rs):

Criação da chave de estado Datakey::ClaimFlag para registrar saques e bloquear ataques de Double Spend (saque duplo).

Adição de novos mapeamentos de erro (AlreadyClaimed, MarketNotFinished, NoStakeFound).

Atualização inteligente de estado: Perdedores também recebem a ClaimFlag após a primeira tentativa, retornando 0 e economizando processamento futuro.

Eventos: Emissão do evento ("Stake", "Claimed") contendo os dados contábeis vitais para a indexação no Front-end/Backend.

Testes Unitários:

test_claim_winner_ok: Valida matemática exata de ROI e impacto.

test_claim_loser_ok: Valida o fluxo de perdedores recebendo 0 e sendo marcados.

test_claim_double_fails: Blinda o contrato contra tentativas de saque múltiplo da mesma carteira.

✅ Checklist
[x] O código compila sem erros ou warnings.

[x] A nova matemática financeira foi testada com valores determinísticos.

[x] A trava de Double Spend está coberta por testes.

[x] Todos os testes passaram localmente (cargo test).

[x] Os snapshots de teste JSON foram gerados e incluídos no commit.

---

### PR #17 - feat(06): refatoração arquitetural e implementação do resolve_market
- **State:** MERGED
- **Created at:** 2026-04-22T19:04:32Z
- **Merged at:** 2026-04-23T22:02:06Z
- **Author:** davicf400
- **URL:** https://github.com/StakeGood-UFMT/smartcontract/pull/17

#### Description
Este PR implementa a funcionalidade de resolução de mercados (resolve_market), incluindo o cálculo e a transferência da taxa da plataforma (fee_platform) sobre o pool perdedor. Além disso, introduz uma refatoração arquitetural crítica para escalar o contrato inteligente.

Closes #6

🏗️ Mudanças Realizadas
Refatoração de Arquitetura (Routing Pattern): O arquivo monolítico ngo.rs foi desmembrado. A lógica foi dividida por domínio nos novos arquivos admin.rs, market.rs e stake.rs.

Gateway (lib.rs): Atualizado para atuar apenas como roteador das chamadas Soroban para os respectivos módulos internos.

Implementação do resolve_market:

Validação de autorização do Oráculo (oracle.require_auth()).

Cálculo dinâmico da taxa da plataforma baseada no pool perdedor (BPS).

Transferência automática dos fundos de taxa para a carteira admin.

Atualização de status e winning_outcome, com persistência (.set()) e extensão de TTL no Ledger.

Testes Unitários:

Criação do ambiente isolado setup_resolve_test.

Adicionados os testes exigidos: test_resolve_ok, test_resolve_unauthorized_fails e test_resolve_invalid_outcome_fails.

Correção da tipagem da v2 (StellarAssetContract vs Address) nos mocks de token.

✅ Checklist
[x] O código compila sem erros ou warnings.

[x] A nova função possui testes automatizados cobrindo os caminhos felizes e de erro.

[x] Todos os testes passaram localmente (cargo test).

[x] Os snapshots de teste JSON foram gerados e incluídos no commit.

---

### PR #16 - Issue05
- **State:** MERGED
- **Created at:** 2026-04-21T18:03:01Z
- **Merged at:** 2026-04-23T22:02:06Z
- **Author:** davicf400
- **URL:** https://github.com/StakeGood-UFMT/smartcontract/pull/16

#### Description
*No description provided.*

---

### PR #15 - Issue03
- **State:** MERGED
- **Created at:** 2026-04-20T04:56:02Z
- **Merged at:** 2026-04-23T22:01:33Z
- **Author:** davicf400
- **URL:** https://github.com/StakeGood-UFMT/smartcontract/pull/15

#### Description
*No description provided.*

---

### PR #14 - Feature2
- **State:** MERGED
- **Created at:** 2026-04-20T02:57:02Z
- **Merged at:** 2026-04-23T22:00:47Z
- **Author:** davicf400
- **URL:** https://github.com/StakeGood-UFMT/smartcontract/pull/14

#### Description
*No description provided.*

---

### PR #13 - issue 1 resolved
- **State:** MERGED
- **Created at:** 2026-04-20T01:48:10Z
- **Merged at:** 2026-04-23T22:00:00Z
- **Author:** davicf400
- **URL:** https://github.com/StakeGood-UFMT/smartcontract/pull/13

#### Description
*No description provided.*

---

