import { supabase } from '../lib/supabaseClient';

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  gender: string | null;
  major: string | null;
  grade: string | null;
  school: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdateInput {
  displayName: string;
  gender: string;
  major: string;
  grade: string;
  school: string;
}

async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error('请先登录，再查看个人资料。');
  }

  return data.user;
}

export async function getMyProfile() {
  const user = await getCurrentUser();
  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();

  if (error) {
    throw error;
  }

  if (data) {
    return data as Profile;
  }

  const { data: inserted, error: insertError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        email: user.email ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    )
    .select()
    .single();

  if (insertError) {
    throw insertError;
  }

  return inserted as Profile;
}

export async function updateMyProfile(input: ProfileUpdateInput) {
  const user = await getCurrentUser();
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        email: user.email ?? null,
        display_name: input.displayName.trim() || null,
        gender: input.gender.trim() || null,
        major: input.major.trim() || null,
        grade: input.grade.trim() || null,
        school: input.school.trim() || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Profile;
}
