-- Transformer 学习游戏 Supabase 初始化脚本
-- 执行位置：Supabase Dashboard -> SQL Editor
-- 注意：前端只使用 publishable/anon key，绝不要把 service_role key 放进 Vite 环境变量。

-- 让 gen_random_uuid() 可用。Supabase 通常已启用，这里写上方便新项目执行。
create extension if not exists pgcrypto;

-- 自动维护 updated_at：每次更新资料或进度时刷新时间。
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 用户资料表：id 与 auth.users.id 一一对应。
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  gender text,
  major text,
  grade text,
  school text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 如果你之前已经执行过旧版 SQL，下面这些 alter 会把新增字段补上。
alter table public.profiles add column if not exists gender text;
alter table public.profiles add column if not exists major text;
alter table public.profiles add column if not exists grade text;
alter table public.profiles add column if not exists school text;

comment on table public.profiles is '每个登录用户自己的公开学习档案。';
comment on column public.profiles.id is '关联 Supabase Auth 的 auth.users.id。';
comment on column public.profiles.display_name is '用户可编辑的昵称。';

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- 新用户注册后自动创建 profile。
-- 选择数据库触发器的理由：即使用户不是从当前前端注册，资料行也会自动创建。
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'display_name',
      nullif(split_part(coalesce(new.email, ''), '@', 1), '')
    )
  )
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- 游戏学习进度表：一名用户的一个 level_id 只保留一条最新记录。
create table if not exists public.game_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  level_id text not null,
  level_title text,
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'completed')),
  score integer check (score is null or (score >= 0 and score <= 100)),
  attempts integer not null default 1 check (attempts >= 0),
  mistakes jsonb not null default '[]'::jsonb,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, level_id)
);

comment on table public.game_progress is 'Transformer 游戏关卡、练习、测验和最终挑战的用户进度。';
comment on column public.game_progress.level_id is '前端传入的关卡标识，例如 campaign:text-enters-model。';
comment on column public.game_progress.mistakes is '错题、误区或错误次数等 JSON 数据。';

drop trigger if exists set_game_progress_updated_at on public.game_progress;
create trigger set_game_progress_updated_at
before update on public.game_progress
for each row
execute function public.set_updated_at();

create index if not exists game_progress_user_id_idx
on public.game_progress (user_id);

create index if not exists game_progress_user_status_idx
on public.game_progress (user_id, status);

create index if not exists game_progress_user_updated_at_idx
on public.game_progress (user_id, updated_at desc);

alter table public.game_progress enable row level security;

drop policy if exists "Users can read own game progress" on public.game_progress;
create policy "Users can read own game progress"
on public.game_progress
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own game progress" on public.game_progress;
create policy "Users can insert own game progress"
on public.game_progress
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own game progress" on public.game_progress;
create policy "Users can update own game progress"
on public.game_progress
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own game progress" on public.game_progress;
create policy "Users can delete own game progress"
on public.game_progress
for delete
to authenticated
using ((select auth.uid()) = user_id);

-- upsert 示例：在前端使用当前登录用户的 user_id，RLS 会检查只能写自己的记录。
-- insert into public.game_progress (
--   user_id, level_id, level_title, status, score, attempts, mistakes, completed_at
-- )
-- values (
--   auth.uid(),
--   'campaign:text-enters-model',
--   '文本进入模型',
--   'completed',
--   90,
--   1,
--   '{"mistakeCount": 1}'::jsonb,
--   now()
-- )
-- on conflict (user_id, level_id)
-- do update set
--   level_title = excluded.level_title,
--   status = excluded.status,
--   score = excluded.score,
--   attempts = public.game_progress.attempts + 1,
--   mistakes = excluded.mistakes,
--   completed_at = excluded.completed_at,
--   updated_at = now();
