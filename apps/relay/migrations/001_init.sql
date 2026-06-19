create table if not exists identities (
  did text primary key,
  identity jsonb not null,
  signed_pre_key jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists one_time_pre_keys (
  did text not null references identities(did) on delete cascade,
  key_id text not null,
  public_key jsonb not null,
  created_at timestamptz not null default now(),
  claimed_at timestamptz,
  primary key (did, key_id)
);

create index if not exists one_time_pre_keys_claim_idx
  on one_time_pre_keys (did, claimed_at, created_at);

create table if not exists envelopes (
  id text primary key,
  sender_did text not null,
  recipient_did text not null,
  created_at timestamptz not null,
  envelope jsonb not null,
  acked_at timestamptz
);

create index if not exists envelopes_recipient_idx
  on envelopes (recipient_did, created_at);

