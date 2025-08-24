import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL hoặc Anon Key không được thiết lập trong file .env');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;