-- MASSIVE SEED SCRIPT FOR STAKEGOOD (FIXED)
-- This script populates ALL tables with realistic data for development and testing.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clear existing data
TRUNCATE users, ngos, markets, kyc_profiles, user_positions, market_snapshots, impact_ledger_entries, deposits, auth_nonces CASCADE;

-- 1. USERS (Admin, Moderators, and Regular Users)
-- Admin User (USER's Wallet)
INSERT INTO users (id, primary_wallet, role, kyc_status, kyc_tier, spending_limit_usd, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000001', 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4', 'admin', 'verified', 'individual', 50000.00, NOW(), NOW());

-- Moderators
INSERT INTO users (id, primary_wallet, role, kyc_status, created_at, updated_at)
VALUES 
('00000000-0000-0000-0000-000000000002', 'GMOD1234567890ABCDEFGH1234567890ABCDEFGH1234567890ABCDEF', 'moderator', 'verified', NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', 'GMOD0987654321ABCDEFGH0987654321ABCDEFGH0987654321ABCDEF', 'moderator', 'verified', NOW(), NOW());

-- Regular Users
INSERT INTO users (id, primary_wallet, role, kyc_status, created_at, updated_at)
SELECT 
    gen_random_uuid(), 
    'GUSER' || lpad(i::text, 51, '0'), 
    'user', 
    CASE WHEN i % 2 = 0 THEN 'verified'::users_kyc_status_enum ELSE 'pending'::users_kyc_status_enum END,
    NOW() - (i || ' days')::interval, 
    NOW()
FROM generate_series(1, 10) i;

-- 2. KYC PROFILES (For verified users)
INSERT INTO kyc_profiles (id, user_id, provider_id, status, verified_at, aml_flags, raw_data, created_at, updated_at)
SELECT 
    gen_random_uuid(), 
    id, 
    'sumsub_' || encode(gen_random_bytes(8), 'hex'), 
    'approved', 
    NOW() - interval '1 day', 
    '{"low_risk": true}', 
    '{"country": "BR", "id_type": "passport"}', 
    NOW(), 
    NOW()
FROM users 
WHERE kyc_status = 'verified';

-- 3. NGOs (Diverse categories)
INSERT INTO ngos (id, name, slug, description, category, verified, wallet_address, total_funds_received, social, impact_metrics, created_at, updated_at)
VALUES 
(gen_random_uuid(), 'Ocean Cleanup', 'ocean-cleanup', 'Developing advanced technologies to rid the world’s oceans of plastic.', 'Environment', true, 'GOCN' || lpad('1', 52, '0'), 5000.00, '{"twitter": "@oceancleanup"}', '{"plastic_removed_kg": 120000}', NOW(), NOW()),
(gen_random_uuid(), 'Doctors Without Borders', 'msf', 'Providing medical assistance to people affected by conflict, epidemics, disasters, or exclusion from healthcare.', 'Health', true, 'GMSF' || lpad('2', 52, '0'), 15000.00, '{"site": "msf.org"}', '{"patients_treated": 500000}', NOW(), NOW()),
(gen_random_uuid(), 'Khan Academy', 'khan-academy', 'Free, world-class education for anyone, anywhere.', 'Education', true, 'GKHN' || lpad('3', 52, '0'), 8500.00, '{"youtube": "khanacademy"}', '{"students_reached": 10000000}', NOW(), NOW()),
(gen_random_uuid(), 'Animal Welfare Institute', 'awi', 'Dedicated to reducing animal suffering caused by people.', 'Animals', true, 'GAWI' || lpad('4', 52, '0'), 2200.00, '{}', '{"animals_saved": 5000}', NOW(), NOW()),
(gen_random_uuid(), 'Code.org', 'code-org', 'Expanding access to computer science in schools.', 'Education', true, 'GCOD' || lpad('5', 52, '0'), 4000.00, '{}', '{"code_hours": 1000000}', NOW(), NOW());

-- 4. MARKETS (Different states and categories)
CREATE TEMP TABLE temp_ngos AS SELECT id, slug FROM ngos;

-- Active Markets
INSERT INTO markets (id, title, description, category, status, lock_at, resolve_at, created_by, created_at, updated_at)
VALUES 
(gen_random_uuid(), 'Will the global average temperature increase by 1.5°C by 2027?', 'Climate change prediction based on NASA data.', 'Environment', 'active', '2027-01-01', '2027-02-01', 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4', NOW(), NOW()),
(gen_random_uuid(), 'Will Ethereum switch to a new consensus layer again in 2025?', 'Prediction on ETH roadmap.', 'Tech', 'active', '2025-12-31', '2026-01-15', 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4', NOW(), NOW()),
(gen_random_uuid(), 'Will Brazil win the 2026 World Cup?', 'Sports prediction.', 'Sports', 'active', '2026-06-11', '2026-07-20', 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4', NOW(), NOW());

-- Resolved Markets
INSERT INTO markets (id, title, description, category, status, lock_at, resolve_at, outcome, created_at, updated_at)
VALUES 
(gen_random_uuid(), 'Did Bitcoin reach $70k in Q1 2024?', 'Finance prediction.', 'Finance', 'resolved', '2024-03-31', '2024-04-01', 'YES', NOW() - interval '6 months', NOW()),
(gen_random_uuid(), 'Did Apple release a VR headset in 2023?', 'Tech prediction.', 'Tech', 'resolved', '2023-12-31', '2024-01-01', 'YES', NOW() - interval '12 months', NOW());

-- Locked Markets (Waiting for Oracle)
INSERT INTO markets (id, title, description, category, status, lock_at, resolve_at, created_at, updated_at)
VALUES 
(gen_random_uuid(), 'Federal Reserve Interest Rate Cut in September 2024?', 'Economy prediction.', 'Finance', 'locked', '2024-09-18', '2024-09-19', NOW() - interval '1 month', NOW());

-- 5. USER POSITIONS (Stakes)
INSERT INTO user_positions (id, user_id, market_id, outcome, amount_staked, status, created_at, updated_at)
SELECT 
    gen_random_uuid(), 
    u.id, 
    m.id, 
    CASE WHEN random() > 0.5 THEN 'YES'::user_positions_outcome_enum ELSE 'NO'::user_positions_outcome_enum END,
    (random() * 500 + 10)::decimal,
    'confirmed',
    NOW() - (random() * 10 || ' days')::interval,
    NOW()
FROM users u, markets m
WHERE u.role = 'user' AND m.status IN ('active', 'resolved')
LIMIT 40;

-- 6. MARKET SNAPSHOTS (History for charts)
INSERT INTO market_snapshots (id, market_id, timestamp, yes_pool, no_pool, trading_volume, created_at)
SELECT 
    gen_random_uuid(), 
    m.id, 
    NOW() - (i || ' hours')::interval, 
    (1000 + random() * 500)::decimal,
    (1000 + random() * 500)::decimal,
    (random() * 100)::decimal,
    NOW()
FROM markets m, generate_series(1, 24) i
WHERE m.status = 'active';

-- 7. IMPACT LEDGER ENTRIES
INSERT INTO impact_ledger_entries (id, date, ngo_id, amount, currency, source, created_at)
SELECT 
    gen_random_uuid(), 
    NOW() - (i || ' days')::interval, 
    n.id, 
    (random() * 1000)::decimal, 
    'USDC', 
    CASE WHEN i % 2 = 0 THEN 'quadratic_voting'::impact_ledger_entries_source_enum ELSE 'donation'::impact_ledger_entries_source_enum END,
    NOW()
FROM temp_ngos n, generate_series(1, 3) i
LIMIT 15;

-- 8. DEPOSITS
INSERT INTO deposits (id, user_id, amount, currency, tx_hash, status, created_at, confirmed_at)
SELECT 
    gen_random_uuid(), 
    u.id, 
    (100 + random() * 1000)::decimal, 
    'USDC', 
    encode(gen_random_bytes(32), 'hex'), 
    'confirmed', 
    NOW() - interval '2 days', 
    NOW() - interval '1 day'
FROM users u
LIMIT 10;

-- Clean up temp table
DROP TABLE temp_ngos;
