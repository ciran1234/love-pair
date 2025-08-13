import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../lib/auth-context';
import { DatabaseService } from '../lib/database';

export default function MessageBoardPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newMessage, setNewMessage] = useState({
    message: '',
    messageType: 'reminder',
    isUrgent: false,
  });

  const messageTypes = [
    { id: 'all', name: '全部', emoji: '📋', color: '#8B4513' },
    { id: 'reminder', name: '提醒', emoji: '⏰', color: '#FF6B6B' },
    { id: 'love_note', name: '情话', emoji: '💕', color: '#FF8E8E' },
    { id: 'question', name: '问题', emoji: '❓', color: '#4ECDC4' },
    { id: 'announcement', name: '公告', emoji: '📢', color: '#FFB347' },
  ];

  useEffect(() => {
    if (user) {
      loadMessages();
    }
  }, [user]);

  const loadMessages = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await DatabaseService.getMessageBoard();
      setMessages(data || []);
    } catch (error) {
      console.error('加载留言板失败:', error);
      Alert.alert('错误', '加载留言板失败');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMessages();
    setRefreshing(false);
  };

  const addMessage = async () => {
    if (!user || !newMessage.message.trim()) {
      Alert.alert('提示', '请输入消息内容');
      return;
    }

    try {
      await DatabaseService.addMessageBoardPost(user.id, {
        message: newMessage.message.trim(),
        message_type: newMessage.messageType,
        is_urgent: newMessage.isUrgent,
      });

      // 触觉反馈
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      Alert.alert('成功', '消息发布成功！');
      setNewMessage({ message: '', messageType: 'reminder', isUrgent: false });
      setShowAddModal(false);
      loadMessages();
    } catch (error) {
      console.error('发布消息失败:', error);
      Alert.alert('错误', '发布消息失败');
    }
  };

  const handleReaction = async (messageId: string, reactionType: 'like' | 'dislike') => {
    if (!user) return;

    try {
      await DatabaseService.addMessageReaction(messageId, user.id, reactionType);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      loadMessages(); // 重新加载以更新计数
    } catch (error) {
      console.error('添加反应失败:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    Alert.alert(
      '确认删除',
      '确定要删除这条消息吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await DatabaseService.deleteMessageBoardPost(messageId);
              Alert.alert('成功', '消息已删除');
              loadMessages();
            } catch (error) {
              console.error('删除消息失败:', error);
              Alert.alert('错误', '删除消息失败');
            }
          },
        },
      ]
    );
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return '刚刚';
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小时前`;
    return `${Math.floor(diffInMinutes / 1440)}天前`;
  };

  const getMessageTypeInfo = (type: string) => {
    return messageTypes.find(t => t.id === type) || messageTypes[0];
  };

  const filteredMessages = selectedCategory === 'all' 
    ? messages 
    : messages.filter(msg => msg.message_type === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 头部 */}
        <View style={styles.header}>
          <Text style={styles.title}>🐼 小熊猫的留言板</Text>
          <Text style={styles.subtitle}>分享你的想法和提醒</Text>
        </View>

        {/* 分类选择 */}
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {messageTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === type.id && styles.categoryButtonActive,
                  { backgroundColor: type.color }
                ]}
                onPress={() => setSelectedCategory(type.id)}
              >
                <Text style={styles.categoryEmoji}>{type.emoji}</Text>
                <Text style={styles.categoryText}>{type.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 发布按钮 */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={24} color="#8B4513" />
          <Text style={styles.addButtonText}>发布新消息</Text>
        </TouchableOpacity>

        {/* 消息列表 */}
        <View style={styles.messagesContainer}>
          {loading ? (
            <Text style={styles.loadingText}>加载中...</Text>
          ) : filteredMessages.length > 0 ? (
            filteredMessages.map((msg, index) => (
              <View key={msg.id || index} style={styles.messageCard}>
                <View style={styles.messageHeader}>
                  <View style={styles.userInfo}>
                    <View style={styles.userAvatar}>
                      <Text style={styles.avatarEmoji}>🐼</Text>
                    </View>
                    <View style={styles.userText}>
                      <Text style={styles.userName}>{msg.user_profiles?.username || '小熊猫'}</Text>
                      <Text style={styles.messageTime}>{getTimeAgo(msg.created_at)}</Text>
                    </View>
                  </View>
                  <View style={styles.messageType}>
                    <Text style={styles.typeEmoji}>
                      {getMessageTypeInfo(msg.message_type).emoji}
                    </Text>
                    {msg.is_urgent && (
                      <Text style={styles.urgentBadge}>紧急</Text>
                    )}
                  </View>
                </View>

                <Text style={styles.messageText}>{msg.message}</Text>

                <View style={styles.messageFooter}>
                  <View style={styles.reactionsContainer}>
                    <TouchableOpacity
                      style={styles.reactionButton}
                      onPress={() => handleReaction(msg.id, 'like')}
                    >
                      <Ionicons name="thumbs-up" size={16} color="#4ECDC4" />
                      <Text style={styles.reactionCount}>{msg.likes_count || 0}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.reactionButton}
                      onPress={() => handleReaction(msg.id, 'dislike')}
                    >
                      <Ionicons name="thumbs-down" size={16} color="#FF6B6B" />
                      <Text style={styles.reactionCount}>{msg.dislikes_count || 0}</Text>
                    </TouchableOpacity>
                  </View>

                  {user && msg.user_id === user.id && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteMessage(msg.id)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#FF6B6B" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyText}>还没有留言</Text>
              <Text style={styles.emptySubtext}>发布第一条消息吧！</Text>
            </View>
          )}
        </View>

        {/* 小熊猫贴士 */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>🐼 小熊猫的小贴士</Text>
          <Text style={styles.tipsText}>
            留言板是你们沟通的桥梁，记得经常查看和回应对方的消息哦！小熊猫最喜欢看到你们的互动了～
          </Text>
        </View>
      </ScrollView>

      {/* 发布消息模态框 */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.messageModal}>
            <Text style={styles.modalTitle}>发布新消息</Text>

            {/* 消息类型选择 */}
            <View style={styles.typeSelector}>
              <Text style={styles.typeLabel}>消息类型：</Text>
              <View style={styles.typeButtons}>
                {messageTypes.slice(1).map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeButton,
                      newMessage.messageType === type.id && styles.typeButtonActive,
                      { backgroundColor: type.color }
                    ]}
                    onPress={() => setNewMessage({ ...newMessage, messageType: type.id })}
                  >
                    <Text style={styles.typeButtonEmoji}>{type.emoji}</Text>
                    <Text style={styles.typeButtonText}>{type.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 紧急标记 */}
            <TouchableOpacity
              style={styles.urgentToggle}
              onPress={() => setNewMessage({ ...newMessage, isUrgent: !newMessage.isUrgent })}
            >
              <Ionicons 
                name={newMessage.isUrgent ? "alert-circle" : "alert-circle-outline"} 
                size={20} 
                color={newMessage.isUrgent ? "#FF6B6B" : "#8B4513"} 
              />
              <Text style={[styles.urgentText, newMessage.isUrgent && styles.urgentTextActive]}>
                标记为紧急
              </Text>
            </TouchableOpacity>

            <TextInput
              style={styles.messageInput}
              placeholder="写下你想说的话..."
              value={newMessage.message}
              onChangeText={(text) => setNewMessage({ ...newMessage, message: text })}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />

            <Text style={styles.characterCount}>{newMessage.message.length}/500</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.sendButton]}
                onPress={addMessage}
              >
                <Text style={styles.sendButtonText}>发布</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B4513',
    opacity: 0.8,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryButtonActive: {
    transform: [{ scale: 1.05 }],
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE4B5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 16,
    color: '#8B4513',
    fontWeight: '600',
    marginLeft: 8,
  },
  messagesContainer: {
    marginBottom: 30,
  },
  messageCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE4B5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarEmoji: {
    fontSize: 20,
  },
  userText: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
  },
  messageTime: {
    fontSize: 12,
    color: '#8B4513',
    opacity: 0.6,
    marginTop: 2,
  },
  messageType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  urgentBadge: {
    backgroundColor: '#FF6B6B',
    color: 'white',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    fontWeight: '600',
  },
  messageText: {
    fontSize: 16,
    color: '#8B4513',
    lineHeight: 24,
    marginBottom: 12,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reactionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFF8F0',
    borderRadius: 16,
    marginRight: 8,
  },
  reactionCount: {
    fontSize: 14,
    color: '#8B4513',
    marginLeft: 4,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#8B4513',
    marginTop: 40,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#8B4513',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8B4513',
    opacity: 0.6,
  },
  tipsCard: {
    backgroundColor: '#DEB887',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFB347',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#8B4513',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 20,
  },
  typeSelector: {
    marginBottom: 16,
  },
  typeLabel: {
    fontSize: 16,
    color: '#8B4513',
    marginBottom: 8,
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeButtonActive: {
    transform: [{ scale: 1.05 }],
  },
  typeButtonEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  typeButtonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  urgentToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 16,
  },
  urgentText: {
    fontSize: 14,
    color: '#8B4513',
    marginLeft: 8,
  },
  urgentTextActive: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#DEB887',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#8B4513',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  characterCount: {
    fontSize: 12,
    color: '#8B4513',
    opacity: 0.6,
    textAlign: 'right',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  sendButton: {
    backgroundColor: '#FF8E8E',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#8B4513',
    fontWeight: '600',
  },
  sendButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});
