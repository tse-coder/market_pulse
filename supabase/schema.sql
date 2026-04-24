create extension if not exists pgcrypto;
create extension if not exists vector;

create table if not exists clusters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  embedding_centroid vector(768),
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
  embedding_vector vector(768),
  cluster_id uuid references clusters(id) on delete set null,
  tags text[] default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_signals_cluster_id on signals(cluster_id);
create index if not exists idx_signals_time on signals(time desc);
create index if not exists idx_signals_total_score on signals(total_score desc);
create index if not exists idx_clusters_momentum_score on clusters(momentum_score desc);

-- Vector indexes for fast similarity search
create index if not exists idx_clusters_centroid on clusters using hnsw (embedding_centroid vector_cosine_ops);
create index if not exists idx_signals_vector on signals using hnsw (embedding_vector vector_cosine_ops);

create or replace function match_cluster(query_embedding vector(768), match_threshold float)
returns table (
  id uuid,
  similarity float
)
language sql
stable
as $$
  select
    id,
    1 - (embedding_centroid <=> query_embedding) as similarity
  from clusters
  where 1 - (embedding_centroid <=> query_embedding) > match_threshold
  order by embedding_centroid <=> query_embedding
  limit 1;
create or replace function refresh_all_cluster_metrics()
returns void
language sql
as $$
  with cluster_stats as (
    select
      cluster_id,
      avg(sentiment_score) as avg_sentiment,
      avg(case when total_score > 0 then total_score else null end) as momentum_score,
      (count(case when sentiment_score < -0.1 then 1 end)::float / nullif(count(*), 0)) * 100 as pain_score
    from signals
    where cluster_id is not null
    group by cluster_id
  )
  update clusters c
  set
    avg_sentiment = coalesce(s.avg_sentiment, 0),
    momentum_score = coalesce(s.momentum_score, 0),
    pain_score = coalesce(s.pain_score, 0),
    opportunity_score = (coalesce(s.momentum_score, 0) * (1 + coalesce(s.avg_sentiment, 0))) / 2,
    updated_at = timezone('utc', now())
  from cluster_stats s
  where c.id = s.cluster_id;
$$;

