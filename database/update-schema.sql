-- 小熊猫恋爱日记 - 数据库更新脚本
-- 新增功能：留言板、位置共享、相册评论和点赞

-- 12. 留言板表 (新增)
CREATE TABLE IF NOT EXISTS message_board (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'reminder', -- reminder, love_note, question, announcement
  is_urgent BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  dislikes_count INTEGER DEFAULT 0,
  is_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. 留言板互动表 (新增)
CREATE TABLE IF NOT EXISTS message_board_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES message_board(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL, -- like, dislike
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id, reaction_type)
);

-- 14. 位置共享表 (新增)
CREATE TABLE IF NOT EXISTS location_sharing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  location_name TEXT,
  is_sharing BOOLEAN DEFAULT true,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. 相册评论表 (新增)
CREATE TABLE IF NOT EXISTS photo_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_id UUID REFERENCES gallery_photos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. 相册点赞表 (新增)
CREATE TABLE IF NOT EXISTS photo_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_id UUID REFERENCES gallery_photos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(photo_id, user_id)
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_message_board_user_id ON message_board(user_id);
CREATE INDEX IF NOT EXISTS idx_message_board_reactions_message_id ON message_board_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_location_sharing_user_id ON location_sharing(user_id);
CREATE INDEX IF NOT EXISTS idx_photo_comments_photo_id ON photo_comments(photo_id);
CREATE INDEX IF NOT EXISTS idx_photo_likes_photo_id ON photo_likes(photo_id);

-- 启用行级安全策略
ALTER TABLE message_board ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_board_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_sharing ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_likes ENABLE ROW LEVEL SECURITY;

-- 留言板策略 (新增)
CREATE POLICY "Users can view all messages" ON message_board FOR SELECT USING (true);
CREATE POLICY "Users can insert own messages" ON message_board FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own messages" ON message_board FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own messages" ON message_board FOR DELETE USING (auth.uid() = user_id);

-- 留言板互动策略 (新增)
CREATE POLICY "Users can view all reactions" ON message_board_reactions FOR SELECT USING (true);
CREATE POLICY "Users can insert own reactions" ON message_board_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reactions" ON message_board_reactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reactions" ON message_board_reactions FOR DELETE USING (auth.uid() = user_id);

-- 位置共享策略 (新增)
CREATE POLICY "Users can view partner location" ON location_sharing FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE (id = auth.uid() AND partner_id = user_id) OR 
          (partner_id = auth.uid() AND id = user_id)
  )
);
CREATE POLICY "Users can insert own location" ON location_sharing FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own location" ON location_sharing FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own location" ON location_sharing FOR DELETE USING (auth.uid() = user_id);

-- 相册评论策略 (新增)
CREATE POLICY "Users can view all comments" ON photo_comments FOR SELECT USING (true);
CREATE POLICY "Users can insert own comments" ON photo_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON photo_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON photo_comments FOR DELETE USING (auth.uid() = user_id);

-- 相册点赞策略 (新增)
CREATE POLICY "Users can view all likes" ON photo_likes FOR SELECT USING (true);
CREATE POLICY "Users can insert own likes" ON photo_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON photo_likes FOR DELETE USING (auth.uid() = user_id);

-- 更新现有相册表，添加评论和点赞关联
-- 注意：如果相册表已经存在，这些索引可能已经存在，会显示警告但不会影响功能
