-- 删除所有现有的策略
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

DROP POLICY IF EXISTS "Users can view own jokes" ON jokes;
DROP POLICY IF EXISTS "Users can insert own jokes" ON jokes;
DROP POLICY IF EXISTS "Users can update own jokes" ON jokes;
DROP POLICY IF EXISTS "Users can delete own jokes" ON jokes;

DROP POLICY IF EXISTS "Users can view sent pins" ON pin_messages;
DROP POLICY IF EXISTS "Users can view received pins" ON pin_messages;
DROP POLICY IF EXISTS "Users can insert pins" ON pin_messages;
DROP POLICY IF EXISTS "Users can update own pins" ON pin_messages;
DROP POLICY IF EXISTS "Users can delete own pins" ON pin_messages;

DROP POLICY IF EXISTS "Users can view own cycle records" ON cycle_records;
DROP POLICY IF EXISTS "Users can insert own cycle records" ON cycle_records;
DROP POLICY IF EXISTS "Users can update own cycle records" ON cycle_records;
DROP POLICY IF EXISTS "Users can delete own cycle records" ON cycle_records;

DROP POLICY IF EXISTS "Users can view own anniversaries" ON anniversaries;
DROP POLICY IF EXISTS "Users can insert own anniversaries" ON anniversaries;
DROP POLICY IF EXISTS "Users can update own anniversaries" ON anniversaries;
DROP POLICY IF EXISTS "Users can delete own anniversaries" ON anniversaries;

DROP POLICY IF EXISTS "Users can view own mood diaries" ON mood_diaries;
DROP POLICY IF EXISTS "Users can insert own mood diaries" ON mood_diaries;
DROP POLICY IF EXISTS "Users can update own mood diaries" ON mood_diaries;
DROP POLICY IF EXISTS "Users can delete own mood diaries" ON mood_diaries;

DROP POLICY IF EXISTS "Users can view own wishlist items" ON wishlist_items;
DROP POLICY IF EXISTS "Users can insert own wishlist items" ON wishlist_items;
DROP POLICY IF EXISTS "Users can update own wishlist items" ON wishlist_items;
DROP POLICY IF EXISTS "Users can delete own wishlist items" ON wishlist_items;

DROP POLICY IF EXISTS "Users can view own alarms" ON alarms;
DROP POLICY IF EXISTS "Users can insert own alarms" ON alarms;
DROP POLICY IF EXISTS "Users can update own alarms" ON alarms;
DROP POLICY IF EXISTS "Users can delete own alarms" ON alarms;

DROP POLICY IF EXISTS "Users can view own transactions" ON budget_transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON budget_transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON budget_transactions;
DROP POLICY IF EXISTS "Users can delete own transactions" ON budget_transactions;

DROP POLICY IF EXISTS "Users can view own date ideas" ON date_ideas;
DROP POLICY IF EXISTS "Users can insert own date ideas" ON date_ideas;
DROP POLICY IF EXISTS "Users can update own date ideas" ON date_ideas;
DROP POLICY IF EXISTS "Users can delete own date ideas" ON date_ideas;

DROP POLICY IF EXISTS "Users can view own photos" ON gallery_photos;
DROP POLICY IF EXISTS "Users can insert own photos" ON gallery_photos;
DROP POLICY IF EXISTS "Users can update own photos" ON gallery_photos;
DROP POLICY IF EXISTS "Users can delete own photos" ON gallery_photos;

-- 重新创建所有策略
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
