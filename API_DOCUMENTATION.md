# StakeGood API Documentation

Welcome to the StakeGood Backend API documentation. This document provides a comprehensive list of all available endpoints, their request formats, and response structures.

## Base URL and Configuration
- **Global Prefix:** `/api/v1` (configurable via `API_PREFIX` env var)
- **Port:** `3000` (configurable via `PORT` env var)
- **CORS:** Enabled for all origins.

## Authentication
Endpoints marked as **[JWT Required]** require a Bearer token in the `Authorization` header:
`Authorization: Bearer <your_jwt_token>`

The JWT token is obtained after a successful call to `/auth/verify`.

---

## 1. General Endpoints

### Health Check
- **Method:** `GET`
- **Path:** `/`
- **Description:** Basic health check for the API.
- **Response (200):** `Hello World!` (plain text)

---

## 2. Authentication (`/auth`)

### Generate Nonce
- **Method:** `GET`
- **Path:** `/auth/nonce`
- **Query Params:**
  - `wallet`: (Required) Stellar wallet address (G...).
- **Response (200):**
  ```json
  {
    "nonce": "hex_string",
    "expires_at": "ISO_DATE",
    "ttl_seconds": 300
  }
  ```

### Verify Signature (Login)
- **Method:** `POST`
- **Path:** `/auth/verify`
- **Body:**
  ```json
  {
    "wallet": "Stellar wallet address",
    "nonce": "Nonce from /auth/nonce",
    "signature": "Ed25519 signature of the nonce"
  }
  ```
- **Response (201):**
  ```json
  {
    "jwt": "eyJhbG...",
    "wallet": "GB...",
    "kyc_status": "none | pending | verified | rejected",
    "kyc_tier": number,
    "expires_in": 86400,
    "user": {
      "id": "uuid",
      "primary_wallet": "GB...",
      "role": "user",
      "public_visibility": boolean
    }
  }
  ```

### KYC Webhook
- **Method:** `POST`
- **Path:** `/auth/kyc/webhook`
- **Description:** Integration point for KYC providers (e.g., Sumsub).
- **Body:**
  ```json
  {
    "externalUserId": "User UUID",
    "review": { "reviewStatus": "approved | rejected", "createdAt": "ISO_DATE" },
    "applicant": { "id": "string", "email": "string" }
  }
  ```
- **Response (201):** `{ "status": "processed | ignored" }`

---

## 3. Markets (`/markets`)

### List Markets **[JWT Required]**
- **Method:** `GET`
- **Path:** `/markets`
- **Query Params:**
  - `status`: `active | settled | locked`
  - `category`: e.g., `SPORTS`, `POLITICS`
  - `limit`: Default 20
  - `offset`: Default 0
  - `sort`: `newest | oldest`
- **Response (200):**
  ```json
  {
    "markets": [
      {
        "id": "uuid",
        "title": "string",
        "status": "string",
        "category": "string",
        "total_liquidity": "decimal_string",
        "lock_at": "ISO_DATE",
        "settle_at": "ISO_DATE"
      }
    ],
    "pagination": { "total": number, "limit": number, "offset": number, "has_next": boolean }
  }
  ```

### Get Market History **[JWT Required]**
- **Method:** `GET`
- **Path:** `/markets/:id/history`
- **Query Params:**
  - `interval`: Default `1h`
  - `days`: Default 7
- **Response (200):**
  ```json
  {
    "market_id": "uuid",
    "title": "string",
    "snapshots": [
      {
        "timestamp": "ISO_DATE",
        "yes_pool": "decimal",
        "no_pool": "decimal",
        "yes_probability": number,
        "trading_volume": "decimal"
      }
    ]
  }
  ```

---

## 4. NGOs (`/ngos`)

### List NGOs
- **Method:** `GET`
- **Path:** `/ngos`
- **Query Params:**
  - `category`: e.g., `EDUCATION`
  - `verified`: `true | false`
  - `limit`: Default 20
  - `offset`: Default 0
  - `sort`: `trending | alphabetical`
- **Response (200):**
  ```json
  {
    "ngos": [
      {
        "id": "uuid",
        "name": "string",
        "category": "string",
        "verified": boolean,
        "total_funds_received": "decimal"
      }
    ],
    "pagination": { "total": number, "limit": number, "offset": number, "has_next": boolean }
  }
  ```

---

## 5. Impact (`/impact`)

### Get Impact Ledger
- **Method:** `GET`
- **Path:** `/impact/ledger`
- **Query Params:**
  - `from`: ISO Date
  - `to`: ISO Date
  - `ngo_id`: UUID
  - `limit`: Default 50
  - `offset`: Default 0
- **Response (200):**
  ```json
  {
    "ledger_entries": [...],
    "pagination": { "total": number, "limit": number, "offset": number, "has_next": boolean },
    "summary": {
      "period": { "from": "ISO_DATE", "to": "ISO_DATE" },
      "total_distributed": "decimal",
      "transaction_count": number
    }
  }
  ```

### Export Ledger **[JWT Required]**
- **Method:** `POST`
- **Path:** `/impact/ledger/export`
- **Body:**
  ```json
  {
    "format": "csv | pdf",
    "from": "ISO_DATE",
    "to": "ISO_DATE",
    "include_breakdown": boolean
  }
  ```
- **Response (201):**
  ```json
  {
    "job_id": "string",
    "status": "queued",
    "format": "csv | pdf",
    "estimated_ready_at": "ISO_DATE",
    "download_url": "null | string",
    "check_status_url": "/api/v1/impact/ledger/export/job_id"
  }
  ```

---

## 6. Transactions (`/transactions`)

### Build Prediction **[JWT Required]**
- **Method:** `POST`
- **Path:** `/transactions/build-prediction`
- **Body:**
  ```json
  {
    "market_id": "UUID",
    "outcome": "YES | NO",
    "amount": "decimal_string"
  }
  ```
- **Response (201):**
  ```json
  {
    "xdr": "BASE64_XDR_FOR_SIGNING",
    "summary": {
      "action": "place_prediction",
      "market": { "id": "uuid", "title": "string" },
      "outcome": "YES | NO",
      "amount": "string",
      "implied_probability": "string",
      "implied_odds": "string",
      "potential_win": "string"
    }
  }
  ```

---

## Error Response Format
All errors follow the standard NestJS format:
```json
{
  "statusCode": 403,
  "message": "Specific error message",
  "error": "Short error name"
}
```
*Note: Some errors (like KYC or Spending Limits) return an object in the `message` field with extra details.*
