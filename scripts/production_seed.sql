--
-- PostgreSQL database dump
--

\restrict 4TQamXrmdq2SaqeplyVd7gsHwp79eFed3yLb3MptpD2js2kcxRRDq4W37adAN89

-- Dumped from database version 15.17
-- Dumped by pg_dump version 15.17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS "FK_3ddc983c5f7bcf132fd8732c3f4";
DROP INDEX IF EXISTS public."IDX_ff4d04ff0e6e63cab62ce7dd70";
DROP INDEX IF EXISTS public."IDX_f312350d6e62cc003531b7ec70";
DROP INDEX IF EXISTS public."IDX_f0f6826c8dba3b64d34e0a0916";
DROP INDEX IF EXISTS public."IDX_de0d6d20268c140c8a07c2d2de";
DROP INDEX IF EXISTS public."IDX_d9108a4cb925f2ace0ad4a5b9e";
DROP INDEX IF EXISTS public."IDX_d12a8d0944b6bc37fad84f31c3";
DROP INDEX IF EXISTS public."IDX_ccfa5950c193dd0f2721d57651";
DROP INDEX IF EXISTS public."IDX_b7e733a597a61dfff0e1d45790";
DROP INDEX IF EXISTS public."IDX_aeee7d2f4d2407baccc8b13039";
DROP INDEX IF EXISTS public."IDX_a7080c443def2e46ba5c4b87f3";
DROP INDEX IF EXISTS public."IDX_a38154827eec1880ee75fac616";
DROP INDEX IF EXISTS public."IDX_9efdf3ceb5219ac7f814fcb33c";
DROP INDEX IF EXISTS public."IDX_8e8a63153fa614a6a85fcf1436";
DROP INDEX IF EXISTS public."IDX_8d69ee9259d1357a89424ecce6";
DROP INDEX IF EXISTS public."IDX_89d21309283e511f013db44c04";
DROP INDEX IF EXISTS public."IDX_88643a0464cca68533c82147d4";
DROP INDEX IF EXISTS public."IDX_86e53cf7e6fa2bf8caaf90db4e";
DROP INDEX IF EXISTS public."IDX_7e386a6324a0e96ca89a27afec";
DROP INDEX IF EXISTS public."IDX_63ce5ed9284d498767d5727020";
DROP INDEX IF EXISTS public."IDX_5952a337387d7d6d4e04aa334e";
DROP INDEX IF EXISTS public."IDX_4542dd2f38a61354a040ba9fd5";
DROP INDEX IF EXISTS public."IDX_4483927f0ad2b87535a7b4926b";
DROP INDEX IF EXISTS public."IDX_22066f85fa761e7d4276980482";
DROP INDEX IF EXISTS public."IDX_1360099bd018167c768e9cb441";
DROP INDEX IF EXISTS public."IDX_109b9d3209e5c344dae2ca8f22";
DROP INDEX IF EXISTS public."IDX_0eb5751043838bddd5ae7f6722";
DROP INDEX IF EXISTS public."IDX_0804e08eb2052a654c1dff24b5";
DROP INDEX IF EXISTS public."IDX_06b683d646838d69ae3607a7d9";
ALTER TABLE IF EXISTS ONLY public.ngos DROP CONSTRAINT IF EXISTS "UQ_e64c5b66beb3bfbfa01ae0f937e";
ALTER TABLE IF EXISTS ONLY public.deposits DROP CONSTRAINT IF EXISTS "UQ_627343eced83e4924a0673d0238";
ALTER TABLE IF EXISTS ONLY public.ngos DROP CONSTRAINT IF EXISTS "UQ_0cc58d650c7475808e95b7d1c70";
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS "REL_3ddc983c5f7bcf132fd8732c3f";
ALTER TABLE IF EXISTS ONLY public.market_snapshots DROP CONSTRAINT IF EXISTS "PK_fda8554552bb9c9898c5a9bedd4";
ALTER TABLE IF EXISTS ONLY public.ngos DROP CONSTRAINT IF EXISTS "PK_f64f509c60499b255fd259a4973";
ALTER TABLE IF EXISTS ONLY public.deposits DROP CONSTRAINT IF EXISTS "PK_f49ba0cd446eaf7abb4953385d9";
ALTER TABLE IF EXISTS ONLY public.markets DROP CONSTRAINT IF EXISTS "PK_dda44129b32f21ae9f1c28dcf99";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS "PK_a3ffb1c0c8416b9fc6f907b7433";
ALTER TABLE IF EXISTS ONLY public.kyc_profiles DROP CONSTRAINT IF EXISTS "PK_94a340b98061b0cd7542d98e4b1";
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS "PK_7d8bee0204106019488c4c50ffa";
ALTER TABLE IF EXISTS ONLY public.tx_intents DROP CONSTRAINT IF EXISTS "PK_76b36472ba7c918fe930f6889db";
ALTER TABLE IF EXISTS ONLY public.tx_receipts DROP CONSTRAINT IF EXISTS "PK_7395301139388fb4ad0a036f54d";
ALTER TABLE IF EXISTS ONLY public.worker_cursors DROP CONSTRAINT IF EXISTS "PK_69fc2236fecefd1d614eccf6e49";
ALTER TABLE IF EXISTS ONLY public.auth_nonces DROP CONSTRAINT IF EXISTS "PK_43f4e702fc79d337c03bce1de16";
ALTER TABLE IF EXISTS ONLY public.impact_ledger_entries DROP CONSTRAINT IF EXISTS "PK_3a6894c2f3c2e4f9f1dcd041821";
ALTER TABLE IF EXISTS ONLY public.user_positions DROP CONSTRAINT IF EXISTS "PK_356d199f37e9af66ec22f3d5de4";
ALTER TABLE IF EXISTS ONLY public.processed_transactions DROP CONSTRAINT IF EXISTS "PK_29527ce826070687efddf719fa3";
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS "PK_1bb179d048bbc581caa3b013439";
DROP TABLE IF EXISTS public.worker_cursors;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.user_positions;
DROP TABLE IF EXISTS public.tx_receipts;
DROP TABLE IF EXISTS public.tx_intents;
DROP TABLE IF EXISTS public.refresh_tokens;
DROP TABLE IF EXISTS public.processed_transactions;
DROP TABLE IF EXISTS public.ngos;
DROP TABLE IF EXISTS public.markets;
DROP TABLE IF EXISTS public.market_snapshots;
DROP TABLE IF EXISTS public.kyc_profiles;
DROP TABLE IF EXISTS public.impact_ledger_entries;
DROP TABLE IF EXISTS public.deposits;
DROP TABLE IF EXISTS public.auth_nonces;
DROP TABLE IF EXISTS public.audit_logs;
DROP TYPE IF EXISTS public.users_role_enum;
DROP TYPE IF EXISTS public.users_kyc_tier_enum;
DROP TYPE IF EXISTS public.users_kyc_status_enum;
DROP TYPE IF EXISTS public.user_positions_status_enum;
DROP TYPE IF EXISTS public.user_positions_outcome_enum;
DROP TYPE IF EXISTS public.markets_status_enum;
DROP TYPE IF EXISTS public.markets_outcome_enum;
DROP TYPE IF EXISTS public.kyc_profiles_status_enum;
DROP TYPE IF EXISTS public.impact_ledger_entries_source_enum;
DROP TYPE IF EXISTS public.deposits_status_enum;
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS pgcrypto;
--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: deposits_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.deposits_status_enum AS ENUM (
    'pending',
    'confirmed',
    'failed'
);


--
-- Name: impact_ledger_entries_source_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.impact_ledger_entries_source_enum AS ENUM (
    'quadratic_voting',
    'donation',
    'grant',
    'fee_pool'
);


--
-- Name: kyc_profiles_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.kyc_profiles_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected',
    'expired'
);


--
-- Name: markets_outcome_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.markets_outcome_enum AS ENUM (
    'YES',
    'NO'
);


--
-- Name: markets_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.markets_status_enum AS ENUM (
    'draft',
    'active',
    'locked',
    'resolved'
);


--
-- Name: user_positions_outcome_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_positions_outcome_enum AS ENUM (
    'YES',
    'NO'
);


--
-- Name: user_positions_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_positions_status_enum AS ENUM (
    'pending',
    'confirmed',
    'cancelled',
    'resolved',
    'claimed'
);


--
-- Name: users_kyc_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.users_kyc_status_enum AS ENUM (
    'pending',
    'verified',
    'rejected',
    'expired'
);


--
-- Name: users_kyc_tier_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.users_kyc_tier_enum AS ENUM (
    'individual',
    'business'
);


