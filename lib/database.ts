import { supabase } from './supabase';

// 数据库服务层 - 提供数据操作接口

// 用户档案相关
export const userService = {
  async createProfile(userId: string, username: string, isPartner: boolean = false) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        username,
        is_partner: isPartner,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },
};

// 笑话相关
export const jokeService = {
  async getJokes(userId: string) {
    const { data, error } = await supabase
      .from('jokes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async addJoke(userId: string, content: string, category: string = 'general') {
    const { data, error } = await supabase
      .from('jokes')
      .insert({
        user_id: userId,
        content,
        category,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};

// Pin消息相关
export const pinService = {
  async sendPin(senderId: string, receiverId: string, message: string) {
    const { data, error } = await supabase
      .from('pin_messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        message,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getReceivedPins(userId: string) {
    const { data, error } = await supabase
      .from('pin_messages')
      .select('*')
      .eq('receiver_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
};
