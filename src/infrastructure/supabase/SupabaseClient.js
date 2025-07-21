import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'dummy-key';
const supabaseServiceKey = process.env.REACT_APP_SUPABASE_API_KEY || 'dummy-service-key';

console.log('Supabase Client Config:', {
  url: supabaseUrl ? 'Set' : 'Not set',
  anonKey: supabaseAnonKey ? 'Set' : 'Not set',
  serviceKey: supabaseServiceKey ? 'Set' : 'Not set'
});

// 일반 클라이언트 (사용자 인증용)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 관리자 클라이언트 (관리자 기능용)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey); 