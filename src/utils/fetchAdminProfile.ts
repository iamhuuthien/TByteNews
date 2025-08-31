import supabase from './supabaseClient';

const CACHE_KEY = 'admin_profile_cache';
const CACHE_EXPIRE = 60000; // 60 giây

export async function getAdminProfile(): Promise<any> {
  // Kiểm tra cache
  const cache = localStorage.getItem(CACHE_KEY);
  if (cache) {
    const { data, timestamp } = JSON.parse(cache);
    if (Date.now() - timestamp < CACHE_EXPIRE) {
      return data;
    }
  }
  // Fetch từ Supabase
  const { data, error } = await supabase
    .from('admin_profile')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();
  if (error) throw error;
  localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  return data;
}

export async function updateAdminProfile(profile: any): Promise<any> {
  const { id, ...rest } = profile;
  const { data, error } = await supabase
    .from('admin_profile')
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  // Cập nhật cache
  localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  return data;
}