# 🏗️ Arquitetura do Sistema: StakeGood Backend

Este documento descreve a estrutura lógica, as regras de negócio e o modelo de dados do **StakeGood Backend**, que atua como um **Orquestrador de Confiança** para o ecossistema de mercados preditivos e filantropia na rede Stellar.

---

## 1. Filosofia e Objetivos

Diferente de sistemas tradicionais, esta API opera sob um modelo de **não-custódia**. Suas três missões principais são:

1.  **Fronteira de Conformidade:** Impedir que usuários sem KYC ou que excederam limites legais interajam com o contrato inteligente.
2.  **Espelhamento On-Chain (Worker):** Indexar eventos da Stellar com latência zero para permitir consultas rápidas (milissegundos) via banco de dados local.
3.  **Motor de Inteligência:** Calcular probabilidades epistêmicas e orquestrar o Voto Quadrático para a distribuição de fundos às ONGs.



---

## 2. Padrões de Design e Arquitetura Lógica

### 2.1 CQRS (Command Query Responsibility Segregation)
A arquitetura separa estritamente as operações de leitura e escrita:
* **Leitura (Queries):** Consome exclusivamente o banco PostgreSQL. Nenhuma rota `GET` faz requisições diretas à rede Stellar em tempo real, garantindo alta performance e escalabilidade.
* **Escrita (Commands):** Valida a intenção do usuário e constrói o envelope **XDR (External Data Representation)** para que o usuário assine localmente via wallet.

### 2.2 Stateless Absolute
A API utiliza **JWT (JSON Web Tokens)** assinados para autenticação. 
* O payload contém a chave pública e o nível de verificação de identidade (KYC). 
* Não há persistência de sessão em memória (Redis/RAM) para autenticação, facilitando o escalonamento horizontal.

---

## 3. Regras de Negócio Críticas

### 3.1 Autenticação Criptográfica (Challenge-Response)
O sistema não utiliza senhas convencionais. O fluxo de segurança segue:
1.  `GET /auth/nonce`: A API gera um código aleatório (nonce).
2.  `POST /auth/verify`: O usuário assina o nonce com sua chave privada (via Freighter/Albedo). A API valida a assinatura contra a chave pública informada.

### 3.2 Prevenção de Fraude no Frontend (XDR Builders)
**Regra de Ouro:** O frontend nunca constrói a transação final.
A API recebe a "intenção", valida os parâmetros (decimais, limites e KYC) e gera o envelope binário Base64. Isso impede que usuários mal-intencionados alterem valores da aposta manipulando o código do navegador.

### 3.3 Trava de Gastos (Anti-Vício)
Implementação de uma **Rolling Window de 30 dias**. Antes de cada `build-transaction`, a API verifica o volume de depósitos no mês atual. Se o montante exceder o teto regulatório, a transação é abortada antes mesmo de chegar à rede Stellar.

---

## 4. Mapeamento de Endpoints (REST API)

### Domínio: Autenticação & Compliance
| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/v1/auth/nonce` | Gera desafio aleatório para a carteira. |
| `POST` | `/api/v1/auth/verify` | Valida assinatura e emite JWT + Status KYC. |
| `POST` | `/api/v1/auth/kyc/webhook` | Recebe atualizações de biometria (ex: SumSub). |

### Domínio: Mercados & Inteligência
| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/v1/markets` | Lista mercados com probabilidades calculadas on-the-fly. |
| `GET` | `/api/v1/markets/{id}/history` | Séries temporais para gráficos de tendência. |
| `POST` | `/api/v1/transactions/build-prediction` | Constrói XDR para apostas (após checks de segurança). |

### Domínio: Impacto Social & ONGs
| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/v1/ngos` | Diretório de ONGs com filtros de causa e verificação. |
| `GET` | `/api/v1/impact/ledger` | Feed global de distribuição de capital social. |
| `POST` | `/api/v1/impact/ledger/export` | Job assíncrono para exportação de dados (PDF/CSV). |

---

## 5. Modelo de Dados (PostgreSQL)

### Núcleo de Identidade
* **users:** `id, primary_wallet, role, kyc_status, kyc_tier, public_visibility, private_mode`.
* **user_wallets:** `id, user_id, wallet_address, network, is_primary`.
* **kyc_profiles:** `id, user_id, provider_id, status, aml_flags (jsonb)`.

### Mercados e Posições
* **markets:** `id, title, status, lock_at, asset_code, asset_issuer, oracle_ref`.
* **market_snapshots:** `id, market_id, timestamp, yes_pool, no_pool, implied_prob`.
* **user_positions:** `id, user_id, market_id, outcome, amount_staked, status`.

### Impacto e Governança
* **ngos:** `id, name, slug, verified, wallet_address, total_funds_received`.
* **impact_ledger_entries:** `id, date, market_id, ngo_id, amount, tx_hash, source`.
* **votes:** `id, market_id, user_id, total_credits_spent, tx_hash`.

---

## 6. Sincronização em Tempo Real (WebSocket)

O servidor mantém um canal aberto para eventos de **UI Otimista**:
* `tx_confirmed` / `tx_failed`: Atualiza o status de processamento da transação após detecção pelo Worker.
* `market_resolved`: Notifica ganhadores instantaneamente sobre o resultado de um mercado.
* `notification_created`: Alerta de novas mensagens ou avisos de conformidade.

---

## 7. QA & Testes Obrigatórios

1.  **Idempotência do Worker:** Testar se a API processa eventos duplicados da rede Stellar (deve ignorar eventos já indexados).
2.  **Barreira de Limite:** Validar se o sistema bloqueia apostas que excedem o limite de 30 dias com erro `HTTP 403 Forbidden`.
3.  **Spoofing Test:** Tentar autenticar com uma assinatura de chave privada diferente da chave pública informada no payload.
4.  **Odds Test:** Garantir que o cálculo de probabilidade implícita segue a fórmula:

$$P_{yes} = \frac{Pool_{yes}}{Pool_{yes} + Pool_{no}}$$

---