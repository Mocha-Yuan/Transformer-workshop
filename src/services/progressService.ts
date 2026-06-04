import { supabase } from '../lib/supabaseClient';

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface GameProgressRow {
  id: string;
  user_id: string;
  level_id: string;
  level_title: string | null;
  status: ProgressStatus;
  score: number | null;
  attempts: number;
  mistakes: unknown;
  completed_at: string | null;
  updated_at: string;
}

export interface SaveLevelProgressPayload {
  levelTitle?: string;
  status?: ProgressStatus;
  score?: number | null;
  attempts?: number;
  mistakes?: unknown;
  completedAt?: string | null;
}

async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error('请先登录，再保存学习进度。');
  }

  return data.user.id;
}

export async function getMyProgress() {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('game_progress')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as GameProgressRow[];
}

export async function getLevelProgress(levelId: string) {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('game_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('level_id', levelId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as GameProgressRow | null;
}

export async function saveLevelProgress(levelId: string, payload: SaveLevelProgressPayload = {}) {
  const userId = await getCurrentUserId();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('game_progress')
    .upsert(
      {
        user_id: userId,
        level_id: levelId,
        level_title: payload.levelTitle,
        status: payload.status ?? 'in_progress',
        score: payload.score ?? null,
        attempts: payload.attempts ?? 1,
        mistakes: payload.mistakes ?? [],
        completed_at: payload.completedAt ?? null,
        updated_at: now,
      },
      { onConflict: 'user_id,level_id' },
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as GameProgressRow;
}

export async function markLevelCompleted(levelId: string, score: number, mistakes: unknown, levelTitle?: string) {
  return saveLevelProgress(levelId, {
    levelTitle,
    status: 'completed',
    score,
    attempts: 1,
    mistakes,
    completedAt: new Date().toISOString(),
  });
}

export async function resetMyProgress() {
  const userId = await getCurrentUserId();
  const { error } = await supabase.from('game_progress').delete().eq('user_id', userId);

  if (error) {
    throw error;
  }
}
