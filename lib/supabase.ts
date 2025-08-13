import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SUPABASE_CONFIG } from '../config/supabase';

// 请替换为你的Supabase项目URL和匿名密钥
const SUPABASE_URL = SUPABASE_CONFIG.url;
const SUPABASE_ANON_KEY = SUPABASE_CONFIG.anonKey;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { 
    persistSession: true, 
    autoRefreshToken: true, 
    detectSessionInUrl: false,
    storage: AsyncStorage
  },
});

// 用户类型定义
export interface User {
  id: string;
  username: string;
  avatar?: string;
  created_at: string;
  is_partner?: boolean; // 是否是伴侣
}

// 认证状态类型
export interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
}