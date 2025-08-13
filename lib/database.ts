import { supabase } from './supabase';

// 数据库服务类
export class DatabaseService {
  // 用户档案相关
  static async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateUserProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // 笑话相关
  static async getJokes(userId: string) {
    const { data, error } = await supabase
      .from('jokes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async addJoke(userId: string, content: string, category: string = 'general') {
    const { data, error } = await supabase
      .from('jokes')
      .insert({
        user_id: userId,
        content,
        category
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async toggleJokeFavorite(jokeId: string, isFavorite: boolean) {
    const { data, error } = await supabase
      .from('jokes')
      .update({ is_favorite: isFavorite })
      .eq('id', jokeId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // 月经周期相关
  static async getCycleRecords(userId: string) {
    const { data, error } = await supabase
      .from('cycle_records')
      .select('*')
      .eq('user_id', userId)
      .order('cycle_start_date', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async addCycleRecord(userId: string, cycleData: any) {
    const { data, error } = await supabase
      .from('cycle_records')
      .insert({
        user_id: userId,
        ...cycleData
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Pin消息相关
  static async getPinMessages(userId: string) {
    const { data, error } = await supabase
      .from('pin_messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async sendPinMessage(senderId: string, receiverId: string, message: string) {
    const { data, error } = await supabase
      .from('pin_messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        message
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async markPinAsRead(messageId: string) {
    const { data, error } = await supabase
      .from('pin_messages')
      .update({ is_read: true })
      .eq('id', messageId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // 纪念日相关
  static async getAnniversaries(userId: string) {
    const { data, error } = await supabase
      .from('anniversaries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  static async addAnniversary(userId: string, anniversaryData: any) {
    const { data, error } = await supabase
      .from('anniversaries')
      .insert({
        user_id: userId,
        ...anniversaryData
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // 心情日记相关
  static async getMoodDiaries(userId: string) {
    const { data, error } = await supabase
      .from('mood_diaries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async addMoodDiary(userId: string, moodData: any) {
    const { data, error } = await supabase
      .from('mood_diaries')
      .insert({
        user_id: userId,
        ...moodData
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // 愿望清单相关
  static async getWishlistItems(userId: string) {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('user_id', userId)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async addWishlistItem(userId: string, itemData: any) {
    const { data, error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: userId,
        ...itemData
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async toggleWishlistFulfilled(itemId: string, isFulfilled: boolean) {
    const { data, error } = await supabase
      .from('wishlist_items')
      .update({ is_fulfilled: isFulfilled })
      .eq('id', itemId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // 闹钟相关
  static async getAlarms(userId: string) {
    const { data, error } = await supabase
      .from('alarms')
      .select('*')
      .eq('user_id', userId)
      .order('time', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  static async addAlarm(userId: string, alarmData: any) {
    const { data, error } = await supabase
      .from('alarms')
      .insert({
        user_id: userId,
        ...alarmData
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async toggleAlarmActive(alarmId: string, isActive: boolean) {
    const { data, error } = await supabase
      .from('alarms')
      .update({ is_active: isActive })
      .eq('id', alarmId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // 记账相关
  static async getBudgetTransactions(userId: string) {
    const { data, error } = await supabase
      .from('budget_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async addBudgetTransaction(userId: string, transactionData: any) {
    const { data, error } = await supabase
      .from('budget_transactions')
      .insert({
        user_id: userId,
        ...transactionData
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // 约会建议相关
  static async getDateIdeas(userId: string) {
    const { data, error } = await supabase
      .from('date_ideas')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async addDateIdea(userId: string, ideaData: any) {
    const { data, error } = await supabase
      .from('date_ideas')
      .insert({
        user_id: userId,
        ...ideaData
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async toggleDateIdeaFavorite(ideaId: string, isFavorite: boolean) {
    const { data, error } = await supabase
      .from('date_ideas')
      .update({ is_favorite: isFavorite })
      .eq('id', ideaId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // 相册相关
  static async getGalleryPhotos(userId: string) {
    const { data, error } = await supabase
      .from('gallery_photos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async addGalleryPhoto(userId: string, photoData: any) {
    const { data, error } = await supabase
      .from('gallery_photos')
      .insert({
        user_id: userId,
        ...photoData
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async togglePhotoFavorite(photoId: string, isFavorite: boolean) {
    const { data, error } = await supabase
      .from('gallery_photos')
      .update({ is_favorite: isFavorite })
      .eq('id', photoId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // 留言板相关 (新增)
  static async getMessageBoard() {
    const { data, error } = await supabase
      .from('message_board')
      .select(`
        *,
        user_profiles!inner(username, avatar_url)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async addMessageBoardPost(userId: string, messageData: any) {
    const { data, error } = await supabase
      .from('message_board')
      .insert({
        user_id: userId,
        ...messageData
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateMessageBoardPost(messageId: string, updates: any) {
    const { data, error } = await supabase
      .from('message_board')
      .update(updates)
      .eq('id', messageId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteMessageBoardPost(messageId: string) {
    const { error } = await supabase
      .from('message_board')
      .delete()
      .eq('id', messageId);
    
    if (error) throw error;
  }

  // 留言板互动相关 (新增)
  static async addMessageReaction(messageId: string, userId: string, reactionType: 'like' | 'dislike') {
    // 先删除之前的反应（如果存在）
    await supabase
      .from('message_board_reactions')
      .delete()
      .eq('message_id', messageId)
      .eq('user_id', userId);

    // 添加新反应
    const { data, error } = await supabase
      .from('message_board_reactions')
      .insert({
        message_id: messageId,
        user_id: userId,
        reaction_type: reactionType
      })
      .select()
      .single();
    
    if (error) throw error;

    // 更新消息的点赞/反对计数
    const { data: reactions } = await supabase
      .from('message_board_reactions')
      .select('reaction_type')
      .eq('message_id', messageId);

    const likesCount = reactions?.filter(r => r.reaction_type === 'like').length || 0;
    const dislikesCount = reactions?.filter(r => r.reaction_type === 'dislike').length || 0;

    await this.updateMessageBoardPost(messageId, {
      likes_count: likesCount,
      dislikes_count: dislikesCount
    });

    return data;
  }

  static async removeMessageReaction(messageId: string, userId: string) {
    const { error } = await supabase
      .from('message_board_reactions')
      .delete()
      .eq('message_id', messageId)
      .eq('user_id', userId);
    
    if (error) throw error;

    // 更新消息的点赞/反对计数
    const { data: reactions } = await supabase
      .from('message_board_reactions')
      .select('reaction_type')
      .eq('message_id', messageId);

    const likesCount = reactions?.filter(r => r.reaction_type === 'like').length || 0;
    const dislikesCount = reactions?.filter(r => r.reaction_type === 'dislike').length || 0;

    await this.updateMessageBoardPost(messageId, {
      likes_count: likesCount,
      dislikes_count: dislikesCount
    });
  }

  // 位置共享相关 (新增)
  static async updateLocation(userId: string, locationData: any) {
    // 先检查是否已有位置记录
    const { data: existingLocation } = await supabase
      .from('location_sharing')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingLocation) {
      // 更新现有位置
      const { data, error } = await supabase
        .from('location_sharing')
        .update({
          ...locationData,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // 创建新位置记录
      const { data, error } = await supabase
        .from('location_sharing')
        .insert({
          user_id: userId,
          ...locationData
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  }

  static async getPartnerLocation(userId: string) {
    // 获取伴侣的位置信息
    const { data, error } = await supabase
      .from('location_sharing')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async toggleLocationSharing(userId: string, isSharing: boolean) {
    const { data, error } = await supabase
      .from('location_sharing')
      .update({ is_sharing: isSharing })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // 相册评论相关 (新增)
  static async getPhotoComments(photoId: string) {
    const { data, error } = await supabase
      .from('photo_comments')
      .select(`
        *,
        user_profiles!inner(username, avatar_url)
      `)
      .eq('photo_id', photoId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  static async addPhotoComment(photoId: string, userId: string, comment: string) {
    const { data, error } = await supabase
      .from('photo_comments')
      .insert({
        photo_id: photoId,
        user_id: userId,
        comment
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deletePhotoComment(commentId: string) {
    const { error } = await supabase
      .from('photo_comments')
      .delete()
      .eq('id', commentId);
    
    if (error) throw error;
  }

  // 相册点赞相关 (新增)
  static async togglePhotoLike(photoId: string, userId: string) {
    // 检查是否已点赞
    const { data: existingLike } = await supabase
      .from('photo_likes')
      .select('id')
      .eq('photo_id', photoId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // 取消点赞
      const { error } = await supabase
        .from('photo_likes')
        .delete()
        .eq('photo_id', photoId)
        .eq('user_id', userId);
      
      if (error) throw error;
      return false; // 已取消点赞
    } else {
      // 添加点赞
      const { error } = await supabase
        .from('photo_likes')
        .insert({
          photo_id: photoId,
          user_id: userId
        });
      
      if (error) throw error;
      return true; // 已点赞
    }
  }

  static async getPhotoLikes(photoId: string) {
    const { data, error } = await supabase
      .from('photo_likes')
      .select('*')
      .eq('photo_id', photoId);
    
    if (error) throw error;
    return data;
  }

  static async isPhotoLikedByUser(photoId: string, userId: string) {
    const { data, error } = await supabase
      .from('photo_likes')
      .select('id')
      .eq('photo_id', photoId)
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 表示没有找到记录
    return !!data;
  }
}