--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.users_role_enum AS ENUM (
    'user',
    'moderator',
    'admin'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    admin_id character varying NOT NULL,
    action character varying NOT NULL,
    target_type character varying NOT NULL,
    target_id character varying,
    payload jsonb,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: auth_nonces; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_nonces (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    wallet_address character varying(56) NOT NULL,
    nonce character varying(64) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    used_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: deposits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deposits (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id character varying NOT NULL,
    amount numeric(18,8) NOT NULL,
    currency character varying(12) DEFAULT 'USDC'::character varying NOT NULL,
    tx_hash character varying(64) NOT NULL,
    status public.deposits_status_enum DEFAULT 'pending'::public.deposits_status_enum NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    confirmed_at timestamp without time zone
);


--
-- Name: impact_ledger_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.impact_ledger_entries (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    date timestamp without time zone NOT NULL,
    market_id character varying,
    ngo_id character varying NOT NULL,
    amount numeric(18,8) NOT NULL,
    currency character varying(12) DEFAULT 'USDC'::character varying NOT NULL,
    source public.impact_ledger_entries_source_enum DEFAULT 'quadratic_voting'::public.impact_ledger_entries_source_enum NOT NULL,
    tx_hash character varying(64),
    breakdown jsonb,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: kyc_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kyc_profiles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id character varying NOT NULL,
    provider_id character varying(100) NOT NULL,
    status public.kyc_profiles_status_enum DEFAULT 'pending'::public.kyc_profiles_status_enum NOT NULL,
    verified_at timestamp without time zone,
    aml_flags jsonb DEFAULT '{}'::jsonb NOT NULL,
    raw_data jsonb,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: market_snapshots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.market_snapshots (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    market_id character varying NOT NULL,
    "timestamp" timestamp without time zone NOT NULL,
    yes_pool numeric(18,8) NOT NULL,
    no_pool numeric(18,8) NOT NULL,
    trading_volume numeric(18,8),
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: markets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.markets (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(500) NOT NULL,
    description text,
    category character varying(50),
    status public.markets_status_enum DEFAULT 'draft'::public.markets_status_enum NOT NULL,
    lock_at timestamp without time zone NOT NULL,
    resolve_at timestamp without time zone NOT NULL,
    outcome public.markets_outcome_enum,
    asset_code character varying(12),
    asset_issuer character varying(56),
    created_by character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    image_url text,
    resolution_rule text,
    resolution_source text,
    oracle_url text,
    contract_address character varying(56),
    fee_ngo numeric(5,4) DEFAULT 0.02 NOT NULL,
    fee_platform numeric(5,4) DEFAULT 0.01 NOT NULL,
    fee_gamification numeric(5,4) DEFAULT 0.005 NOT NULL,
    oracle_ref character varying(100)
);


--
-- Name: ngos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ngos (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    description text,
    category character varying(50),
    verified boolean DEFAULT false NOT NULL,
    verification_date timestamp without time zone,
    verified_by character varying,
    wallet_address character varying(56) NOT NULL,
    website character varying(500),
    social jsonb DEFAULT '{}'::jsonb NOT NULL,
    impact_metrics jsonb DEFAULT '{}'::jsonb NOT NULL,
    total_funds_received numeric(18,8) DEFAULT '0'::numeric NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: processed_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.processed_transactions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tx_hash character varying(64) NOT NULL,
    op_index integer NOT NULL,
    event_type character varying(50) NOT NULL,
    processed_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refresh_tokens (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    token character varying NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    revoked boolean DEFAULT false NOT NULL,
    user_id uuid
);


--
-- Name: tx_intents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tx_intents (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    admin_id character varying NOT NULL,
    action character varying NOT NULL,
    xdr text NOT NULL,
    tx_hash character varying,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    error_message text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: tx_receipts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tx_receipts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tx_hash character varying NOT NULL,
    ledger integer,
    status character varying NOT NULL,
    result_xdr text,
    processed_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: user_positions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_positions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id character varying NOT NULL,
    market_id character varying NOT NULL,
    outcome public.user_positions_outcome_enum NOT NULL,
    amount_staked numeric(18,8) NOT NULL,
    status public.user_positions_status_enum DEFAULT 'pending'::public.user_positions_status_enum NOT NULL,
    tx_hash character varying(64),
    resolved_at timestamp without time zone,
    payout_amount numeric(18,8),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    primary_wallet character varying(56) NOT NULL,
    role public.users_role_enum DEFAULT 'user'::public.users_role_enum NOT NULL,
    kyc_status public.users_kyc_status_enum DEFAULT 'pending'::public.users_kyc_status_enum NOT NULL,
    kyc_tier public.users_kyc_tier_enum DEFAULT 'individual'::public.users_kyc_tier_enum NOT NULL,
    public_visibility boolean DEFAULT true NOT NULL,
    private_mode boolean DEFAULT false NOT NULL,
    spending_limit_usd numeric(10,2) DEFAULT '500'::numeric NOT NULL,
    spending_window_days integer DEFAULT 30 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


--
-- Name: worker_cursors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.worker_cursors (
    id character varying(50) NOT NULL,
    last_ledger_id bigint DEFAULT '0'::bigint NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: auth_nonces; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.auth_nonces (id, wallet_address, nonce, expires_at, used_at, created_at) VALUES ('5734a699-287c-4f3d-a886-d7a804deeb21', 'GDU62AMRURI55CG5SEXOJJM6X5IYEH4ZNTK22NA2GFBJYV3I5SZ56MAG', 'f1ffd46268549bb2b4c9d1d85534d2fb83c11c9976576cc4a971c23a24f76ef7', '2026-04-23 15:54:12.985', NULL, '2026-04-23 19:49:13.029587');
INSERT INTO public.auth_nonces (id, wallet_address, nonce, expires_at, used_at, created_at) VALUES ('289a0171-51f9-4e92-9e84-376252024f2b', 'GDU62AMRURI55CG5SEXOJJM6X5IYEH4ZNTK22NA2GFBJYV3I5SZ56MAG', '9726041a828a12124839a308be9cd199a80c7fe29288bac87b5a3bb1902e4c48', '2026-04-23 15:55:00.775', '2026-04-23 15:50:09.117', '2026-04-23 19:50:00.837939');
INSERT INTO public.auth_nonces (id, wallet_address, nonce, expires_at, used_at, created_at) VALUES ('b613b3e4-1913-4061-a99c-64d43d353e06', 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4', '68de7b914f4b50a28b67b0a2b011e160929ebf9bb679a8c82d749b456dbde90f', '2026-04-23 20:18:13.238', '2026-04-23 20:13:24.102', '2026-04-24 00:13:13.267567');
INSERT INTO public.auth_nonces (id, wallet_address, nonce, expires_at, used_at, created_at) VALUES ('e09b8035-16f3-42cf-833b-0dae3f8d7504', 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4', 'db4a788212156deb2e2dff95161d5764fae013bdc9da6a042782dd71837e25c2', '2026-04-24 08:13:14.608', NULL, '2026-04-24 12:08:14.659881');
INSERT INTO public.auth_nonces (id, wallet_address, nonce, expires_at, used_at, created_at) VALUES ('358b0fc7-fbf9-4e5a-8633-882d02ae2eac', 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4', '93601c78bc0f7a989de4d637d870d9542ef928b488efdef06187a91048aeafd0', '2026-04-24 08:14:12.229', NULL, '2026-04-24 12:09:12.271072');
INSERT INTO public.auth_nonces (id, wallet_address, nonce, expires_at, used_at, created_at) VALUES ('b607b4cd-eaf8-43ce-8017-e36f11b7fbbe', 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4', 'b134fb78c00cbb21673bf8833cd555915d73ad1de6a616fe66d699d000528f92', '2026-04-24 08:14:34.221', NULL, '2026-04-24 12:09:34.213982');
INSERT INTO public.auth_nonces (id, wallet_address, nonce, expires_at, used_at, created_at) VALUES ('ed6ce57f-0074-42cd-a9fe-62f4521c2d79', 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4', '2c817710369b6b1d77a5ee96510431d87e28978baf959403891d9c37e1713254', '2026-04-24 08:15:32.61', NULL, '2026-04-24 12:10:32.604161');
INSERT INTO public.auth_nonces (id, wallet_address, nonce, expires_at, used_at, created_at) VALUES ('309949d9-5ac0-4cb2-9139-1555111c7560', 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4', 'a9a3669e84d67cf9fc2907e028a908943d7cf389e6bc68214fa64100fe4c1ea3', '2026-04-24 08:16:01.248', NULL, '2026-04-24 12:11:01.224797');
INSERT INTO public.auth_nonces (id, wallet_address, nonce, expires_at, used_at, created_at) VALUES ('d98bf2ee-c8d9-496f-8d50-892527b28bd9', 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4', '1ec80e4f05d054805072e9a94a8603b55aea0c0f94116ff4ed148f3f77316eab', '2026-04-24 08:16:29.005', NULL, '2026-04-24 12:11:29.00643');
INSERT INTO public.auth_nonces (id, wallet_address, nonce, expires_at, used_at, created_at) VALUES ('852f42dd-a463-48c9-9ac4-f00b2e2d1dc2', 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4', 'dc1d8a8fe2d665952bc286943b92c6622447e520b8cb4946025efa10232e9baf', '2026-04-24 08:19:16.611', NULL, '2026-04-24 12:14:16.64564');
INSERT INTO public.auth_nonces (id, wallet_address, nonce, expires_at, used_at, created_at) VALUES ('ea5b7e61-09fd-4dc0-8b1a-2a0aca0b5436', 'GDU62AMRURI55CG5SEXOJJM6X5IYEH4ZNTK22NA2GFBJYV3I5SZ56MAG', 'de4683047572e6f197a898c035f9bc89d1ecb14ad7bf31097eca579af19072ef', '2026-04-24 08:19:46.812', NULL, '2026-04-24 12:14:46.858693');
INSERT INTO public.auth_nonces (id, wallet_address, nonce, expires_at, used_at, created_at) VALUES ('286bd0f4-5bf4-4bcd-b6cc-3bc0817de8e3', 'GDU62AMRURI55CG5SEXOJJM6X5IYEH4ZNTK22NA2GFBJYV3I5SZ56MAG', '6ed10b801aa8051ede84069482550732ed359c6ca7ff6b2171c7e265cf6b093f', '2026-04-24 08:20:51.812', NULL, '2026-04-24 12:15:51.822718');
INSERT INTO public.auth_nonces (id, wallet_address, nonce, expires_at, used_at, created_at) VALUES ('c631a856-a0cb-41bb-a7d8-4aadaa7119b4', 'GDU62AMRURI55CG5SEXOJJM6X5IYEH4ZNTK22NA2GFBJYV3I5SZ56MAG', '777b506f411e8acec0a46ffb37e8ef1a8ff533e17625fb4237c7e70b09d21343', '2026-04-24 08:23:20.568', NULL, '2026-04-24 12:18:20.614412');
INSERT INTO public.auth_nonces (id, wallet_address, nonce, expires_at, used_at, created_at) VALUES ('7a04cdc2-3b23-4427-8aad-d51abc79c4db', 'GDU62AMRURI55CG5SEXOJJM6X5IYEH4ZNTK22NA2GFBJYV3I5SZ56MAG', 'fc22ecc309c3937dcfd515a57d396e62b2601a14065a0e1470174b8c9ba56d0b', '2026-04-24 08:23:42.244', NULL, '2026-04-24 12:18:42.266321');
INSERT INTO public.auth_nonces (id, wallet_address, nonce, expires_at, used_at, created_at) VALUES ('2b6181ba-c419-4528-a553-d80d5ca13658', 'GDU62AMRURI55CG5SEXOJJM6X5IYEH4ZNTK22NA2GFBJYV3I5SZ56MAG', 'f58fa11fde737a573e40f64587d1ced9785f1312d07c936ae37995e635c67565', '2026-04-24 08:24:40.896', NULL, '2026-04-24 12:19:40.920188');
INSERT INTO public.auth_nonces (id, wallet_address, nonce, expires_at, used_at, created_at) VALUES ('1e381d14-e3f2-4f27-ac97-f399a05a9ab3', 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4', '63dc420ecec4a88126319449a7fb5e8b3c5520a13af656ed0ead590c6c43c4b2', '2026-04-24 08:28:16.474', NULL, '2026-04-24 12:23:16.503672');
INSERT INTO public.auth_nonces (id, wallet_address, nonce, expires_at, used_at, created_at) VALUES ('232ad3f5-b601-4946-8882-c3a91cac3bdf', 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4', '255c0c9f1fe835914f928658feb4c1b9b6ffcf2ece95b6b78a8c7c2f50b1d595', '2026-04-24 08:31:18.542', NULL, '2026-04-24 12:26:18.569137');
INSERT INTO public.auth_nonces (id, wallet_address, nonce, expires_at, used_at, created_at) VALUES ('9a3b112f-1b56-4a94-ad61-f40eeb9c3aa2', 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4', '3611a57171efd58d26535164017fcef41b782227f93aa84f563f35f39fa1509e', '2026-04-24 08:32:23.939', NULL, '2026-04-24 12:27:23.937185');
INSERT INTO public.auth_nonces (id, wallet_address, nonce, expires_at, used_at, created_at) VALUES ('272cec31-4708-4c5d-a97b-952d0a35701f', 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4', 'b61c089b74ddec9f49a267adb727666444263a17c59bf49297dc3916d859a721', '2026-04-24 08:35:05.153', NULL, '2026-04-24 12:30:05.156992');
INSERT INTO public.auth_nonces (id, wallet_address, nonce, expires_at, used_at, created_at) VALUES ('46f74d63-91bd-40c1-90c0-4bfcd5cd8ae1', 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4', 'd501a260d8b602f7316508091e7d423b6b6e2d576f31673c006c559fb7d6b327', '2026-04-24 08:36:51.997', '2026-04-24 08:31:55.698', '2026-04-24 12:31:52.001035');
INSERT INTO public.auth_nonces (id, wallet_address, nonce, expires_at, used_at, created_at) VALUES ('40a24939-ce42-4470-8c0a-ca834e2128e6', 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4', '19855decd5a094eaee82ba3941f3e4be05c4777a50b02e06420b82f5025686fc', '2026-04-24 08:38:32.488', '2026-04-24 08:33:38.788', '2026-04-24 12:33:32.482762');
INSERT INTO public.auth_nonces (id, wallet_address, nonce, expires_at, used_at, created_at) VALUES ('c4237ead-ab73-4481-8752-a9a6e528f32e', 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4', '52dcdc3a8d9f2374b1829d3313585b974243e97efac742fa4490bb8cf423fc4e', '2026-04-24 09:27:43.961', '2026-04-24 09:22:48.974', '2026-04-24 13:22:43.96125');


--
-- Data for Name: deposits; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.deposits (id, user_id, amount, currency, tx_hash, status, created_at, confirmed_at) VALUES ('7590ad30-7860-48f8-a8d5-288c113bd20d', '00000000-0000-0000-0000-000000000001', 398.12303334, 'USDC', '7d05e73ec8002a43da64451416824de0f3b6101598a3c675d36b7332b6789adc', 'confirmed', '2026-04-21 15:27:03.22449', '2026-04-22 15:27:03.22449');
INSERT INTO public.deposits (id, user_id, amount, currency, tx_hash, status, created_at, confirmed_at) VALUES ('787e0be5-875b-41e5-98a8-4e0ea4e78710', '00000000-0000-0000-0000-000000000002', 727.18870484, 'USDC', 'a17be14f56dc6d248cc717fe9f0408a665b9eb4f5ba892c263cc632593339082', 'confirmed', '2026-04-21 15:27:03.22449', '2026-04-22 15:27:03.22449');
INSERT INTO public.deposits (id, user_id, amount, currency, tx_hash, status, created_at, confirmed_at) VALUES ('7c767f8d-60d2-4a3d-9808-8c4d22e63c99', '00000000-0000-0000-0000-000000000003', 717.25822331, 'USDC', '3f2919b999470b569d1a0aa74c535603d3be6516966e1fd8ebb7ef62ac21dfb1', 'confirmed', '2026-04-21 15:27:03.22449', '2026-04-22 15:27:03.22449');
INSERT INTO public.deposits (id, user_id, amount, currency, tx_hash, status, created_at, confirmed_at) VALUES ('6d950252-7516-4b6d-9465-2d2db8caa1cf', '2d063cd3-8856-48f3-92aa-f67f2eb45668', 965.45406164, 'USDC', '6843a4a22a14308c99acb88fb0962a3912a3875ff6caddff62144d878d629e7c', 'confirmed', '2026-04-21 15:27:03.22449', '2026-04-22 15:27:03.22449');
INSERT INTO public.deposits (id, user_id, amount, currency, tx_hash, status, created_at, confirmed_at) VALUES ('825a7e9b-2519-4f9d-a916-00d0a7b5d98c', '5e6d3185-560b-43f0-99b7-7e91b76db9da', 1039.27710958, 'USDC', '33db29eb92c5610f5fb9b65405cecb04a5bba31a023553f9ff698e928a5d5ffb', 'confirmed', '2026-04-21 15:27:03.22449', '2026-04-22 15:27:03.22449');
INSERT INTO public.deposits (id, user_id, amount, currency, tx_hash, status, created_at, confirmed_at) VALUES ('d42626c1-dc58-49f4-9690-c7b42f6f1c14', 'cb3ba0c3-0064-418c-af53-d7d671a1be72', 728.29452462, 'USDC', '7452a16a724c2427a9874d848b51944b5be86aa090c100095c798e9489e3fb68', 'confirmed', '2026-04-21 15:27:03.22449', '2026-04-22 15:27:03.22449');
INSERT INTO public.deposits (id, user_id, amount, currency, tx_hash, status, created_at, confirmed_at) VALUES ('bf75ae58-29b7-46cb-92dd-73356bda4014', '94e2f1cc-94e9-4e61-9df5-66eca758b177', 433.38382518, 'USDC', '7c187530b0afc7a2db57ff0331edc48c24a56931dda3e26137cd3344241332e8', 'confirmed', '2026-04-21 15:27:03.22449', '2026-04-22 15:27:03.22449');
INSERT INTO public.deposits (id, user_id, amount, currency, tx_hash, status, created_at, confirmed_at) VALUES ('3a529f3a-d54a-4a10-b793-bd9c68da710e', '459932d6-b975-4c47-9b33-93d9ba6d6aca', 315.12770109, 'USDC', '3034056136c7dc489b6188a9223ac04d00bdb915c6ccfaed7ad62c502375fb90', 'confirmed', '2026-04-21 15:27:03.22449', '2026-04-22 15:27:03.22449');
INSERT INTO public.deposits (id, user_id, amount, currency, tx_hash, status, created_at, confirmed_at) VALUES ('64990858-7f2b-4a61-ba44-6805561606b3', '2314ff40-dbc3-4c52-b40c-eea6c046fb1f', 417.95959839, 'USDC', '0f61d643de0d45117255458d4db9bd214ffbff1849fce57de5a001e29514fe0c', 'confirmed', '2026-04-21 15:27:03.22449', '2026-04-22 15:27:03.22449');
INSERT INTO public.deposits (id, user_id, amount, currency, tx_hash, status, created_at, confirmed_at) VALUES ('b2748ed9-8b03-4536-af7b-da13ec085e24', '04e39317-9d00-455c-9ab4-ad697dfae2b7', 975.00456856, 'USDC', '0da7331553caf4420a1e995aae4d4e508b8ad76dd6a5f6e27e521e4ee894cd15', 'confirmed', '2026-04-21 15:27:03.22449', '2026-04-22 15:27:03.22449');


--
-- Data for Name: impact_ledger_entries; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.impact_ledger_entries (id, date, market_id, ngo_id, amount, currency, source, tx_hash, breakdown, created_at) VALUES ('32d717dd-5fe9-4764-985d-97f77ae9e6f5', '2026-04-22 15:27:03.220893', NULL, 'efa5aa30-1fa4-4d01-9928-9201b72fbba0', 993.49481186, 'USDC', 'donation', NULL, NULL, '2026-04-23 15:27:03.220893');
INSERT INTO public.impact_ledger_entries (id, date, market_id, ngo_id, amount, currency, source, tx_hash, breakdown, created_at) VALUES ('e098ef5f-1fcd-411c-bddb-360cc6bd557d', '2026-04-22 15:27:03.220893', NULL, '86274401-cef4-4dd8-8771-11377e320fb7', 91.29190715, 'USDC', 'donation', NULL, NULL, '2026-04-23 15:27:03.220893');
INSERT INTO public.impact_ledger_entries (id, date, market_id, ngo_id, amount, currency, source, tx_hash, breakdown, created_at) VALUES ('937469bd-1b86-4ffb-b5a0-b01f9ab7af72', '2026-04-22 15:27:03.220893', NULL, '1388c81b-48b3-4ad9-a902-0a34ce73b1e7', 739.83509908, 'USDC', 'donation', NULL, NULL, '2026-04-23 15:27:03.220893');
INSERT INTO public.impact_ledger_entries (id, date, market_id, ngo_id, amount, currency, source, tx_hash, breakdown, created_at) VALUES ('9a1a9a52-21f9-4998-8886-78a8f14f6edb', '2026-04-22 15:27:03.220893', NULL, '75479af1-bdc1-4852-afaa-1deb3dd7385b', 307.86928060, 'USDC', 'donation', NULL, NULL, '2026-04-23 15:27:03.220893');
INSERT INTO public.impact_ledger_entries (id, date, market_id, ngo_id, amount, currency, source, tx_hash, breakdown, created_at) VALUES ('9dee941b-fdfe-492d-88a2-78a29b3656ad', '2026-04-22 15:27:03.220893', NULL, 'a4f672f5-a89a-45b7-81e6-e79d81a0fa43', 398.12125761, 'USDC', 'donation', NULL, NULL, '2026-04-23 15:27:03.220893');
INSERT INTO public.impact_ledger_entries (id, date, market_id, ngo_id, amount, currency, source, tx_hash, breakdown, created_at) VALUES ('2d69080b-73ab-427d-9493-ca823ac38b12', '2026-04-21 15:27:03.220893', NULL, 'efa5aa30-1fa4-4d01-9928-9201b72fbba0', 158.02306859, 'USDC', 'quadratic_voting', NULL, NULL, '2026-04-23 15:27:03.220893');
INSERT INTO public.impact_ledger_entries (id, date, market_id, ngo_id, amount, currency, source, tx_hash, breakdown, created_at) VALUES ('7f507f30-3a5d-45f8-87d9-32df7d4764b7', '2026-04-21 15:27:03.220893', NULL, '86274401-cef4-4dd8-8771-11377e320fb7', 606.29690546, 'USDC', 'quadratic_voting', NULL, NULL, '2026-04-23 15:27:03.220893');
INSERT INTO public.impact_ledger_entries (id, date, market_id, ngo_id, amount, currency, source, tx_hash, breakdown, created_at) VALUES ('f255568d-aae0-4948-892a-1e03ae6d19b4', '2026-04-21 15:27:03.220893', NULL, '1388c81b-48b3-4ad9-a902-0a34ce73b1e7', 482.83464156, 'USDC', 'quadratic_voting', NULL, NULL, '2026-04-23 15:27:03.220893');
INSERT INTO public.impact_ledger_entries (id, date, market_id, ngo_id, amount, currency, source, tx_hash, breakdown, created_at) VALUES ('d895adc3-7879-4700-9be2-2062f8986136', '2026-04-21 15:27:03.220893', NULL, '75479af1-bdc1-4852-afaa-1deb3dd7385b', 473.41970668, 'USDC', 'quadratic_voting', NULL, NULL, '2026-04-23 15:27:03.220893');
INSERT INTO public.impact_ledger_entries (id, date, market_id, ngo_id, amount, currency, source, tx_hash, breakdown, created_at) VALUES ('45e6cbed-5162-4f30-a767-6c1911bc9fda', '2026-04-21 15:27:03.220893', NULL, 'a4f672f5-a89a-45b7-81e6-e79d81a0fa43', 382.03953165, 'USDC', 'quadratic_voting', NULL, NULL, '2026-04-23 15:27:03.220893');
INSERT INTO public.impact_ledger_entries (id, date, market_id, ngo_id, amount, currency, source, tx_hash, breakdown, created_at) VALUES ('a9e081c8-4c84-433b-8d66-1611ccd84fb7', '2026-04-20 15:27:03.220893', NULL, 'efa5aa30-1fa4-4d01-9928-9201b72fbba0', 506.28528825, 'USDC', 'donation', NULL, NULL, '2026-04-23 15:27:03.220893');
INSERT INTO public.impact_ledger_entries (id, date, market_id, ngo_id, amount, currency, source, tx_hash, breakdown, created_at) VALUES ('3fa70e25-6861-4bbd-8a29-fb043ee2931c', '2026-04-20 15:27:03.220893', NULL, '86274401-cef4-4dd8-8771-11377e320fb7', 749.65566263, 'USDC', 'donation', NULL, NULL, '2026-04-23 15:27:03.220893');
INSERT INTO public.impact_ledger_entries (id, date, market_id, ngo_id, amount, currency, source, tx_hash, breakdown, created_at) VALUES ('23a6aaa6-95e2-44e2-84a7-61dad0145840', '2026-04-20 15:27:03.220893', NULL, '1388c81b-48b3-4ad9-a902-0a34ce73b1e7', 974.83443494, 'USDC', 'donation', NULL, NULL, '2026-04-23 15:27:03.220893');
INSERT INTO public.impact_ledger_entries (id, date, market_id, ngo_id, amount, currency, source, tx_hash, breakdown, created_at) VALUES ('11111dac-5411-42b2-b9d1-5c34ca63f89b', '2026-04-20 15:27:03.220893', NULL, '75479af1-bdc1-4852-afaa-1deb3dd7385b', 467.61559696, 'USDC', 'donation', NULL, NULL, '2026-04-23 15:27:03.220893');
INSERT INTO public.impact_ledger_entries (id, date, market_id, ngo_id, amount, currency, source, tx_hash, breakdown, created_at) VALUES ('a2f0f55d-d0b6-4548-a3e8-3720d5ae377f', '2026-04-20 15:27:03.220893', NULL, 'a4f672f5-a89a-45b7-81e6-e79d81a0fa43', 552.34992157, 'USDC', 'donation', NULL, NULL, '2026-04-23 15:27:03.220893');


--
-- Data for Name: kyc_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.kyc_profiles (id, user_id, provider_id, status, verified_at, aml_flags, raw_data, created_at, updated_at) VALUES ('f9f8b067-867a-42b5-b1e7-947cbace75aa', '00000000-0000-0000-0000-000000000001', 'sumsub_2f5d289b16bbb133', 'approved', '2026-04-22 15:27:03.173491', '{"low_risk": true}', '{"country": "BR", "id_type": "passport"}', '2026-04-23 15:27:03.173491', '2026-04-23 15:27:03.173491');
INSERT INTO public.kyc_profiles (id, user_id, provider_id, status, verified_at, aml_flags, raw_data, created_at, updated_at) VALUES ('0c7fbc06-a831-4a5e-8a07-b2a13fd368b3', '00000000-0000-0000-0000-000000000002', 'sumsub_598485b449494646', 'approved', '2026-04-22 15:27:03.173491', '{"low_risk": true}', '{"country": "BR", "id_type": "passport"}', '2026-04-23 15:27:03.173491', '2026-04-23 15:27:03.173491');
INSERT INTO public.kyc_profiles (id, user_id, provider_id, status, verified_at, aml_flags, raw_data, created_at, updated_at) VALUES ('6e693f38-44b1-4c16-b137-a50b4eea7b12', '00000000-0000-0000-0000-000000000003', 'sumsub_f92371a1522a121f', 'approved', '2026-04-22 15:27:03.173491', '{"low_risk": true}', '{"country": "BR", "id_type": "passport"}', '2026-04-23 15:27:03.173491', '2026-04-23 15:27:03.173491');
INSERT INTO public.kyc_profiles (id, user_id, provider_id, status, verified_at, aml_flags, raw_data, created_at, updated_at) VALUES ('4e5acf87-e3d6-4726-9835-334f390ecea3', '5e6d3185-560b-43f0-99b7-7e91b76db9da', 'sumsub_ff9bb813701360c4', 'approved', '2026-04-22 15:27:03.173491', '{"low_risk": true}', '{"country": "BR", "id_type": "passport"}', '2026-04-23 15:27:03.173491', '2026-04-23 15:27:03.173491');
INSERT INTO public.kyc_profiles (id, user_id, provider_id, status, verified_at, aml_flags, raw_data, created_at, updated_at) VALUES ('14f8a5a1-19ff-422e-a191-06f8d8c0b7cd', '94e2f1cc-94e9-4e61-9df5-66eca758b177', 'sumsub_62a71f8b73615779', 'approved', '2026-04-22 15:27:03.173491', '{"low_risk": true}', '{"country": "BR", "id_type": "passport"}', '2026-04-23 15:27:03.173491', '2026-04-23 15:27:03.173491');
INSERT INTO public.kyc_profiles (id, user_id, provider_id, status, verified_at, aml_flags, raw_data, created_at, updated_at) VALUES ('606b2992-f68e-4466-86d9-feef58ea54e9', '2314ff40-dbc3-4c52-b40c-eea6c046fb1f', 'sumsub_211d5e1a762e2ee1', 'approved', '2026-04-22 15:27:03.173491', '{"low_risk": true}', '{"country": "BR", "id_type": "passport"}', '2026-04-23 15:27:03.173491', '2026-04-23 15:27:03.173491');
INSERT INTO public.kyc_profiles (id, user_id, provider_id, status, verified_at, aml_flags, raw_data, created_at, updated_at) VALUES ('deee3973-4d9d-408f-b677-63150e4f182e', '4f595728-e40d-4cd3-a113-d1714d40193b', 'sumsub_a8b9a4b8c4f3d320', 'approved', '2026-04-22 15:27:03.173491', '{"low_risk": true}', '{"country": "BR", "id_type": "passport"}', '2026-04-23 15:27:03.173491', '2026-04-23 15:27:03.173491');
INSERT INTO public.kyc_profiles (id, user_id, provider_id, status, verified_at, aml_flags, raw_data, created_at, updated_at) VALUES ('8be8712c-8953-4886-b01b-ddec3ace3092', 'ef842a60-1912-4df9-992c-598164785a82', 'sumsub_6401afa77a0d7b6a', 'approved', '2026-04-22 15:27:03.173491', '{"low_risk": true}', '{"country": "BR", "id_type": "passport"}', '2026-04-23 15:27:03.173491', '2026-04-23 15:27:03.173491');


--
-- Data for Name: market_snapshots; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('33853989-9b02-4bb0-adf9-b11274e17c64', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-23 15:27:03.201861', 1532.68786366, 2136.18724691, 20.02110904, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d191c636-066a-4af3-94c9-f80807b5b02a', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-23 15:27:03.201861', 1692.24517604, 2154.03540994, 29.31308224, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('3acf0882-7d77-4044-833f-f03243150276', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-23 15:27:03.201861', 1634.41561247, 2144.66866057, 17.86292002, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('235b4249-6f3b-4267-bc3f-db87934091f4', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-23 15:27:03.201861', 1622.71637039, 2155.08349466, 5.65476527, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ae57b166-1819-4f2e-8f0c-a70e75613e8a', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-23 15:27:03.201861', 1629.84685281, 2138.28476341, 28.47314190, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7a9ba0f2-9beb-47f2-8882-a9605b9df380', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-23 15:27:03.201861', 1541.37097856, 2108.98747638, 24.68733371, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9eac07fd-2e81-411a-a6f6-98f215ac3a03', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-23 14:27:03.201861', 1712.97741695, 2008.36692160, 43.96654280, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('096b08d3-6183-4848-8279-7127eafabd2b', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-23 14:27:03.201861', 1617.51631661, 2193.26376020, 24.97287158, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6fbbc087-d71f-417e-901f-81c524d3ef6a', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-23 14:27:03.201861', 1719.07027902, 2065.14714275, 42.83045912, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e10885f3-7c7b-4c98-b604-b1c584a9dae8', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-23 14:27:03.201861', 1713.93691733, 2051.12831359, 11.03806265, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d1172cf3-86ee-493e-839c-38190caf7965', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-23 14:27:03.201861', 1636.73706503, 2042.56023892, 30.15981459, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('af5280dd-9b0c-4ac9-aa16-57285a498723', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-23 14:27:03.201861', 1720.90173351, 2017.24687938, 37.57331476, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7314a83e-08a5-47a1-bda3-8652b1cb7752', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-23 13:27:03.201861', 1737.64869332, 1990.09343319, 33.55003988, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a762ed97-81af-4bcf-991e-fa1f9368db39', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-23 13:27:03.201861', 1761.27873740, 2101.32574533, 0.51668989, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('df61786c-327e-426f-b207-64ae3e5fe3f7', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-23 13:27:03.201861', 1771.55794079, 2010.19420924, 37.54976435, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1da835de-0ae2-41af-b8ea-8bc1ede1719f', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-23 13:27:03.201861', 1690.56564667, 2028.91436241, 46.52220429, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c11b231a-992a-440e-b60b-6e08a2332483', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-23 13:27:03.201861', 1775.46232674, 2172.43697910, 10.97417923, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0ab3150f-6ed6-4220-b252-2ee22adb6457', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-23 13:27:03.201861', 1627.29740170, 2059.66863886, 23.81960134, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b57b219d-95ef-4dd9-bb33-e3951571a9d1', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-23 12:27:03.201861', 1834.75769937, 2121.37891292, 11.50330086, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('bc6d6d9d-1e41-43fd-8606-5ff0aec89d14', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-23 12:27:03.201861', 1681.64337406, 2135.21167609, 8.57552797, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('41ff86b8-3aec-4f85-89d2-dca2da65b6fe', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-23 12:27:03.201861', 1714.39059384, 2020.71141958, 17.65233443, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b6f0f7c8-38d7-4367-9778-0aed685fc600', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-23 12:27:03.201861', 1805.52257102, 2091.01676861, 12.45471317, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('928e156e-a1b1-447b-a15a-1025c03a8486', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-23 12:27:03.201861', 1837.18407014, 2080.01228637, 16.84400537, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('52d19381-8a99-4307-948b-326ba1f19123', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-23 12:27:03.201861', 1748.33531808, 2173.42116894, 37.63750724, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('75c78912-e857-429b-9054-11afd6e17f57', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-23 11:27:03.201861', 1862.36163673, 2009.12436496, 9.57233621, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9463ee08-dbac-4a45-be9c-b02f53cd8083', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-23 11:27:03.201861', 1726.02594104, 2099.58334689, 16.63421359, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e50f6a89-2955-4349-9b85-13a489dd42b9', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-23 11:27:03.201861', 1784.90156159, 1998.62569612, 34.24691694, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2af8c91a-fa1f-4e14-8a53-6e15ceaabfc2', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-23 11:27:03.201861', 1742.14524475, 2010.89409211, 12.86877127, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a3d1c84d-9971-471c-86bc-996443816c61', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-23 11:27:03.201861', 1841.20955504, 2130.35033699, 1.79444537, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c0f776f3-52e4-4530-94d1-dae76e452cd9', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-23 11:27:03.201861', 1821.80420809, 2152.01328722, 40.10259671, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('358b6cc8-dd65-4af1-b553-b0fa02ef1699', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-23 10:27:03.201861', 1743.80247622, 2104.43660459, 25.65751403, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('352c1c7d-7db2-454c-bdc0-9ee5f7479db4', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-23 10:27:03.201861', 1806.79508894, 1991.61383734, 17.57799148, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2ba949e5-b916-4a32-8aab-f8e1e402f36a', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-23 10:27:03.201861', 1847.80801744, 2132.17169148, 44.45154062, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8084afe5-599d-4bf8-92ba-357df5e00a8f', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-23 10:27:03.201861', 1843.98382649, 1976.74505281, 30.44564973, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('65bd0d78-7b1e-4131-b3b9-6be6cf550f05', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-23 10:27:03.201861', 1832.30852196, 2057.37477878, 37.59804337, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0f1a36b5-95a8-498a-b1c4-286c086c3e31', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-23 10:27:03.201861', 1937.95678776, 1972.18346368, 9.48241202, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('84331f18-2133-43e5-9823-226932de5853', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-23 09:27:03.201861', 1837.01798198, 1953.77560753, 0.69578969, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('08e8bcfc-9654-4194-8306-53392cabf9fe', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-23 09:27:03.201861', 1804.96926837, 2039.31531325, 8.50426662, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('be19bca2-3fdc-4b25-bb2d-e28da02b126f', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-23 09:27:03.201861', 1861.49221540, 2060.24854180, 5.66377915, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('189f1400-b034-40b4-b173-fb859fd95233', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-23 09:27:03.201861', 1829.23733439, 2095.51402865, 44.39392378, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('24ab1de5-4635-4a1d-a5a5-0892783f6f87', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-23 09:27:03.201861', 1907.14919054, 1961.43927936, 3.08762866, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b9b0f90d-0f61-4f92-9a29-e08ec357451d', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-23 09:27:03.201861', 1937.13653919, 2076.46480762, 49.29532987, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('256a473f-a859-45c4-94a8-30ea2aeb9786', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-23 08:27:03.201861', 1832.23877486, 2072.68276268, 43.38736389, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f8de24c4-9b9c-4fae-b4b3-b724c580c6f5', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-23 08:27:03.201861', 1824.38425646, 1897.94060265, 20.01000014, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('64cbef51-69a2-45a0-982f-30244305c7e5', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-23 08:27:03.201861', 1919.68071910, 1910.61764873, 39.18130067, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a9446135-4a83-4efc-9d47-b1031d0f9a51', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-23 08:27:03.201861', 1923.79228656, 1974.09493602, 26.07518401, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ae41857f-b07a-4e6a-b2ae-4335d75fcfe5', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-23 08:27:03.201861', 1856.11251672, 1978.45244098, 27.02597460, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c2b819f3-e349-4a66-af0c-dc1b5ac1a79b', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-23 08:27:03.201861', 1960.86425307, 2057.71442349, 21.32436984, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a004068b-6da9-4df9-9c4d-4f0d7c27699a', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-23 07:27:03.201861', 2008.71402062, 1914.05750596, 0.81605803, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b5549f2e-c3bd-439c-8d90-102a5454fbfd', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-23 07:27:03.201861', 1939.19103484, 2045.21954961, 45.14347087, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('38ea4a21-f1b8-4691-9a0d-512003673dbb', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-23 07:27:03.201861', 1867.21724923, 2038.39243981, 42.91002820, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('eb362faf-03a1-4a18-b2a8-7b934f1ece4e', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-23 07:27:03.201861', 1894.05354069, 1985.01179973, 20.67352377, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('de793708-e535-42ae-a7be-f665eaf60aba', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-23 07:27:03.201861', 1948.48978612, 1865.15153662, 40.09554592, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e784eb0c-393b-48c0-9b27-24e1036e0ac6', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-23 07:27:03.201861', 1930.30162979, 2017.97269512, 28.82920113, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('27ea6f31-c73c-4b9a-9b52-82122fb8e9d3', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-23 06:27:03.201861', 1893.51221160, 1980.39789621, 30.02461251, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f69562c1-626d-454e-a432-a343dbf0f182', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-23 06:27:03.201861', 2084.46941556, 1860.07531929, 7.43912515, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('dd9498e6-a6e4-4279-84d6-f69a82067eef', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-23 06:27:03.201861', 1895.18287707, 1867.21520500, 35.78246840, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ff7bda30-966c-4f64-8d77-9c28bd786905', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-23 06:27:03.201861', 2072.44381351, 1959.15777681, 6.39395044, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b273cd31-8d1d-48c3-9bbe-b79cadc1cb73', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-23 06:27:03.201861', 2033.05246320, 1964.34511139, 48.80058770, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('759761ef-3427-4617-8dda-576a7cba2d66', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-23 06:27:03.201861', 2000.92452493, 1939.33730581, 44.72865169, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('13652d79-c7fe-49b0-a8d4-ddcd34a49437', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-23 05:27:03.201861', 2079.90840385, 1783.94640106, 25.94403503, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b18a76e6-0121-4572-a29a-7b5ce80cfac4', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-23 05:27:03.201861', 2060.15699903, 1912.08164963, 42.69339333, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('73b63a25-4e4d-4165-b4b5-96c920c3f845', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-23 05:27:03.201861', 1942.41824902, 1928.66019653, 9.85981626, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6c480094-d3ff-4920-8cd6-94b9d140c81e', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-23 05:27:03.201861', 2059.41255851, 1954.11468556, 31.41073064, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e8474d82-b9dc-48e3-8783-a2f2fcba9682', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-23 05:27:03.201861', 2086.00044849, 1872.16717901, 36.20003394, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('3bdb33a2-3197-4ba7-a4f5-0c0fa5291d0b', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-23 05:27:03.201861', 2046.40876212, 1783.03387234, 1.26696277, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a7ef5cdb-2389-44d1-ad66-98d39314423b', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-23 04:27:03.201861', 2074.09788256, 1786.45583386, 40.61909531, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9bcb4e93-9408-4713-be54-f789e80e8d2b', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-23 04:27:03.201861', 1946.03920594, 1857.55794853, 36.63579677, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7aab3863-b1ab-4be0-a93b-c415ecd1870c', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-23 04:27:03.201861', 2030.69467296, 1917.31518713, 28.77335223, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2f36c1f3-7c0c-4258-843e-7fc5b21e6791', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-23 04:27:03.201861', 1952.68082803, 1891.06703271, 39.36648720, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('15306b9d-907c-427e-8a5a-345f888c35ad', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-23 04:27:03.201861', 2073.94771264, 1843.35925708, 46.87280675, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('5b5ab75d-04c6-4e35-8c72-0a1a180d19e0', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-23 04:27:03.201861', 2021.47198021, 1797.91257235, 28.84289237, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b1bb3afc-764e-4a26-972b-f1e07a751484', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-23 03:27:03.201861', 2156.77087929, 1765.89081123, 33.43240855, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('824561f6-3f84-42ca-a610-c29b9f91f3d9', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-23 03:27:03.201861', 2162.81774324, 1789.11973369, 40.17278115, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c4ff8450-a3af-462a-9820-168bc14c46a4', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-23 03:27:03.201861', 2049.12528955, 1832.11360617, 12.90541135, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0bfee302-fd52-4a21-9759-81827e815c0b', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-23 03:27:03.201861', 2005.93485791, 1869.62363770, 16.24026657, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('5f8e3d32-b7ad-4df1-8693-5921bc5bd8a9', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-23 03:27:03.201861', 2004.01471696, 1687.96991697, 22.38704439, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('371dd6d5-697c-4446-9673-beddce3f62aa', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-23 03:27:03.201861', 2042.71026691, 1758.84601258, 31.09617417, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6fb714c4-543e-4122-a423-5b444d80b90c', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-23 02:27:03.201861', 2047.99816933, 1803.74432653, 41.56675917, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('579fa821-63ef-49d2-85c8-82a279cd887f', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-23 02:27:03.201861', 2114.59317296, 1674.85857398, 41.71780647, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4b651b0a-79e6-45f4-ab93-12625cda54be', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-23 02:27:03.201861', 2067.86330624, 1766.62781122, 9.55495965, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2548d981-f01a-41f7-8020-8261bb64c0ba', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-23 02:27:03.201861', 2120.13844758, 1660.28004401, 36.01220093, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('fee523a7-e6ce-4477-882e-7eae96034681', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-23 02:27:03.201861', 2139.27619808, 1795.86912790, 1.30340559, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ab316681-dbaa-4554-9c18-ab56fba4ae96', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-23 02:27:03.201861', 2076.91031927, 1652.46049448, 4.40233563, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('30ae9e27-5369-499e-b14d-55b7fb9dc77f', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-23 01:27:03.201861', 2071.88135811, 1722.67369991, 4.17076107, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9d759af0-5449-42ba-93e9-d21ce541fdb0', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-23 01:27:03.201861', 2008.95202628, 1615.99952558, 2.73904509, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9a6e4199-7348-42db-aa61-c62ff6a3e72b', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-23 01:27:03.201861', 2007.02757573, 1604.44852104, 24.11121049, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f00785ad-2d38-4628-95a2-9ab175746030', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-23 01:27:03.201861', 2010.23999268, 1606.64957617, 26.66970020, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b4c6f649-f504-4711-8409-05a5c15d3efe', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-23 01:27:03.201861', 2071.16075073, 1699.74703917, 1.72905003, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('29211fd8-d931-4ebf-bea8-60e3916685a8', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-23 01:27:03.201861', 2034.10700969, 1646.63040518, 16.99091372, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e671cc7b-6f4d-436c-a4f8-4509adb24ca4', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-23 00:27:03.201861', 2146.11809619, 1646.68538848, 11.38859143, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1a1f66ca-a209-4465-bcee-b3a6abe049cc', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-23 00:27:03.201861', 2028.03395093, 1543.63269525, 36.95298111, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d11397e4-0a08-4ac6-95fb-83bde6abdb4d', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-23 00:27:03.201861', 2185.03116593, 1561.93798236, 18.96355621, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('646db7d7-c8de-468b-ba1d-da0aa996ab06', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-23 00:27:03.201861', 2029.37106085, 1535.76652724, 29.73546975, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('fdc8538f-5ad3-49f9-9e1d-b022f71899db', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-23 00:27:03.201861', 2099.78952459, 1633.39659784, 27.61794347, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('bd815a50-7a85-4a18-8a69-e571b24cb533', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-23 00:27:03.201861', 2127.60286020, 1551.26579840, 3.64405896, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('76791a52-41ac-4062-baf6-f718ca56d6c4', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-22 23:27:03.201861', 2000.66224831, 1505.03169669, 7.83318898, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a60890d4-b216-43f7-a648-73c6d6b42f34', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-22 23:27:03.201861', 2020.55540050, 1489.56026637, 38.44688819, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('82630a9f-7f2c-4acf-b6eb-0b2f4f6da144', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-22 23:27:03.201861', 2004.67780625, 1540.47565467, 26.08215420, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('661ce02a-2f5e-4c33-a8bb-aad08bd077b0', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-22 23:27:03.201861', 2142.02768850, 1540.70197693, 7.01591324, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2dd9117c-49a7-4dcc-b7ba-59bfa16e0f75', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-22 23:27:03.201861', 2041.06856109, 1678.68470354, 30.95525887, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e4ad8eea-ea9e-475e-983c-6914da68c394', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-22 23:27:03.201861', 2075.02649490, 1547.51908938, 28.72157664, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('dfde0964-f66a-496d-9f62-defe527cbdbb', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-22 22:27:03.201861', 2092.45831705, 1565.14014587, 43.30825972, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ef300a3f-8868-4317-8322-71914d15df37', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-22 22:27:03.201861', 2152.63083559, 1530.60049046, 42.84857147, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('46768842-d694-4a45-b714-7507080e776f', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-22 22:27:03.201861', 2122.16682293, 1502.61242172, 30.90167884, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9db44db3-99c6-455c-8cce-2d77e0990d32', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-22 22:27:03.201861', 2164.23242919, 1464.81288242, 9.62641432, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('afdd321a-6e06-4692-861f-6b3c59080127', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-22 22:27:03.201861', 2130.02823422, 1586.77170840, 40.86123760, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('69af62cc-c35d-4e69-9de4-04a985f23031', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-22 22:27:03.201861', 2062.44570637, 1633.43522958, 39.54709297, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b5e20b94-4a9a-4c0b-8d84-b3d2e09c6723', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-22 21:27:03.201861', 2084.68978051, 1486.48366562, 33.11160754, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('19944c9c-ffcf-478c-a38f-9b9a90245991', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-22 21:27:03.201861', 2076.40370705, 1545.07795112, 14.99429256, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('54ca629c-34a2-4280-ba69-d799e8ac7f70', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-22 21:27:03.201861', 2028.73741535, 1389.91566034, 26.96224511, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('32db9319-2d5b-4f07-ba13-417ba3a7c89e', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-22 21:27:03.201861', 2000.66675003, 1434.77097544, 41.26369567, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('39919588-178d-46b0-a170-a6b22d23e1ff', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-22 21:27:03.201861', 2041.70862291, 1570.72961925, 21.78939730, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ec93e995-c76b-40fe-ab00-7fe6b9c46c36', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-22 21:27:03.201861', 2087.95006471, 1436.85501800, 1.57280137, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c299a297-af9f-4b36-825d-094c7e976a44', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-22 20:27:03.201861', 2075.91554260, 1529.03812833, 24.14332086, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('438945d7-36cd-443f-9db0-1f95d4973df3', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-22 20:27:03.201861', 1996.25973899, 1490.35328709, 37.87756856, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d1002da7-f081-4794-b86b-94c988f6f104', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-22 20:27:03.201861', 2117.91296130, 1488.21679285, 25.94570544, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('746aaa56-c64b-47ab-9014-d4d0fc2dcc0d', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-22 20:27:03.201861', 2080.43856589, 1436.64524478, 33.76024530, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d888967c-e2fc-43a6-9cf7-7425ce4c4144', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-22 20:27:03.201861', 2139.30350853, 1341.88815582, 27.65463579, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('bf5fcc37-7638-4756-ba2a-3f2489cbfba0', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-22 20:27:03.201861', 2117.89622472, 1404.21799887, 1.24884572, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7351d11e-7106-460a-9729-2818d3fb6784', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-22 19:27:03.201861', 1979.24015362, 1319.72852861, 7.10152558, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2acb8b24-3e8d-4bbe-9a41-d755490cc95e', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-22 19:27:03.201861', 2050.95999914, 1341.56816601, 25.08518950, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('815562b5-74a2-40e6-9ae0-1aad4cbfe33f', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-22 19:27:03.201861', 2037.38226354, 1488.64201696, 15.80816882, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('82bd1736-b75a-4017-9112-db4cc1cb00f2', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-22 19:27:03.201861', 2056.37280318, 1489.54629862, 35.48581912, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('182a4a16-90e5-4892-95ac-25ca8cad57df', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-22 19:27:03.201861', 2090.23958326, 1467.03087991, 5.29388042, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('535b1b4c-72f9-4322-abbc-ceb1e074b0a4', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-22 19:27:03.201861', 1988.72734691, 1297.09265768, 19.86928752, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('364859cd-a272-448b-a8b9-30b58d566b21', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-22 18:27:03.201861', 1991.64970356, 1366.89847071, 18.51169134, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6a1fc24d-db4d-4e7a-8fbc-25de02ad0f45', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-22 18:27:03.201861', 2056.76955207, 1325.27880101, 49.86680543, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a5de34ee-e459-43ba-bcd0-2a09cfc5b952', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-22 18:27:03.201861', 2059.93148324, 1388.55218934, 32.22907001, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('79fda971-acc5-4889-8570-55275f96dbce', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-22 18:27:03.201861', 2041.63357441, 1248.59560813, 16.31286315, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('84477565-995a-40ff-9288-722a03a957a9', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-22 18:27:03.201861', 1960.23644480, 1336.64245567, 5.52710734, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('279f68d5-1704-40ed-8206-b62b4cfb26c8', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-22 18:27:03.201861', 1975.44751371, 1437.19648285, 49.62518878, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ece67eb1-2db1-4c6e-8971-c1c672fd0c95', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-22 17:27:03.201861', 2027.02565824, 1353.80193726, 43.59675726, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d3fe8ff3-42ba-4393-9be7-02bfe50026bc', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-22 17:27:03.201861', 2068.78764566, 1261.09381409, 39.86955672, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('3d7ce7d3-d6a4-4ea6-988d-f1ab98e03a77', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-22 17:27:03.201861', 1915.68854059, 1348.06684826, 28.18842896, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('855cec5d-8089-43a9-bb75-f8c656f95722', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-22 17:27:03.201861', 2017.54462065, 1206.74323101, 20.39532062, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('5247a4d7-1c6d-467c-b604-805e0c2b9188', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-22 17:27:03.201861', 1997.50476384, 1325.19272493, 30.14290139, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1945cbcd-00b1-4cc8-87d3-52df0e773da1', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-22 17:27:03.201861', 2083.65782837, 1372.66758739, 18.12419547, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('045bd433-d46a-4844-93b5-2ef12e6be5ee', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-22 16:27:03.201861', 1963.70932707, 1336.77278378, 5.85923582, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('95146994-4f4b-400a-a37c-1ad2a7447648', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-22 16:27:03.201861', 1950.42463174, 1358.00575170, 11.66015936, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d7c7dc45-1aea-4d5c-bffb-c551acdd2e69', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-22 16:27:03.201861', 1914.77268006, 1202.89852689, 10.47282671, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0ac56570-69b8-4eb1-aaf7-8640f6b99a94', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-22 16:27:03.201861', 2012.26331967, 1319.62359561, 39.49952381, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('85050ab8-ef11-45b5-882f-1e67132350a8', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-22 16:27:03.201861', 1916.22703266, 1224.89798089, 27.66758367, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c6c690d7-1e5b-402b-9b6f-6c9e52602d79', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-22 16:27:03.201861', 2017.85728667, 1350.76081054, 38.58627768, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('522c17ef-255f-4922-851b-670fafc024ce', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-22 15:27:03.201861', 1905.69304908, 1213.86425471, 29.54226480, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f3e26344-5c83-40dd-b7e9-c4be011006b3', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-22 15:27:03.201861', 2033.48701013, 1186.03507096, 12.34430478, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e6a87c8a-151c-41e3-9d16-a2f2f0550600', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-22 15:27:03.201861', 1981.19031144, 1301.51380114, 1.72580482, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c3504742-263f-45cb-a7bc-f0405db9f0e9', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-22 15:27:03.201861', 2028.58873507, 1291.49294629, 9.68706447, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e190c453-9658-4a47-9844-f38c102bae2e', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-22 15:27:03.201861', 1893.58789164, 1194.02098173, 6.97786558, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b8940dd0-e751-49c7-961d-19241e16a512', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-22 15:27:03.201861', 1859.15050944, 1225.43497792, 39.19726626, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b33bbf04-4b83-4b55-b85c-69fb64c05f42', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-22 14:27:03.201861', 1909.85213505, 1291.13207446, 43.93434878, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('562ad0fa-7c5b-48b5-9723-0209f317b804', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-22 14:27:03.201861', 1962.88605797, 1265.20934235, 4.77917188, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('72988453-7888-4353-8299-34d0a60d14f9', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-22 14:27:03.201861', 1989.70436257, 1190.66609760, 41.92877799, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b5f6d165-7abd-43d1-8e82-65b0ede18871', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-22 14:27:03.201861', 1832.89101235, 1123.89583797, 19.85532579, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('07c9d0df-f000-46fa-966f-cf7aa869171b', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-22 14:27:03.201861', 1937.65518588, 1170.08280884, 11.72743818, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6482a772-41d1-4142-8d99-7a1ef6bb67b8', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-22 14:27:03.201861', 1811.14637860, 1255.86367067, 47.10453799, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('cd0f7c56-b39b-4767-aec8-58e351deeb0a', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-22 13:27:03.201861', 1814.72618777, 1230.73632567, 6.22730466, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8ee08549-bea3-42d6-ab62-12eca8da6638', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-22 13:27:03.201861', 1857.45781986, 1110.14838996, 18.61038739, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4c9a58df-922a-4a15-b87e-e9d539ae132b', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-22 13:27:03.201861', 1923.07574594, 1176.83586933, 20.20998217, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9ecd6e5b-cbfc-4d80-a5b7-0a79f941d826', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-22 13:27:03.201861', 1860.75644503, 1169.52593033, 22.29430777, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c6da293d-d376-4b6a-968f-6e50ba5adfe9', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-22 13:27:03.201861', 1866.55494634, 1241.22452765, 41.90141166, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8cb654e4-6123-4c64-8b11-d7e66c08e258', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-22 13:27:03.201861', 1914.49824116, 1088.12545932, 45.77389396, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f1dda271-020d-4b04-9b21-b56d2c62b343', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-22 12:27:03.201861', 1721.71217082, 1066.71839796, 12.18434482, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ce856f36-9677-4b5b-9039-1ebfe1c78bd7', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-22 12:27:03.201861', 1745.88333975, 1220.40258512, 28.68018766, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c5aac82e-0300-4dad-975c-dcab6aca00e4', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-22 12:27:03.201861', 1906.50535418, 1139.08536672, 5.29325184, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('691fd6fb-2745-4eef-bb0b-1d60f3848ba4', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-22 12:27:03.201861', 1853.77595949, 1195.10534681, 37.35877756, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f5721ab3-92c1-461c-be14-d53fe239d8f9', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-22 12:27:03.201861', 1907.68386475, 1078.68209875, 12.39741870, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1ad3bf14-973a-4580-91fa-eabe28d6e72b', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-22 12:27:03.201861', 1740.93329412, 1209.12662859, 12.03655995, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('17767a5f-3832-4a7d-914a-8e54a8ab8133', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-22 11:27:03.201861', 1696.01247258, 1101.26337105, 41.95044120, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('be11d66d-31d3-4c89-865e-058101d61bd2', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-22 11:27:03.201861', 1792.51429423, 1169.20168699, 24.40021856, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('cc45b87a-0a49-4e86-936a-7d6034849722', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-22 11:27:03.201861', 1667.84096610, 1106.38038700, 29.24326957, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0dc155c3-82a6-4f57-8fa3-f6fa67563fa3', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-22 11:27:03.201861', 1737.96484770, 1158.93556568, 44.40029061, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6bfefa72-56c5-4ed3-980a-aa7ec6d415f3', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-22 11:27:03.201861', 1863.32978185, 1198.04715102, 28.49607732, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('bfd6defa-5e66-44ef-9580-c0a4f04ea5f1', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-22 11:27:03.201861', 1723.72630332, 1080.04543999, 48.41390472, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e743e241-e190-4b0c-b0ff-89a19b0b3bf4', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-22 10:27:03.201861', 1679.71511580, 1028.94960212, 30.34144275, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a18c6090-e287-4a16-940e-e04e0d60b30a', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-22 10:27:03.201861', 1655.53058385, 1206.33079572, 2.26137728, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6d1fe946-40b3-45bb-8449-9f3b2e85a31c', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-22 10:27:03.201861', 1777.70749251, 1117.13161462, 35.76928216, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('43d9f2d9-22b0-49a2-9567-386a683396fb', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-22 10:27:03.201861', 1717.08276464, 1111.63315873, 10.21341526, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6d0d8ce0-1134-409f-b39e-ebd7cb149b9e', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-22 10:27:03.201861', 1743.85701352, 1017.64763367, 17.86376126, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('152a28ad-101c-4981-b26d-f247852b7020', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-22 10:27:03.201861', 1623.90048387, 1147.49597728, 13.18706440, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7b695d8c-c126-476d-97da-8184cbeb0903', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-22 09:27:03.201861', 1674.88276061, 1039.46568071, 9.51807004, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4024eaf8-ff57-472c-863f-9debf2dc15b8', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-22 09:27:03.201861', 1580.16441638, 1132.45543361, 29.32071161, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0469a6a0-cd3a-47ea-baa5-30b899911500', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-22 09:27:03.201861', 1590.33536266, 1099.70224195, 36.49856597, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e6417dbe-0892-4650-b416-12b52983ecd4', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-22 09:27:03.201861', 1735.49804693, 1106.69826133, 35.11324195, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('54fd6bcc-45d8-4440-91d6-f3ed428b1559', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-22 09:27:03.201861', 1670.59930536, 1187.56999673, 15.45328113, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0e3d0aca-294f-4dc5-a874-4b2b464e02bc', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-22 09:27:03.201861', 1646.52610553, 1010.73262925, 19.02118868, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b997a2f2-dafe-4701-aa14-1096932c6b21', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-22 08:27:03.201861', 1672.31903592, 1149.25150943, 12.06112689, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4c87513d-c6d6-4c80-8a74-f630a2008b4e', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-22 08:27:03.201861', 1521.67258457, 1113.67741153, 11.34136579, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f5d09e95-4386-4fef-86d9-370ad9233928', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-22 08:27:03.201861', 1701.64353277, 1126.45555530, 9.89462137, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('35318a3a-9c3f-48b1-ae81-bdea9aaa6de4', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-22 08:27:03.201861', 1639.79463869, 1161.02789924, 15.46694554, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('96cfa2aa-15e2-41f7-ae94-59a1ad15a0a5', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-22 08:27:03.201861', 1623.70127330, 1008.82717319, 3.46431155, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('48028506-e6c6-4c66-9bd2-38f6640f5332', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-22 08:27:03.201861', 1571.50964122, 1070.30380356, 4.90224075, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('feaa66ba-5b63-4537-90e0-c01e89e44572', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-22 07:27:03.201861', 1629.30276550, 1064.63372273, 19.17011527, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('fc5effdd-05e2-4113-b0f0-f90ffd196f53', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-22 07:27:03.201861', 1632.40315812, 1016.88869755, 38.53622216, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('801cd3f2-d92b-4397-a680-bca012476475', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-22 07:27:03.201861', 1542.07029523, 1040.70454659, 29.73331181, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f5b4c239-1f71-471c-b6f1-202bbc2348d9', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-22 07:27:03.201861', 1533.50977479, 1035.62449061, 1.12333689, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e10aafcd-8150-40c1-b0cf-fdfe8e7b3cdf', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-22 07:27:03.201861', 1531.63087909, 1034.25597905, 6.86418896, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c7c3bd6e-b281-4c5a-bdea-57defeb591b4', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-22 07:27:03.201861', 1512.95601466, 1124.97360344, 46.64002704, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a390e345-e87e-45ba-af7d-59a139ba10b9', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-22 06:27:03.201861', 1532.60246346, 1046.38882907, 40.88488666, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('95c90eaf-6e90-437c-80d6-3d937d03fff7', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-22 06:27:03.201861', 1512.59222399, 1166.59655131, 49.17759656, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e14251d3-5fdf-4036-bac9-d94bdbf6ec7d', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-22 06:27:03.201861', 1569.48908124, 1098.81598718, 18.13328248, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('490a3d15-e373-4dfa-941c-3f7a8b1be5a5', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-22 06:27:03.201861', 1448.35967220, 1176.45056549, 37.42780462, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('5b8752e4-7964-4d1b-af5e-4294e6fd59e0', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-22 06:27:03.201861', 1438.66653219, 1151.66397752, 24.60640671, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('adea2e06-2e24-47b8-a678-f9fa5e24860f', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-22 06:27:03.201861', 1424.91664937, 1166.53299699, 16.29600091, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b82f21a1-a1f5-4666-bcca-00e2a70ceca2', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-22 05:27:03.201861', 1407.80658952, 1128.65087966, 14.61557595, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('22eb55fd-3088-4b1f-ab0f-d52ae0ac0794', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-22 05:27:03.201861', 1525.72609278, 1102.33276115, 3.63019077, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('02bae07b-c6ca-47ba-ba48-90fde4c15b1a', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-22 05:27:03.201861', 1458.44266818, 1084.56717068, 26.40036003, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6194c366-64a2-4f5c-902b-43c05121dc44', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-22 05:27:03.201861', 1477.96915011, 1151.37659400, 21.59187914, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('3f36fe3b-6128-4bc8-81a9-f0cfb2069efb', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-22 05:27:03.201861', 1482.46741293, 1074.46156652, 39.85502433, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('14b5289d-108e-428a-be25-d74884191e37', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-22 05:27:03.201861', 1509.47288958, 1103.95438183, 14.68422847, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0164466e-309a-4b9c-beff-b64bf17b1725', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-22 04:27:03.201861', 1507.45115443, 1113.14371163, 29.94103165, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8cc97477-56e0-41a3-8184-115dc94947d6', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-22 04:27:03.201861', 1407.19526743, 1122.40731397, 36.62179639, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('26bcfeb2-97f6-4900-96cf-ba504a29bea8', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-22 04:27:03.201861', 1337.11562831, 1221.57906993, 29.91626223, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a597e366-eced-450f-96ab-68e05c94d7c3', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-22 04:27:03.201861', 1499.64154687, 1087.06504821, 15.95527426, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('cc0a5d7a-25d4-4f01-8626-69fe45a8db24', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-22 04:27:03.201861', 1355.07003326, 1055.24046702, 22.72012833, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1e8be276-66b2-406f-9b41-368e7057af56', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-22 04:27:03.201861', 1501.34194882, 1133.90022756, 36.49639382, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('37694b12-bf64-44bc-9646-b8befe4663ff', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-22 03:27:03.201861', 1451.86016661, 1198.14716065, 25.20792501, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('dae27df7-2661-458f-a744-8bd81f725306', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-22 03:27:03.201861', 1360.50763502, 1166.94359761, 48.45542021, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f0b255c1-12da-4057-a42f-461e9ff21228', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-22 03:27:03.201861', 1330.26908775, 1178.50764869, 40.07412689, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('34221d07-dbc4-4b5b-8f78-d8980cf4fae5', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-22 03:27:03.201861', 1343.21375647, 1167.11627564, 48.34330989, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('718ca0ef-cd92-4ec2-9785-1c5449fbb34f', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-22 03:27:03.201861', 1369.75508178, 1226.58305905, 43.64339535, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6882a744-2425-4688-b74a-f4865e6dc689', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-22 03:27:03.201861', 1459.05696091, 1079.76833953, 49.38676504, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('fce7234a-e089-4d77-aaee-db34a8b04758', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-22 02:27:03.201861', 1268.38473958, 1153.41129314, 30.49219463, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('93a476da-6a56-41ab-a9ac-df3be27217c8', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-22 02:27:03.201861', 1356.20962152, 1091.21829483, 2.89531417, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f6e21f11-378d-430e-9415-73ea3c721263', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-22 02:27:03.201861', 1374.13900073, 1144.33196592, 43.89067383, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('930b3245-6d7c-40ca-9625-91fe9d25fb18', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-22 02:27:03.201861', 1264.94348831, 1143.25620648, 18.49619532, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f40eb9b3-6e16-4c8b-87d0-7caa32394cd4', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-22 02:27:03.201861', 1357.21154240, 1129.43656242, 44.48145547, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('aeb84b9b-b7ac-4c2e-a5e9-a2fc35dd32ee', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-22 02:27:03.201861', 1262.60130518, 1231.11868298, 7.73387769, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('78ae9f8d-659c-4199-ad9f-d29e21dc060f', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-22 01:27:03.201861', 1304.38320169, 1138.94534239, 18.02851598, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2832bf33-cf93-4733-badb-3d2f5c4d5326', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-22 01:27:03.201861', 1217.35803633, 1205.55257225, 8.32056241, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f0dafed4-285c-4a61-a202-444b4b5f9b12', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-22 01:27:03.201861', 1319.91014732, 1111.44787595, 48.95049462, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('677a4cc9-323c-4fc0-8260-463c9a0619aa', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-22 01:27:03.201861', 1372.94662101, 1268.34937732, 47.99926489, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('024b42d1-f170-4608-b837-507d986a95a5', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-22 01:27:03.201861', 1336.89403972, 1274.36689335, 14.98092085, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('81c6e8fa-34d8-4658-abb8-af6384b9f699', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-22 01:27:03.201861', 1307.50091965, 1259.74873197, 34.00790384, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('179fe1bf-c5ba-424c-9a50-8d8e03dcc5ff', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-22 00:27:03.201861', 1301.80931444, 1330.61639710, 16.05865443, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('cc624e28-fc9e-4b07-841a-a0bc74e72fa8', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-22 00:27:03.201861', 1207.30878128, 1216.57581089, 22.21474644, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('cd35ff33-8aa1-4224-9fa8-65a610bbbb18', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-22 00:27:03.201861', 1260.95752289, 1188.90305752, 4.61959269, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('14904772-7bdc-4b27-8891-0fa3374529c7', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-22 00:27:03.201861', 1170.65486106, 1299.14058385, 47.57079861, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7c63275d-5166-4fe1-ba28-eefe4d21bb28', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-22 00:27:03.201861', 1287.61996839, 1325.07594988, 1.59584364, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d009d738-0178-446c-9aec-9c239a1ebc98', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-22 00:27:03.201861', 1340.99610984, 1197.38771591, 47.71773363, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('580f4889-8151-4345-bd56-9e4582109bf2', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-21 23:27:03.201861', 1187.38153819, 1228.47482356, 21.98297516, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c527cccf-a0a8-45ed-b7f4-8108957862d0', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-21 23:27:03.201861', 1207.80481626, 1307.95780225, 31.36284617, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('39fc165d-3d0f-4d2a-95f5-750b0c0fc931', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-21 23:27:03.201861', 1315.86736732, 1270.66181917, 26.26711413, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4d21e888-ba86-4eb5-b3f9-e4b041d84b9d', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-21 23:27:03.201861', 1219.31496152, 1248.90919649, 39.49079698, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ee9f7d34-7161-451f-9d32-2bc51024a004', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-21 23:27:03.201861', 1273.38005878, 1247.37461749, 8.61433244, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4451554d-80b2-4498-b429-a057428da63b', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-21 23:27:03.201861', 1226.64231958, 1305.94487620, 14.87635204, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e4ff5af0-c3b8-49c3-85b7-a54dcaafcd07', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-21 22:27:03.201861', 1290.16553752, 1213.82309049, 17.14520890, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('bfca2761-09bc-4e6c-888d-d2295bae32b9', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-21 22:27:03.201861', 1198.66466385, 1383.90493038, 48.35653452, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0e13191f-251a-41fe-9b6f-5f40b1aa18a0', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-21 22:27:03.201861', 1264.60964553, 1228.44751876, 17.46347900, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8d3795ee-9245-4fc7-81eb-68382a281648', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-21 22:27:03.201861', 1203.04659064, 1326.22459025, 2.73418500, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f458baf5-9c41-4309-9f24-bdc21eaab200', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-21 22:27:03.201861', 1225.83286254, 1384.46638704, 10.84213732, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('95ab39b5-4e00-40a2-afca-f1c5da3a32d6', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-21 22:27:03.201861', 1091.44384346, 1262.84672122, 42.05071113, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('38307693-0270-48ee-a1d5-bd2bf31fb9b6', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-21 21:27:03.201861', 1106.71564569, 1450.28447785, 17.34439876, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e67d3337-fb70-414b-a376-4fbaf116175d', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-21 21:27:03.201861', 1112.20959810, 1390.36275355, 15.68639713, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d1692a72-baf4-49b7-a2e9-d905212a86c4', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-21 21:27:03.201861', 1132.62640965, 1418.55435986, 24.30971286, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d7a97b03-9ae3-4ac8-9a22-2dd78fa94b23', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-21 21:27:03.201861', 1159.11758075, 1257.88119257, 36.54756366, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ea5fb78c-b52c-4b6a-bbf5-9109dc49c73c', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-21 21:27:03.201861', 1183.73789467, 1294.73836094, 33.99392732, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('47d42da0-be4f-40d6-a508-24fd953fdc3e', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-21 21:27:03.201861', 1094.56471100, 1389.03788181, 2.84760904, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e1197711-ffd6-420d-86b8-0d0258364b22', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-21 20:27:03.201861', 1043.54916848, 1482.61616695, 34.54354512, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('563c9360-fa07-430f-86bd-8dd96022f9ec', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-21 20:27:03.201861', 1168.31150103, 1493.20691904, 4.88044044, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('cd9c8467-010c-423a-8d7f-2d1d9f09bc3a', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-21 20:27:03.201861', 1212.20050209, 1357.81019296, 45.46745669, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('197c8bd8-43dc-4f5a-b8c4-8af042952f65', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-21 20:27:03.201861', 1169.90616056, 1360.63878688, 20.93253397, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4e7fe154-3e6f-48b5-8899-4f8ff90023a5', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-21 20:27:03.201861', 1133.87810183, 1448.20254939, 42.75464327, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('febd4dd3-a5d4-4f89-a804-4a7f689a0eb9', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-21 20:27:03.201861', 1176.90272822, 1398.80418462, 4.86017571, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('15a4cd1a-e67d-4204-9cf2-1ec05391f93b', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-21 19:27:03.201861', 1221.19706332, 1390.55921729, 15.66460482, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('cb1f8611-856f-4771-80b1-0ab4b83ebf37', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-21 19:27:03.201861', 1182.65551353, 1474.24649388, 42.94150172, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('beb059b7-3d39-4da2-a8d7-159590713b31', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-21 19:27:03.201861', 1066.33155278, 1350.33679455, 13.42960157, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('76db058d-ee9c-468d-aee4-0559dd2e0cfd', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-21 19:27:03.201861', 1053.56039835, 1449.10438179, 30.96639785, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('923dc067-a0c9-4e17-b42b-8a61a6ae331f', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-21 19:27:03.201861', 1078.27417288, 1355.59256950, 49.82398589, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('054f8ea2-ae51-464e-9181-b1229f3bc03c', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-21 19:27:03.201861', 1222.06563162, 1381.53102568, 11.24069595, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7b09edac-3a47-4966-8278-42f0a4b25d74', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-21 18:27:03.201861', 1077.02650713, 1437.51238217, 8.60282911, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('30d197df-2246-4ded-9b2f-7f9077a8e33b', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-21 18:27:03.201861', 1196.94766429, 1449.35986253, 0.10589360, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d7fb607b-f20a-42b2-ae86-b9f65fd52811', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-21 18:27:03.201861', 1077.99158573, 1398.52861895, 11.91220806, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('727ae7d7-c3b0-4acc-a697-c9a103b4fd9d', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-21 18:27:03.201861', 1129.83282392, 1483.51593437, 48.20161429, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2ba6f405-a34b-44b5-b0a4-aa5627a91525', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-21 18:27:03.201861', 1207.49811439, 1504.70939554, 49.97830585, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('98e02908-49af-474d-9d5b-6c7779f346b1', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-21 18:27:03.201861', 1135.30141655, 1417.15619472, 10.69259519, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b82437b8-37f8-42cf-b854-e3179156f956', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-21 17:27:03.201861', 1004.22781373, 1625.49838075, 28.25467555, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4febb41d-2e2d-4e1f-bf94-1ce5e9c76adf', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-21 17:27:03.201861', 1100.59794408, 1568.97713307, 15.52419411, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a2ee3285-bb7d-4c10-820e-700fb9472bc9', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-21 17:27:03.201861', 1195.51041451, 1585.94970713, 30.26954778, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f5148894-df91-4cf8-9b72-8d5b8414181a', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-21 17:27:03.201861', 1072.02338242, 1494.45677654, 4.00279819, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6a218a1b-0eb8-4f10-a533-3a2718df8ec1', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-21 17:27:03.201861', 1059.27202230, 1554.29031791, 14.65151865, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9d55110f-c7d2-4698-a0c7-acac002c3a71', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-21 17:27:03.201861', 1173.71285284, 1623.57659878, 41.87569764, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c2d926b7-951e-45aa-98b0-060c477492f6', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-21 16:27:03.201861', 1142.79541169, 1515.75493191, 31.86212510, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('93124abd-4f77-4e55-95e3-850518f17ce7', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-21 16:27:03.201861', 1030.01143767, 1548.05851047, 21.61171050, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6b975773-1c32-4149-b81d-f911049a19cc', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-21 16:27:03.201861', 1187.14953226, 1588.75133970, 37.19902725, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7b524ebe-7880-4e93-9c16-964e704559a4', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-21 16:27:03.201861', 1011.71052616, 1643.23533513, 12.16129715, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('13677a3c-b9ff-49b4-ac9b-96be9bbb18b5', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-21 16:27:03.201861', 1120.30386260, 1519.95877712, 6.00998344, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('45366898-27a7-4052-b57e-7cfda1139e61', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-21 16:27:03.201861', 1090.41163206, 1570.95220169, 2.95992369, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('474a9a7c-9be6-4398-888f-46b4761b2035', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-21 15:27:03.201861', 1063.83969335, 1596.41664753, 12.45541896, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a5de5ccb-d5b0-43c8-8fa1-b811293182f3', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-21 15:27:03.201861', 1050.74438488, 1644.94616495, 34.76808084, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d51505a2-882d-4c1e-9f55-cecbc4190505', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-21 15:27:03.201861', 1148.52315709, 1597.63543754, 4.67086522, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7bb14bfc-cbb3-44de-8ccb-8f39a126f2ed', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-21 15:27:03.201861', 1171.61437778, 1741.24532627, 30.84581500, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('3ce10745-31c2-44f2-b36f-0029c22e349e', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-21 15:27:03.201861', 1084.49226353, 1643.55266115, 3.10168720, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('404d8477-8761-4552-801e-a33ca41e2898', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-21 15:27:03.201861', 1170.44012950, 1596.80125540, 47.14465558, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8063f1c5-feb2-4d1c-820f-5c2d2db76273', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-21 14:27:03.201861', 1202.52852980, 1767.47145942, 9.97098271, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ad7adf39-9d05-4976-a9b6-c3fcf7e98c58', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-21 14:27:03.201861', 1024.81315030, 1598.66058845, 2.15767876, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('57d10974-cf69-4d05-93bf-985056735f1f', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-21 14:27:03.201861', 1193.60267156, 1786.93566532, 34.92169560, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('074b9ee4-79e6-4597-b5a6-7affc4003388', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-21 14:27:03.201861', 1096.78806157, 1746.69022101, 6.24083148, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2d043adb-8e8d-40ef-818f-c98677c8b542', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-21 14:27:03.201861', 1148.65310826, 1638.97555331, 23.20869333, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('111bb6a2-9e99-4575-9400-a59bc31348cc', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-21 14:27:03.201861', 1093.20395622, 1724.08887079, 7.36780239, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('31d32b1f-e3b6-4875-89bd-aa6b1267faa6', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-21 13:27:03.201861', 1029.89899315, 1651.45766958, 2.53300984, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b2c78118-0a0f-448e-9645-41047614d440', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-21 13:27:03.201861', 1107.51667574, 1809.88498192, 31.54459460, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c495f14f-3fc2-4c0b-890b-1ff097b1b561', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-21 13:27:03.201861', 1055.21700293, 1756.82460983, 20.26101235, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c3c8771f-da68-4dcc-aa90-d95aba2d5133', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-21 13:27:03.201861', 1166.29031347, 1799.26656511, 34.79609812, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d5acc026-fa66-49ce-8407-6bbbe6c35200', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-21 13:27:03.201861', 1210.03398844, 1655.48216411, 36.11282338, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d7de601c-71c2-4cbb-b803-5cd81f0ed03e', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-21 13:27:03.201861', 1036.66172621, 1684.62824592, 25.66688958, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4f9c760e-96cd-430d-8792-eedf5cb4e88a', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-21 12:27:03.201861', 1159.07536917, 1754.02180236, 8.03503878, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('35fb1131-e440-4e76-b728-1fefba64e422', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-21 12:27:03.201861', 1220.98299127, 1874.55849245, 47.35193257, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('97c1d591-0a9c-4d1c-8bd8-8347ee805d38', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-21 12:27:03.201861', 1152.12758864, 1857.87909668, 29.99440729, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e5701131-7750-414b-b4c9-4dc5a6baa59a', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-21 12:27:03.201861', 1187.77764053, 1844.83936830, 16.77610048, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('90abefa0-68b5-4f01-be22-38caacac7c83', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-21 12:27:03.201861', 1101.39744792, 1858.05465291, 27.63385931, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8ae79d2e-b671-4fd4-98e8-90aeb09d3680', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-21 12:27:03.201861', 1107.96152733, 1810.65786811, 26.19409261, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a7e7b080-effc-4d54-8957-5c729bba15ec', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-21 11:27:03.201861', 1233.01679776, 1771.42801391, 14.84966711, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('703aa371-a3d8-4700-82d4-b2a986d53f59', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-21 11:27:03.201861', 1171.22352077, 1829.60460016, 8.09446149, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9a3f0aaf-3e0f-453c-9f13-7a64fd205da0', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-21 11:27:03.201861', 1230.29923939, 1932.77485229, 39.67369608, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('db1a58b0-6bee-4898-8ffc-3bd7a90219c8', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-21 11:27:03.201861', 1144.33836532, 1911.69682741, 28.50567958, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('dd1ca80f-6b88-4cce-8079-39df2a3b2e95', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-21 11:27:03.201861', 1153.31888688, 1872.12839525, 15.25910955, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('bbbaf8c7-fde4-4896-9492-2fed93a885eb', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-21 11:27:03.201861', 1077.42602821, 1793.67586619, 10.60640293, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e47785ea-325c-42b5-9ff8-98f217c2906f', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-21 10:27:03.201861', 1090.29368920, 1818.11552425, 3.51211442, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('24c39d7d-b640-48d8-9a48-4ae4dc3288c2', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-21 10:27:03.201861', 1229.44247796, 1853.21898714, 11.47645402, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2d0483f6-26fa-4c52-a5e7-3999fa79c10f', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-21 10:27:03.201861', 1174.68822782, 1788.29514944, 14.67084751, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4f1e77dc-7852-4aa5-988c-d7e3a38940ab', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-21 10:27:03.201861', 1227.86529127, 1951.15480722, 6.51620902, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('53bd5ff8-6ea4-47e3-adfd-7b0a80c0dea2', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-21 10:27:03.201861', 1208.65569045, 1964.22704455, 19.83020848, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d48fa404-1ddb-4748-a57b-2d15d5b838af', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-21 10:27:03.201861', 1238.11025692, 1870.68763107, 9.94157196, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('402e3955-f324-46c2-8a2b-53ac64d9165c', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-21 09:27:03.201861', 1151.48597506, 1980.00209166, 4.39147980, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('55025246-797a-40bc-8937-199efec1ee8e', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-21 09:27:03.201861', 1212.56259259, 1914.76906084, 38.62151565, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7f57d36c-61c9-4a1a-8a09-d10d78c65374', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-21 09:27:03.201861', 1199.07613038, 1905.91386571, 5.65646927, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0ab246f1-0399-41d6-a1b0-80cb6b9cc489', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-21 09:27:03.201861', 1297.56924052, 1992.01490503, 42.48957520, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e61e0d7a-f25d-4ee3-b3a5-cc7fd29a270c', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-21 09:27:03.201861', 1236.75895287, 1945.95282236, 36.32899002, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('5f72af69-69dd-4454-9aac-a183f573dd48', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-21 09:27:03.201861', 1134.99213098, 1949.76655657, 8.81925136, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('37d9f5c2-2d33-48ef-aa36-4559788aa224', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-21 08:27:03.201861', 1159.74069139, 1911.30056158, 28.07130097, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e07cbe05-3c9f-48a5-8762-375bdb3941f4', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-21 08:27:03.201861', 1238.76155028, 1968.96042912, 45.42162630, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('3655d059-8f42-46bf-9f69-071d632e3793', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-21 08:27:03.201861', 1172.00881140, 2015.77891211, 13.74886801, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2f935b2f-0a93-4461-9f11-863c716dea9d', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-21 08:27:03.201861', 1318.08789440, 1983.36574413, 7.41339369, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e8fe7cc8-4061-4197-848d-2a772b32dbd0', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-21 08:27:03.201861', 1277.56821398, 2001.73286113, 35.06148141, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ec3e09f3-75c3-4e85-914f-ecc1261b5f9a', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-21 08:27:03.201861', 1284.95712226, 1880.23347277, 24.22164901, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7ae59fb2-73db-4a56-9b21-d189403869e9', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-21 07:27:03.201861', 1237.37980432, 1922.84457300, 47.61059607, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('586679f4-0b11-4899-81aa-7aa091119b2e', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-21 07:27:03.201861', 1311.41080779, 1912.40834163, 0.15210022, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('91341e34-d3e9-474d-88be-2b4c17473f78', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-21 07:27:03.201861', 1248.71521180, 2051.50158691, 17.79510024, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('bec162eb-8f00-49b9-8019-ac3b38a2cf89', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-21 07:27:03.201861', 1216.11411597, 1987.14209595, 37.36828476, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d57a3ecb-d32a-4897-8c4e-9c30a5373454', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-21 07:27:03.201861', 1378.94966657, 1964.61353222, 40.68694136, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('106a749a-6f30-495e-96ef-9120b96e84a1', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-21 07:27:03.201861', 1382.70219924, 1941.47957104, 43.87320101, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('83d14032-396d-4866-a713-a1c0d3a54545', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-21 06:27:03.201861', 1268.67741572, 2077.94008589, 35.22092843, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b2f4c54e-4a59-4a71-9138-a4aca61947dd', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-21 06:27:03.201861', 1228.18992006, 2083.64048017, 30.85613162, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c6f71aa5-3f0e-4569-8654-fbd2e3b9cb5f', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-21 06:27:03.201861', 1289.19568864, 2030.34735117, 32.01709132, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1694cf96-8503-4629-9b31-220046ac2c2d', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-21 06:27:03.201861', 1263.78887131, 2018.07106430, 21.39909449, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('62d125fd-6451-4fa4-8f97-f1be971617e6', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-21 06:27:03.201861', 1382.09040398, 1975.59099865, 27.51718342, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c453f868-e59c-4230-b89e-dc1aa7a9d931', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-21 06:27:03.201861', 1395.34971819, 1966.93890775, 16.55219124, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('44e75ebb-1fcd-4be8-8eec-2f7fcc82b13d', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-21 05:27:03.201861', 1409.95135211, 1967.87541329, 26.67895551, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4afcca77-0664-43c7-9ebc-61d2e86d014d', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-21 05:27:03.201861', 1368.71750762, 2035.52460368, 30.21200987, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('95ac0a17-2a80-44c0-ab95-e117b4b706ec', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-21 05:27:03.201861', 1386.42787299, 2073.13793735, 22.99276187, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9d827b87-90f9-43f5-9aaa-c95592a34aa2', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-21 05:27:03.201861', 1307.65973592, 2138.26211263, 19.89732478, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('04132329-ec3d-4126-8e91-b8ecab3c365a', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-21 05:27:03.201861', 1406.40559602, 1981.28467378, 12.84772040, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1a024d57-1be7-40a7-8237-8db6cfb4671c', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-21 05:27:03.201861', 1347.40859231, 1973.63693059, 47.19432554, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('21f4a0a3-6a87-46e5-b41c-bc384091904d', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-21 04:27:03.201861', 1394.57871480, 1970.82059658, 20.47616795, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ed5b140c-c403-41f3-bd72-50f658273d5f', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-21 04:27:03.201861', 1505.83863627, 2082.81628763, 15.60148521, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6fe6c523-54b1-45bc-bc6a-4945c0065e81', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-21 04:27:03.201861', 1476.56739179, 2025.99687248, 48.09153883, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('dc90e9d1-347c-4bd4-90a3-fe62b075dbd6', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-21 04:27:03.201861', 1325.35551941, 1997.35670668, 32.45597546, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('308a503f-d8b2-4e6f-9b74-a836541a8b89', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-21 04:27:03.201861', 1352.89037164, 2144.50231152, 5.94805602, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('bd17aab6-7e20-4565-8437-6a30a98c2f2e', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-21 04:27:03.201861', 1511.51685725, 1977.90131062, 45.21061087, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0320d2d1-fbb2-4ff7-982f-e9154f247c7b', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-21 03:27:03.201861', 1483.17136611, 2056.21743184, 4.73586890, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('3686e39a-1cd6-460f-b0b7-6c785dae5ec1', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-21 03:27:03.201861', 1493.53724213, 2106.99830024, 39.57385663, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ea68b08a-cebd-456e-ad23-4e4c3b7afee7', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-21 03:27:03.201861', 1503.05688372, 2138.47581833, 15.37705037, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a325d8e0-0f71-45f4-a8d9-71a1b81ae758', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-21 03:27:03.201861', 1393.93551205, 2165.08434621, 22.22265658, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('692cb74b-5948-4b8c-bee9-d2f88a44ac23', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-21 03:27:03.201861', 1534.57464064, 2176.41410612, 3.79244688, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e053c848-712a-469b-b9c7-037a43bdad00', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-21 03:27:03.201861', 1555.97493702, 2122.40417611, 11.75399352, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ba6e9778-4c48-49e0-8ae8-6d5959b432a3', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-21 02:27:03.201861', 1499.14340676, 1994.58723787, 47.44100073, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0db45c1b-8f32-4759-b64b-ef95c90e5b10', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-21 02:27:03.201861', 1446.28241783, 2107.77067721, 29.71462896, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('5f7f97b8-d281-4520-a46a-1511824e2be2', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-21 02:27:03.201861', 1548.90348960, 2187.45989688, 0.03471056, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('664dfde8-6e82-484c-b3fe-ea1a095e56da', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-21 02:27:03.201861', 1457.75984502, 2019.07686887, 28.58327000, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('bbf80c73-d783-49d0-a20c-6ba95b73f67a', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-21 02:27:03.201861', 1486.01352707, 2118.61227651, 37.65128167, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a5c80a8b-d262-44ef-b7e2-f337446eeb21', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-21 02:27:03.201861', 1504.37793507, 2188.64488649, 37.79760165, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7e495bcd-2a85-4ec0-9c34-ea4d0486e4c8', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-21 01:27:03.201861', 1491.07406667, 2126.61207456, 46.06423011, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('55d5efa1-5f77-444e-95d4-f56ed613ee20', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-21 01:27:03.201861', 1629.65769926, 2171.81087682, 7.89309796, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f6c4b426-ba62-4394-aaec-8253ca83eefe', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-21 01:27:03.201861', 1513.55548348, 2168.10337176, 32.64787665, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1f156e00-a68f-48af-a360-ceea62f28a6f', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-21 01:27:03.201861', 1545.97236666, 2183.49799207, 31.43109035, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('02a9a8de-2437-4fb7-a306-bec0983ab46b', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-21 01:27:03.201861', 1584.16289620, 2147.45206697, 2.21501747, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('731ce2ca-1c54-4ba4-bac3-8c15f61aa581', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-21 01:27:03.201861', 1596.82982934, 2105.39983601, 25.49851733, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6500df68-ecc4-4636-9a36-b9700ff31a94', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-21 00:27:03.201861', 1561.10978678, 2146.92808933, 8.20409587, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7c72dcab-7766-4f75-b609-bc122682b40d', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-21 00:27:03.201861', 1704.64690914, 2000.09751490, 7.06007677, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('102dc0d5-4a24-4eda-990c-f6f6f744e104', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-21 00:27:03.201861', 1662.68062648, 2184.13498448, 46.32073134, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('fd67a65c-ec26-4d4a-a10b-b3fc944de63c', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-21 00:27:03.201861', 1634.04647400, 2005.96859069, 30.06855920, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('469604f1-64b4-4e38-84b2-66cb12cfcc17', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-21 00:27:03.201861', 1700.39531574, 2052.44246302, 43.82690712, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d9798c33-ffdc-44b4-a3cc-ab2216fa5f95', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-21 00:27:03.201861', 1689.27960202, 2086.75647796, 40.24903165, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e8fcedc8-b8c0-415f-bb8c-6ec8bb31249d', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-20 23:27:03.201861', 1644.53361479, 2087.49503287, 25.94891663, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b15017b0-dbef-4069-9438-124a65213018', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-20 23:27:03.201861', 1621.44985547, 2003.49113058, 12.20243087, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f9b28f07-8a69-41f7-a11a-9b388f29cafb', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-20 23:27:03.201861', 1668.81033565, 2176.95794453, 45.02939215, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a580e562-9443-4990-af56-327a125726a3', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-20 23:27:03.201861', 1615.96589076, 2152.22462505, 47.63876369, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6bbb213f-309f-420d-9e5f-7f537e6798bb', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-20 23:27:03.201861', 1611.98983362, 2177.13522609, 40.10853160, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9ddfa435-f789-4abb-8c05-262f34ac1352', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-20 23:27:03.201861', 1734.88200372, 2104.54908879, 35.05045374, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e7cf6e09-1fed-4e80-ba0a-bd6978dbcebf', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-20 22:27:03.201861', 1729.92965760, 2158.22090607, 13.22861888, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9d87f9c8-5e35-4721-93eb-d89151dabcc7', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-20 22:27:03.201861', 1711.84163592, 2082.52454012, 8.58849485, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('db842e69-997c-4e8b-ada3-7e525e04587d', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-20 22:27:03.201861', 1676.77524081, 2001.90541018, 7.38200369, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b9460741-ec7c-4d18-b199-2e7330b44df1', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-20 22:27:03.201861', 1768.70807230, 2187.12578942, 36.05755429, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6e2b15e5-ac1c-4fee-820e-51754c41bd25', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-20 22:27:03.201861', 1798.86039067, 2075.04867834, 48.84213396, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('24c9c586-52e8-4dc0-8cc5-db82f85d8b88', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-20 22:27:03.201861', 1719.35644465, 2071.84406657, 46.19321009, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('5dea330c-b799-4e53-a3e9-e95976ab827f', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-20 21:27:03.201861', 1760.59886367, 2036.23446007, 7.52835706, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8849b15d-01e1-4358-9338-e551b5ac582f', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-20 21:27:03.201861', 1773.81679260, 2033.29048947, 23.00381643, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('350d79ea-7e79-4077-9085-57bbfc1f20ba', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-20 21:27:03.201861', 1746.39049743, 2022.28001702, 42.17949273, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6c35ce78-75d3-4bb4-8c16-52490a361193', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-20 21:27:03.201861', 1826.80625400, 2063.86386746, 12.75876985, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ae66f350-581e-4a15-9138-ffe6aaf3142c', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-20 21:27:03.201861', 1792.99451414, 2096.27495322, 28.12955014, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b205184a-4b82-41fe-9f67-f291416f64e4', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-20 21:27:03.201861', 1817.02034506, 2081.81212972, 46.44743724, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('799f18e8-d83b-4d03-b43e-a8ddeb85cfd1', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-20 20:27:03.201861', 1797.65274710, 2090.43681361, 37.95011332, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8363ff9e-9d70-41a1-9eff-ae901b4e5405', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-20 20:27:03.201861', 1789.56904169, 2041.56647873, 17.62693661, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('fbfcdf9f-99fa-48f5-813e-be52ea9f953f', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-20 20:27:03.201861', 1793.89544449, 2065.09702059, 11.73829696, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('99b91e18-a167-433f-aff1-c6b043d19e82', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-20 20:27:03.201861', 1767.18590917, 2082.20078937, 42.13022479, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('5692d06b-b073-448e-83f3-5e969fa878dc', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-20 20:27:03.201861', 1810.34484216, 2067.00841289, 16.62737423, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c57a11f9-993c-448b-abbb-ac1287e098f6', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-20 20:27:03.201861', 1886.95546241, 2154.21130258, 43.11114989, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('91ee4ab4-31a0-4956-92d6-1b77093d474d', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-20 19:27:03.201861', 1831.23492469, 1984.13322634, 45.86740293, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d4e39656-50cb-4248-b09d-52ddf3587fff', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-20 19:27:03.201861', 1809.69388138, 2047.24151958, 10.77266654, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('26a6a5b6-b95d-4bfe-a71a-6787600c3212', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-20 19:27:03.201861', 1851.93812287, 2090.72601500, 25.97805979, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e36724f6-7b87-4d4b-b7cb-8165a00e7746', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-20 19:27:03.201861', 1815.72139346, 1944.63393209, 23.58995435, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('849a9f97-9ac0-4e69-bdaa-cb7ef5a79660', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-20 19:27:03.201861', 1792.42830550, 2120.26236877, 8.83109642, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c69cafe3-7865-447e-99a7-8f80077a2b6d', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-20 19:27:03.201861', 1945.65558557, 1975.41926901, 35.04869933, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('aa69962e-3744-47c0-a48f-5749a3586246', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-20 18:27:03.201861', 1899.48822900, 2005.87183353, 1.00728424, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('488d3b28-bbaa-458e-9ddf-ffc980d8b461', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-20 18:27:03.201861', 1857.80820231, 1935.22616073, 49.72913577, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('28ef91b7-bd25-4e2d-8ce8-ea72b1630276', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-20 18:27:03.201861', 1860.75771695, 2060.75325177, 11.89136108, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('96fd808d-d50c-46de-993a-97b340495348', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-20 18:27:03.201861', 1971.83322181, 2058.96783241, 31.44027998, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9f12dde1-8003-4f94-877d-baf3782e7996', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-20 18:27:03.201861', 1943.92277458, 2102.24146666, 10.29263236, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6422927b-9cac-4740-a251-b1c093d1fd38', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-20 18:27:03.201861', 1821.32909695, 1971.22309950, 49.26754601, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('03cdc8e3-3683-4dcb-9ea6-bf4a7d9ef755', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-20 17:27:03.201861', 1972.66724091, 2006.29938604, 40.83443370, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1acf89e7-9eee-4768-8ea9-029d2d1c0bde', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-20 17:27:03.201861', 1984.94169411, 2053.22997091, 38.05081060, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e2231065-6823-4a78-b5d5-e0d7cb13821a', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-20 17:27:03.201861', 1972.86182223, 1908.87335338, 40.02752567, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1d5c7816-9b6a-431a-8b5f-e9608fda3bc3', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-20 17:27:03.201861', 1878.73995456, 2064.56667578, 4.97468892, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('99daadfc-bdbf-4d2d-adb2-1858d477d0a9', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-20 17:27:03.201861', 1939.94426989, 1984.33531769, 48.26257246, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('00ee3966-15fb-4c05-bbbe-8855ab385070', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-20 17:27:03.201861', 2003.03708678, 1986.77536298, 21.33966226, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('5bf1d28a-eef3-440a-9f1c-b68b36bf6d27', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-20 16:27:03.201861', 2056.78644224, 1872.86869570, 7.27777278, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7a8a751f-5cc4-4131-b78b-70d22ff4ef33', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-20 16:27:03.201861', 2010.06130008, 1947.11596580, 44.44577218, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('57802882-02b1-42e6-85cd-fca19003c5a5', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-20 16:27:03.201861', 1893.21698064, 1964.28805546, 2.01383278, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b567875f-4036-45ff-b37d-295d7b0f3e58', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-20 16:27:03.201861', 1939.94929264, 1995.54098928, 42.62924941, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4990f596-e79c-4007-b1d8-cbd2e274bc50', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-20 16:27:03.201861', 1986.59775521, 1884.90072635, 34.40331801, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b9e29c33-4a46-456b-803b-8bbdca85ae66', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-20 16:27:03.201861', 1970.52578248, 1980.15503646, 49.22914623, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('50efa3c5-e34e-4785-9866-b2c777ccaea5', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-20 15:27:03.201861', 2020.74203551, 1847.96587753, 44.47629758, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c55d39f8-5538-43fe-b035-f4f5fcc8373e', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-20 15:27:03.201861', 2092.79422315, 1917.46984402, 12.04435747, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('67c47dc7-cd73-4507-b751-7d4e17fbc3d5', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-20 15:27:03.201861', 2039.18520975, 1941.45344737, 49.88811360, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f21cc752-e66a-409e-9793-d36eba15e85a', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-20 15:27:03.201861', 2090.86113882, 1999.28495266, 15.98607637, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f09ba290-ea50-478d-918b-aaee42f505cc', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-20 15:27:03.201861', 1935.75383926, 1844.78786871, 40.15381583, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8921d769-b1af-457f-b2a8-0cfa1bf07788', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-20 15:27:03.201861', 2031.47354484, 1979.20546958, 4.22429640, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2553a315-9d22-4917-b4df-ad40dca0a671', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-20 14:27:03.201861', 2065.75541274, 1845.80590464, 1.78181880, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('93ce3554-f62d-4e0f-8b6d-93eb1e7bc1ae', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-20 14:27:03.201861', 2112.73995674, 1776.92199769, 15.73291800, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2215deed-6e19-4666-a6c7-f9c824dd42da', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-20 14:27:03.201861', 1960.04428306, 1882.37937541, 18.98669404, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('21882858-77ed-43de-85d9-2b635c05d6fe', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-20 14:27:03.201861', 2116.25945633, 1936.44856534, 13.21746301, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('14d0b0e9-533d-4bf3-924c-ae8124eeb6b7', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-20 14:27:03.201861', 1929.36969993, 1938.41590014, 14.47063782, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f869ec0f-1186-4fec-913f-c1340a08bb5a', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-20 14:27:03.201861', 1985.04119290, 1815.14485643, 35.84881258, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1162e500-ef89-4bf4-8f26-75a2505b2cdc', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-20 13:27:03.201861', 2099.47341275, 1780.53613029, 29.67239478, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e56a419c-17ed-497e-b998-31453f129c83', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-20 13:27:03.201861', 2028.69697072, 1881.39647820, 7.32850014, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('17468865-5e49-4fa1-a989-4d8643e89f2e', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-20 13:27:03.201861', 2070.64595175, 1842.76902303, 47.25020814, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e94aa7b9-29ca-400a-a707-d4bf0eb081f7', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-20 13:27:03.201861', 2080.12702497, 1779.69959419, 4.15482294, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('49d0721d-0ad0-4070-aca8-8aef626ff257', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-20 13:27:03.201861', 2047.46471971, 1843.49256962, 30.69256628, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('22cf6843-0edb-4a73-85f0-74b2b726c272', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-20 13:27:03.201861', 1995.08059986, 1773.96032027, 28.42738812, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('de729f8c-a462-429f-9088-f361484a8813', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-20 12:27:03.201861', 2037.86206252, 1690.92525179, 1.93554312, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f1ac51c4-efa5-471f-9850-d218d75c46fd', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-20 12:27:03.201861', 2128.15476010, 1732.97270958, 14.45707991, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('622d5afa-cd98-41fd-b72e-404cc6665bdd', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-20 12:27:03.201861', 2116.90930860, 1726.64597121, 30.47784575, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d251da38-0b6f-4218-b305-87d969b9b457', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-20 12:27:03.201861', 2054.91052162, 1760.20179931, 47.93888818, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f78a3671-2af0-41a8-b50e-f91b1b54a1fe', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-20 12:27:03.201861', 2072.99710372, 1723.00914306, 44.92955224, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8d4dd6c0-72c8-454c-8fcd-edf0c43b83c6', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-20 12:27:03.201861', 2031.73600199, 1855.56478863, 37.06939167, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('cbb36730-3f9c-48a2-a334-88cd7ea3265f', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-20 11:27:03.201861', 2131.26585210, 1788.91515706, 47.74410845, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('85faf2b8-c946-4ce3-9866-4f1df05b6a87', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-20 11:27:03.201861', 2130.79774098, 1644.58120448, 35.21612245, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d2366499-b471-42a8-8b46-c5c4ad142025', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-20 11:27:03.201861', 2075.18478054, 1773.77997401, 27.91169361, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9827b1cc-7cb1-46ad-b762-63e75232a4bb', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-20 11:27:03.201861', 2183.26253148, 1708.09339985, 37.11665832, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8188a6a5-c5e9-4b0c-9b56-4a9db6118c49', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-20 11:27:03.201861', 2056.00666707, 1668.04418274, 45.50323767, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f41d61cb-7970-4be2-9f06-58aebfaf134d', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-20 11:27:03.201861', 2126.44972981, 1786.63516790, 28.86340641, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('62d6fd0f-4b81-4c69-a349-c9d60dffb9f6', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-20 10:27:03.201861', 2103.95010506, 1719.95272595, 25.86988804, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('bfd96bd3-a8a8-415a-a728-bb960d8616d5', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-20 10:27:03.201861', 2047.23627727, 1596.74517151, 13.11641066, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e7108c55-7340-4ce1-9c2f-b01afc3e1819', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-20 10:27:03.201861', 2005.06993540, 1741.75295411, 34.21603781, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e8128b0e-3372-4aa8-b763-1e9dc3edee92', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-20 10:27:03.201861', 2099.78009909, 1614.03707479, 42.38493951, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8610e3e5-a7da-4040-b73c-355c293f18ce', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-20 10:27:03.201861', 2034.72499500, 1767.10160080, 15.18536594, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('938a1df0-5265-477c-ad1c-ea28cc2f31c7', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-20 10:27:03.201861', 2079.76432821, 1720.96072307, 43.65572940, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4701a0f9-6426-4aec-a986-8ea2a239fa11', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-20 09:27:03.201861', 2128.66713807, 1540.56875375, 35.66558739, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('93457b12-de31-442b-b510-ff64791489fc', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-20 09:27:03.201861', 2011.15545572, 1549.43656613, 12.27371210, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2ce3799d-cd66-493e-a1e6-f4c072f48e33', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-20 09:27:03.201861', 2066.48816019, 1658.73732728, 36.90418332, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e4748d1e-0a91-4755-86a9-4c0103afb4b6', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-20 09:27:03.201861', 2016.04316401, 1558.32279235, 8.24611402, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6d21e06d-d0bf-4861-94e4-8200cdbb1e75', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-20 09:27:03.201861', 2051.51138096, 1548.86966591, 31.58441017, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8f4271a9-b8e6-4261-b21d-6f7e402ffa6d', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-20 09:27:03.201861', 2151.96246799, 1573.12421809, 21.30665593, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0bb62014-8234-45f1-ad5f-c746bf1f6e6e', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-20 08:27:03.201861', 2173.08797826, 1499.85683013, 38.59328782, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8c84da33-c960-4be4-9c01-878a17dc83b0', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-20 08:27:03.201861', 2071.00288693, 1646.14500788, 18.04754930, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('10a79a11-3e5e-4554-a000-e5892bb2fd8f', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-20 08:27:03.201861', 2111.70122062, 1589.01362460, 20.07067812, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e3412804-760b-4342-9cad-0d692d8f3d28', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-20 08:27:03.201861', 2149.98732886, 1561.23380946, 23.45159746, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ce60671c-3d99-49da-a709-06d97b1ba72f', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-20 08:27:03.201861', 2059.83179107, 1515.74011193, 1.25046639, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('270126b1-1312-4084-8202-aaf8d483e5b2', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-20 08:27:03.201861', 2111.11322893, 1537.87364827, 36.67355512, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6f64f4cf-cdfe-4f3d-903d-7d62cdf362d7', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-20 07:27:03.201861', 2022.26305561, 1525.08307853, 21.54881908, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('45d264d9-370f-40ac-b4dc-30eb56b166f1', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-20 07:27:03.201861', 2123.41360323, 1510.17177302, 1.95189334, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('5087ebd4-1393-455c-a6e9-5026b9f1bc31', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-20 07:27:03.201861', 2051.00253925, 1558.64421341, 20.29830138, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('81c87842-e315-406f-b753-0634cafd6b42', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-20 07:27:03.201861', 2100.86329535, 1578.63675303, 0.32521943, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2068ebc1-b446-4d0a-99b6-7e05c588d4dc', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-20 07:27:03.201861', 2167.15938331, 1464.06740909, 35.14629268, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('77e9e33d-be85-4996-bf2a-d7bb58f3311e', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-20 07:27:03.201861', 2107.66845824, 1586.71993634, 33.84161760, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0b8e939b-c5f5-4ae8-8dd7-90900b517a33', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-20 06:27:03.201861', 2008.96962760, 1444.26989069, 8.33066978, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('42393b39-6526-4e51-a1f9-5f390d7ac7ee', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-20 06:27:03.201861', 2136.93157808, 1520.58993760, 13.09273966, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f246ee06-98bf-4c73-817a-1460a76637c7', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-20 06:27:03.201861', 2154.95199346, 1461.90066655, 7.77565389, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('74b27547-e750-44cf-bb1b-2991ed77e696', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-20 06:27:03.201861', 2136.17290082, 1452.51542615, 29.42474810, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1c8eacfa-d941-4409-ae71-1ddd2842a6c5', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-20 06:27:03.201861', 1986.16158169, 1576.78917751, 3.93410114, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('22f6076d-6e2e-4545-9036-e66a0626f31b', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-20 06:27:03.201861', 2146.81957766, 1523.69231402, 30.26931652, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1d8c38a8-d815-4929-abfa-7aad93c4f297', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-20 05:27:03.201861', 2071.58688076, 1372.90877130, 43.77372755, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0b56ce14-783e-44fe-8994-a62288e0b344', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-20 05:27:03.201861', 2104.06900158, 1331.50792659, 46.66440302, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('05ca2347-9792-49ec-b1b6-e8a8e68f7aab', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-20 05:27:03.201861', 2047.93680052, 1347.55677606, 39.65335113, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0978bed1-8a32-42dd-b91f-72c8aeb28368', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-20 05:27:03.201861', 2017.12780894, 1359.19007464, 44.81886545, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('605b9851-3128-4ae3-82d0-5df14eee52b2', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-20 05:27:03.201861', 2065.77830646, 1424.47974198, 2.88807556, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('bae4a058-6307-47ee-9456-687c1c302c4d', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-20 05:27:03.201861', 1994.99425764, 1521.45239682, 23.66272525, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('819cf95a-241e-4ec0-9c9e-c9ee30badab0', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-20 04:27:03.201861', 2035.42746836, 1312.74541623, 30.37278575, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d9c25af6-ddbd-422c-a183-8e0fa59bf96b', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-20 04:27:03.201861', 1959.22610446, 1302.99458575, 0.39535426, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('cff170e0-f597-43b6-a794-ae94cfde4aec', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-20 04:27:03.201861', 2119.50250187, 1326.89889993, 14.99048031, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e97605e5-318e-44d6-bf70-1852036785b2', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-20 04:27:03.201861', 2098.60723412, 1401.61911068, 20.18550236, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('be2572f3-b163-464a-b013-0fe25b2422b6', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-20 04:27:03.201861', 1979.17679976, 1342.50434023, 38.26442590, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e7af23eb-0383-45a3-8179-9fbff77e8857', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-20 04:27:03.201861', 1980.21142005, 1310.46623650, 32.31950312, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('79fe11e3-6af4-45e2-b831-f46fb6f349d5', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-20 03:27:03.201861', 2039.40765119, 1288.69758188, 10.82607632, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('91ecf862-5452-4bb4-838f-3350e8b6b794', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-20 03:27:03.201861', 2070.99682442, 1261.92580549, 24.60456179, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b176e2b4-3448-4f42-9fed-90c588db028c', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-20 03:27:03.201861', 2067.62234016, 1419.22209311, 37.60684584, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('53c2ef38-6384-4d87-8a85-8d3792c43d0e', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-20 03:27:03.201861', 2015.29522245, 1367.45041853, 9.37646035, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0d8718dc-2539-4f45-a3bf-ce0f8027b22f', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-20 03:27:03.201861', 2001.28577820, 1293.91981118, 16.21662315, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('164ed510-59cc-4b86-b5e0-6bebc7416240', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-20 03:27:03.201861', 2035.96323681, 1397.26503510, 14.48668246, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('80d2c2a0-0a74-4d9d-a5e8-48ca24c51a8f', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-20 02:27:03.201861', 1956.93002036, 1292.65272836, 40.31086740, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('28926c7d-fe03-42cf-98da-3776102210a6', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-20 02:27:03.201861', 1994.85041147, 1327.80199910, 35.40322191, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9e7f020d-b608-42c6-ab02-d4cf86f7af55', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-20 02:27:03.201861', 1939.03529974, 1218.04671077, 7.00806937, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0b6c699b-6a66-4c81-8df6-347b61f6821c', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-20 02:27:03.201861', 2039.90866780, 1337.82052042, 11.01772825, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7e2958f1-6142-467f-bf49-56a790edd544', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-20 02:27:03.201861', 2031.10381627, 1384.13985463, 47.95453920, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c69eff1f-3911-422c-8ec2-3f91eb6b8af4', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-20 02:27:03.201861', 2083.67566371, 1248.59735284, 44.65699438, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4e7912da-088c-4fcf-af06-596f35629826', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-20 01:27:03.201861', 2002.35290223, 1272.98987525, 10.59765101, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('90211a38-58ea-4a51-8a2d-ca402a85353b', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-20 01:27:03.201861', 2043.56966596, 1305.93481538, 33.92297876, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2e416f14-20cf-4def-a12c-08a16ee73ef2', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-20 01:27:03.201861', 2043.34854763, 1296.62751018, 23.20862002, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('bdad1d91-32ff-4518-8b42-7ff6965cc5a9', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-20 01:27:03.201861', 1936.60178955, 1203.02507547, 14.82133104, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2e242310-5a1f-4f72-a43c-b425acb252bb', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-20 01:27:03.201861', 1880.14963817, 1195.90914361, 49.00089041, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6d2a0c85-548a-4c22-876b-b66c25101392', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-20 01:27:03.201861', 2061.12234882, 1205.93171573, 0.43948745, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b6a1ee64-5a4d-49a9-a8e8-acd379cc2e59', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-20 00:27:03.201861', 1992.05016733, 1221.21977683, 15.84177047, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('740cd40d-dc1b-413b-8744-3c0fdc97243d', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-20 00:27:03.201861', 1976.40491591, 1266.73647287, 19.46296688, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ec75f6af-7413-47f6-978d-bcb2db844050', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-20 00:27:03.201861', 1877.01746253, 1234.98216771, 21.98252469, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('218f2319-62ee-4a93-a1fb-1eb065ca0716', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-20 00:27:03.201861', 1924.84844692, 1315.85143734, 34.42703432, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e74796cc-5547-4977-ab67-59a06a601f71', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-20 00:27:03.201861', 1902.15134137, 1246.01136253, 24.35661205, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('39da304e-35a5-43d2-a900-26921b1db2a4', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-20 00:27:03.201861', 1855.62521264, 1252.02059141, 10.27327168, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a32f7e44-fe19-4428-a15f-63cab7ef2436', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-19 23:27:03.201861', 1839.08693618, 1282.21408741, 15.47644412, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1e874435-9d22-406e-88e9-b0fa6f8eff27', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-19 23:27:03.201861', 1978.05729904, 1171.53384386, 10.63308539, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b6d57dae-e67c-45c1-93c0-7a127bec586f', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-19 23:27:03.201861', 1939.46515456, 1285.74473996, 38.02172553, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a9dccc81-38e3-4ffa-972a-2c6f4dde257a', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-19 23:27:03.201861', 1900.78258956, 1224.30973507, 8.68888104, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b989a99e-40ac-44d8-9daf-5397f3ceff1b', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-19 23:27:03.201861', 1982.16825033, 1134.46848735, 20.17181502, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c978e446-945f-48d0-91a9-47d321f007d0', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-19 23:27:03.201861', 1815.98393217, 1239.86356229, 1.90370335, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2f4882e7-aaac-44c7-8bab-737ef91b1a36', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-19 22:27:03.201861', 1890.76128116, 1190.42315812, 8.63096146, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('605d2868-a468-4d44-93e0-a9fbd64fadbf', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-19 22:27:03.201861', 1897.87020035, 1093.72001487, 35.99273473, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b1529bfb-8e61-4d54-ade9-40957fd03da9', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-19 22:27:03.201861', 1944.79809947, 1147.25355537, 43.66640468, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('112110b8-5d82-4201-a279-d810c1b125cf', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-19 22:27:03.201861', 1882.77178480, 1139.40895606, 49.12466957, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('91cdaa7d-597c-4ade-844f-542b1d67a57a', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-19 22:27:03.201861', 1765.42990768, 1206.26677481, 21.64925267, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6dc802d7-b6be-42f3-b978-c8a22eb2331f', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-19 22:27:03.201861', 1910.92478014, 1167.21873409, 14.84606814, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('065384d7-cef7-4fb5-bae4-4330ab684052', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-19 21:27:03.201861', 1730.29120915, 1079.91209399, 36.30798567, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b6c01256-eda2-4ea8-b444-9f1e5c898d91', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-19 21:27:03.201861', 1853.84594598, 1180.89823460, 38.67870994, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d42e6084-d74d-4f3d-8e2f-eb5a5ad86178', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-19 21:27:03.201861', 1790.97460306, 1068.30306573, 39.50295716, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('20de644c-babc-48e7-9467-814739450e2b', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-19 21:27:03.201861', 1888.33844229, 1140.44656031, 29.40354129, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d83898da-7de5-497f-81be-43bb395998cb', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-19 21:27:03.201861', 1781.21805497, 1167.93604868, 48.70824711, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('564da37a-ad82-49ed-9460-a4060e53a2b7', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-19 21:27:03.201861', 1858.01884322, 1180.35371076, 17.91694760, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('65a880b3-518f-4db1-a602-b238b91df886', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-19 20:27:03.201861', 1823.54373721, 1140.78679753, 20.54016470, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a585c7fc-aa54-4d43-97b7-65d10a0fbcac', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-19 20:27:03.201861', 1696.37000017, 1197.06485317, 1.62189272, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7ab45d58-4710-4a23-875c-427e7344eaef', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-19 20:27:03.201861', 1821.60183226, 1027.70199721, 8.31688478, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7b984f69-cafd-4068-acf7-f208e5e34da8', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-19 20:27:03.201861', 1793.63525183, 1168.87131659, 3.65646911, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2dce7c91-c0f8-40e5-84ef-642526eb3190', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-19 20:27:03.201861', 1661.27060935, 1156.00610033, 2.41330191, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('32b5f49f-68ca-44c8-b4cb-ec9828e946b8', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-19 20:27:03.201861', 1668.78584911, 1038.39621173, 0.75093104, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8d40e3bc-afec-4b6a-880e-8c7d63bf3171', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-19 19:27:03.201861', 1751.71651387, 1131.73845454, 35.09113435, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ed148329-b60e-4466-9211-dda886f8ea2e', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-19 19:27:03.201861', 1634.50413501, 1139.61666217, 39.93447025, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7b6411de-4037-4448-a0fb-d163b1ecbbf2', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-19 19:27:03.201861', 1646.45999069, 1071.88987917, 35.56229903, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f672fe1c-8205-4d00-a705-3a8f4aa90f75', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-19 19:27:03.201861', 1695.66117071, 1074.52636385, 37.18128438, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c301ecc7-2281-4e1d-985c-b3eecfc6bb36', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-19 19:27:03.201861', 1641.38259482, 1125.06003834, 26.13932448, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8ade72d4-9e5b-48bc-b4a5-7b4f3d6a77ac', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-19 19:27:03.201861', 1697.90413381, 1088.97391077, 26.87958264, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('15ae8b4a-cb31-4584-b650-986c5b18e94b', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-19 18:27:03.201861', 1616.39256684, 1127.95702352, 35.29599996, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d2c8772c-bd43-4dfc-8039-76a9df433469', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-19 18:27:03.201861', 1606.76500716, 1048.00920502, 32.58702870, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9e1ec146-4918-4924-b824-d55b296419a7', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-19 18:27:03.201861', 1721.57895537, 1110.86292066, 26.01918306, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('600439ef-2aec-4118-9651-be842e74ffe1', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-19 18:27:03.201861', 1607.39826913, 1123.26419673, 26.05636137, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('829c4bd5-7b93-4822-a4d0-4b6905a041ee', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-19 18:27:03.201861', 1649.18452581, 1014.30998287, 48.23311390, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('32370d68-1bc4-4ba9-acf6-19627c403da7', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-19 18:27:03.201861', 1695.45844486, 1027.23986888, 35.71382094, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ef36b908-a04d-4767-b736-d55c700aca94', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-19 17:27:03.201861', 1626.69773070, 1184.32582674, 21.76742963, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f95933d1-a6d1-4097-ba79-7d070da32dea', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-19 17:27:03.201861', 1560.39423139, 1115.88609869, 10.49961623, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a4ccd504-7202-4359-bc67-ebef65a25860', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-19 17:27:03.201861', 1635.15810465, 1052.57590722, 6.25243215, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('739fb501-7364-4640-9f72-2b0ea5dcba9f', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-19 17:27:03.201861', 1575.24030754, 1060.25512013, 16.98168640, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2ced0ac2-e7d3-4b8f-802c-e9e289d1579c', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-19 17:27:03.201861', 1559.38007584, 1052.72942703, 32.62033488, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('94cd49e9-8df1-4493-b1d2-0fa29ba4d8f9', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-19 17:27:03.201861', 1650.95030912, 1016.89477462, 0.99509554, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('860c3ed3-9e27-441c-b7d0-0d1bd7c488d3', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-19 16:27:03.201861', 1615.71695637, 1168.79732882, 17.97777722, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b209b7b8-11e1-4b19-b805-17c883f4f42d', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-19 16:27:03.201861', 1593.06949685, 1138.52995547, 28.74075143, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('82378fad-dfe1-486b-aa08-2e3fdaeb2001', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-19 16:27:03.201861', 1509.28968736, 1096.09117391, 42.34892513, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('394f25d9-6227-4b27-a38a-cbf032cf3901', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-19 16:27:03.201861', 1613.53967679, 1018.89261762, 13.44663886, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('aede2d0d-e939-45b7-afdd-82703861a70b', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-19 16:27:03.201861', 1577.55457175, 1090.47704316, 45.24879553, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d46af49a-e401-4e67-8e99-479fc3ba1c3d', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-19 16:27:03.201861', 1607.33707516, 1019.75504826, 35.01536982, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('40d8d5ec-d9ff-4fee-b9c3-4385953b4bb6', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-19 15:27:03.201861', 1597.10204047, 1042.27825683, 0.74607380, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4429cbc6-98c5-4e9a-8366-7f43638752a7', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-19 15:27:03.201861', 1608.08999620, 1070.94598719, 47.37520191, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('801f0650-1e48-4821-ba33-85d78c5bd85b', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-19 15:27:03.201861', 1602.29100950, 1111.54491724, 16.29650874, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('16754230-7e5d-4436-a7d0-1b796533ca03', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-19 15:27:03.201861', 1543.13417993, 1104.14774853, 49.49717442, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('13e5e50e-c9fc-4f96-bdf3-9f48fd2805bc', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-19 15:27:03.201861', 1607.35483018, 1046.64897041, 43.85616811, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9dd971f4-54c6-45be-b9dc-ef8fbf0bb9d7', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-19 15:27:03.201861', 1502.26532286, 1082.40276766, 12.71551895, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d8bdbbf3-9409-445e-9b74-ba471ebcbc0d', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-19 14:27:03.201861', 1399.01088466, 1145.35639399, 23.47293860, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('71d69d79-35cd-4aea-aa1a-53cb5764b83c', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-19 14:27:03.201861', 1413.71494793, 1211.95198887, 44.53028540, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('49f8a153-5112-4172-89e9-e7e99d91d1f8', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-19 14:27:03.201861', 1483.68729377, 1108.28864801, 11.07423714, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9a0317a1-3cd7-45bc-bc50-7c6fb1f6176c', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-19 14:27:03.201861', 1475.04538529, 1115.40913271, 24.91363801, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6d706360-c9b2-4cf5-910e-624aeb9c3171', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-19 14:27:03.201861', 1514.03777294, 1033.52140628, 24.94847706, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2b9c72b7-3734-4f85-9ed7-45cc95030b52', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-19 14:27:03.201861', 1442.61084193, 1171.75790216, 46.25193059, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('84fc1e1f-0c18-42fd-b96e-769eeed5e6b9', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-19 13:27:03.201861', 1381.25161072, 1225.64676473, 3.14944043, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b62f6788-d287-4b1d-95c1-f920c3cdcfaf', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-19 13:27:03.201861', 1411.09566444, 1125.52325972, 21.70244209, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ba2659e7-a121-41af-a2a3-19ae9913927d', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-19 13:27:03.201861', 1355.97935796, 1193.58802238, 42.51099328, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8a055686-6397-4b74-a69d-34d5cdf571a1', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-19 13:27:03.201861', 1413.57871886, 1097.95121904, 49.79359890, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('60f1018a-8d42-46ce-bee6-8b105697ca8f', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-19 13:27:03.201861', 1453.48964567, 1115.88117450, 7.79123828, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0071cec1-8758-445e-bb36-8327ec0b0e27', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-19 13:27:03.201861', 1446.78588386, 1083.01343849, 5.85168912, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f1ca3364-7b6f-4fb3-a322-6936546d961d', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-19 12:27:03.201861', 1300.18765878, 1237.46145615, 33.44199757, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6fd03b3d-5e6c-4395-97c5-bed9726587b3', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-19 12:27:03.201861', 1460.28424313, 1143.76450435, 38.33177831, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a05337c6-32ad-4826-af96-e7007e14dfa9', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-19 12:27:03.201861', 1404.84360368, 1114.67606668, 15.77607826, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1202ee95-f3a4-40b9-b7da-efbb442772c3', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-19 12:27:03.201861', 1362.73776053, 1216.68489451, 20.74780207, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('49707f15-b2af-4e57-ae42-d421f2eab227', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-19 12:27:03.201861', 1442.22705321, 1144.64766764, 18.86338193, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('701e7131-8679-4b30-a548-55c52de497e9', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-19 12:27:03.201861', 1393.59235513, 1165.25680867, 5.05564615, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c2c680a4-eaff-47e9-9323-ca10f813069f', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-19 11:27:03.201861', 1402.76599757, 1190.09232417, 43.99974754, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d48fe26d-7957-412d-9c5b-ecafd1e19ead', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-19 11:27:03.201861', 1275.93831868, 1246.61683477, 37.83955494, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('5b941857-15c1-42e0-956d-654cb97bb6a7', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-19 11:27:03.201861', 1380.13283838, 1270.53562877, 32.98654503, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('3ee78424-1bd8-417c-927a-fa68096ae8f3', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-19 11:27:03.201861', 1265.90866084, 1094.94973162, 45.24210133, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0ae4fbfa-1684-4951-bc18-f8f37c94de0d', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-19 11:27:03.201861', 1410.75154236, 1098.60308199, 16.94573654, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('02e982d3-3cd8-4824-84d8-b1b0ae5b30bf', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-19 11:27:03.201861', 1399.21751456, 1273.26769362, 32.77572934, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0b8b1ac2-f38f-4e36-833d-a39b8af81559', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-19 10:27:03.201861', 1219.55524060, 1193.00998534, 21.63934591, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('aa5aa080-b5c7-473e-bb9f-9c5f86b2a2ca', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-19 10:27:03.201861', 1360.67464009, 1111.71648852, 5.25281263, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('cc50c7f7-d071-49d2-b491-05d276888b83', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-19 10:27:03.201861', 1334.58120463, 1172.88089995, 20.75984517, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2cd77654-d29e-4ab4-9d59-06f3e4bfa801', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-19 10:27:03.201861', 1329.67003046, 1110.50353852, 24.76264849, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('43463cb7-ae33-4659-aa98-dcf5951a7677', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-19 10:27:03.201861', 1360.11716770, 1168.81345805, 40.85586249, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ac836179-d0ea-44c2-a096-8da873759ef1', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-19 10:27:03.201861', 1357.43153512, 1144.84547276, 33.84033288, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c99dac1a-0be0-4365-969c-973fe8d396cb', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-19 09:27:03.201861', 1220.04317701, 1211.71158841, 14.30560374, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1a98d8a7-fbf1-43da-ad35-6e04ec024664', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-19 09:27:03.201861', 1286.33687396, 1257.91554226, 48.42473086, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('07f484fb-f3dc-43ca-bc79-d1f56ea86fe9', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-19 09:27:03.201861', 1319.59024838, 1303.48966347, 12.92162498, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ef2ab804-75ae-4a5c-b33d-b8086708881e', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-19 09:27:03.201861', 1334.03635674, 1291.58711910, 31.25500622, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d00384a4-4ff2-4381-a46f-7827819ae5dd', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-19 09:27:03.201861', 1327.10861050, 1293.06465399, 29.84202605, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f5dcfef4-e633-4a7a-afc6-fbd92ecacc7c', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-19 09:27:03.201861', 1244.76499314, 1146.93245763, 28.92141506, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e32c64ea-374d-4d17-b72f-5eee2c46ef71', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-19 08:27:03.201861', 1235.84118401, 1266.62068673, 30.43850499, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7d283e36-2ac1-4b8a-b3e1-3d0b7b93c8ea', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-19 08:27:03.201861', 1145.62857282, 1251.55093541, 26.14550649, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('fe01a9d6-8259-42a3-92d4-cb04a73ca94b', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-19 08:27:03.201861', 1230.13194360, 1231.81753732, 19.52457140, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8adc6e11-cf24-4101-8a7e-95b6156fee30', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-19 08:27:03.201861', 1264.72464055, 1225.65292450, 3.12949477, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b2701d61-0e40-478a-8573-23817827279f', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-19 08:27:03.201861', 1157.67214054, 1274.34692625, 6.69785911, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('bdc2f007-5c28-47af-a2f7-fb5be8d2b707', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-19 08:27:03.201861', 1228.97426159, 1197.62108485, 22.87932956, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('728a1c13-a000-4d0b-a2d0-f1da8cb3f975', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-19 07:27:03.201861', 1252.34256509, 1239.02658784, 5.51261556, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('bafd56a2-8065-4fe3-9c07-7f71dc14d2fd', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-19 07:27:03.201861', 1149.51797767, 1289.07285773, 14.22884815, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a162f30e-79a2-4307-9093-60c1ff2b3bec', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-19 07:27:03.201861', 1282.16723988, 1386.80565995, 41.74701533, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('38eee3b9-3880-4406-a53e-f0cfd90b1cbe', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-19 07:27:03.201861', 1115.42419994, 1324.21409467, 24.03528044, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('91ae0db7-ffe1-4348-911b-afc44b78954b', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-19 07:27:03.201861', 1212.00217886, 1329.73620311, 41.92693236, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b2bc097f-0a87-49e5-99ca-3216d438beb1', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-19 07:27:03.201861', 1106.31606407, 1220.62948627, 36.79482987, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e79fa985-ebc2-4e8b-b91a-c5483bdb6f70', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-19 06:27:03.201861', 1223.52358940, 1286.79041442, 12.14012091, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a471c6a2-5caa-41a9-a8d2-b095b3ee505e', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-19 06:27:03.201861', 1078.74224436, 1305.79427276, 44.04670948, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('67aa9880-33e2-4e40-b30d-d93d10eff127', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-19 06:27:03.201861', 1112.74952594, 1327.62885852, 9.19432839, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e4818aed-73b0-4c6d-a977-98cc3ef16fdf', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-19 06:27:03.201861', 1146.07817781, 1293.50327891, 39.67099615, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b725bb9c-55ec-4513-9d82-aa5d2a6901b7', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-19 06:27:03.201861', 1233.95182070, 1298.15077595, 18.75830644, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4683c2dc-ebea-42b2-9045-5577c5b85a70', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-19 06:27:03.201861', 1191.31940874, 1313.55813866, 18.30501754, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d618c359-505e-4172-898a-ce56caa4f123', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-19 05:27:03.201861', 1091.61466082, 1345.10968741, 13.39577389, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d40431eb-2895-4b60-809e-58fec921072f', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-19 05:27:03.201861', 1209.86329287, 1308.33888640, 2.98117803, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1fb88424-655a-4e09-a11e-312e4877e115', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-19 05:27:03.201861', 1206.03587967, 1506.31720880, 24.16430274, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('90b49113-c1f3-4bf9-be4a-0ad6435cb4bd', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-19 05:27:03.201861', 1130.12426875, 1418.61129763, 14.48188874, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('fd07bff7-af9b-4d52-bfbf-365e5de878b1', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-19 05:27:03.201861', 1134.25921932, 1406.00627909, 17.69578049, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('98e81ae2-038a-43b4-983a-d80db0e1bd51', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-19 05:27:03.201861', 1159.60523338, 1391.36498417, 3.37848290, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('cedac5d6-7d2f-467d-8302-446625cabfe1', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-19 04:27:03.201861', 1154.00892095, 1368.43951435, 13.97988766, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e6037f36-64f3-467f-b84e-159f6c099ee0', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-19 04:27:03.201861', 1143.59251603, 1526.52302495, 1.67790141, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('bfb7c41f-cd08-4a8c-ad62-240786957415', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-19 04:27:03.201861', 1097.69432650, 1417.77897459, 34.08363888, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2b27126e-2ea3-4ae6-816b-98f082a33bf3', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-19 04:27:03.201861', 1034.17269727, 1469.64171373, 37.15287007, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('15456b4c-5dc6-42f7-8edd-0d1a2c41f89c', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-19 04:27:03.201861', 1089.80208835, 1395.60343176, 12.23261227, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c79b0244-e073-4945-a51a-a0e420f57816', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-19 04:27:03.201861', 1209.21108837, 1498.95210638, 17.58492117, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2e0adbbb-0ad9-48e8-a7ca-a9e491d73f5a', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-19 03:27:03.201861', 1196.64921379, 1422.59840300, 46.04510430, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('3f434073-6848-406b-9f5b-809a463f30a0', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-19 03:27:03.201861', 1056.65260758, 1487.60178374, 6.11600404, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('642e7a7b-1aba-49ae-adaf-9ad80a7ae18a', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-19 03:27:03.201861', 1081.41204459, 1472.35674901, 42.34988609, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4306374d-39a3-4229-864e-04f0ca2d658f', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-19 03:27:03.201861', 1125.36680196, 1490.16360006, 38.49924726, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7bf8e387-4b92-4285-bca8-b3d0193ec430', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-19 03:27:03.201861', 1026.85891994, 1476.07603107, 23.46118867, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f06d3e57-d070-4dfb-832d-2534e8e59473', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-19 03:27:03.201861', 1153.37017301, 1464.37629532, 45.91773423, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e5d62d2f-b32e-4920-8436-77d5357a83ca', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-19 02:27:03.201861', 1051.00753828, 1548.63281966, 18.14264456, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('37fb7e87-d04b-43ee-a2fd-8ec95cdfc2ae', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-19 02:27:03.201861', 1037.51329846, 1513.66671707, 46.45050233, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1b93e053-bbaf-431f-9ed7-1f19ccdb06a6', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-19 02:27:03.201861', 1115.88301731, 1475.71877254, 28.05587597, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('66a8bd93-b448-4e63-8437-66d1c849d175', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-19 02:27:03.201861', 1195.45355504, 1549.83563851, 32.59826766, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6e81a4f6-5f96-4d8c-949c-2a3b9a59b5e0', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-19 02:27:03.201861', 1119.18633493, 1580.11161088, 39.97390170, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7e30e69d-8e98-4731-bd30-f9bb74e83ea1', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-19 02:27:03.201861', 1132.72027304, 1535.43025097, 40.31188471, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f34748a8-25f8-4599-a73a-5732e3c6a1aa', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-19 01:27:03.201861', 1188.16864100, 1647.74304249, 2.33948969, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7f2fcd00-e1b8-4358-bce2-f40b9aaa8e17', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-19 01:27:03.201861', 1193.31271402, 1685.00039842, 19.88955420, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('63a8944d-d65d-49c6-a397-a5b079fdbb4a', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-19 01:27:03.201861', 1024.14194623, 1613.23136357, 26.99397512, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('eb66c771-8353-463e-b874-9a157dc60566', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-19 01:27:03.201861', 1131.23917749, 1515.67471842, 1.22199427, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('3032321f-cb57-4f1e-9cbd-b6d3f3ae69db', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-19 01:27:03.201861', 1108.37762307, 1598.58878934, 3.85212090, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('052fb95b-f521-4c48-ae97-3285aeea6d8e', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-19 01:27:03.201861', 1018.70292801, 1689.20525659, 12.71147425, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7401a6c7-264d-480c-88d1-24f2377c2b0f', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-19 00:27:03.201861', 1022.64866735, 1577.16734017, 5.77496702, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('fe2081c9-2404-4654-af6f-8e867c86cdee', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-19 00:27:03.201861', 1071.16496575, 1555.48747282, 12.16310209, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2714b4de-104f-418b-94cc-5bd902543687', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-19 00:27:03.201861', 1112.45540625, 1580.48269315, 23.19533095, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e890a1e2-efd3-4a18-aba7-2f837fc85241', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-19 00:27:03.201861', 1195.22270089, 1741.25370316, 8.53954570, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('357ce0c0-880a-4276-b6c5-df7677228e04', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-19 00:27:03.201861', 1027.98214075, 1678.71615398, 23.48591152, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('3921e477-c85e-401d-b457-db659c4bd143', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-19 00:27:03.201861', 1082.64049713, 1687.61077816, 33.09994745, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('255ab1b1-ea36-4b02-8f9e-c1b941d6a6ca', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-18 23:27:03.201861', 1034.11529226, 1740.81944215, 35.71352198, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2c048ceb-f939-4271-9b7e-c049660bd190', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-18 23:27:03.201861', 1039.65683214, 1638.98175758, 15.13277506, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6212edb5-af42-4b99-b1d1-1ec3b0bdd418', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-18 23:27:03.201861', 1140.55197626, 1629.77522536, 2.62309396, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('cfe431d8-d296-4bbd-bf6b-66579c7f63db', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-18 23:27:03.201861', 1140.06606466, 1795.87488649, 43.17746677, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e0efaf71-79c4-4f17-af61-51847e96855c', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-18 23:27:03.201861', 1086.39388034, 1751.91362006, 0.68177762, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ab8ab2d3-dcbf-41a3-bd43-0c0044fddcda', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-18 23:27:03.201861', 1081.82610438, 1755.46056841, 30.25290941, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d87b1c89-1560-4250-8326-9c83ab74a942', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-18 22:27:03.201861', 1193.13034674, 1845.15725615, 14.37383553, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8d770f9b-c394-44b8-b72d-7cfbb925d1aa', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-18 22:27:03.201861', 1193.36092069, 1768.25858496, 36.71044591, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1ae29e38-d4eb-42b9-a916-6637fcbe37a5', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-18 22:27:03.201861', 1099.31913737, 1685.77032480, 41.33547389, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c7667c7a-7388-4ab5-b15a-46893ab9b78f', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-18 22:27:03.201861', 1027.77686254, 1652.84668238, 5.65760791, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('3300753f-1bb8-4a89-9961-c8dfa97b997e', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-18 22:27:03.201861', 1188.42032513, 1652.95723736, 16.81665517, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('76fa5876-c879-43a9-9258-0b5771105a1a', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-18 22:27:03.201861', 1204.19025725, 1764.50051712, 49.04319037, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('40b20aa3-f238-44b6-81d0-0a9ac4e03761', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-18 21:27:03.201861', 1078.98042249, 1804.37493084, 43.74038128, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0b36db61-48f4-49dc-a75e-3d083b2f43a1', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-18 21:27:03.201861', 1049.52344491, 1721.00650046, 38.93570011, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('88111b61-fc50-48b5-ada6-ce2e2d808694', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-18 21:27:03.201861', 1082.75454898, 1763.24130198, 17.82257348, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('81e88187-4b3f-4003-8bb6-1f7491aaa33e', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-18 21:27:03.201861', 1197.80557813, 1762.89785793, 22.82710497, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f18923b5-0de2-4813-a589-5843279320bb', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-18 21:27:03.201861', 1208.66310505, 1809.06638109, 46.03204841, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('587a3cec-dd0d-46ad-b94b-28e62af1ba29', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-18 21:27:03.201861', 1165.16456129, 1817.91596030, 15.06239910, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('85151ec6-e4f1-4f1b-8990-c8f5b4008857', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-18 20:27:03.201861', 1163.39264485, 1914.18029729, 42.73199093, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8ef63f3c-57e3-4621-a5d9-bf7c75df83b7', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-18 20:27:03.201861', 1236.63672265, 1936.54589407, 10.91204505, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('dc101431-eaff-4732-8b1b-f39403c33d68', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-18 20:27:03.201861', 1065.18236383, 1784.49291840, 11.83638355, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('36892645-5857-4ce8-84ff-1c568a2c2833', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-18 20:27:03.201861', 1232.06816152, 1897.78692879, 23.84110981, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9a2fb5bc-b47d-4556-bfaa-c7e1b3f83b5e', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-18 20:27:03.201861', 1140.90383457, 1758.85295835, 21.67114485, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7fa21fc0-e084-44c7-8a59-8a5dc7c9e104', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-18 20:27:03.201861', 1087.48076826, 1924.52220758, 36.82341403, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a2103f91-cd93-44e3-aa96-723e875c7648', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-18 19:27:03.201861', 1233.72107879, 1889.91761665, 24.60093628, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('458b79c9-7b22-4479-968c-acef8f79a60d', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-18 19:27:03.201861', 1131.57135777, 1785.67283352, 11.21761677, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b9bbc742-3d32-4dc4-ac44-0e89b3b3059b', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-18 19:27:03.201861', 1245.67607540, 1942.70408491, 33.17069291, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('30dd3665-56a5-48ba-b5d6-25ca2a35f1a5', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-18 19:27:03.201861', 1235.60036119, 1837.62560640, 2.55565308, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('388b9901-269e-47ed-a29b-efd76e2e354d', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-18 19:27:03.201861', 1189.54757192, 1911.90691025, 39.14938147, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e1f255eb-b316-4513-bdc0-a690dc890a46', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-18 19:27:03.201861', 1161.63154976, 1888.08675218, 24.84522632, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('60dacb4f-d799-4624-8e46-58b52f7a9ca2', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-18 18:27:03.201861', 1137.31686628, 1951.58442403, 43.19040815, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('21f3b8f7-49db-4667-a2c3-8b92f0763855', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-18 18:27:03.201861', 1172.48363531, 1943.26012541, 35.83838872, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('5854b46d-41c0-4af6-bba7-64c95b092a13', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-18 18:27:03.201861', 1169.71629518, 1885.70038688, 23.74799963, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('22662df2-e97a-4a3e-9dc2-874bc98a5023', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-18 18:27:03.201861', 1168.93469989, 1913.10870040, 2.48016579, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9dcdd522-8dc3-4d58-b2ed-8f0a32b24cfe', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-18 18:27:03.201861', 1231.37307127, 1950.07592509, 33.86155420, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a3cb54fc-f133-40c4-89d5-46def26aa9cb', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-18 18:27:03.201861', 1190.06910681, 1852.12255351, 45.95586987, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d033eb20-851b-4c2e-8844-619a484e9280', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-18 17:27:03.201861', 1173.00564445, 1876.09250673, 5.12127497, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('76d4190d-d074-4a6a-9ef6-2adb04a7befe', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-18 17:27:03.201861', 1320.61210963, 2055.73228334, 48.90474234, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7019f580-4ea0-49b8-9b15-3f78fef1e1d3', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-18 17:27:03.201861', 1310.95736607, 1932.15958483, 45.21653999, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b5c08d72-9576-4197-9388-160e635fa706', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-18 17:27:03.201861', 1267.07614636, 2033.24685460, 3.58207195, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7ef75913-28b9-40b1-b754-b4b19eb9035c', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-18 17:27:03.201861', 1270.46064038, 2054.57929221, 14.98687295, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6b11466b-2721-4c35-98c7-1b8cd22673d3', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-18 17:27:03.201861', 1168.43899970, 2059.91330308, 33.38481428, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('30ec6aee-e0ef-4127-a53f-fa0cfde48430', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-18 16:27:03.201861', 1298.77724630, 2073.51088288, 10.69546800, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('bd129edb-fa5c-43f9-9793-190b9d650f37', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-18 16:27:03.201861', 1315.72070962, 1917.83581640, 39.89566992, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('12dbec6c-ee59-4eb4-b5b7-b56ab36ac500', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-18 16:27:03.201861', 1243.62946618, 2038.88316786, 18.25810282, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4b86c114-4df3-4977-95ad-0e2eb0ff9307', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-18 16:27:03.201861', 1245.73153646, 1995.28630719, 40.05709177, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('da6e03b1-851a-4efd-a0ea-b92f17d8bfe2', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-18 16:27:03.201861', 1199.72617116, 1952.59857956, 20.47200819, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e5c7aae1-c218-4265-bb32-367ca40f9d11', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-18 16:27:03.201861', 1244.40253339, 2068.73422264, 28.81368417, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ee9f6659-fb7a-4440-a248-c14b6d9d4570', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-18 15:27:03.201861', 1267.01731126, 1973.15682879, 34.77639709, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e371270b-8faa-4380-b294-c78b1f274867', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-18 15:27:03.201861', 1280.36018405, 2118.75970156, 15.25697777, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8bd0055b-ae95-4904-b7c8-22d559cc5cd8', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-18 15:27:03.201861', 1265.12714273, 2018.10034017, 3.91034559, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f5e9146a-f6af-4dcb-afd7-76f52a219ae9', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-18 15:27:03.201861', 1424.62900331, 2044.66881333, 48.37413690, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('dd9e4f66-c359-44fc-84b6-d3ffe697ce81', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-18 15:27:03.201861', 1369.59511669, 1922.31368844, 16.59836047, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a597d1f2-a3cc-4cfb-b76e-b83a21c156d4', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-18 15:27:03.201861', 1403.28296941, 2118.53266574, 9.85135964, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('990ceb9c-8afb-4803-a622-ebb9182ea2e7', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-18 14:27:03.201861', 1401.95417289, 1968.45370679, 29.67160134, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a117df59-9cf2-4ddf-a141-17ad8d91ce9b', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-18 14:27:03.201861', 1342.88698566, 2063.90081857, 38.18556045, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ee1bd0f0-a708-455b-9bde-ad4a3a7c728c', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-18 14:27:03.201861', 1386.82076222, 1970.25334695, 48.73732089, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6b93dfe3-c869-46a0-8d7b-37e221272546', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-18 14:27:03.201861', 1388.44935459, 2071.65979829, 6.07358170, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('fd7288a5-bc43-4dbc-aab2-fa3eff4f750a', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-18 14:27:03.201861', 1335.29263520, 2035.18917669, 19.28109188, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ac67b937-7870-4215-bc60-cec12638f913', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-18 14:27:03.201861', 1325.13821204, 2021.87928936, 47.69877842, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8980bb7b-e58c-40e1-9f11-db0dd2d4b07b', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-18 13:27:03.201861', 1341.11615199, 2140.54799515, 26.18548588, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a1dfaaa5-0487-4611-b943-2c9e5f7e9fb3', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-18 13:27:03.201861', 1353.86182772, 2000.07465580, 45.63007609, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('5899076c-446c-40c7-9b37-69d8651a735b', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-18 13:27:03.201861', 1472.03372745, 2139.24898477, 21.19836205, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('91161bd3-6c79-4437-b725-26debd1813de', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-18 13:27:03.201861', 1436.34105026, 2099.09037598, 4.29165932, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('5c63cb17-066d-45c0-9c92-c53ebb48f87e', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-18 13:27:03.201861', 1366.96502184, 2091.31820955, 41.60210401, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0cfe1532-74ee-4e40-a7c5-b0cf6f8a61c7', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-18 13:27:03.201861', 1414.31860101, 2043.14273448, 42.27666784, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('959e8b3f-b544-4d00-b85d-c1bcddde3047', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-18 12:27:03.201861', 1463.67294540, 2043.00836492, 17.38654137, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('5b098e10-8774-44f6-9b70-f9146423bc00', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-18 12:27:03.201861', 1433.72908037, 2137.96788271, 0.93824615, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('aaeeb01e-f14f-419e-b5c2-7627040831d0', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-18 12:27:03.201861', 1516.94560117, 2172.15306562, 48.49738157, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('536a29cd-6b51-4b06-8182-1d819af12cfd', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-18 12:27:03.201861', 1373.47388314, 1990.05925368, 9.29399226, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('15c52cc9-7e84-41c5-b9f9-92711601c3d2', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-18 12:27:03.201861', 1557.88483038, 2123.47326536, 10.58952838, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9bdb9672-90f3-440d-8aeb-d3c565966bd0', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-18 12:27:03.201861', 1396.64464894, 2177.02932625, 19.15544971, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('17f65ee6-03a2-4d17-b4d5-e9bb3c17cdda', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-18 11:27:03.201861', 1587.04488592, 2001.74397360, 30.65730063, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d0f60a41-8cbb-4c03-916b-e01d62dd5ac3', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-18 11:27:03.201861', 1562.69713307, 2186.11528329, 12.78937171, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1cb23f84-390f-40c6-b188-0a066077fa20', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-18 11:27:03.201861', 1604.18395551, 2062.98268414, 42.46270039, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('380a292f-f078-4298-a749-c44fa9869fe7', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-18 11:27:03.201861', 1485.81510309, 2008.04452426, 34.97119061, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ce4d4859-ff34-4860-8cbf-9be9ea7dbe07', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-18 11:27:03.201861', 1481.05018867, 2106.19446222, 16.99881747, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7f7d871e-5578-4d71-a21c-8fbe9348a6c1', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-18 11:27:03.201861', 1534.39378655, 2049.92953839, 7.81274778, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ce4f8468-e5e5-45a0-a233-0d5d4f89d892', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-18 10:27:03.201861', 1654.55855969, 2196.76736382, 22.65319148, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f0be60bd-c648-4b09-b45e-71588521356c', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-18 10:27:03.201861', 1622.12560489, 2046.61673106, 37.26787266, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('126a3224-83d4-4ad8-919c-27cca0b055b0', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-18 10:27:03.201861', 1629.07545833, 2102.62443187, 30.76111935, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b79aa751-6ff3-41f5-a678-a47aeaf98e6e', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-18 10:27:03.201861', 1495.56398809, 2147.79645793, 3.88063437, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2a4c2f5d-33e3-447e-a2c6-ed91d297db69', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-18 10:27:03.201861', 1612.50673782, 2007.90027244, 46.12567127, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e8507658-0172-448f-985e-69360c319052', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-18 10:27:03.201861', 1598.39161754, 2197.90612084, 39.62240583, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7e7e3ddb-9477-455f-9cc8-a86f11409626', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-18 09:27:03.201861', 1551.13246646, 2178.23384132, 40.58051687, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1e704628-3251-479e-ab04-3116bbaac3ae', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-18 09:27:03.201861', 1588.91200203, 2137.10066242, 33.67432560, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e45db9c2-1504-4e73-8daf-0bc238e61469', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-18 09:27:03.201861', 1536.66364814, 2193.30597257, 5.71056698, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4c32f889-0bcf-466a-b395-dd66f72083df', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-18 09:27:03.201861', 1543.13747629, 2014.66537761, 6.16452532, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d5f7557d-4ff9-4135-a79c-9d8ff960d718', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-18 09:27:03.201861', 1616.12995344, 2187.18723821, 18.09252680, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4aa34f97-7fd9-4b6e-834f-ba52c92a70cb', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-18 09:27:03.201861', 1672.41977454, 2148.11837459, 24.83198038, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7804bf01-13dd-4c99-b889-20843f81d6bb', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-18 08:27:03.201861', 1597.32858831, 2189.98857145, 33.79350062, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ee76aefc-aaa2-4f22-bba2-10e3bc0524ed', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-18 08:27:03.201861', 1598.51931492, 2033.04146335, 2.42382143, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('dd5bf9ee-650b-48d6-b35b-361077521610', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-18 08:27:03.201861', 1608.68462734, 2016.15900410, 6.04542776, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0cac4647-ce9b-481b-8a5d-0432797572c9', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-18 08:27:03.201861', 1647.58729465, 2130.92939121, 27.65533912, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('73847bf2-3927-472c-b92e-ce2191ab7fdb', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-18 08:27:03.201861', 1608.60646310, 2114.00919890, 19.24609344, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('555cbf08-b268-4a90-be1f-cbe16798023a', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-18 08:27:03.201861', 1616.50274313, 2181.89905692, 42.87565664, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d3b62719-b502-41ba-872a-8ab59e59d5da', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-18 07:27:03.201861', 1663.31906384, 2070.59369739, 4.83591760, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0a03134f-c261-424f-9ad4-a6174c3efbd2', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-18 07:27:03.201861', 1805.60472701, 2178.70674055, 44.00064618, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('19b42111-efe7-41c6-8d9f-ec10321b4950', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-18 07:27:03.201861', 1704.41220137, 2097.66769776, 21.24543971, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6b217ee2-ee1f-4b44-ad45-3a84fb5fa53e', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-18 07:27:03.201861', 1813.41437120, 1998.29641004, 27.36363904, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f346ef25-0035-49ef-a015-a751bbbb8612', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-18 07:27:03.201861', 1721.31415248, 1996.40689650, 44.68386808, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c62d588e-422d-4d68-b832-ce4b158a6d92', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-18 07:27:03.201861', 1691.49945901, 2051.10553059, 40.95107041, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('331bccb2-519d-4699-9b67-b0873ebaec53', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-18 06:27:03.201861', 1854.20397475, 2102.75787230, 19.93417906, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('89000faf-ce0e-4477-bc42-5dc5296b9e04', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-18 06:27:03.201861', 1712.50331973, 1988.15209860, 35.52173511, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c322093f-125f-424e-9b6a-63a1b411df1a', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-18 06:27:03.201861', 1705.85920000, 2118.91024702, 5.37235701, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('71cda106-09d3-4c39-8597-b804749cd67e', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-18 06:27:03.201861', 1824.62526966, 2077.52968611, 0.51388446, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f4f30ddb-b246-4917-9545-4b262d7e9fda', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-18 06:27:03.201861', 1816.38004790, 2033.25437003, 25.16916815, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6f7c9096-03c0-42e6-a061-b7c8de4b65d0', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-18 06:27:03.201861', 1795.98734055, 2099.70103821, 10.77364569, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('dadc8d8c-80ef-47fb-80c4-b70db016b71c', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-18 05:27:03.201861', 1720.03402822, 2095.66572290, 40.06768100, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1d1c1380-14fc-429c-aebe-2f3f419fe521', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-18 05:27:03.201861', 1757.96032991, 1959.25118328, 19.22066146, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2f7c8a3f-6c22-457c-9ffb-34efe80ac6e2', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-18 05:27:03.201861', 1711.59095405, 2139.70811063, 20.24371716, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f64eeb53-4c07-4c69-821a-a7b5201234e5', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-18 05:27:03.201861', 1785.90467642, 2099.32106460, 43.77432628, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('26cd1a8e-ed30-4c61-9573-1e390486d9a7', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-18 05:27:03.201861', 1888.03122541, 2110.18326980, 14.92582150, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d40f24e8-6a72-4edf-9910-1510c2eb7567', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-18 05:27:03.201861', 1766.01159671, 2047.87629107, 11.54052299, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6544f968-a2d2-4566-9ad2-97cba8f761ff', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-18 04:27:03.201861', 1904.86672343, 1930.63796772, 27.50570739, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d179e9ff-7bd6-4950-97c9-d2f439e6b40b', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-18 04:27:03.201861', 1940.33437268, 2060.56198568, 48.32744184, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('071fd9bf-e4c8-4822-a22b-1a74483e37eb', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-18 04:27:03.201861', 1773.45508570, 2055.21032383, 21.79236303, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('511d53ff-ec9e-4e82-b47a-9466e5225e99', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-18 04:27:03.201861', 1830.40298742, 2028.03087548, 20.96238854, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('33ea502c-6a98-4975-acf4-cc1a9597d088', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-18 04:27:03.201861', 1941.05281684, 2046.75023187, 12.95369867, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4048aab0-d789-46d0-bbf4-173cc7442a86', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-18 04:27:03.201861', 1785.22920458, 1969.02430436, 37.44535571, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8cf00f9e-1437-4b39-a189-3074043de6de', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-18 03:27:03.201861', 1959.22351043, 1903.51038973, 33.16151267, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('75791ffb-6789-4a6d-9a59-f1e98f762489', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-18 03:27:03.201861', 1797.30755266, 1926.62040237, 41.91312902, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('130831e8-627c-4ce4-aa31-81316eed0268', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-18 03:27:03.201861', 1875.77473152, 1980.85967160, 29.66147285, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('75d6952a-04a2-4465-9e02-7f71d4484002', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-18 03:27:03.201861', 1903.55806155, 1955.00932192, 9.91884401, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4e0344d7-b6a3-438f-8b2a-bc35560b5558', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-18 03:27:03.201861', 1814.78137558, 1984.35832741, 22.81078053, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b2e6aa88-b59b-4550-97b8-a407f79b29ff', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-18 03:27:03.201861', 1816.42825927, 2022.74208148, 10.62201816, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e6872a6b-2e74-4f86-8ea3-d5d803ade3b2', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-18 02:27:03.201861', 1983.38943282, 1896.45736676, 38.44818973, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c0c6c643-9c18-4060-b606-4a8df7efe94a', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-18 02:27:03.201861', 1895.61529221, 1938.73950998, 33.81108825, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6e4ea688-c320-46ec-bc17-462dbe347f59', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-18 02:27:03.201861', 1863.46467574, 2064.31637330, 45.40294919, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('aeb761a1-d17c-4b81-817e-2f2434909842', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-18 02:27:03.201861', 1902.39423557, 1916.79630332, 25.88346422, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('978ecc72-6c6a-4117-a6bf-2360cbe6540b', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-18 02:27:03.201861', 1927.20388821, 2069.14536959, 6.04934813, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8a301ed8-2765-405e-adf8-33a8853d8080', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-18 02:27:03.201861', 1974.77255763, 1974.53842424, 2.09115065, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2b4daafd-f3b3-4834-bde8-828cd1756041', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-18 01:27:03.201861', 1954.94851166, 1929.79934062, 12.76280074, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f227f1eb-46b8-499e-9a26-41b25f9d1820', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-18 01:27:03.201861', 2022.16758295, 1990.10154353, 43.39063155, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c9223a7a-0d36-4053-bd14-343d908b68bd', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-18 01:27:03.201861', 2034.81798179, 1928.69866375, 17.05713075, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('01398cda-82a3-4c13-a1bf-6a50415a9a92', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-18 01:27:03.201861', 2028.31189878, 1942.34430288, 33.64615820, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1faa07dc-89e1-43f3-9ec9-1059540ccdc8', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-18 01:27:03.201861', 2052.58101046, 1951.10859277, 24.20954772, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4f906ce1-9a18-4c90-ba57-4b45374b19be', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-18 01:27:03.201861', 1974.08285572, 1972.60485948, 32.72940532, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('27f03a5b-39e4-4fe5-b329-40128951a85b', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-18 00:27:03.201861', 2048.29783574, 1866.31714192, 4.49883653, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a2d119b1-f574-4cd6-b1be-0124f715d6e3', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-18 00:27:03.201861', 2014.75431375, 1971.05413917, 36.69036694, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1ec4f85e-5a20-4191-9f69-d483d9787b1f', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-18 00:27:03.201861', 1942.35296069, 1863.22312526, 5.32664435, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('94aa27b1-b2b1-405c-9151-95b1176f3218', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-18 00:27:03.201861', 1936.77261158, 1911.68137379, 39.68367677, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('50b0b599-b870-4a80-b736-ffc97972f6e6', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-18 00:27:03.201861', 2098.46276966, 1945.94173760, 15.95314733, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('77875aa7-ed7f-404f-b9af-7901391ec9b6', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-18 00:27:03.201861', 2091.09862019, 1924.76390757, 20.49521532, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2b64b31a-6d7e-469a-9721-095d4548fd78', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-17 23:27:03.201861', 2108.81468312, 1769.35591676, 44.41769631, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1d4239bf-d632-4ff0-ad8d-bd509f27fac7', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-17 23:27:03.201861', 2044.11020326, 1876.16810129, 26.40589020, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('3f0d567a-220e-4029-adc4-d3a5e33a98eb', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-17 23:27:03.201861', 2070.58393301, 1905.72150440, 44.75320795, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('04f1dd5c-aedf-4dba-af17-4ea5fc2f19f3', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-17 23:27:03.201861', 1995.05079063, 1811.77932601, 10.72678886, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9e243bb3-ce4a-4e4f-8cc7-3f2d2fa4d627', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-17 23:27:03.201861', 2111.47784519, 1872.07963267, 27.14526868, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a3f64329-505b-4b7f-b037-14c8df4d81f0', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-17 23:27:03.201861', 2066.56103121, 1845.12268217, 18.87919327, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2354c489-8e30-451c-853d-2917dbfd237a', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-17 22:27:03.201861', 2001.93856642, 1769.71252776, 27.28286222, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6d1cf448-aa4e-43d3-9937-16f9038eab59', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-17 22:27:03.201861', 2065.14246529, 1826.53626606, 17.15108788, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1b72b536-8eec-4be3-b493-28fc9821e84e', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-17 22:27:03.201861', 2038.54061933, 1718.56759542, 17.18235681, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8ff25586-d9b8-4b72-bb00-7b0c45f09d17', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-17 22:27:03.201861', 2061.50255450, 1830.01676425, 26.90921105, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('033207e0-6eb9-46da-b739-db05da06a425', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-17 22:27:03.201861', 2076.96999399, 1790.82773028, 40.34047447, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7a2f20eb-38c4-41d8-8e87-45dc60e54fea', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-17 22:27:03.201861', 1975.17552947, 1757.67189077, 4.52344845, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d90a3c21-6c51-4267-a4b5-6e8487e28d95', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-17 21:27:03.201861', 2032.66137272, 1742.89104278, 27.80910755, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e6f67700-bb33-4800-9604-c478ed1728f8', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-17 21:27:03.201861', 2079.45007801, 1780.44566747, 13.70374597, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0de9f7cb-15d9-4bce-af69-7faf1b287d29', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-17 21:27:03.201861', 2033.54665136, 1723.88393648, 25.60964515, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d31966d4-a27b-42a7-903a-69c87f3ea325', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-17 21:27:03.201861', 2089.18316532, 1818.45675748, 28.31933874, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('fc9a7b08-0fe3-4874-aa5a-701defc35512', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-17 21:27:03.201861', 2127.95634394, 1676.94433966, 27.30625842, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ae2a8c8e-6331-4c3a-a924-4e96ebd36b00', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-17 21:27:03.201861', 2157.56972840, 1746.74677943, 21.91435717, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('fa92813b-f74b-4580-8056-da62f163a540', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-17 20:27:03.201861', 2158.93353056, 1625.04971297, 10.95109282, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6bd31afe-32c7-4278-a544-0dc33f0177cf', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-17 20:27:03.201861', 2167.35785752, 1774.41715251, 38.62182724, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c1e89585-9d29-4a20-8140-c504d28e96b8', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-17 20:27:03.201861', 2137.27671113, 1698.29587944, 34.58914886, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1929ea4e-fcd1-4a54-870b-ec37ca736c50', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-17 20:27:03.201861', 2169.29177172, 1785.10196613, 45.49795875, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('70c6e38b-4822-4887-a31a-b95c8d963880', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-17 20:27:03.201861', 2048.10368843, 1790.15889140, 21.01167877, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d7fb3784-f289-4a2f-9391-46bb42659faa', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-17 20:27:03.201861', 2013.43175349, 1815.85280116, 29.42091452, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('00834812-ce73-4ba0-9f39-cc9526abcb8b', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-17 19:27:03.201861', 2150.70453740, 1685.23961731, 34.75360557, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7f9b7065-5ea0-411e-9e65-dc4f8a912d75', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-17 19:27:03.201861', 1999.02587496, 1603.12200319, 2.28287831, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2158746c-2091-46ee-a9c7-4d4c65520470', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-17 19:27:03.201861', 2093.99789290, 1592.96678233, 46.78763427, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0b88224a-4a6a-45f6-82bf-1bde9fc7f73b', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-17 19:27:03.201861', 2016.94603187, 1633.12226687, 18.65543179, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('bd55a5f5-43ae-4893-bbf2-dd00f1bcd9f1', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-17 19:27:03.201861', 2019.49320709, 1657.54677747, 5.73559925, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('37d43a43-eeb1-484c-9018-f96f0098db7a', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-17 19:27:03.201861', 2070.05386153, 1688.88153040, 32.44750922, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('437ddb20-d2a7-4f72-bc7c-d0e48ec9487b', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-17 18:27:03.201861', 2002.75597855, 1584.95574444, 6.14709117, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('344ddab5-5659-41e5-a09f-997360c44118', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-17 18:27:03.201861', 2126.11280236, 1717.84608258, 45.42544738, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('951f2bb5-5216-4b88-b474-07569057f97f', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-17 18:27:03.201861', 2074.54766973, 1690.47295142, 10.99479883, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('bcdf54b8-c720-4a03-84e2-759fa75d96f0', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-17 18:27:03.201861', 2057.01800903, 1685.52830211, 27.16533694, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('217f655e-a36e-43c2-96fd-4eaa0073029f', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-17 18:27:03.201861', 2120.65746821, 1527.51146469, 33.46783978, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('3d875d69-d1d6-4c89-b2b8-ccd70a0693d8', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-17 18:27:03.201861', 2140.13748288, 1685.57908765, 22.22921467, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('bfb4ec55-aa9e-4ef7-a78e-ebdeb12eb08d', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-17 17:27:03.201861', 2198.98308568, 1651.37845118, 14.18249181, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f905562c-ab58-45dc-8cb1-4798cd0ad178', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-17 17:27:03.201861', 2047.94980919, 1520.32921384, 26.74552353, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1a255c60-7f2d-45d0-b3fa-e19135b6bb02', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-17 17:27:03.201861', 2146.64023079, 1660.72069307, 11.23249851, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c65c15cf-fc48-4328-8702-86635b135470', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-17 17:27:03.201861', 2001.21845868, 1654.78033522, 14.75362855, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('df3f3685-9f55-43c1-afd3-405d72ea8c4c', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-17 17:27:03.201861', 2092.91638734, 1649.66692357, 35.36806976, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('bfe9fcdb-88bc-4536-b4e3-5dbf316a5b1f', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-17 17:27:03.201861', 2077.62401102, 1656.40725915, 34.54206183, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e47b1a88-27b4-4d2d-9075-5dd6686f9a2b', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-17 16:27:03.201861', 2057.07272336, 1546.99731028, 36.69636611, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ff7d5bdb-0aee-4b67-a734-74c61164c9f6', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-17 16:27:03.201861', 2036.07236525, 1513.46182164, 21.47628631, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('42c7e66a-ec0e-4014-8718-d9a3cc9f85c3', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-17 16:27:03.201861', 2107.34839851, 1419.01509198, 1.32110545, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('eb4ecd3c-6ce2-4f9d-9841-feaab400df19', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-17 16:27:03.201861', 2130.87909159, 1459.66945523, 14.18792716, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('97b9292e-568b-4f9a-9f86-b6b9458e8349', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-17 16:27:03.201861', 2036.73578081, 1419.04361898, 21.25720842, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6cab6a2c-aafc-4df2-a184-fb74aa499e98', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-17 16:27:03.201861', 2171.82973454, 1578.25086778, 38.82832925, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('5af3f072-9a9d-4d0c-9fa5-3dbea87db1fa', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-17 15:27:03.201861', 2114.77873811, 1508.02517759, 14.78988593, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8eae9ef8-a734-483c-8c95-78baed0abfab', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-17 15:27:03.201861', 2044.99347511, 1563.60748728, 45.33017512, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0f03333e-5eeb-4775-a8cd-42931ecd9a4f', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-17 15:27:03.201861', 2046.25235742, 1457.04646853, 3.22955067, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6fef07c9-d676-4ef7-b930-28acc92db22d', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-17 15:27:03.201861', 2136.85013000, 1526.42469681, 6.91254372, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a71138a5-1210-4f86-806b-34915699125a', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-17 15:27:03.201861', 2060.23141477, 1472.78928419, 31.12978426, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('3d49ddb6-c9e9-4947-8eca-6e3650190805', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-17 15:27:03.201861', 2166.07759605, 1464.18365591, 18.90489529, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c1868cbd-6db8-4c7d-9b59-8b40d62b94fd', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-17 14:27:03.201861', 2009.08814232, 1417.01629783, 34.40660183, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1e0c7275-c794-4b92-a3e5-b40843c11671', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-17 14:27:03.201861', 2111.47138255, 1452.57266465, 6.64071124, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('094f9479-c8fa-441e-9771-add11a9e75d7', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-17 14:27:03.201861', 1973.90205064, 1508.17778880, 40.72561685, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f7f46b48-97d3-4e3a-aac2-9117de9da817', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-17 14:27:03.201861', 2107.61021038, 1393.87235580, 47.31746721, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0776f43a-2df8-43ad-8d6f-e0d8f3c281c3', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-17 14:27:03.201861', 2092.31899952, 1340.90229557, 1.08743220, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ef955118-21ce-44a0-adbc-819db3098b3a', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-17 14:27:03.201861', 2156.31991254, 1521.02397068, 5.69308254, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6415317a-6413-4373-8ddd-444ed6ac15c8', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-17 13:27:03.201861', 2086.85330433, 1467.48599660, 23.34852053, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('10dfba15-abdd-44de-ab0e-30017e09bbde', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-17 13:27:03.201861', 1999.99790501, 1420.09690018, 22.80083145, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('3b01b238-a1b6-497d-9cac-d71f5b79cf80', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-17 13:27:03.201861', 2088.51354785, 1281.59915279, 35.95181426, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('be981b38-fb80-4cc2-ae9e-320476947d25', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-17 13:27:03.201861', 2123.08573649, 1380.74794943, 5.31919909, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d55990e6-be91-41a9-b323-04b6aa3f54cd', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-17 13:27:03.201861', 1971.99229936, 1433.50488840, 19.38108203, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('50c92b59-f61b-4581-94d6-a3e72a899495', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-17 13:27:03.201861', 2095.16396717, 1318.78224323, 19.47213559, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b8898327-7235-44c1-8ef7-e47bbdcacc33', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-17 12:27:03.201861', 2079.69393904, 1336.18065956, 43.56713964, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('408a64a2-aebe-455d-bed9-9b70fe7891ec', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-17 12:27:03.201861', 1935.56890100, 1249.61536700, 33.00411858, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('02858f51-2f61-46dd-b864-fdc76260d47a', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-17 12:27:03.201861', 1998.28190578, 1262.23246362, 32.77723957, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a7495cb2-93d4-4aad-86ae-7b51513ad233', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-17 12:27:03.201861', 1996.33491527, 1397.18298735, 24.39032414, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4fb5d54a-4bf8-4ba5-a7c6-c6bdc8168172', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-17 12:27:03.201861', 1958.69716280, 1263.58784710, 47.12217907, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ef9e28ea-71ad-47f5-8af2-fb53f303283d', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-17 12:27:03.201861', 1967.82820833, 1282.38767450, 28.41185146, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ff4dcc6a-ad53-4ef3-af26-98bbcb0cfdd3', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-17 11:27:03.201861', 2013.17162994, 1270.91363335, 16.78588063, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7533ba74-e41c-4c2a-8d8b-7e40ea9bd33c', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-17 11:27:03.201861', 1933.83729184, 1250.46576581, 23.10552830, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('50267de4-34dd-480b-9de6-1676998bc2d5', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-17 11:27:03.201861', 1942.92065528, 1296.55809525, 3.04099052, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d7ae6c9a-9865-4e14-a5d2-fc24f5d26f6e', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-17 11:27:03.201861', 2035.10103689, 1327.38239032, 40.24528456, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e2fcc06f-39ee-4fed-8707-1dea95a0241b', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-17 11:27:03.201861', 2042.01111902, 1383.95196846, 16.96040555, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('fef30bbf-07f7-4475-b045-5c60e149d6aa', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-17 11:27:03.201861', 2039.93240112, 1240.44760519, 15.59992731, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f3e777b8-d1e8-4459-b65e-9861a4c1ceef', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-17 10:27:03.201861', 2008.45782068, 1167.04065618, 43.52850087, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('3d26add8-34eb-491f-8409-68b32b37053a', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-17 10:27:03.201861', 1967.27963927, 1326.63955366, 7.65540692, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('906abd99-3fd6-4938-a409-0d4e89adf4e3', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-17 10:27:03.201861', 1875.60203969, 1268.85897409, 8.77760168, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('cb41da00-86fa-44af-a97a-db899e558c9f', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-17 10:27:03.201861', 1979.76863661, 1348.12628516, 16.55284196, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('12d24c5c-8551-49bf-861b-cdf2a4020efd', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-17 10:27:03.201861', 1953.24400506, 1349.48881361, 46.86279039, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('aa688c0f-e887-4035-b247-d1678da19ffe', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-17 10:27:03.201861', 1997.67900745, 1288.41234482, 37.33160244, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('296998c7-3589-4df8-be2b-d1afc094b02f', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-17 09:27:03.201861', 2001.86332529, 1163.45344314, 25.69312096, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('041ac74e-758e-4657-82f0-e2238855ac43', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-17 09:27:03.201861', 2015.42864913, 1318.34487689, 2.40913457, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('832561ad-b952-446b-9999-5ad29966427e', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-17 09:27:03.201861', 1976.02904875, 1148.76475780, 18.48579490, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1dc4c243-b0d7-48e1-a988-7a29d6e127e8', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-17 09:27:03.201861', 1934.45385285, 1131.44369182, 3.74223332, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a20f49ca-27a2-472f-b927-b8049fa21293', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-17 09:27:03.201861', 1943.11556529, 1181.18513807, 6.80617435, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b419c4c6-574d-422e-8ffc-7d69eb95c67c', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-17 09:27:03.201861', 2002.85262383, 1122.75613149, 18.55509931, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('572d5be5-dc85-49b7-bb64-3b17ec00d129', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-17 08:27:03.201861', 1935.11733704, 1161.90736491, 1.97572977, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ee1f5dca-6f51-4be2-b9a9-17d9be28ea16', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-17 08:27:03.201861', 1923.85710952, 1151.30095800, 28.16142214, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f4c5cf2e-5a4d-42bf-8a99-19b92334ec59', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-17 08:27:03.201861', 1985.29243517, 1200.34329593, 3.31423032, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ef00c6b7-93d3-41e8-bbf9-2eff7796562c', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-17 08:27:03.201861', 1880.81872161, 1178.75840312, 2.18370372, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c5f83308-bcbd-49cb-9887-3dc61b5afcab', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-17 08:27:03.201861', 1878.32135730, 1096.61471880, 35.04036222, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('cff4caf2-1b9c-4d40-aff7-49901a76e5a8', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-17 08:27:03.201861', 1820.09384296, 1162.71763398, 26.85752546, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('cbe8ea95-371e-40f9-8e05-0511aa3a4783', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-17 07:27:03.201861', 1894.45126126, 1104.26352231, 33.27826324, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('da14e66a-a409-4c06-a9b6-6cacb204291c', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-17 07:27:03.201861', 1835.77613475, 1067.73789739, 9.13651043, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8cd5b955-46cf-4fa5-bdc0-2dbafcec6a3b', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-17 07:27:03.201861', 1802.62823693, 1073.12248550, 8.01877869, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('001d6e0f-c5df-4f03-9739-7dc7944d50d4', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-17 07:27:03.201861', 1942.68176931, 1143.32395430, 24.16242972, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('5b16c391-ada6-49f7-89e1-6051961a5338', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-17 07:27:03.201861', 1910.24858704, 1134.21151408, 33.31684590, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8ef28775-6a90-47e5-b91f-a87958b41c76', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-17 07:27:03.201861', 1773.98186244, 1141.78909002, 6.83969365, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8a704151-ada8-44b2-85da-3146f3750246', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-17 06:27:03.201861', 1707.80983765, 1116.39965247, 37.63734793, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('150645bd-99ec-48cb-91af-93e9e7fa6ead', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-17 06:27:03.201861', 1755.96906389, 1118.75092955, 9.33334968, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('fc267142-392a-459b-ba7c-6d7f2e70195a', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-17 06:27:03.201861', 1849.27944733, 1077.36760849, 15.96510346, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b9e8c723-5006-4951-8e71-03ca7e76abc3', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-17 06:27:03.201861', 1778.64734716, 1227.61451572, 18.83589494, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2f0fe777-992f-426f-a2f7-abf491686cf1', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-17 06:27:03.201861', 1824.08611794, 1069.17013573, 27.33038647, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('841c34de-bddf-4561-ae84-aa96dd258b27', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-17 06:27:03.201861', 1723.14179670, 1129.89720323, 39.23159015, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ede59bba-6558-4a3c-a2c1-2c955c7fafeb', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-17 05:27:03.201861', 1757.67418676, 1139.93159788, 6.85059991, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('d4b26743-6e37-452e-89c0-a8f4d05d8af0', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-17 05:27:03.201861', 1652.26766380, 1026.70562471, 17.19792239, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('14676e56-8a41-4d3a-9fb9-8b2a71378d1e', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-17 05:27:03.201861', 1830.39037659, 1174.62310453, 2.46484094, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9d112545-0f5d-4fad-a04b-19cb7c976f9a', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-17 05:27:03.201861', 1653.26541375, 1157.02214864, 23.88061393, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('bb765ab0-1abd-4957-b38d-339b69b7e896', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-17 05:27:03.201861', 1730.34100390, 1099.84609775, 42.98555328, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7de9dc1a-4d6a-427a-ad26-ee4d909bbd44', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-17 05:27:03.201861', 1832.44201039, 1076.51458837, 28.13743973, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('32ecf6a5-30cc-4960-b48d-2ca3e986c6f7', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-17 04:27:03.201861', 1681.79057060, 1109.43488193, 21.13236916, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('90271e38-0010-41a3-a5a1-2b0b719f10a6', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-17 04:27:03.201861', 1614.84884965, 1031.76815648, 12.82391354, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a757ef0a-49a5-426e-b387-9c798cca7378', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-17 04:27:03.201861', 1624.63800833, 1152.97591836, 24.42117412, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('20f6144e-3d36-449e-ab8f-da119521350e', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-17 04:27:03.201861', 1696.92210106, 1119.27264267, 3.94270172, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f7b6c3ce-8597-4725-bf59-ffb0e45480be', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-17 04:27:03.201861', 1743.10209724, 1016.01921021, 11.72907874, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1b8bba72-f7cc-4dae-bc59-b0f5adf538a5', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-17 04:27:03.201861', 1712.14324148, 1104.71585532, 16.26501285, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f8871872-fc5e-4423-b68c-afdac8991782', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-17 03:27:03.201861', 1712.33800572, 1195.09313177, 41.40931408, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('eba486d3-1e1f-4761-996c-a348ce8a5ad2', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-17 03:27:03.201861', 1668.23311575, 1030.43293067, 34.09551643, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8dd98f61-b6ad-4b1a-8306-de22accf3fff', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-17 03:27:03.201861', 1730.57254396, 1113.77418999, 11.38866399, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('441b9763-63a8-4126-9a0b-594dd58cdad3', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-17 03:27:03.201861', 1569.65030694, 1186.46737379, 19.19094659, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('266deaf3-c9a1-448d-95cd-fd7c5708c146', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-17 03:27:03.201861', 1613.52097567, 1143.25032785, 36.24480364, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b443e7e8-64f6-43c3-bcfe-ea94d49d0fac', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-17 03:27:03.201861', 1626.40101990, 1119.46693450, 4.34038787, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9e65b75c-379b-41c9-9627-4a473ec81e7e', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-17 02:27:03.201861', 1669.42255110, 1076.99935429, 44.83341107, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4291e82a-3aa6-4053-a410-e1f79d8e09c8', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-17 02:27:03.201861', 1599.32773769, 1072.46077756, 25.08859980, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9d5ce436-e3d3-4cc6-9b36-dad6448df1f8', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-17 02:27:03.201861', 1605.71286703, 1062.36947023, 20.04202193, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('98715cbc-704f-40c6-b54d-9bca1d5143de', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-17 02:27:03.201861', 1613.88657248, 1089.35172548, 8.65575529, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ae0764f5-a5cb-41f6-830f-00e45152ac54', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-17 02:27:03.201861', 1650.57670908, 1030.05590662, 48.13987308, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e8ba1af9-3ba6-4297-ba5a-6ee16ddec9bc', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-17 02:27:03.201861', 1510.17594847, 1188.34695345, 12.58232857, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2ab7a196-53ad-4365-8259-8fe8767c577f', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-17 01:27:03.201861', 1640.24553791, 1009.72193397, 46.52536558, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('030c2ac3-7a9d-4fc6-9ede-cabdc296bbe6', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-17 01:27:03.201861', 1493.89981813, 1049.51199383, 30.20367673, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('59536f59-7538-4b6e-80a0-3dec24e03f6b', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-17 01:27:03.201861', 1468.22403808, 1116.50812160, 48.21493540, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('6cf53130-4004-4737-b7d1-a0214f332b93', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-17 01:27:03.201861', 1486.98274786, 1038.94929820, 0.73451016, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('60959933-51cb-450a-909f-aee9d113dbc6', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-17 01:27:03.201861', 1615.51323328, 1071.59004960, 23.22550787, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('5e4ec374-1153-4054-8d0e-44f95c0d4256', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-17 01:27:03.201861', 1489.85392220, 1164.63554404, 4.60918836, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('113948d5-f910-4e91-956a-b13a0ec578a1', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-17 00:27:03.201861', 1511.01680481, 1192.85941983, 23.33784215, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f9dfe826-bb8b-4263-b355-88354496a027', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-17 00:27:03.201861', 1494.23031208, 1103.29275873, 33.09723380, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8568ade1-7e22-4a02-8258-7394bf5778a6', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-17 00:27:03.201861', 1474.87138620, 1092.37524927, 18.13694775, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('80e28331-5fa9-4865-bd2d-a867c83faaea', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-17 00:27:03.201861', 1573.06801164, 1143.92393650, 27.93267782, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('9e867417-f3ce-4c99-a27a-5e414b1a0b49', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-17 00:27:03.201861', 1589.44788002, 1208.30283440, 9.86812529, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f3bcd8e2-cd2b-46f1-ae50-cf40a5eac3fd', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-17 00:27:03.201861', 1505.54089827, 1177.91220154, 15.68890694, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('7a12fafe-03b8-440c-a166-813b28f483ea', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-16 23:27:03.201861', 1539.71517288, 1065.59288494, 38.38043049, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('897866c8-d12a-47de-80ff-7036b6c85fbb', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-16 23:27:03.201861', 1526.53290869, 1162.04666754, 49.99940259, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('8772e756-c9a1-4e23-ae59-eaefe969cb8e', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-16 23:27:03.201861', 1392.93070749, 1054.40215046, 34.71934272, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('90d7b3ba-6cc9-4137-a18f-c215e509ae9b', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-16 23:27:03.201861', 1445.16924639, 1157.83461922, 26.88878627, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('0711c2e8-b134-415e-ba90-3e3140692ec2', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-16 23:27:03.201861', 1508.90643955, 1155.19462133, 14.90084703, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e2af3736-c2b1-4577-a07b-194aa22250fd', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-16 23:27:03.201861', 1523.23573067, 1215.18028095, 18.05421391, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b130c662-2004-47e3-af32-c33f7cdf7c79', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-16 22:27:03.201861', 1396.14139639, 1216.95585028, 20.73522847, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('db0dd229-7c23-4fb6-94bc-7c4323a1ea53', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-16 22:27:03.201861', 1478.53540200, 1131.70960334, 20.08482022, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ab22b8ce-ca14-4f62-8310-2d8b61570379', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-16 22:27:03.201861', 1452.24492265, 1235.03924047, 30.24659270, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a71f70b4-1c81-491e-8454-e86af5b4bc61', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-16 22:27:03.201861', 1354.34840024, 1151.14537817, 27.84171081, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('743ca4a4-0579-4cde-ab93-241b305c1d0e', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-16 22:27:03.201861', 1461.84813473, 1049.04760455, 29.09041788, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('626b0a25-2da2-48df-a6b5-2327c902f364', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-16 22:27:03.201861', 1414.13658382, 1168.80140070, 21.59160078, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('141fc192-0066-4cf8-9472-615d53781e3b', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-16 21:27:03.201861', 1424.02312589, 1085.57980593, 45.14658940, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('28a61640-d923-4346-9d79-6ba3d8c205ee', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-16 21:27:03.201861', 1431.25983706, 1177.79471975, 30.21053836, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('49ac5393-01a9-48f4-91d7-f7917b53af23', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-16 21:27:03.201861', 1347.66398295, 1078.84786220, 47.74109143, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4869fb63-69fe-4451-88a3-9b3b9b31ebcd', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-16 21:27:03.201861', 1447.31131534, 1092.70807096, 32.36666648, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('e5c59dd5-567e-4ce6-9726-fe32841ddbc0', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-16 21:27:03.201861', 1284.31897147, 1081.96677546, 37.34734697, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f1a2644a-cc0f-4837-a6f4-16f6161a7f05', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-16 21:27:03.201861', 1341.19365859, 1073.41692614, 15.11405569, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4f4f5218-2aee-4624-9a59-8fdc50e7b6fd', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-16 20:27:03.201861', 1233.65451003, 1086.19302883, 38.94268112, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4bf52cf9-b95e-49e5-a4fb-d93f7ab56239', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-16 20:27:03.201861', 1348.53440810, 1137.42819751, 13.30798817, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2fb0dcd7-1f8b-4757-8a4a-c6ba21d0c677', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-16 20:27:03.201861', 1252.71912192, 1092.52259319, 37.61380224, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('534592e7-8c31-4775-a7e0-0f4de8445329', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-16 20:27:03.201861', 1225.14977364, 1189.51007187, 39.51142878, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('821f1e76-aed6-4b0c-a1b8-595a415bc5f6', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-16 20:27:03.201861', 1383.19982726, 1110.25518682, 13.45277003, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ca070b4a-0b3f-4e95-a0a7-8a93e3058fda', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-16 20:27:03.201861', 1405.11534216, 1117.08692006, 1.56365115, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('59a83a97-aebe-4f14-84f4-9652be9e4523', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-16 19:27:03.201861', 1373.08903046, 1270.63810192, 34.32813908, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b825689a-4da3-4943-b3dd-68ff1791fa9d', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-16 19:27:03.201861', 1256.55242487, 1162.31141398, 6.65953799, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('20963b48-f9f1-46a6-adb6-52524cc6710b', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-16 19:27:03.201861', 1238.23060198, 1211.39829724, 47.47097020, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('68e961c8-ba81-4df6-af2f-b76ea44b914b', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-16 19:27:03.201861', 1263.14123913, 1312.12596053, 26.14147032, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('3f470bc4-4f2d-43d9-ae85-686cdf5514a3', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-16 19:27:03.201861', 1367.65031603, 1238.99661781, 25.36562610, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b3ce5c89-82e7-49e4-933d-2e13544bc81e', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-16 19:27:03.201861', 1298.48221386, 1139.28441919, 14.36719370, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('4ade36d4-7fac-43b0-9c1c-6f534a9e86a1', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-16 18:27:03.201861', 1217.15467121, 1272.27135912, 41.87913302, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('b6bd2602-b327-4405-9def-4a08ad669c61', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-16 18:27:03.201861', 1267.56669228, 1248.34482487, 11.98505141, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('01dab55f-a209-4bd0-a8f8-55ac41a2ed45', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-16 18:27:03.201861', 1147.66732340, 1172.77168005, 37.54508310, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('fbf60b63-8f3d-44db-81c5-d9078fd54660', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-16 18:27:03.201861', 1151.39242031, 1173.53318852, 22.91090639, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('549b0d88-d4bf-4a3e-959b-f751c805270a', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-16 18:27:03.201861', 1178.18219084, 1180.54529808, 42.29261381, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('ce7083ff-090c-4dba-8844-d5445188429b', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-16 18:27:03.201861', 1213.09266418, 1288.73285475, 35.56038643, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('5c7db06d-0e74-495d-ac11-21e62eeb621e', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-16 17:27:03.201861', 1146.55773514, 1228.08535933, 36.58996541, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c95df965-c1f2-4e0f-bcf0-d2d4f6fdeee5', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-16 17:27:03.201861', 1121.39675549, 1197.95327720, 20.38055783, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('f2311c3a-9648-418d-b198-0d4618e44f48', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-16 17:27:03.201861', 1247.89706100, 1261.91388843, 47.41254653, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('dc8d910e-ba45-4286-984d-7b644e4ee274', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-16 17:27:03.201861', 1206.80893706, 1261.57685770, 18.58231218, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('cdfc36eb-e3ff-4112-9374-f9930ce162df', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-16 17:27:03.201861', 1229.58464918, 1238.65506752, 24.18835332, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2b1139f0-df5b-45b9-8d3a-28b2b67c5037', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-16 17:27:03.201861', 1182.40678258, 1367.15053381, 1.98527984, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('fae552ef-72c5-40ca-8712-231c35da1732', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-16 16:27:03.201861', 1246.94021559, 1398.60364063, 35.42463143, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2d2bc296-68a4-440e-b4bb-a154fddab768', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-16 16:27:03.201861', 1258.56847802, 1267.03846022, 19.59285256, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1b8658b5-b38d-4dd7-9c1c-0a49f22622d1', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-16 16:27:03.201861', 1082.56747494, 1249.79625667, 32.25700126, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('3ec4120c-34a6-46b4-9308-5859e1ceb787', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-16 16:27:03.201861', 1168.80270838, 1269.51679703, 42.66749692, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('94779929-c330-4082-9569-fee94a044490', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-16 16:27:03.201861', 1192.25651983, 1242.03224330, 23.20561571, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('74a5d725-53c5-4004-9789-3294c3257acb', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-16 16:27:03.201861', 1196.07735700, 1374.00481026, 2.53810748, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('c59a31f9-f72d-4add-a1f0-1acc5808eca2', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', '2026-04-16 15:27:03.201861', 1061.73272479, 1401.70997127, 11.60410275, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('a8bfe012-d871-45fd-8c6d-8fe8383e96a0', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', '2026-04-16 15:27:03.201861', 1065.41188360, 1319.20005099, 30.44748811, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('3030353a-f347-424d-8152-f658b0c94135', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', '2026-04-16 15:27:03.201861', 1191.32700843, 1355.58324503, 18.76286080, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('1bf116c0-fc89-4ca7-8cb2-a3a06f8c2a82', '8e82d033-4b68-4a80-be66-7f6f51251653', '2026-04-16 15:27:03.201861', 1104.41055072, 1343.92091998, 26.77968230, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('2d0753df-ba33-4efe-8294-49f72106ed1f', '2bb0f08a-1caf-40de-bd29-45897f968ce9', '2026-04-16 15:27:03.201861', 1077.63359273, 1436.18623783, 45.40199722, '2026-04-23 15:27:03.201861');
INSERT INTO public.market_snapshots (id, market_id, "timestamp", yes_pool, no_pool, trading_volume, created_at) VALUES ('3fa423b1-d2fc-4103-985e-b78f94272160', '97f0fac2-fa67-4e65-a425-73a6b071efca', '2026-04-16 15:27:03.201861', 1183.68539113, 1309.32422584, 20.20865188, '2026-04-23 15:27:03.201861');


--
-- Data for Name: markets; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.markets (id, title, description, category, status, lock_at, resolve_at, outcome, asset_code, asset_issuer, created_by, created_at, updated_at, image_url, resolution_rule, resolution_source, oracle_url, contract_address, fee_ngo, fee_platform, fee_gamification, oracle_ref) VALUES ('5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', 'Will the global average temperature increase by 1.5??C by 2027?', 'Climate change prediction based on NASA data.', 'Environment', 'active', '2027-01-01 00:00:00', '2027-02-01 00:00:00', NULL, NULL, NULL, 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4', '2026-04-23 15:27:03.186478', '2026-04-23 15:27:03.186478', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05', 'Average global temperature as reported by NASA GISS.', 'https://data.giss.nasa.gov/', 'https://api.oracle.com/v1/temp', 'C123...', 0.0200, 0.0100, 0.0050, NULL);
INSERT INTO public.markets (id, title, description, category, status, lock_at, resolve_at, outcome, asset_code, asset_issuer, created_by, created_at, updated_at, image_url, resolution_rule, resolution_source, oracle_url, contract_address, fee_ngo, fee_platform, fee_gamification, oracle_ref) VALUES ('f1d95c7b-c614-4814-a202-f5c7fedf2b2d', 'Will Ethereum switch to a new consensus layer again in 2025?', 'Prediction on ETH roadmap.', 'Tech', 'active', '2025-12-31 00:00:00', '2026-01-15 00:00:00', NULL, NULL, NULL, 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4', '2026-04-23 15:27:03.186478', '2026-04-23 15:27:03.186478', 'https://images.unsplash.com/photo-1622741821284-673f3839ce21', 'Official Ethereum Foundation blog announcement.', 'https://blog.ethereum.org/', 'https://api.oracle.com/v1/eth', 'C456...', 0.0200, 0.0100, 0.0050, NULL);
INSERT INTO public.markets (id, title, description, category, status, lock_at, resolve_at, outcome, asset_code, asset_issuer, created_by, created_at, updated_at, image_url, resolution_rule, resolution_source, oracle_url, contract_address, fee_ngo, fee_platform, fee_gamification, oracle_ref) VALUES ('2c9a077e-b9eb-46c6-a66f-c6d5694213d7', 'Will Brazil win the 2026 World Cup?', 'Sports prediction.', 'Sports', 'active', '2026-06-11 00:00:00', '2026-07-20 00:00:00', NULL, NULL, NULL, 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4', '2026-04-23 15:27:03.186478', '2026-04-23 15:27:03.186478', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018', 'Official FIFA match results.', 'https://fifa.com', 'https://api.oracle.com/v1/sports', 'C789...', 0.0200, 0.0100, 0.0050, NULL);
INSERT INTO public.markets (id, title, description, category, status, lock_at, resolve_at, outcome, asset_code, asset_issuer, created_by, created_at, updated_at, image_url, resolution_rule, resolution_source, oracle_url, contract_address, fee_ngo, fee_platform, fee_gamification, oracle_ref) VALUES ('8e82d033-4b68-4a80-be66-7f6f51251653', 'Did Bitcoin reach $70k in Q1 2024?', 'Finance prediction.', 'Finance', 'resolved', '2024-03-31 00:00:00', '2024-04-01 00:00:00', 'YES', NULL, NULL, NULL, '2025-10-23 15:27:03.189342', '2026-04-23 15:27:03.189342', 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d', 'CoinMarketCap daily close price.', 'https://coinmarketcap.com', NULL, NULL, 0.0200, 0.0100, 0.0050, NULL);
INSERT INTO public.markets (id, title, description, category, status, lock_at, resolve_at, outcome, asset_code, asset_issuer, created_by, created_at, updated_at, image_url, resolution_rule, resolution_source, oracle_url, contract_address, fee_ngo, fee_platform, fee_gamification, oracle_ref) VALUES ('2bb0f08a-1caf-40de-bd29-45897f968ce9', 'Did Apple release a VR headset in 2023?', 'Tech prediction.', 'Tech', 'resolved', '2023-12-31 00:00:00', '2024-01-01 00:00:00', 'YES', NULL, NULL, NULL, '2025-04-23 15:27:03.189342', '2026-04-23 15:27:03.189342', 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac', 'Official Apple Newsroom announcement.', 'https://apple.com/newsroom', NULL, NULL, 0.0200, 0.0100, 0.0050, NULL);
INSERT INTO public.markets (id, title, description, category, status, lock_at, resolve_at, outcome, asset_code, asset_issuer, created_by, created_at, updated_at, image_url, resolution_rule, resolution_source, oracle_url, contract_address, fee_ngo, fee_platform, fee_gamification, oracle_ref) VALUES ('97f0fac2-fa67-4e65-a425-73a6b071efca', 'Federal Reserve Interest Rate Cut in September 2024?', 'Economy prediction.', 'Finance', 'locked', '2024-09-18 00:00:00', '2024-09-19 00:00:00', NULL, NULL, NULL, NULL, '2026-03-23 15:27:03.191276', '2026-04-23 15:27:03.191276', 'https://images.unsplash.com/photo-1611974714024-4696144e0078', 'Official Federal Reserve press release.', 'https://federalreserve.gov', NULL, NULL, 0.0200, 0.0100, 0.0050, NULL);


--
-- Data for Name: ngos; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.ngos (id, name, slug, description, category, verified, verification_date, verified_by, wallet_address, website, social, impact_metrics, total_funds_received, created_at, updated_at) VALUES ('efa5aa30-1fa4-4d01-9928-9201b72fbba0', 'Ocean Cleanup', 'ocean-cleanup', 'Developing advanced technologies to rid the world???s oceans of plastic.', 'Environment', true, NULL, NULL, 'GOCN0000000000000000000000000000000000000000000000000001', NULL, '{"twitter": "@oceancleanup"}', '{"plastic_removed_kg": 120000}', 5000.00000000, '2026-04-23 15:27:03.179244', '2026-04-23 15:27:03.179244');
INSERT INTO public.ngos (id, name, slug, description, category, verified, verification_date, verified_by, wallet_address, website, social, impact_metrics, total_funds_received, created_at, updated_at) VALUES ('86274401-cef4-4dd8-8771-11377e320fb7', 'Doctors Without Borders', 'msf', 'Providing medical assistance to people affected by conflict, epidemics, disasters, or exclusion from healthcare.', 'Health', true, NULL, NULL, 'GMSF0000000000000000000000000000000000000000000000000002', NULL, '{"site": "msf.org"}', '{"patients_treated": 500000}', 15000.00000000, '2026-04-23 15:27:03.179244', '2026-04-23 15:27:03.179244');
INSERT INTO public.ngos (id, name, slug, description, category, verified, verification_date, verified_by, wallet_address, website, social, impact_metrics, total_funds_received, created_at, updated_at) VALUES ('1388c81b-48b3-4ad9-a902-0a34ce73b1e7', 'Khan Academy', 'khan-academy', 'Free, world-class education for anyone, anywhere.', 'Education', true, NULL, NULL, 'GKHN0000000000000000000000000000000000000000000000000003', NULL, '{"youtube": "khanacademy"}', '{"students_reached": 10000000}', 8500.00000000, '2026-04-23 15:27:03.179244', '2026-04-23 15:27:03.179244');
INSERT INTO public.ngos (id, name, slug, description, category, verified, verification_date, verified_by, wallet_address, website, social, impact_metrics, total_funds_received, created_at, updated_at) VALUES ('75479af1-bdc1-4852-afaa-1deb3dd7385b', 'Animal Welfare Institute', 'awi', 'Dedicated to reducing animal suffering caused by people.', 'Animals', true, NULL, NULL, 'GAWI0000000000000000000000000000000000000000000000000004', NULL, '{}', '{"animals_saved": 5000}', 2200.00000000, '2026-04-23 15:27:03.179244', '2026-04-23 15:27:03.179244');
INSERT INTO public.ngos (id, name, slug, description, category, verified, verification_date, verified_by, wallet_address, website, social, impact_metrics, total_funds_received, created_at, updated_at) VALUES ('a4f672f5-a89a-45b7-81e6-e79d81a0fa43', 'Code.org', 'code-org', 'Expanding access to computer science in schools.', 'Education', true, NULL, NULL, 'GCOD0000000000000000000000000000000000000000000000000005', NULL, '{}', '{"code_hours": 1000000}', 4000.00000000, '2026-04-23 15:27:03.179244', '2026-04-23 15:27:03.179244');


--
-- Data for Name: processed_transactions; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.refresh_tokens (id, token, expires_at, revoked, user_id) VALUES ('840f6d33-73a0-4ba2-a0d5-f3dd3e13388b', '590f9617c0e8c4b7857bdcc32b068e3b2230e22b22a88055674918b7befb17f030c1d4074b328a0b14403ee3613d1c6bec404030e95b0de42431224b067bbc7f', '2026-05-01 09:22:48.981', false, '00000000-0000-0000-0000-000000000001');


--
-- Data for Name: tx_intents; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: tx_receipts; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: user_positions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('9850b9ab-3ea5-43e4-b02e-343395cc5a41', '2d063cd3-8856-48f3-92aa-f67f2eb45668', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', 'YES', 325.46181147, 'confirmed', NULL, NULL, NULL, '2026-04-21 20:20:06.414377', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('aab79a77-dad3-455f-a66d-165b3cea205c', '2d063cd3-8856-48f3-92aa-f67f2eb45668', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', 'NO', 187.69100947, 'confirmed', NULL, NULL, NULL, '2026-04-14 14:47:33.712319', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('0fb549ec-361f-4777-ad87-61f4a3aee62a', '2d063cd3-8856-48f3-92aa-f67f2eb45668', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', 'NO', 148.25591443, 'confirmed', NULL, NULL, NULL, '2026-04-13 17:22:24.277398', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('8b78c847-4231-4bf3-b79a-68377bd2b48d', '2d063cd3-8856-48f3-92aa-f67f2eb45668', '8e82d033-4b68-4a80-be66-7f6f51251653', 'YES', 259.43216554, 'confirmed', NULL, NULL, NULL, '2026-04-22 08:42:33.924469', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('1900247c-c845-4179-b4fb-ff0f4779e46d', '2d063cd3-8856-48f3-92aa-f67f2eb45668', '2bb0f08a-1caf-40de-bd29-45897f968ce9', 'NO', 364.95223382, 'confirmed', NULL, NULL, NULL, '2026-04-16 02:35:34.08701', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('47098521-cda5-4cd2-b0e4-f293cb19e64d', '5e6d3185-560b-43f0-99b7-7e91b76db9da', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', 'NO', 20.27086775, 'confirmed', NULL, NULL, NULL, '2026-04-17 19:42:24.950762', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('704deb19-6a62-4e3f-b345-6fb8b26c497e', '5e6d3185-560b-43f0-99b7-7e91b76db9da', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', 'NO', 455.73551327, 'confirmed', NULL, NULL, NULL, '2026-04-22 01:44:51.208077', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('e03a11b5-a896-4b39-bacf-7900a8ab5bc2', '5e6d3185-560b-43f0-99b7-7e91b76db9da', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', 'YES', 486.03253151, 'confirmed', NULL, NULL, NULL, '2026-04-22 18:49:11.587637', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('2f2c7cc5-1a64-43e1-a18e-0466051b65a0', '5e6d3185-560b-43f0-99b7-7e91b76db9da', '8e82d033-4b68-4a80-be66-7f6f51251653', 'YES', 119.29653778, 'confirmed', NULL, NULL, NULL, '2026-04-19 04:52:30.426161', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('ea5909d3-44ba-47a0-8384-0963654672ba', '5e6d3185-560b-43f0-99b7-7e91b76db9da', '2bb0f08a-1caf-40de-bd29-45897f968ce9', 'NO', 62.74493771, 'confirmed', NULL, NULL, NULL, '2026-04-16 17:47:25.53282', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('c6a91a82-0841-4ef1-8aa4-1c3e922490e7', 'cb3ba0c3-0064-418c-af53-d7d671a1be72', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', 'NO', 351.96401855, 'confirmed', NULL, NULL, NULL, '2026-04-16 17:31:19.744487', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('70c7a572-f557-4ce2-9175-c8fae5f276a3', 'cb3ba0c3-0064-418c-af53-d7d671a1be72', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', 'NO', 154.01712211, 'confirmed', NULL, NULL, NULL, '2026-04-16 05:32:51.499661', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('19fb41e5-9a60-4df3-9647-99ab8352ecfe', 'cb3ba0c3-0064-418c-af53-d7d671a1be72', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', 'YES', 144.33583621, 'confirmed', NULL, NULL, NULL, '2026-04-13 22:42:03.741703', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('2dd617b8-fb96-4d6a-a1f0-fe6aa289f488', 'cb3ba0c3-0064-418c-af53-d7d671a1be72', '8e82d033-4b68-4a80-be66-7f6f51251653', 'NO', 226.40979652, 'confirmed', NULL, NULL, NULL, '2026-04-13 16:40:18.688971', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('3bcac68f-4ac0-456d-b74f-7344785e8736', 'cb3ba0c3-0064-418c-af53-d7d671a1be72', '2bb0f08a-1caf-40de-bd29-45897f968ce9', 'YES', 142.94748932, 'confirmed', NULL, NULL, NULL, '2026-04-16 12:02:00.24114', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('ea5f3299-06af-4aae-8f13-c18503d20245', '94e2f1cc-94e9-4e61-9df5-66eca758b177', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', 'YES', 35.34565668, 'confirmed', NULL, NULL, NULL, '2026-04-20 16:08:29.890978', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('ee124d22-9ccd-444d-b01e-f8f9a423f9f2', '94e2f1cc-94e9-4e61-9df5-66eca758b177', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', 'NO', 449.00161847, 'confirmed', NULL, NULL, NULL, '2026-04-16 06:47:07.230687', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('c4e80ed2-59fa-437e-8908-798da40e79e0', '94e2f1cc-94e9-4e61-9df5-66eca758b177', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', 'NO', 131.81853990, 'confirmed', NULL, NULL, NULL, '2026-04-15 02:27:28.991928', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('536b9d8d-79d1-40c4-89d1-ded9dee71083', '94e2f1cc-94e9-4e61-9df5-66eca758b177', '8e82d033-4b68-4a80-be66-7f6f51251653', 'NO', 508.31000424, 'confirmed', NULL, NULL, NULL, '2026-04-15 10:27:06.980783', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('06de613b-aae9-4349-84df-800af22e4f63', '94e2f1cc-94e9-4e61-9df5-66eca758b177', '2bb0f08a-1caf-40de-bd29-45897f968ce9', 'YES', 67.92059508, 'confirmed', NULL, NULL, NULL, '2026-04-20 17:47:02.180367', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('056944b1-2fe8-4606-83d1-079ef1f44488', '459932d6-b975-4c47-9b33-93d9ba6d6aca', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', 'YES', 295.49170051, 'confirmed', NULL, NULL, NULL, '2026-04-18 01:22:51.950057', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('ccb74dee-ed2b-450f-8ecb-5ab408bb3e25', '459932d6-b975-4c47-9b33-93d9ba6d6aca', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', 'YES', 412.24480859, 'confirmed', NULL, NULL, NULL, '2026-04-18 09:56:29.7882', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('1c21704d-2aab-497d-a676-3e2adff631e4', '459932d6-b975-4c47-9b33-93d9ba6d6aca', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', 'NO', 347.88128085, 'confirmed', NULL, NULL, NULL, '2026-04-17 12:29:47.225682', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('6ae867dd-f8c0-4f9a-bcfa-bed6b7861a58', '459932d6-b975-4c47-9b33-93d9ba6d6aca', '8e82d033-4b68-4a80-be66-7f6f51251653', 'YES', 463.01198127, 'confirmed', NULL, NULL, NULL, '2026-04-13 15:54:42.572658', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('ee80715c-a543-4cc9-951c-fbe017345ab6', '459932d6-b975-4c47-9b33-93d9ba6d6aca', '2bb0f08a-1caf-40de-bd29-45897f968ce9', 'YES', 197.06351128, 'confirmed', NULL, NULL, NULL, '2026-04-23 00:03:16.788095', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('1484e466-54b6-4874-ac64-291d9e719991', '2314ff40-dbc3-4c52-b40c-eea6c046fb1f', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', 'YES', 159.45975079, 'confirmed', NULL, NULL, NULL, '2026-04-14 12:06:12.059279', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('543f087c-9e94-4dad-ada7-c3d83a4b06a3', '2314ff40-dbc3-4c52-b40c-eea6c046fb1f', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', 'NO', 259.05445107, 'confirmed', NULL, NULL, NULL, '2026-04-16 07:14:10.475978', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('516430fb-679b-4ae7-9663-409915acbd2a', '2314ff40-dbc3-4c52-b40c-eea6c046fb1f', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', 'NO', 441.12835095, 'confirmed', NULL, NULL, NULL, '2026-04-16 08:41:53.491639', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('69689fe2-fb65-4801-a429-2013beb38188', '2314ff40-dbc3-4c52-b40c-eea6c046fb1f', '8e82d033-4b68-4a80-be66-7f6f51251653', 'YES', 218.73790741, 'confirmed', NULL, NULL, NULL, '2026-04-20 16:46:25.646381', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('b7dc1430-3873-42be-8cf2-dc9f1c2cdede', '2314ff40-dbc3-4c52-b40c-eea6c046fb1f', '2bb0f08a-1caf-40de-bd29-45897f968ce9', 'NO', 274.58894460, 'confirmed', NULL, NULL, NULL, '2026-04-13 17:38:31.852163', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('8489776a-6f5c-4636-afe1-461eab51be5d', '04e39317-9d00-455c-9ab4-ad697dfae2b7', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', 'YES', 259.91353895, 'confirmed', NULL, NULL, NULL, '2026-04-17 07:09:19.889136', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('4dbc8307-0ab5-4f84-9c4a-d73a05f5f778', '04e39317-9d00-455c-9ab4-ad697dfae2b7', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', 'YES', 52.89908281, 'confirmed', NULL, NULL, NULL, '2026-04-15 08:05:39.121981', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('642ec1ad-8302-4e8f-8afe-2e86c49e7d2f', '04e39317-9d00-455c-9ab4-ad697dfae2b7', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', 'NO', 394.74723314, 'confirmed', NULL, NULL, NULL, '2026-04-18 21:56:49.206866', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('0d235b3e-edd4-47ca-9cd8-f88e1dd3a875', '04e39317-9d00-455c-9ab4-ad697dfae2b7', '8e82d033-4b68-4a80-be66-7f6f51251653', 'YES', 430.82370939, 'confirmed', NULL, NULL, NULL, '2026-04-14 16:53:18.547481', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('63c8ee70-ea3a-4ecc-aa61-6ad035536531', '04e39317-9d00-455c-9ab4-ad697dfae2b7', '2bb0f08a-1caf-40de-bd29-45897f968ce9', 'YES', 373.68084026, 'confirmed', NULL, NULL, NULL, '2026-04-17 03:27:53.942426', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('16096f34-3190-4c1e-a5c2-cacfaf22e19a', '4f595728-e40d-4cd3-a113-d1714d40193b', '5dbb9aca-6f13-4d19-b53a-70cb4bf7a14d', 'NO', 302.07888803, 'confirmed', NULL, NULL, NULL, '2026-04-16 08:21:11.623578', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('a69e11fc-6057-4815-a23b-65dd3f0fa08e', '4f595728-e40d-4cd3-a113-d1714d40193b', 'f1d95c7b-c614-4814-a202-f5c7fedf2b2d', 'YES', 492.92949800, 'confirmed', NULL, NULL, NULL, '2026-04-20 04:32:09.103073', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('085ab246-a359-4090-b777-9d8a12788953', '4f595728-e40d-4cd3-a113-d1714d40193b', '2c9a077e-b9eb-46c6-a66f-c6d5694213d7', 'NO', 295.13700900, 'confirmed', NULL, NULL, NULL, '2026-04-23 00:23:36.848366', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('43a574f5-a514-4369-8c68-29ea67d8049e', '4f595728-e40d-4cd3-a113-d1714d40193b', '8e82d033-4b68-4a80-be66-7f6f51251653', 'NO', 251.45983396, 'confirmed', NULL, NULL, NULL, '2026-04-20 16:17:08.715895', '2026-04-23 15:27:03.193696');
INSERT INTO public.user_positions (id, user_id, market_id, outcome, amount_staked, status, tx_hash, resolved_at, payout_amount, created_at, updated_at) VALUES ('1a51333d-1774-42e4-a480-85d474e6b435', '4f595728-e40d-4cd3-a113-d1714d40193b', '2bb0f08a-1caf-40de-bd29-45897f968ce9', 'NO', 58.77565157, 'confirmed', NULL, NULL, NULL, '2026-04-17 02:22:01.272192', '2026-04-23 15:27:03.193696');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users (id, primary_wallet, role, kyc_status, kyc_tier, public_visibility, private_mode, spending_limit_usd, spending_window_days, created_at, updated_at, deleted_at) VALUES ('00000000-0000-0000-0000-000000000001', 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4', 'admin', 'verified', 'individual', true, false, 50000.00, 30, '2026-04-23 15:27:03.164312', '2026-04-23 15:27:03.164312', NULL);
INSERT INTO public.users (id, primary_wallet, role, kyc_status, kyc_tier, public_visibility, private_mode, spending_limit_usd, spending_window_days, created_at, updated_at, deleted_at) VALUES ('00000000-0000-0000-0000-000000000002', 'GMOD1234567890ABCDEFGH1234567890ABCDEFGH1234567890ABCDEF', 'moderator', 'verified', 'individual', true, false, 5000.00, 30, '2026-04-23 15:27:03.167476', '2026-04-23 15:27:03.167476', NULL);
INSERT INTO public.users (id, primary_wallet, role, kyc_status, kyc_tier, public_visibility, private_mode, spending_limit_usd, spending_window_days, created_at, updated_at, deleted_at) VALUES ('00000000-0000-0000-0000-000000000003', 'GMOD0987654321ABCDEFGH0987654321ABCDEFGH0987654321ABCDEF', 'moderator', 'verified', 'individual', true, false, 5000.00, 30, '2026-04-23 15:27:03.167476', '2026-04-23 15:27:03.167476', NULL);
INSERT INTO public.users (id, primary_wallet, role, kyc_status, kyc_tier, public_visibility, private_mode, spending_limit_usd, spending_window_days, created_at, updated_at, deleted_at) VALUES ('2d063cd3-8856-48f3-92aa-f67f2eb45668', 'GUSER000000000000000000000000000000000000000000000000001', 'user', 'pending', 'individual', true, false, 5000.00, 30, '2026-04-22 15:27:03.169444', '2026-04-23 15:27:03.169444', NULL);
INSERT INTO public.users (id, primary_wallet, role, kyc_status, kyc_tier, public_visibility, private_mode, spending_limit_usd, spending_window_days, created_at, updated_at, deleted_at) VALUES ('5e6d3185-560b-43f0-99b7-7e91b76db9da', 'GUSER000000000000000000000000000000000000000000000000002', 'user', 'verified', 'individual', true, false, 5000.00, 30, '2026-04-21 15:27:03.169444', '2026-04-23 15:27:03.169444', NULL);
INSERT INTO public.users (id, primary_wallet, role, kyc_status, kyc_tier, public_visibility, private_mode, spending_limit_usd, spending_window_days, created_at, updated_at, deleted_at) VALUES ('cb3ba0c3-0064-418c-af53-d7d671a1be72', 'GUSER000000000000000000000000000000000000000000000000003', 'user', 'pending', 'individual', true, false, 5000.00, 30, '2026-04-20 15:27:03.169444', '2026-04-23 15:27:03.169444', NULL);
INSERT INTO public.users (id, primary_wallet, role, kyc_status, kyc_tier, public_visibility, private_mode, spending_limit_usd, spending_window_days, created_at, updated_at, deleted_at) VALUES ('94e2f1cc-94e9-4e61-9df5-66eca758b177', 'GUSER000000000000000000000000000000000000000000000000004', 'user', 'verified', 'individual', true, false, 5000.00, 30, '2026-04-19 15:27:03.169444', '2026-04-23 15:27:03.169444', NULL);
INSERT INTO public.users (id, primary_wallet, role, kyc_status, kyc_tier, public_visibility, private_mode, spending_limit_usd, spending_window_days, created_at, updated_at, deleted_at) VALUES ('459932d6-b975-4c47-9b33-93d9ba6d6aca', 'GUSER000000000000000000000000000000000000000000000000005', 'user', 'pending', 'individual', true, false, 5000.00, 30, '2026-04-18 15:27:03.169444', '2026-04-23 15:27:03.169444', NULL);
INSERT INTO public.users (id, primary_wallet, role, kyc_status, kyc_tier, public_visibility, private_mode, spending_limit_usd, spending_window_days, created_at, updated_at, deleted_at) VALUES ('2314ff40-dbc3-4c52-b40c-eea6c046fb1f', 'GUSER000000000000000000000000000000000000000000000000006', 'user', 'verified', 'individual', true, false, 5000.00, 30, '2026-04-17 15:27:03.169444', '2026-04-23 15:27:03.169444', NULL);
INSERT INTO public.users (id, primary_wallet, role, kyc_status, kyc_tier, public_visibility, private_mode, spending_limit_usd, spending_window_days, created_at, updated_at, deleted_at) VALUES ('04e39317-9d00-455c-9ab4-ad697dfae2b7', 'GUSER000000000000000000000000000000000000000000000000007', 'user', 'pending', 'individual', true, false, 5000.00, 30, '2026-04-16 15:27:03.169444', '2026-04-23 15:27:03.169444', NULL);
INSERT INTO public.users (id, primary_wallet, role, kyc_status, kyc_tier, public_visibility, private_mode, spending_limit_usd, spending_window_days, created_at, updated_at, deleted_at) VALUES ('4f595728-e40d-4cd3-a113-d1714d40193b', 'GUSER000000000000000000000000000000000000000000000000008', 'user', 'verified', 'individual', true, false, 5000.00, 30, '2026-04-15 15:27:03.169444', '2026-04-23 15:27:03.169444', NULL);
INSERT INTO public.users (id, primary_wallet, role, kyc_status, kyc_tier, public_visibility, private_mode, spending_limit_usd, spending_window_days, created_at, updated_at, deleted_at) VALUES ('55673fd8-1f62-4b20-8c18-364a2fa0a6bb', 'GUSER000000000000000000000000000000000000000000000000009', 'user', 'pending', 'individual', true, false, 5000.00, 30, '2026-04-14 15:27:03.169444', '2026-04-23 15:27:03.169444', NULL);
INSERT INTO public.users (id, primary_wallet, role, kyc_status, kyc_tier, public_visibility, private_mode, spending_limit_usd, spending_window_days, created_at, updated_at, deleted_at) VALUES ('ef842a60-1912-4df9-992c-598164785a82', 'GUSER000000000000000000000000000000000000000000000000010', 'user', 'verified', 'individual', true, false, 5000.00, 30, '2026-04-13 15:27:03.169444', '2026-04-23 15:27:03.169444', NULL);
INSERT INTO public.users (id, primary_wallet, role, kyc_status, kyc_tier, public_visibility, private_mode, spending_limit_usd, spending_window_days, created_at, updated_at, deleted_at) VALUES ('6ff316f2-6957-435e-88b0-e8199372b8f5', 'GDU62AMRURI55CG5SEXOJJM6X5IYEH4ZNTK22NA2GFBJYV3I5SZ56MAG', 'user', 'verified', 'individual', true, false, 5000.00, 30, '2026-04-23 19:50:09.186222', '2026-04-23 19:50:09.186222', NULL);


--
-- Data for Name: worker_cursors; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Name: audit_logs PK_1bb179d048bbc581caa3b013439; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY (id);


--
-- Name: processed_transactions PK_29527ce826070687efddf719fa3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.processed_transactions
    ADD CONSTRAINT "PK_29527ce826070687efddf719fa3" PRIMARY KEY (id);


--
-- Name: user_positions PK_356d199f37e9af66ec22f3d5de4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_positions
    ADD CONSTRAINT "PK_356d199f37e9af66ec22f3d5de4" PRIMARY KEY (id);


--
-- Name: impact_ledger_entries PK_3a6894c2f3c2e4f9f1dcd041821; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.impact_ledger_entries
    ADD CONSTRAINT "PK_3a6894c2f3c2e4f9f1dcd041821" PRIMARY KEY (id);


--
-- Name: auth_nonces PK_43f4e702fc79d337c03bce1de16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_nonces
    ADD CONSTRAINT "PK_43f4e702fc79d337c03bce1de16" PRIMARY KEY (id);


--
-- Name: worker_cursors PK_69fc2236fecefd1d614eccf6e49; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.worker_cursors
    ADD CONSTRAINT "PK_69fc2236fecefd1d614eccf6e49" PRIMARY KEY (id);


--
-- Name: tx_receipts PK_7395301139388fb4ad0a036f54d; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tx_receipts
    ADD CONSTRAINT "PK_7395301139388fb4ad0a036f54d" PRIMARY KEY (id);


--
-- Name: tx_intents PK_76b36472ba7c918fe930f6889db; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tx_intents
    ADD CONSTRAINT "PK_76b36472ba7c918fe930f6889db" PRIMARY KEY (id);


--
-- Name: refresh_tokens PK_7d8bee0204106019488c4c50ffa; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY (id);


--
-- Name: kyc_profiles PK_94a340b98061b0cd7542d98e4b1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kyc_profiles
    ADD CONSTRAINT "PK_94a340b98061b0cd7542d98e4b1" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: markets PK_dda44129b32f21ae9f1c28dcf99; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.markets
    ADD CONSTRAINT "PK_dda44129b32f21ae9f1c28dcf99" PRIMARY KEY (id);


--
-- Name: deposits PK_f49ba0cd446eaf7abb4953385d9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deposits
    ADD CONSTRAINT "PK_f49ba0cd446eaf7abb4953385d9" PRIMARY KEY (id);


--
-- Name: ngos PK_f64f509c60499b255fd259a4973; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ngos
    ADD CONSTRAINT "PK_f64f509c60499b255fd259a4973" PRIMARY KEY (id);


--
-- Name: market_snapshots PK_fda8554552bb9c9898c5a9bedd4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.market_snapshots
    ADD CONSTRAINT "PK_fda8554552bb9c9898c5a9bedd4" PRIMARY KEY (id);


--
-- Name: refresh_tokens REL_3ddc983c5f7bcf132fd8732c3f; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "REL_3ddc983c5f7bcf132fd8732c3f" UNIQUE (user_id);


--
-- Name: ngos UQ_0cc58d650c7475808e95b7d1c70; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ngos
    ADD CONSTRAINT "UQ_0cc58d650c7475808e95b7d1c70" UNIQUE (name);


--
-- Name: deposits UQ_627343eced83e4924a0673d0238; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deposits
    ADD CONSTRAINT "UQ_627343eced83e4924a0673d0238" UNIQUE (tx_hash);


--
-- Name: ngos UQ_e64c5b66beb3bfbfa01ae0f937e; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ngos
    ADD CONSTRAINT "UQ_e64c5b66beb3bfbfa01ae0f937e" UNIQUE (wallet_address);


--
-- Name: IDX_06b683d646838d69ae3607a7d9; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_06b683d646838d69ae3607a7d9" ON public.markets USING btree (status);


--
-- Name: IDX_0804e08eb2052a654c1dff24b5; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_0804e08eb2052a654c1dff24b5" ON public.market_snapshots USING btree ("timestamp");


--
-- Name: IDX_0eb5751043838bddd5ae7f6722; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_0eb5751043838bddd5ae7f6722" ON public.impact_ledger_entries USING btree (date);


--
-- Name: IDX_109b9d3209e5c344dae2ca8f22; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_109b9d3209e5c344dae2ca8f22" ON public.deposits USING btree (user_id);


--
-- Name: IDX_1360099bd018167c768e9cb441; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_1360099bd018167c768e9cb441" ON public.deposits USING btree (status);


--
-- Name: IDX_22066f85fa761e7d4276980482; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_22066f85fa761e7d4276980482" ON public.ngos USING btree (category);


--
-- Name: IDX_4483927f0ad2b87535a7b4926b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_4483927f0ad2b87535a7b4926b" ON public.tx_intents USING btree (tx_hash);


--
-- Name: IDX_4542dd2f38a61354a040ba9fd5; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_4542dd2f38a61354a040ba9fd5" ON public.refresh_tokens USING btree (token);


--
-- Name: IDX_5952a337387d7d6d4e04aa334e; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_5952a337387d7d6d4e04aa334e" ON public.tx_receipts USING btree (tx_hash);


--
-- Name: IDX_63ce5ed9284d498767d5727020; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_63ce5ed9284d498767d5727020" ON public.processed_transactions USING btree (tx_hash, op_index);


--
-- Name: IDX_7e386a6324a0e96ca89a27afec; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_7e386a6324a0e96ca89a27afec" ON public.kyc_profiles USING btree (user_id);


--
-- Name: IDX_86e53cf7e6fa2bf8caaf90db4e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_86e53cf7e6fa2bf8caaf90db4e" ON public.impact_ledger_entries USING btree (source);


--
-- Name: IDX_88643a0464cca68533c82147d4; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_88643a0464cca68533c82147d4" ON public.kyc_profiles USING btree (status);


--
-- Name: IDX_89d21309283e511f013db44c04; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_89d21309283e511f013db44c04" ON public.markets USING btree (lock_at);


--
-- Name: IDX_8d69ee9259d1357a89424ecce6; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_8d69ee9259d1357a89424ecce6" ON public.user_positions USING btree (status);


--
-- Name: IDX_8e8a63153fa614a6a85fcf1436; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_8e8a63153fa614a6a85fcf1436" ON public.ngos USING btree (slug);


--
-- Name: IDX_9efdf3ceb5219ac7f814fcb33c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_9efdf3ceb5219ac7f814fcb33c" ON public.auth_nonces USING btree (expires_at);


--
-- Name: IDX_a38154827eec1880ee75fac616; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_a38154827eec1880ee75fac616" ON public.market_snapshots USING btree (market_id, "timestamp");


--
-- Name: IDX_a7080c443def2e46ba5c4b87f3; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_a7080c443def2e46ba5c4b87f3" ON public.auth_nonces USING btree (nonce);


--
-- Name: IDX_aeee7d2f4d2407baccc8b13039; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_aeee7d2f4d2407baccc8b13039" ON public.users USING btree (primary_wallet);


--
-- Name: IDX_b7e733a597a61dfff0e1d45790; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_b7e733a597a61dfff0e1d45790" ON public.auth_nonces USING btree (wallet_address);


--
-- Name: IDX_ccfa5950c193dd0f2721d57651; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_ccfa5950c193dd0f2721d57651" ON public.user_positions USING btree (tx_hash);


--
-- Name: IDX_d12a8d0944b6bc37fad84f31c3; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_d12a8d0944b6bc37fad84f31c3" ON public.user_positions USING btree (user_id);


--
-- Name: IDX_d9108a4cb925f2ace0ad4a5b9e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_d9108a4cb925f2ace0ad4a5b9e" ON public.impact_ledger_entries USING btree (ngo_id);


--
-- Name: IDX_de0d6d20268c140c8a07c2d2de; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_de0d6d20268c140c8a07c2d2de" ON public.users USING btree (kyc_status);


--
-- Name: IDX_f0f6826c8dba3b64d34e0a0916; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_f0f6826c8dba3b64d34e0a0916" ON public.ngos USING btree (verified);


--
-- Name: IDX_f312350d6e62cc003531b7ec70; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_f312350d6e62cc003531b7ec70" ON public.processed_transactions USING btree (tx_hash);


--
-- Name: IDX_ff4d04ff0e6e63cab62ce7dd70; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_ff4d04ff0e6e63cab62ce7dd70" ON public.markets USING btree (category);


--
-- Name: refresh_tokens FK_3ddc983c5f7bcf132fd8732c3f4; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 4TQamXrmdq2SaqeplyVd7gsHwp79eFed3yLb3MptpD2js2kcxRRDq4W37adAN89

