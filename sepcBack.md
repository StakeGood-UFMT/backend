# 🏗️ Especificação Técnica: StakeGood Backend

**Versão:** 1.0.0  
**Status:** Em Desenvolvimento  
**Última Atualização:** Abril 2026  
**Escopo:** Orquestrador de Confiança para Mercados Preditivos + Filantropia (Stellar)

---

## 📋 Índice

1. [Visão Geral](#1-visão-geral)
2. [Filosofia & Princípios](#2-filosofia--princípios)
3. [Arquitetura & Padrões](#3-arquitetura--padrões)
4. [Regras de Negócio](#4-regras-de-negócio)
5. [API REST - Endpoints](#5-api-rest---endpoints)
6. [Modelo de Dados](#6-modelo-de-dados)
7. [Fluxos Críticos](#7-fluxos-críticos)
8. [Sincronização em Tempo Real](#8-sincronização-em-tempo-real)
9. [Segurança & Conformidade](#9-segurança--conformidade)
10. [Testes & QA](#10-testes--qa)
11. [Roadmap de Desenvolvimento](#11-roadmap-de-desenvolvimento)

---

## 1. Visão Geral

### Missão
Atuar como **Orquestrador de Confiança** centralizado em um ecossistema descentralizado, operando sob modelo de **não-custódia** onde:
- ✅ A API **valida** mas não **armazena** fundos
- ✅ Usuários assinam transações localmente (via wallet)
- ✅ Blockchain é source-of-truth

### Três Pilares Operacionais

| Pilar | Responsabilidade | Impacto |
|:---:|:---|:---|
| **Conformidade** | Barreira KYC / Limites regulatórios | Previne fraude & lavagem de dinheiro |
| **Espelhamento On-Chain** | Worker indexa Stellar → PostgreSQL | Queries rápidas (ms) vs Chain (s) |
| **Inteligência** | Probabilidades epistêmicas + Voto Quadrático | Distribui capital para ONGs otimalmente |

### Stack Tecnológico
```
Backend: Node.js / Express (ou similar)
Database: PostgreSQL + Indexação
Blockchain: Stellar (XDR Transactions)
Auth: JWT + Criptografia (Ed25519)
Real-time: WebSocket
External: SumSub (KYC), Freighter/Albedo (Wallets)
```

---

## 2. Filosofia & Princípios

### 2.1 Não-Custódia Absoluta
- 🔒 A API **nunca** detém chaves privadas
- 🔒 Cada transação é assinada pelo usuário localmente
- 🔒 Servidor apenas valida e orquestra

**Benefício:** Impossível para hacker roubar fundos mesmo comprometendo o servidor.

### 2.2 Stateless & Escalável Horizontalmente
- Sem persistência de sessão em RAM
- JWT auto-contido com validade
- N réplicas podem servir simultaneamente

### 2.3 Transparência Criptográfica
- Assinatura digital = Prova criptográfica de intenção
- Impossível negar uma ação após assinatura
- Auditoria completa em blockchain

---

## 3. Arquitetura & Padrões

### 3.1 CQRS (Command Query Responsibility Segregation)

#### Queries (Leitura)
```
GET /api/v1/* → PostgreSQL (sempre)
↓
Resposta em ms (cache-friendly)
```
**Características:**
- ✓ Cache seguro (dados imutáveis)
- ✓ Escalável (leitura é barata)
- ✓ Replicação fácil (read-only replicas)
- ✓ Nenhuma blockchain call em GET

#### Commands (Escrita)
```
POST /api/v1/transactions/build-* → Validação → XDR
↓
Usuário assina (local) → Retorna ao frontend
↓
Frontend envia ao Stellar → Worker indexa
```
**Características:**
- ✓ Validação prévia rigorosa
- ✓ XDR é construído pelo backend (não frontend)
- ✓ Assinatura = Responsabilidade do usuário
- ✓ Blockchain é single source-of-truth

### 3.2 Autenticação Stateless (JWT + Challenge-Response)

```
┌──────────────────────────────────────────────────────────┐
│ FLUXO: Challenge-Response com Carteira                   │
└──────────────────────────────────────────────────────────┘

1. Cliente solicita desafio
   GET /api/v1/auth/nonce
   ↓
   API gera: nonce = random_hex(32)
   Armazena em cache (TTL 5min)
   ↓
   Response: { nonce: "abc123...", expires_at: "..." }

2. Cliente assina com chave privada
   Usuário abre carteira (Freighter/Albedo)
   Assina: signature = sign(nonce, private_key)
   ↓
   POST /api/v1/auth/verify
   Body: { wallet: "G...", nonce: "abc123...", signature: "..." }

3. API valida assinatura
   Recupera público_key do payload
   Valida: verify(signature, nonce, public_key) ✓
   ↓
   Consulta KYC status (DB)
   ↓
   Emite JWT:
   {
     "iss": "stakegood-api",
     "sub": "wallet_address",
     "iat": 1234567890,
     "exp": 1234654290,
     "wallet": "G...",
     "kyc_status": "verified|pending|rejected",
     "kyc_tier": "individual|business",
     "role": "user|moderator|admin"
   }

4. Cliente armazena JWT + usa em Headers
   Authorization: Bearer eyJhbGc...
```

**Por quê não passwords?**
- ✗ Carteira é a identidade na Stellar
- ✗ Chave privada ≠ É transmitida
- ✗ Assinatura = Prova criptográfica

### 3.3 Worker Pattern (Sincronização On-Chain)

```
┌─────────────────────────────────────────────────────────┐
│ WORKER: Stellar → PostgreSQL (Listener)                 │
└─────────────────────────────────────────────────────────┘

Stellar Network
  ↓ (Transações, Operações)
  ↓ Horizon API (WebSocket)
  ↓
Worker Node.js
  ├─ Parse XDR
  ├─ Validar assinatura
  ├─ Deduplica (idempotência)
  ├─ Atualiza state
  └─ Notifica clientes (WebSocket)
     ↓
  PostgreSQL
     ↓
  Clients recebem notificação
  "Sua aposta foi confirmada!"
```

**Garantias:**
- ✓ Cada evento indexado uma única vez
- ✓ Latência < 5s (vs 10s+ de polling)
- ✓ Pronto para 1000+ transações/seg

---

## 4. Regras de Negócio

### 4.1 Autenticação Criptográfica

**Fluxo em 4 passos:**

| Etapa | O que acontece | Validação |
|:---:|:---|:---|
| **1. Nonce** | API gera desafio único | TTL 5min, stored in cache |
| **2. Sign** | Usuário assina com carteira | Envolve private key (nunca transmitida) |
| **3. Verify** | API valida assinatura | `verify(sig, nonce, public_key)` ✓ |
| **4. JWT** | Emite token seguro | Contém KYC status + wallet |

**Codes de Erro:**
```
❌ 400: Nonce inválido/expirado
❌ 401: Assinatura falsa
❌ 403: Usuário bloqueado (KYC rejected)
❌ 429: Rate-limit (muitas tentativas)
```

### 4.2 Prevenção de Fraude no Frontend (XDR Builders)

**Princípio:** O frontend **nunca** constrói a transação final.

```
┌─ Cenário Malicioso ─────────────────────────┐
│ Hacker manipula JavaScript no browser       │
│ Altera valor de aposta 10 → 10,000          │
│ Envia tx assinada para blockchain           │
└─────────────────────────────────────────────┘

SOLUÇÃO: API constrói o XDR
  ↓
Frontend recebe XDR base64 (sem poder alterá-lo)
  ↓
Usuário assina localmente (sem ver detalhes)
  ↓
Resultado: TX com valores corretos ✓
```

**Implementação:**

```javascript
// ❌ ERRADO (Frontend constrói)
let tx = new TransactionBuilder(source)
  .addOperation(Operation.manageOffer({
    selling: asset,
    buying: USDC,
    amount: "10000",  // ← Hacker alterou aqui!
    price: "1"
  }))
  .build();

// ✅ CORRETO (Backend constrói)
POST /api/v1/transactions/build-prediction
Body: {
  market_id: "mkr_123",
  outcome: "YES",
  amount: "10"
}
↓
Response: {
  xdr: "AAAA...",  // Base64, imutável
  summary: {
    action: "place_prediction",
    outcome: "YES",
    amount: "10 USDC",
    market: "Will BTC reach $100k?"
  }
}
```

### 4.3 Trava de Gastos (Anti-Vício) - Rolling Window 30d

**Regra:** Limite máximo de depósitos em 30 dias corridos.

```
┌─ Verificação pré-transação ────────────────┐
│ Antes de build-transaction:                │
│ 1. Pega data de hoje                       │
│ 2. Lookback 30 dias                        │
│ 3. Soma depósitos confirmados              │
│ 4. Compara com limite regulatório           │
│ 5. Se excede → HTTP 403 (abortado)         │
└────────────────────────────────────────────┘
```

**Exemplo:**

```
Limite: US$ 5,000 / 30 dias
Hoje: 20/04/2026
Lookback window: 21/03/2026 → 20/04/2026

Depósitos nesse período:
  - 25/03: $1,000
  - 05/04: $2,000
  - 18/04: $1,500
  ────────────────
  Total: $4,500

Novo depósito: $1,000?
  $4,500 + $1,000 = $5,500 > $5,000 ✗
  Resposta: HTTP 403 Forbidden
  {"error": "Spending limit exceeded", "remaining": "$500"}
```

**Campos do Schema:**
```sql
-- users table
ALTER TABLE users ADD COLUMN (
  spending_limit_usd DECIMAL(10,2) DEFAULT 5000,
  spending_window_days INT DEFAULT 30
);

-- Query: total gasto nos últimos 30 dias
SELECT SUM(amount) 
FROM deposits 
WHERE user_id = $1 
  AND created_at >= NOW() - INTERVAL '30 days'
  AND status = 'confirmed';
```

**Códigos de erro:**
```
✓ 200: Transação validada
✗ 403: Spending limit exceeded
✗ 400: Limite não configurado (erro interno)
```

### 4.4 KYC Status & Acesso

| KYC Status | Pode apostar? | Limites | Observações |
|:---|:---:|:---|:---|
| `pending` | ❌ | - | Aguardando verificação |
| `verified` | ✅ | Completo | Identidade confirmada |
| `rejected` | ❌ | - | Bloqueado (suspeita) |
| `expired` | ❌ | - | Precisa renovar |

**Validação em cada POST:**
```javascript
if (user.kyc_status !== 'verified') {
  return res.status(403).json({
    error: 'KYC_REQUIRED',
    redirect_to: '/kyc/verify',
    kyc_status: user.kyc_status
  });
}
```

---

## 5. API REST - Endpoints

### 5.1 Domínio: Autenticação & Compliance

#### `GET /api/v1/auth/nonce`
**Descrição:** Gera desafio aleatório para a carteira.

```yaml
Requisição:
  GET /api/v1/auth/nonce?wallet=G1234...

Resposta (200 OK):
  {
    "nonce": "a7f3d9e2c1b4a8f0...",
    "expires_at": "2026-04-18T14:35:00Z",
    "ttl_seconds": 300
  }

Erros:
  400: Wallet inválida
  429: Too many requests
```

---

#### `POST /api/v1/auth/verify`
**Descrição:** Valida assinatura e emite JWT + Status KYC.

```yaml
Requisição:
  POST /api/v1/auth/verify
  Content-Type: application/json

  {
    "wallet": "GAAAA...",
    "nonce": "a7f3d9e2c1b4a8f0...",
    "signature": "base64_encoded_signature"
  }

Resposta (200 OK):
  {
    "jwt": "eyJhbGc...",
    "wallet": "GAAAA...",
    "kyc_status": "verified",
    "kyc_tier": "individual",
    "expires_in": 86400,
    "user": {
      "id": "usr_abc123",
      "primary_wallet": "GAAAA...",
      "role": "user",
      "public_visibility": true
    }
  }

Erros:
  400: Nonce inválido
  401: Assinatura falsa
  403: Usuário bloqueado
  429: Rate limit (max 5 tentativas/min por wallet)
```

---

#### `POST /api/v1/auth/kyc/webhook`
**Descrição:** Recebe atualizações de KYC de SumSub.

```yaml
Requisição:
  POST /api/v1/auth/kyc/webhook
  Content-Type: application/json
  X-Signature: hmac_sha256(body, secret)

  {
    "externalUserId": "user_abc123",
    "review": {
      "reviewStatus": "approved",
      "createdAt": "2026-04-18T10:00:00Z"
    },
    "applicant": {
      "id": "appl_xyz",
      "email": "user@example.com"
    }
  }

Resposta (200 OK):
  { "status": "processed" }

Ações internas:
  - Atualiza kyc_profiles.status = "approved"
  - Atualiza users.kyc_status = "verified"
  - Emite notificação WebSocket ao usuário
  - Desbloqueia acesso à plataforma
```

---

### 5.2 Domínio: Mercados & Inteligência

#### `GET /api/v1/markets`
**Descrição:** Lista mercados com probabilidades calculadas on-the-fly.

```yaml
Requisição:
  GET /api/v1/markets?status=active&limit=20&offset=0

Query Parameters:
  - status: "active" | "locked" | "resolved" (default: all)
  - category: "climate" | "social" | "health" | "finance" (default: all)
  - limit: 1-100 (default: 20)
  - offset: 0+ (default: 0)
  - sort: "newest" | "trending" | "liquidity" (default: newest)

Resposta (200 OK):
  {
    "markets": [
      {
        "id": "mkr_001",
        "title": "Will global CO2 emissions decrease by 2027?",
        "description": "Based on IEA data...",
        "status": "active",
        "category": "climate",
        "oracle_ref": "IEA_CO2_2027",
        "lock_at": "2026-12-31T23:59:59Z",
        "resolve_at": "2027-01-15T23:59:59Z",
        "asset": {
          "code": "USDC",
          "issuer": "GBUQWP3BOUZX34LOCALNET22222222222222222222222222222F"
        },
        "pools": {
          "yes": "50000.00",
          "no": "30000.00",
          "total": "80000.00"
        },
        "implied_probability": {
          "yes": 0.625,  // 50k / (50k + 30k)
          "no": 0.375,
          "calculated_at": "2026-04-18T14:00:00Z"
        },
        "trading_volume_24h": "5000.00",
        "volume_trending": "up",
        "participants": 342,
        "created_at": "2026-01-01T00:00:00Z"
      }
      // ... mais mercados
    ],
    "pagination": {
      "total": 145,
      "limit": 20,
      "offset": 0,
      "has_next": true
    }
  }

Erros:
  400: Parâmetro inválido
  401: Sem autenticação
```

---

#### `GET /api/v1/markets/{id}/history`
**Descrição:** Séries temporais para gráficos de tendência.

```yaml
Requisição:
  GET /api/v1/markets/mkr_001/history?interval=1h&days=7

Query Parameters:
  - interval: "5m" | "15m" | "1h" | "1d" (default: 1h)
  - days: 1-365 (default: 7)

Resposta (200 OK):
  {
    "market_id": "mkr_001",
    "title": "Will global CO2 emissions decrease by 2027?",
    "snapshots": [
      {
        "timestamp": "2026-04-11T00:00:00Z",
        "yes_pool": "45000.00",
        "no_pool": "28000.00",
        "yes_probability": 0.616,
        "trading_volume": "1200.00"
      },
      {
        "timestamp": "2026-04-12T00:00:00Z",
        "yes_pool": "48000.00",
        "no_pool": "29000.00",
        "yes_probability": 0.623,
        "trading_volume": "3000.00"
      }
      // ... mais snapshots
    ]
  }

Erros:
  404: Mercado não encontrado
  400: Intervalo inválido
```

---

#### `POST /api/v1/transactions/build-prediction`
**Descrição:** Constrói XDR para apostas (após checks de segurança).

```yaml
Requisição:
  POST /api/v1/transactions/build-prediction
  Authorization: Bearer <JWT>
  Content-Type: application/json

  {
    "market_id": "mkr_001",
    "outcome": "YES",
    "amount": "100.50"
  }

Headers obrigatórios:
  - Authorization: Bearer eyJhbGc...
  - Content-Type: application/json

Validações internas:
  1. Usuário tem JWT válido? (401 se não)
  2. KYC status = "verified"? (403 se não)
  3. Spending limit não excedido? (403 se sim)
  4. Mercado existe e está ativo? (404 / 400 se não)
  5. Outcome é "YES" ou "NO"? (400 se não)
  6. Amount é positivo? (400 se não)

Resposta (200 OK):
  {
    "xdr": "AAAAAgAAAABLiHV8GX+/Tpo+...",
    "summary": {
      "action": "place_prediction",
      "market": {
        "id": "mkr_001",
        "title": "Will global CO2 emissions decrease by 2027?"
      },
      "outcome": "YES",
      "amount": "100.50 USDC",
      "implied_odds": "1.60",  // payout múltiplo se ganhar
      "potential_win": "160.80 USDC"
    },
    "instructions": [
      "1. Open your Stellar wallet (Freighter/Albedo)",
      "2. Sign the transaction below",
      "3. Copy the signature and submit",
      "4. Your prediction will be live in seconds!"
    ]
  }

Erros:
  400: Parâmetro inválido (outcome, amount)
  401: Sem JWT válido
  403: KYC não verificado | Spending limit exceeded
  404: Mercado não encontrado
  409: Mercado já finalizado
```

---

### 5.3 Domínio: Impacto Social & ONGs

#### `GET /api/v1/ngos`
**Descrição:** Diretório de ONGs com filtros de causa e verificação.

```yaml
Requisição:
  GET /api/v1/ngos?category=climate&verified=true&limit=20

Query Parameters:
  - category: "climate" | "health" | "education" | "poverty" (default: all)
  - verified: true | false (default: all)
  - limit: 1-100 (default: 20)
  - offset: 0+ (default: 0)
  - sort: "trending" | "oldest" | "alphabetical" (default: trending)

Resposta (200 OK):
  {
    "ngos": [
      {
        "id": "ngo_001",
        "name": "Greenpeace Brasil",
        "slug": "greenpeace-brasil",
        "category": "climate",
        "description": "Organização de defesa ambiental...",
        "verified": true,
        "verification_date": "2025-06-01T00:00:00Z",
        "wallet_address": "GNGOPNG123...",
        "website": "https://greenpeace.org.br",
        "impact_metrics": {
          "total_funds_received": "250000.00",
          "donor_count": 342,
          "projects_funded": 12,
          "estimated_impact": "500 ton CO2 reduced"
        },
        "social": {
          "instagram": "@greenpeace_br",
          "twitter": "@greenpeace_br"
        }
      }
      // ... mais ONGs
    ],
    "pagination": {
      "total": 87,
      "limit": 20,
      "offset": 0,
      "has_next": true
    }
  }

Erros:
  400: Parâmetro inválido
```

---

#### `GET /api/v1/impact/ledger`
**Descrição:** Feed global de distribuição de capital social.

```yaml
Requisição:
  GET /api/v1/impact/ledger?from=2026-04-01&to=2026-04-18&limit=50

Query Parameters:
  - from: ISO8601 date (default: 30 dias atrás)
  - to: ISO8601 date (default: hoje)
  - ngo_id: filtra por ONG específica
  - limit: 1-100 (default: 50)
  - offset: 0+ (default: 0)

Resposta (200 OK):
  {
    "ledger_entries": [
      {
        "id": "led_abc123",
        "date": "2026-04-18T10:30:00Z",
        "market": {
          "id": "mkr_001",
          "title": "Will global CO2 emissions decrease by 2027?"
        },
        "ngo": {
          "id": "ngo_001",
          "name": "Greenpeace Brasil",
          "slug": "greenpeace-brasil"
        },
        "amount": "2500.50",
        "currency": "USDC",
        "source": "quadratic_voting",  // quadratic_voting | donation | grant
        "tx_hash": "f1c3f7d8a4b2e1c9...",
        "breakdown": {
          "base_allocation": "1000.00",
          "quadratic_boost": "1500.50"
        }
      }
      // ... mais entradas
    ],
    "pagination": {
      "total": 342,
      "limit": 50,
      "offset": 0,
      "has_next": true
    },
    "summary": {
      "period": {
        "from": "2026-04-01T00:00:00Z",
        "to": "2026-04-18T23:59:59Z"
      },
      "total_distributed": "125000.00",
      "transaction_count": 342,
      "unique_ngos": 47
    }
  }

Erros:
  400: Data inválida
```

---

#### `POST /api/v1/impact/ledger/export`
**Descrição:** Job assíncrono para exportação de dados (PDF/CSV).

```yaml
Requisição:
  POST /api/v1/impact/ledger/export
  Authorization: Bearer <JWT>
  Content-Type: application/json

  {
    "format": "csv",  // "csv" | "pdf"
    "from": "2026-01-01",
    "to": "2026-04-18",
    "include_breakdown": true
  }

Resposta (202 Accepted):
  {
    "job_id": "job_xyz789",
    "status": "queued",
    "format": "csv",
    "estimated_ready_at": "2026-04-18T14:15:00Z",
    "download_url": null,
    "check_status_url": "/api/v1/impact/ledger/export/job_xyz789"
  }

Polling para resultado:
  GET /api/v1/impact/ledger/export/job_xyz789
  ↓
  Resposta (200 OK):
  {
    "job_id": "job_xyz789",
    "status": "ready",  // queued | processing | ready | failed
    "format": "csv",
    "download_url": "https://cdn.stakegood.io/exports/job_xyz789/ledger.csv",
    "expires_at": "2026-04-25T14:15:00Z"
  }

Erros:
  401: Sem JWT
  400: Parâmetro inválido
  429: Muitos jobs simultâneos
```

---

## 6. Modelo de Dados

### 6.1 Núcleo de Identidade

```sql
-- Usuários
CREATE TABLE users (
  id UUID PRIMARY KEY,
  primary_wallet VARCHAR(56) NOT NULL UNIQUE,  -- Stellar address
  role ENUM('user', 'moderator', 'admin') DEFAULT 'user',
  kyc_status ENUM('pending', 'verified', 'rejected', 'expired') DEFAULT 'pending',
  kyc_tier ENUM('individual', 'business') DEFAULT 'individual',
  public_visibility BOOLEAN DEFAULT true,  -- Perfil visível publicamente?
  private_mode BOOLEAN DEFAULT false,  -- Ocultar transações?
  spending_limit_usd DECIMAL(10,2) DEFAULT 5000.00,
  spending_window_days INT DEFAULT 30,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP  -- Soft delete
);

CREATE INDEX idx_users_primary_wallet ON users(primary_wallet);
CREATE INDEX idx_users_kyc_status ON users(kyc_status);

-- Carteiras secundárias (um usuário pode ter N carteiras)
CREATE TABLE user_wallets (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wallet_address VARCHAR(56) NOT NULL UNIQUE,
  network ENUM('mainnet', 'testnet', 'publicnet') DEFAULT 'mainnet',
  is_primary BOOLEAN DEFAULT false,
  label VARCHAR(100),  -- "MetaMask 1", "Cold Storage", etc
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_wallets_user_id ON user_wallets(user_id);
CREATE INDEX idx_user_wallets_wallet ON user_wallets(wallet_address);

-- Perfis KYC (integração SumSub)
CREATE TABLE kyc_profiles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  provider_id VARCHAR(100) NOT NULL,  -- SumSub applicant ID
  status ENUM('pending', 'approved', 'rejected', 'expired') DEFAULT 'pending',
  verified_at TIMESTAMP,
  aml_flags JSONB DEFAULT '{}',  -- {"country_risk": "high", ...}
  raw_data JSONB,  -- Dados brutos do SumSub (criptografado em produção)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_kyc_profiles_user_id ON kyc_profiles(user_id);
CREATE INDEX idx_kyc_profiles_status ON kyc_profiles(status);
```

### 6.2 Mercados e Posições

```sql
-- Mercados (Prediction Markets)
CREATE TABLE markets (
  id UUID PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  category VARCHAR(50),  -- climate, health, finance, social, etc
  status ENUM('draft', 'active', 'locked', 'resolved') DEFAULT 'draft',
  lock_at TIMESTAMP NOT NULL,  -- Quando fecha apostas?
  resolve_at TIMESTAMP NOT NULL,  -- Quando resolve?
  outcome ENUM('YES', 'NO') DEFAULT NULL,  -- NULL até resolução
  oracle_ref VARCHAR(200),  -- Referência da fonte oracular (IEA_CO2_2027, etc)
  asset_code VARCHAR(12),  -- USDC, USD, etc
  asset_issuer VARCHAR(56),  -- Stellar issuer pubkey
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_markets_status ON markets(status);
CREATE INDEX idx_markets_category ON markets(category);
CREATE INDEX idx_markets_lock_at ON markets(lock_at);

-- Snapshots de pools (para cálculo de probabilidades)
CREATE TABLE market_snapshots (
  id UUID PRIMARY KEY,
  market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
  timestamp TIMESTAMP NOT NULL,
  yes_pool DECIMAL(18,8) NOT NULL,  -- Montante total apostado em YES
  no_pool DECIMAL(18,8) NOT NULL,
  implied_prob_yes NUMERIC(5,4) GENERATED ALWAYS AS (
    yes_pool / (yes_pool + no_pool)
  ) STORED,
  trading_volume DECIMAL(18,8),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_market_snapshots_market_time ON market_snapshots(market_id, timestamp DESC);
CREATE INDEX idx_market_snapshots_timestamp ON market_snapshots(timestamp DESC);

-- Posições de usuários (apostas)
CREATE TABLE user_positions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
  outcome ENUM('YES', 'NO') NOT NULL,
  amount_staked DECIMAL(18,8) NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled', 'resolved', 'claimed') DEFAULT 'pending',
  tx_hash VARCHAR(64),  -- Hash da transação Stellar
  resolved_at TIMESTAMP,
  payout_amount DECIMAL(18,8),  -- NULL até resolução
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_positions_user_market ON user_positions(user_id, market_id);
CREATE INDEX idx_user_positions_status ON user_positions(status);
CREATE INDEX idx_user_positions_tx_hash ON user_positions(tx_hash);
```

### 6.3 Impacto e Governança

```sql
-- Diretório de ONGs
CREATE TABLE ngos (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(50),  -- climate, health, education, poverty, etc
  verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMP,
  verified_by UUID REFERENCES users(id),
  wallet_address VARCHAR(56) NOT NULL UNIQUE,  -- Stellar pubkey
  website VARCHAR(500),
  social JSONB DEFAULT '{}',  -- {instagram: "@...", twitter: "@...", ...}
  impact_metrics JSONB DEFAULT '{}',  -- {projects: 12, beneficiaries: 1000, ...}
  total_funds_received DECIMAL(18,8) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ngos_slug ON ngos(slug);
CREATE INDEX idx_ngos_verified ON ngos(verified);
CREATE INDEX idx_ngos_category ON ngos(category);

-- Ledger de impacto (distribuição de fundos)
CREATE TABLE impact_ledger_entries (
  id UUID PRIMARY KEY,
  date TIMESTAMP NOT NULL,
  market_id UUID REFERENCES markets(id),
  ngo_id UUID NOT NULL REFERENCES ngos(id) ON DELETE CASCADE,
  amount DECIMAL(18,8) NOT NULL,
  currency VARCHAR(12) DEFAULT 'USDC',
  source ENUM('quadratic_voting', 'donation', 'grant', 'fee_pool') DEFAULT 'quadratic_voting',
  tx_hash VARCHAR(64),  -- Transação no Stellar
  breakdown JSONB,  -- {base_allocation: X, quadratic_boost: Y, ...}
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_impact_ledger_date ON impact_ledger_entries(date DESC);
CREATE INDEX idx_impact_ledger_ngo ON impact_ledger_entries(ngo_id);
CREATE INDEX idx_impact_ledger_source ON impact_ledger_entries(source);

-- Votos (Quadratic Voting)
CREATE TABLE votes (
  id UUID PRIMARY KEY,
  market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_credits_spent DECIMAL(18,8) NOT NULL,
  ngo_allocations JSONB NOT NULL,  -- {ngo_id: credits_spent, ...}
  tx_hash VARCHAR(64),
  status ENUM('pending', 'confirmed', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(market_id, user_id)
);

CREATE INDEX idx_votes_market ON votes(market_id);
CREATE INDEX idx_votes_user ON votes(user_id);
CREATE INDEX idx_votes_status ON votes(status);
```

### 6.4 Transações & Auditoria

```sql
-- Nonces (Challenge-Response)
CREATE TABLE auth_nonces (
  id UUID PRIMARY KEY,
  wallet_address VARCHAR(56) NOT NULL,
  nonce VARCHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,  -- NULL se não usado ainda
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_auth_nonces_expires ON auth_nonces(expires_at);
CREATE INDEX idx_auth_nonces_wallet ON auth_nonces(wallet_address);

-- Depósitos (rastreamento para spending limits)
CREATE TABLE deposits (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(18,8) NOT NULL,
  currency VARCHAR(12) DEFAULT 'USDC',
  tx_hash VARCHAR(64) NOT NULL UNIQUE,
  status ENUM('pending', 'confirmed', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  confirmed_at TIMESTAMP
);

CREATE INDEX idx_deposits_user_created ON deposits(user_id, created_at DESC);
CREATE INDEX idx_deposits_status ON deposits(status);

-- Auditoria geral
CREATE TABLE audit_log (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,  -- auth_verify, build_transaction, kyc_updated, etc
  resource_type VARCHAR(50),  -- market, position, ngo, user, etc
  resource_id VARCHAR(100),
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  status ENUM('success', 'failure') DEFAULT 'success',
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_timestamp ON audit_log(created_at DESC);
```

---

## 7. Fluxos Críticos

### 7.1 Fluxo: Autenticação (Challenge-Response)

```
┌─────────────────────────────────────────────────────────────┐
│ AUTENTICAÇÃO: Challenge-Response com Carteira Stellar       │
└─────────────────────────────────────────────────────────────┘

PASSO 1: Cliente solicita Nonce
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GET /api/v1/auth/nonce?wallet=GAAAA...

API:
├─ Valida formato da wallet (valid Stellar address?)
├─ Gera random hex string (32 bytes)
├─ Armazena em cache com TTL 5min
└─ Responde com nonce + expiration

Response:
{
  "nonce": "a7f3d9e2c1b4a8f0d5e2c9b6a3f7e4c1...",
  "expires_at": "2026-04-18T14:35:00Z"
}

PASSO 2: Cliente assina Nonce
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Usuario abre carteira (Freighter/Albedo)
└─ Seleciona "Sign message"
   ├─ Message: "a7f3d9e2c1b4a8f0d5e2c9b6a3f7e4c1..."
   └─ Sistema assina com private_key
      └─ Resultado: base64_signature

Frontend:
POST /api/v1/auth/verify
{
  "wallet": "GAAAA...",
  "nonce": "a7f3d9e2c1b4a8f0d5e2c9b6a3f7e4c1...",
  "signature": "base64_encoded_signature"
}

PASSO 3: API Valida Assinatura
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Servidor:
├─ Recupera nonce do cache
├─ Verifica se ainda válido (< 5min)
├─ Extrai public_key do wallet address
├─ Valida: nacl.sign.open(signature, nonce, public_key)
│  └─ ✓ Se OK → assinatura é legítima
│  └─ ✗ Se FALHA → 401 Unauthorized
├─ Consulta users.kyc_status
└─ Emite JWT

Response (200 OK):
{
  "jwt": "eyJhbGciOiJFZDI1NTE5IiwidHlwIjoiSldUIn0...",
  "wallet": "GAAAA...",
  "kyc_status": "verified",
  "kyc_tier": "individual",
  "expires_in": 86400
}

PASSO 4: Cliente usa JWT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Frontend armazena JWT em localStorage/sessionStorage
Usa em todas requisições:
GET /api/v1/markets
├─ Header: Authorization: Bearer eyJhbGc...
└─ API valida JWT (signature + expiration)
   ├─ ✓ OK → Retorna dados
   ├─ ✗ Expirado → 401 (fazer novo auth)
   └─ ✗ Inválido → 401 (fazer novo auth)

```

**Código de Exemplo (Backend):**

```javascript
// auth.controller.js
async function getNonce(req, res) {
  const { wallet } = req.query;
  
  // Validar formato Stellar
  if (!StrKey.isValidPublicKey(wallet)) {
    return res.status(400).json({ error: 'Invalid wallet' });
  }
  
  // Gerar nonce
  const nonce = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  
  // Armazenar em cache (Redis)
  await cache.set(`nonce:${wallet}`, nonce, 300); // TTL 5min
  
  res.json({
    nonce,
    expires_at: expiresAt.toISOString(),
    ttl_seconds: 300
  });
}

async function verify(req, res) {
  const { wallet, nonce, signature } = req.body;
  
  // 1. Validar nonce
  const cachedNonce = await cache.get(`nonce:${wallet}`);
  if (!cachedNonce || cachedNonce !== nonce) {
    return res.status(400).json({ error: 'Invalid nonce' });
  }
  
  // 2. Validar assinatura
  try {
    const publicKey = StrKey.decodeEd25519PublicKey(wallet);
    const signatureBuffer = Buffer.from(signature, 'base64');
    const nonceBuffer = Buffer.from(nonce, 'hex');
    
    // Usar libsodium/nacl
    nacl.sign.open(signatureBuffer, publicKey);
  } catch (e) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // 3. Consultar usuário & KYC
  const user = await User.findOne({ primary_wallet: wallet });
  if (!user) {
    // Criar novo usuário
    user = await User.create({
      primary_wallet: wallet,
      kyc_status: 'pending'
    });
  }
  
  // 4. Emitir JWT
  const jwt = JwtService.sign({
    sub: wallet,
    kyc_status: user.kyc_status,
    kyc_tier: user.kyc_tier,
    role: user.role
  }, { expiresIn: '24h' });
  
  // 5. Limpar nonce (usar apenas uma vez)
  await cache.delete(`nonce:${wallet}`);
  
  res.json({
    jwt,
    wallet,
    kyc_status: user.kyc_status,
    expires_in: 86400
  });
}
```

---

### 7.2 Fluxo: Colocar Aposta (Place Prediction)

```
┌─────────────────────────────────────────────────────────────┐
│ COLOCAR APOSTA: Construção de XDR + Assinatura              │
└─────────────────────────────────────────────────────────────┘

ETAPA 1: Frontend requisita XDR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POST /api/v1/transactions/build-prediction
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "market_id": "mkr_001",
  "outcome": "YES",
  "amount": "100.50"
}

ETAPA 2: Backend valida & constrói XDR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Servidor executa validações:

✓ JWT válido? → OK
✓ KYC status = "verified"? → OK
✓ Spending limit não excedido? → OK
  └─ Query: SUM(deposits.amount) WHERE user_id = X 
       AND created_at >= NOW() - INTERVAL '30 days'
  └─ Total < limite? → OK
✓ Mercado existe? → OK
✓ Mercado está "active"? → OK
✓ Agora < lock_at? → OK
✓ Outcome é YES ou NO? → OK
✓ Amount > 0? → OK

Cálculos:
├─ Recupera yes_pool e no_pool do market_snapshots
├─ Calcula implied_probability = yes_pool / (yes_pool + no_pool)
├─ Calcula payout_multiplier = (yes_pool + amount) / amount
└─ Calcula potential_win = amount * payout_multiplier

Construir XDR:
├─ Source account = StakeGood master account
├─ Fee = 100 stroops
├─ Sequence number = +1
├─ TimeoutBounds = (0, lock_at)
├─ Operation = ManageOffer
│  ├─ selling: amount USDC
│  ├─ buying: market_id_YES (custom trustline)
│  └─ price: 1/(payout_multiplier)
└─ Resultado: tx_envelope_xdr

Response (200 OK):
{
  "xdr": "AAAAAgAAAABLiHV8GX+/Tpo+...",
  "summary": {
    "action": "place_prediction",
    "market": {
      "id": "mkr_001",
      "title": "Will CO2 emissions decrease by 2027?"
    },
    "outcome": "YES",
    "amount": "100.50 USDC",
    "implied_probability": "0.625",
    "implied_odds": "1.60",
    "potential_win": "160.80 USDC"
  }
}

ETAPA 3: Frontend apresenta resumo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UI mostra:
┌─────────────────────────────────────────┐
│ Confirmação de Aposta                   │
├─────────────────────────────────────────┤
│ Mercado:                                │
│ "Will CO2 emissions decrease by 2027?"  │
│                                         │
│ Sua aposta: YES                         │
│ Montante: 100.50 USDC                   │
│ Probabilidade implícita: 62.5%          │
│ Odds: 1.60                              │
│ Ganho potencial: 160.80 USDC            │
│                                         │
│ [Abrir Carteira e Assinar]              │
└─────────────────────────────────────────┘

ETAPA 4: Usuário assina com carteira
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Clica botão "Abrir Carteira"
  └─ Abre Freighter/Albedo
     ├─ Mostra XDR (binary)
     ├─ Usuário revisa (ou não)
     ├─ Confirma operação
     └─ Retorna signature ao navegador

Frontend obtém:
{
  "signature": "base64_signature_from_wallet",
  "tx_envelope": "AAAAAgAAAABLiHV8GX+..."
}

ETAPA 5: Frontend submete tx ao Stellar
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Frontend envia direto à Horizon API (Stellar):
POST https://horizon.stellar.org/transactions
Content-Type: application/x-www-form-urlencoded

tx=AAAAAgAAAABLiHV8GX+/Tpo+...

Respostas possíveis:
✓ 200 OK: Transação enfileirada
  └─ Retorna hash + link para acompanhamento
✗ 400: Erro no envelope (bad sequence, bad fee, etc)
✗ 500: Stellar network error

Response (sucesso):
{
  "hash": "f1c3f7d8a4b2e1c9...",
  "envelope_xdr": "...",
  "_links": {
    "transaction": "https://horizon.stellar.org/transactions/f1c3f7d8..."
  }
}

ETAPA 6: Worker indexa transação
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Worker monitora Stellar:
  └─ Detecta novo ManageOffer em ledger X
     ├─ Parse XDR
     ├─ Extrai: user wallet, amount, outcome
     ├─ Valida assinatura
     ├─ Deduplica: já indexou esse tx? (idempotência)
     ├─ Cria entry em user_positions
     │  └─ status = "confirmed"
     ├─ Atualiza market_snapshots (novos pools)
     └─ Emite WebSocket ao cliente

WebSocket evento:
{
  "type": "position_confirmed",
  "position": {
    "id": "pos_xyz",
    "market_id": "mkr_001",
    "outcome": "YES",
    "amount": "100.50",
    "tx_hash": "f1c3f7d8a4b2e1c9...",
    "status": "confirmed"
  }
}

ETAPA 7: Frontend atualiza UI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mostra notificação:
┌─────────────────────────────────────────┐
│ ✓ Aposta confirmada!                   │
├─────────────────────────────────────────┤
│ Hash: f1c3f7d8a4b2e1c9...              │
│ Status: Confirmada em ledger 12345     │
│ Ganho potencial: 160.80 USDC           │
│                                        │
│ [Ver Detalhes] [Voltar]                │
└─────────────────────────────────────────┘

```

---

### 7.3 Fluxo: Resolver Mercado (Resolve Market)

```
┌─────────────────────────────────────────────────────────────┐
│ RESOLVER MERCADO: Determinação de resultado + Distribuição  │
└─────────────────────────────────────────────────────────────┘

GATILHO: Data de resolução atingida

ETAPA 1: Oracle alimenta dado
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Fonte externa (IEA, Reuters, etc) publica resultado
API recebe via webhook seguro (HMAC):
POST /api/v1/internal/oracle/resolve
X-Signature: hmac_sha256(body, secret)

{
  "market_id": "mkr_001",
  "outcome": "YES",
  "source_url": "https://iea.org/...",
  "timestamp": "2027-01-15T23:59:59Z",
  "confidence": 0.99
}

Validações:
├─ HMAC assinatura válida?
├─ Market existe e status = "active"?
├─ Oracle é registrado (whitelist)?
└─ Data é >= resolve_at?

ETAPA 2: Processar resolução
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Banco de dados:
├─ UPDATE markets SET outcome = 'YES', status = 'resolved'
├─ Para cada position em user_positions:
│  ├─ Se outcome MATCHER: status = "resolved" (ganhou!)
│  └─ Se outcome NÃO MATCH: status = "resolved" (perdeu)
├─ Calcular pool de prêmios
├─ Distribuir entre ganhadores (pro-rata)
└─ Registrar em impact_ledger_entries (Voto Quadrático → ONGs)

Cálculo de Payout:
pool_total = sum(all_positions_amount)
ganhadores = positions WHERE outcome = "YES"
total_ganho = sum(ganhadores.amount)

Para cada ganhador:
  payout = (position.amount / total_ganho) * pool_total

Exemplo:
┌─────────────────────────────┐
│ Market: CO2 emissions       │
│ Resultado: YES              │
├─────────────────────────────┤
│ Posições YES:               │
│ - Alice: 100 USDC           │
│ - Bob: 200 USDC             │
│ - Carol: 100 USDC           │
│ Total YES: 400 USDC         │
│                             │
│ Posições NO:                │
│ - David: 300 USDC           │
│ - Eve: 200 USDC             │
│ Total NO: 500 USDC          │
│                             │
│ Pool total: 900 USDC        │
├─────────────────────────────┤
│ Pagamentos:                 │
│ Alice: (100/400) * 900      │
│        = 225 USDC ✓         │
│ Bob: (200/400) * 900        │
│      = 450 USDC ✓           │
│ Carol: (100/400) * 900      │
│        = 225 USDC ✓         │
│                             │
│ David: 0 ✗                  │
│ Eve: 0 ✗                    │
└─────────────────────────────┘

ETAPA 3: Quadratic Voting para ONGs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Baseado em market.category, distribuir % para ONGs

Fórmula Quadratic Voting:
cost_i = votes_i^2
alocação_i = sqrt(votes_i)

Exemplo:
┌─────────────────────────────────┐
│ Market category: climate        │
│ Total impacto: 900 USDC         │
├─────────────────────────────────┤
│ % por categoria:                │
│ 70% → ONGs de clima             │
│ 20% → ONGs de educação          │
│ 10% → Fundo geral               │
├─────────────────────────────────┤
│ Para ONGs de clima:             │
│ Total = 900 * 0.70 = 630 USDC   │
│                                 │
│ Quadratic votes:                │
│ Greenpeace: 2 votes             │
│ WWF: 3 votes                    │
│ The Nature Conservancy: 1 vote  │
│                                 │
│ Custos:                         │
│ Greenpeace: 2^2 = 4 créditos    │
│ WWF: 3^2 = 9 créditos           │
│ The Nature: 1^2 = 1 crédito     │
│ Total: 14 créditos              │
│                                 │
│ Alocações:                      │
│ Greenpeace: (2 credits) * (630/14 per credit)
│            = 90 USDC            │
│ WWF: (3 credits) * (630/14)     │
│      = 135 USDC                 │
│ The Nature: (1 credit) * (630/14)
│            = 45 USDC            │
│ Total: 270 USDC                 │
└─────────────────────────────────┘

Inserir em impact_ledger_entries:
INSERT INTO impact_ledger_entries (date, market_id, ngo_id, amount, source, breakdown)
VALUES
  ('2027-01-15', 'mkr_001', 'ngo_greenpeace', 90, 'quadratic_voting', '{"base": 90}'),
  ('2027-01-15', 'mkr_001', 'ngo_wwf', 135, 'quadratic_voting', '{"base": 135}'),
  ('2027-01-15', 'mkr_001', 'ngo_nature', 45, 'quadratic_voting', '{"base": 45}');

ETAPA 4: Notificar stakeholders
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WebSocket evento a todos os clientes subscribed:
{
  "type": "market_resolved",
  "market_id": "mkr_001",
  "outcome": "YES",
  "resolved_at": "2027-01-15T23:59:59Z",
  "distributions": {
    "to_winners": 900,
    "to_ngos": 630,
    "platform_fee": 170
  }
}

Email a ganhadores:
Subject: Parabéns! Sua aposta em "CO2 emissions" foi vencedora!
Body:
  - Ganho: 225 USDC
  - Sua predição estava correta
  - Link para reivindicar

ETAPA 5: Ganhador reclama prêmio
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POST /api/v1/positions/{position_id}/claim
Authorization: Bearer <JWT>

API:
├─ Verifica se position.user_id = JWT.sub
├─ Verifica se position.status = "resolved"
├─ Constrói XDR para payout
└─ Retorna para assinatura (igual ao fluxo de aposta)

Frontend:
├─ Abre carteira
├─ Assina transação
└─ Envia ao Stellar

Worker:
├─ Detecta PaymentOp
├─ Atualiza position.status = "claimed"
└─ Notifica usuário

```

---

## 8. Sincronização em Tempo Real

### 8.1 WebSocket Events

O servidor mantém canais abertos para atualizações instantâneas:

```javascript
// Cliente
const ws = new WebSocket('wss://api.stakegood.io/ws');

ws.addEventListener('message', (event) => {
  const { type, data } = JSON.parse(event.data);
  
  switch (type) {
    case 'tx_confirmed':
      // { position_id, tx_hash, status }
      updateUI(data);
      break;
    
    case 'tx_failed':
      // { position_id, error }
      showError(data);
      break;
    
    case 'market_resolved':
      // { market_id, outcome, timestamp }
      notifyMarketResolved(data);
      break;
    
    case 'notification_created':
      // { id, type, title, message }
      addNotification(data);
      break;
  }
});
```

### 8.2 Eventos Principais

| Evento | Payload | Gatilho | Quem recebe |
|:---|:---|:---|:---|
| `tx_confirmed` | `{position_id, tx_hash}` | Worker indexa tx no Stellar | Usuário dono da posição |
| `tx_failed` | `{position_id, error}` | Transação rejeitada na rede | Usuário dono |
| `market_resolved` | `{market_id, outcome}` | Oracle resolve mercado | Todos subscribed ao mercado |
| `notification_created` | `{id, type, title}` | Novos avisos (KYC, limite, etc) | Usuário específico |
| `market_snapshot_updated` | `{market_id, pools, probability}` | Nova aposta confirmada | Subscribed ao mercado |

---

## 9. Segurança & Conformidade

### 9.1 Checkpoints de Validação

```
┌──────────────────────────────────────────────────────────────┐
│ REQUEST PIPELINE: Camadas de Validação                       │
└──────────────────────────────────────────────────────────────┘

1. AUTENTICAÇÃO
   ├─ JWT presente?
   ├─ Assinatura JWT válida?
   └─ Expirado?
   
2. AUTORIZAÇÃO
   ├─ User role >= recurso requerido?
   ├─ Ownership check (user_id do JWT = recurso.user_id)?
   └─ KYC status = verified?

3. RATE LIMITING
   ├─ IP: 100 req/min
   ├─ JWT (user): 500 req/min
   └─ Per-endpoint: customizado

4. INPUT VALIDATION
   ├─ Tipo? (string, number, enum)
   ├─ Tamanho? (max length)
   ├─ Formato? (regex, Stellar address)
   └─ Range? (min/max)

5. BUSINESS LOGIC
   ├─ Spending limit OK?
   ├─ Mercado ativo?
   ├─ Outcome válido?
   └─ Nonce válido?

6. LOGGING & AUDITORIA
   ├─ User action: audit_log
   ├─ IP + user agent
   └─ Success/failure + erro

```

### 9.2 KYC / AML

**Integração SumSub:**

```
┌─────────────────────────────────┐
│ Usuário clica "Verificar KYC"   │
│                                 │
├─────────────────────────────────┤
│ 1. Backend cria ApplicantID     │
│    POST /api/v1/auth/kyc/init   │
│    ← Returns SumSub access token│
│                                 │
│ 2. Frontend abre SDK SumSub     │
│    Usuário faz selfie + doc     │
│                                 │
│ 3. SumSub processa              │
│    (liveness check, OCR, etc)   │
│                                 │
│ 4. SumSub envia webhook         │
│    POST /api/v1/auth/kyc/webhook│
│    {                            │
│      externalUserId: "...",     │
│      review: { status: "approved" }
│    }                            │
│                                 │
│ 5. Backend atualiza             │
│    users.kyc_status = "verified"│
│    ← Acesso desbloqueado        │
└─────────────────────────────────┘
```

### 9.3 Conformidade Regulatória

**Regiões suportadas / Bloqueadas:**

```yaml
Allowed:
  - Brasil
  - Portugal
  - Moçambique
  - Singapura
  - Suíça
  - EU (com restrições)

Blocked:
  - EUA (OFAC list)
  - Irã, N. Coréia
  - Lista PEP (Pessoas Politicamente Expostas)
  - Jurisdições com crypto ban

Aml_flags:
  - country_risk: high | medium | low
  - age: < 18 (bloqueado)
  - pep_match: true (investigar)
  - sanctions_match: true (bloqueado)
```

---

## 10. Testes & QA

### 10.1 Testes Obrigatórios

#### 1. Idempotência do Worker

```javascript
/**
 * Teste: Worker processa evento duplicado sem efeito colateral
 */
it('should idempotently process duplicate Stellar events', async () => {
  const event = {
    type: 'transaction',
    hash: 'f1c3f7d8a4b2e1c9...',
    operations: [/* ... */]
  };
  
  // Processar primeira vez
  await worker.process(event);
  const position1 = await Position.findOne({ tx_hash: 'f1c3f7d8...' });
  expect(position1.status).toBe('confirmed');
  
  // Processar novamente (duplicado)
  await worker.process(event);
  const position2 = await Position.findOne({ tx_hash: 'f1c3f7d8...' });
  
  // Deve ser a mesma, não duplicar
  expect(position1.id).toBe(position2.id);
  expect(await Position.count({ tx_hash: 'f1c3f7d8...' })).toBe(1);
});
```

#### 2. Barreira de Limite

```javascript
/**
 * Teste: Sistema bloqueia apostas que excedem limite 30d
 */
it('should reject bet exceeding 30-day spending limit', async () => {
  const user = await User.create({
    primary_wallet: 'GTEST...',
    spending_limit_usd: 5000
  });
  
  // Depositar $4,500
  await Deposit.create({
    user_id: user.id,
    amount: 4500,
    status: 'confirmed',
    created_at: new Date()
  });
  
  // Tentar apostar $1,000 (total seria $5,500)
  const response = await request(app)
    .post('/api/v1/transactions/build-prediction')
    .set('Authorization', `Bearer ${jwt}`)
    .send({
      market_id: 'mkr_001',
      outcome: 'YES',
      amount: '1000'
    });
  
  expect(response.status).toBe(403);
  expect(response.body.error).toBe('SPENDING_LIMIT_EXCEEDED');
});
```

#### 3. Spoofing Test

```javascript
/**
 * Teste: Rejeita assinatura com chave privada diferente
 */
it('should reject verification with wrong signature', async () => {
  const nonce = 'a7f3d9e2c1b4a8f0...';
  const wallet = 'GAAAA...';
  
  // Gerar segundo keypair (diferente)
  const { publicKey: fakePublicKey, secretKey: fakeSecretKey } = generateKeyPair();
  
  // Assinar com fake key
  const fakeSignature = sign(nonce, fakeSecretKey);
  
  const response = await request(app)
    .post('/api/v1/auth/verify')
    .send({
      wallet,
      nonce,
      signature: fakeSignature
    });
  
  expect(response.status).toBe(401);
  expect(response.body.error).toBe('INVALID_SIGNATURE');
});
```

#### 4. Odds Calculation Test

```javascript
/**
 * Teste: Probabilidade implícita segue fórmula corretamente
 */
it('should calculate implied probability correctly', async () => {
  const market = await Market.create({
    title: 'Test market',
    status: 'active'
  });
  
  // Criar snapshot
  await MarketSnapshot.create({
    market_id: market.id,
    yes_pool: 50000,
    no_pool: 30000,
    timestamp: new Date()
  });
  
  // Recuperar e validar
  const snapshot = await MarketSnapshot.findOne({ market_id: market.id });
  const expected = 50000 / (50000 + 30000); // 0.625
  
  expect(snapshot.implied_prob_yes).toBeCloseTo(expected, 6);
});
```

### 10.2 Plano de Testes

```yaml
Cobertura de Testes:
  Unit Tests:
    - Autenticação: 95%+
    - Validações: 100%
    - Cálculos: 100%
  
  Integration Tests:
    - Fluxo completo (auth → aposta → resolução): 100%
    - Interação com Stellar (mock): 100%
    - Interação com WebSocket: 90%+
  
  End-to-End:
    - Testnet Stellar: Full scenario
    - KYC workflow: Manual + automated
    - Performance: 1000+ bets/sec load test
  
  Security:
    - OWASP Top 10
    - SQL Injection: ✓ (parameterized)
    - XSS: ✓ (Content-Security-Policy)
    - CSRF: ✓ (SameSite cookies)
    - Rate limiting: ✓ (IP + user)
```

---

## 11. Roadmap de Desenvolvimento

### Fase 1: MVP (Q2 2026) 🚀
- [x] Autenticação Challenge-Response
- [x] Endpoints de mercados (GET)
- [x] Build & submit de apostas (POST)
- [x] Worker básico (indexação)
- [x] KYC com SumSub
- [x] Spending limits
- [ ] Testes completos

### Fase 2: Escalabilidade (Q3 2026) 📈
- [ ] Caching Redis (queries)
- [ ] Read replicas (PostgreSQL)
- [ ] Multi-region deployment
- [ ] Performance: <100ms latência P99
- [ ] Suporte a 10k+ usuários simultâneos

### Fase 3: Voto Quadrático (Q4 2026) 🗳️
- [ ] Votação em ONGs
- [ ] Distribuição automática
- [ ] Dashboard de impacto
- [ ] Relatórios PDF/CSV

### Fase 4: Expansão (2027) 🌍
- [ ] Mais mercados (sports, crypto, etc)
- [ ] Mobile app nativa
- [ ] API pública (partner integrations)
- [ ] Governança DAO

---

## 📞 Contato & Suporte

**Email:** dev@stakegood.io  
**Docs:** https://docs.stakegood.io  
**Status:** https://status.stakegood.io  
**Discord:** https://discord.gg/stakegood

---

**Documento versão 1.0.0** | Última atualização: Abril 2026