-- Founder Dashboard initial schema

CREATE TYPE email_category AS ENUM ('revenue', 'urgent', 'waiting', 'other');
CREATE TYPE revenue_event_type AS ENUM ('payment', 'refund', 'failed_charge');
CREATE TYPE payment_provider AS ENUM ('stripe', 'paddle');
CREATE TYPE plan_status AS ENUM ('trialing', 'active', 'past_due', 'canceled', 'inactive');

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  google_refresh_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  plan_status plan_status NOT NULL DEFAULT 'trialing',
  dodo_customer_id TEXT
);

CREATE TABLE sync_state (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  last_synced_at TIMESTAMPTZ,
  last_history_id TEXT,
  sync_in_progress BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gmail_message_id TEXT NOT NULL,
  thread_id TEXT NOT NULL,
  sender TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT '',
  received_at TIMESTAMPTZ NOT NULL,
  category email_category NOT NULL DEFAULT 'other',
  urgent_subcategory TEXT CHECK (urgent_subcategory IN ('bug', 'churn', 'other')),
  classification_confidence NUMERIC(4, 3),
  raw_snippet TEXT,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  UNIQUE (user_id, gmail_message_id)
);

CREATE TABLE revenue_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email_id UUID NOT NULL REFERENCES emails(id) ON DELETE CASCADE,
  type revenue_event_type NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  provider payment_provider NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE waiting_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  thread_id TEXT NOT NULL,
  last_sender TEXT NOT NULL,
  last_message_at TIMESTAMPTZ NOT NULL,
  subject TEXT NOT NULL DEFAULT '',
  UNIQUE (user_id, thread_id)
);

CREATE INDEX emails_user_received_at_idx ON emails (user_id, received_at DESC);
CREATE INDEX emails_user_category_idx ON emails (user_id, category);
CREATE INDEX revenue_events_user_occurred_at_idx ON revenue_events (user_id, occurred_at DESC);
CREATE INDEX waiting_threads_user_last_message_at_idx ON waiting_threads (user_id, last_message_at DESC);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE waiting_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_select_own ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY users_update_own ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY sync_state_select_own ON sync_state
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY sync_state_update_own ON sync_state
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY emails_select_own ON emails
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY revenue_events_select_own ON revenue_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY waiting_threads_select_own ON waiting_threads
  FOR SELECT USING (auth.uid() = user_id);
