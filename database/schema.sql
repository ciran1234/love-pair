-- 小熊猫恋爱日记数据库表结构

-- 1. 用户档案表
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  is_partner BOOLEAN DEFAULT false,
  partner_id UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 笑话表
CREATE TABLE IF NOT EXISTS jokes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 月经周期记录表
CREATE TABLE IF NOT EXISTS cycle_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  cycle_start_date DATE NOT NULL,
  cycle_length INTEGER DEFAULT 28,
  symptoms TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Pin消息表
CREATE TABLE IF NOT EXISTS pin_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 纪念日表
CREATE TABLE IF NOT EXISTS anniversaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  is_recurring BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 心情日记表
CREATE TABLE IF NOT EXISTS mood_diaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
  mood_description TEXT,
  activities TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 愿望清单表
CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  priority INTEGER DEFAULT 1,
  is_fulfilled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. 闹钟提醒表
CREATE TABLE IF NOT EXISTS alarms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  time TIME NOT NULL,
  days_of_week INTEGER[] DEFAULT '{1,2,3,4,5,6,7}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. 记账表
CREATE TABLE IF NOT EXISTS budget_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  transaction_date DATE DEFAULT CURRENT_DATE,
  is_shared BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. 约会建议表
CREATE TABLE IF NOT EXISTS date_ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  cost_level INTEGER DEFAULT 2,
  duration_minutes INTEGER,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. 相册表
CREATE TABLE IF NOT EXISTS gallery_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  photo_url TEXT NOT NULL,
  album_category TEXT DEFAULT 'general',
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_jokes_user_id ON jokes(user_id);
CREATE INDEX IF NOT EXISTS idx_cycle_records_user_id ON cycle_records(user_id);
CREATE INDEX IF NOT EXISTS idx_pin_messages_sender_id ON pin_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_pin_messages_receiver_id ON pin_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_anniversaries_user_id ON anniversaries(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_diaries_user_id ON mood_diaries(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_alarms_user_id ON alarms(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_transactions_user_id ON budget_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_date_ideas_user_id ON date_ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_user_id ON gallery_photos(user_id);

-- 启用行级安全策略
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jokes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pin_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE anniversaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE alarms ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

-- 创建安全策略
-- 用户档案策略
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 笑话策略
CREATE POLICY "Users can view own jokes" ON jokes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own jokes" ON jokes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own jokes" ON jokes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own jokes" ON jokes FOR DELETE USING (auth.uid() = user_id);

-- Pin消息策略
CREATE POLICY "Users can view sent pins" ON pin_messages FOR SELECT USING (auth.uid() = sender_id);
CREATE POLICY "Users can view received pins" ON pin_messages FOR SELECT USING (auth.uid() = receiver_id);
CREATE POLICY "Users can insert pins" ON pin_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own pins" ON pin_messages FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can delete own pins" ON pin_messages FOR DELETE USING (auth.uid() = sender_id);

-- 月经周期策略
CREATE POLICY "Users can view own cycle records" ON cycle_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cycle records" ON cycle_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cycle records" ON cycle_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cycle records" ON cycle_records FOR DELETE USING (auth.uid() = user_id);

-- 纪念日策略
CREATE POLICY "Users can view own anniversaries" ON anniversaries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own anniversaries" ON anniversaries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own anniversaries" ON anniversaries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own anniversaries" ON anniversaries FOR DELETE USING (auth.uid() = user_id);

-- 心情日记策略
CREATE POLICY "Users can view own mood diaries" ON mood_diaries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mood diaries" ON mood_diaries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mood diaries" ON mood_diaries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own mood diaries" ON mood_diaries FOR DELETE USING (auth.uid() = user_id);

-- 愿望清单策略
CREATE POLICY "Users can view own wishlist items" ON wishlist_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wishlist items" ON wishlist_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wishlist items" ON wishlist_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own wishlist items" ON wishlist_items FOR DELETE USING (auth.uid() = user_id);

-- 闹钟策略
CREATE POLICY "Users can view own alarms" ON alarms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own alarms" ON alarms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own alarms" ON alarms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own alarms" ON alarms FOR DELETE USING (auth.uid() = user_id);

-- 记账策略
CREATE POLICY "Users can view own transactions" ON budget_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON budget_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON budget_transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON budget_transactions FOR DELETE USING (auth.uid() = user_id);

-- 约会建议策略
CREATE POLICY "Users can view own date ideas" ON date_ideas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own date ideas" ON date_ideas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own date ideas" ON date_ideas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own date ideas" ON date_ideas FOR DELETE USING (auth.uid() = user_id);

-- 相册策略
CREATE POLICY "Users can view own photos" ON gallery_photos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own photos" ON gallery_photos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own photos" ON gallery_photos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own photos" ON gallery_photos FOR DELETE USING (auth.uid() = user_id);
