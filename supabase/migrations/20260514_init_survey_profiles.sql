create table if not exists public.survey_profiles (
  user_id text primary key,
  user_name text,
  user_role text,
  blend_summary text,
  analysis_text text,
  analysis_preview text,
  analysis_source text,
  dominant_style_key text,
  dominant_style_label text,
  dominant_style_score integer,
  dominant_style_percentage integer,
  secondary_style_key text,
  secondary_style_label text,
  secondary_style_score integer,
  secondary_style_percentage integer,
  ml_predicted_style_label text,
  ml_confidence_percent integer,
  ml_ambiguity_level text,
  ml_valid_accuracy double precision,
  completed_at timestamptz,
  profile_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.survey_profiles add column if not exists user_name text;
alter table public.survey_profiles add column if not exists user_role text;
alter table public.survey_profiles add column if not exists blend_summary text;
alter table public.survey_profiles add column if not exists analysis_text text;
alter table public.survey_profiles add column if not exists analysis_preview text;
alter table public.survey_profiles add column if not exists analysis_source text;
alter table public.survey_profiles add column if not exists dominant_style_key text;
alter table public.survey_profiles add column if not exists dominant_style_label text;
alter table public.survey_profiles add column if not exists dominant_style_score integer;
alter table public.survey_profiles add column if not exists dominant_style_percentage integer;
alter table public.survey_profiles add column if not exists secondary_style_key text;
alter table public.survey_profiles add column if not exists secondary_style_label text;
alter table public.survey_profiles add column if not exists secondary_style_score integer;
alter table public.survey_profiles add column if not exists secondary_style_percentage integer;
alter table public.survey_profiles add column if not exists ml_predicted_style_label text;
alter table public.survey_profiles add column if not exists ml_confidence_percent integer;
alter table public.survey_profiles add column if not exists ml_ambiguity_level text;
alter table public.survey_profiles add column if not exists ml_valid_accuracy double precision;
alter table public.survey_profiles add column if not exists completed_at timestamptz;
alter table public.survey_profiles add column if not exists profile_json jsonb not null default '{}'::jsonb;
alter table public.survey_profiles add column if not exists created_at timestamptz not null default now();
alter table public.survey_profiles add column if not exists updated_at timestamptz not null default now();

create index if not exists survey_profiles_updated_at_idx
  on public.survey_profiles (updated_at desc);

create index if not exists survey_profiles_completed_at_idx
  on public.survey_profiles (completed_at desc);
