create extension if not exists pgcrypto;

create table if not exists clusters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  embedding_centroid double precision[] default '{}',
  total_signals integer not null default 0,
  total_startups integer not null default 0,
  total_discussions integer not null default 0,
  avg_sentiment double precision not null default 0,
  momentum_score double precision not null default 0,
  pain_score double precision not null default 0,
  opportunity_score double precision not null default 0,
  primary_tags text[] default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists signals (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  external_id text not null unique,
  type text not null default 'discussion' check (type in ('startup', 'discussion', 'prediction')),
  title text,
  content text not null,
  score integer,
  time timestamptz not null,
  url text,
  sentiment_score double precision,
  ai_summary text,
  ai_sentiment text,
  ai_topics text[] default '{}',
  metadata jsonb default '{}'::jsonb,
  total_score double precision not null default 0,
  trend_score double precision not null default 0,
  embedding_vector double precision[] default '{}',
  cluster_id uuid references clusters(id) on delete set null,
  tags text[] default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_signals_cluster_id on signals(cluster_id);
create index if not exists idx_signals_time on signals(time desc);
create index if not exists idx_signals_total_score on signals(total_score desc);
create index if not exists idx_clusters_momentum_score on clusters(momentum_score desc);
