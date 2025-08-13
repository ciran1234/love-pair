import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../lib/auth-context';
import { DatabaseService } from '../lib/database';

const { width: screenWidth } = Dimensions.get('window');

export default function PinPage() {
  const { user } = useAuth();
  const [pinMessages, setPinMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedQuickAction, setSelectedQuickAction] = useState('');
  
  // 动画值
  const heartScale = useRef(new Animated.Value(1)).current;
  const heartOpacity = useRef(new Animated.Value(1)).current;
  const messageScale = useRef(new Animated.Value(0)).current;
  const floatingHearts = useRef([]).current;

  // 快速操作选项
  const quickActions = [
    { id: 'miss_you', text: '我想你了', emoji: '💕', color: '#FF6B6B' },
    { id: 'good_morning', text: '早安', emoji: '🌅', color: '#FFB347' },
    { id: 'good_night', text: '晚安', emoji: '🌙', color: '#6C5CE7' },
    { id: 'love_you', text: '我爱你', emoji: '🥰', color: '#FF8E8E' },
    { id: 'thinking_of_you', text: '在想你', emoji: '🤔', color: '#4ECDC4' },
    { id: 'come_here', text: '过来抱抱', emoji: '🤗', color: '#A8E6CF' },
    { id: 'kiss', text: '亲亲', emoji: '💋', color: '#FF6B6B' },
    { id: 'hug', text: '抱抱', emoji: '🫂', color: '#FFB347' },
  ];

  useEffect(() => {
    if (user) {
      loadPinMessages();
    }
  }, [user]);

  const loadPinMessages = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const messages = await DatabaseService.getPinMessages(user.id);
      setPinMessages(messages || []);
    } catch (error) {
      console.error('加载Pin消息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendPinMessage = async (messageText: string, type: string = 'custom') => {
    if (!user) return;

    try {
      // 这里暂时发送给自己，后续可以实现伴侣配对
      await DatabaseService.sendPinMessage(user.id, user.id, messageText);
      
      // 触觉反馈
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // 播放心跳动画
      playHeartbeatAnimation();
      
      // 显示成功提示
      Alert.alert('💕 发送成功', '你的心意已经传递了！');
      
      // 重新加载消息
      loadPinMessages();
    } catch (error) {
      console.error('发送Pin失败:', error);
      Alert.alert('错误', '发送失败，请重试');
    }
  };

  const sendQuickAction = (action: any) => {
    setSelectedQuickAction(action.id);
    setShowQuickActions(false);
    
    // 发送快速消息
    sendPinMessage(action.text, 'quick');
  };

  const playHeartbeatAnimation = () => {
    // 心跳缩放动画
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.3,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // 创建浮动爱心动画
    createFloatingHearts();
  };

  const createFloatingHearts = () => {
    const hearts = [];
    for (let i = 0; i < 5; i++) {
      const heart = {
        id: Date.now() + i,
        x: Math.random() * screenWidth,
        y: new Animated.Value(screenWidth * 0.6),
        scale: new Animated.Value(0),
        opacity: new Animated.Value(1),
      };
      
      hearts.push(heart);
      
      // 爱心上升动画
      Animated.parallel([
        Animated.timing(heart.scale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(heart.y, {
          toValue: (screenWidth * 0.6) - 200,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(heart.opacity, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // 动画结束后清理
        const index = floatingHearts.findIndex(h => h.id === heart.id);
        if (index > -1) {
          floatingHearts.splice(index, 1);
        }
      });
    }
    
    floatingHearts.push(...hearts);
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

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'miss_you': return '💕';
      case 'good_morning': return '🌅';
      case 'good_night': return '🌙';
      case 'love_you': return '🥰';
      case 'thinking_of_you': return '🤔';
      case 'come_here': return '🤗';
      case 'kiss': return '💋';
      case 'hug': return '🫂';
      default: return '💌';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 头部 */}
        <View style={styles.header}>
          <Text style={styles.title}>💕 小熊猫的思念</Text>
          <Text style={styles.subtitle}>传递你的心意</Text>
        </View>

        {/* 主心跳按钮 */}
        <View style={styles.heartContainer}>
          <TouchableOpacity
            style={styles.heartButton}
            onPress={() => setShowQuickActions(true)}
            activeOpacity={0.8}
          >
            <Animated.View style={[styles.heartIcon, { transform: [{ scale: heartScale }] }]}>
              <Text style={styles.heartEmoji}>💕</Text>
            </Animated.View>
            <Text style={styles.heartText}>点击发送思念</Text>
          </TouchableOpacity>
        </View>

        {/* 快速操作网格 */}
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.quickActionButton, { backgroundColor: action.color }]}
              onPress={() => sendQuickAction(action)}
              activeOpacity={0.8}
            >
              <Text style={styles.quickActionEmoji}>{action.emoji}</Text>
              <Text style={styles.quickActionText}>{action.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 自定义消息按钮 */}
        <TouchableOpacity
          style={styles.customMessageButton}
          onPress={() => setShowSendModal(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={24} color="#8B4513" />
          <Text style={styles.customMessageText}>发送自定义消息</Text>
        </TouchableOpacity>

        {/* 消息列表 */}
        <View style={styles.messagesSection}>
          <Text style={styles.sectionTitle}>💌 思念记录</Text>
          {loading ? (
            <Text style={styles.loadingText}>加载中...</Text>
          ) : pinMessages.length > 0 ? (
            pinMessages.map((msg, index) => (
              <View key={msg.id || index} style={styles.messageCard}>
                <View style={styles.messageHeader}>
                  <Text style={styles.messageIcon}>
                    {getMessageIcon(msg.message)}
                  </Text>
                  <Text style={styles.messageTime}>
                    {getTimeAgo(msg.created_at)}
                  </Text>
                </View>
                <Text style={styles.messageText}>{msg.message}</Text>
                <View style={styles.messageFooter}>
                  <Text style={styles.messageStatus}>
                    {msg.is_read ? '已读' : '未读'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>💕</Text>
              <Text style={styles.emptyText}>还没有思念记录</Text>
              <Text style={styles.emptySubtext}>发送第一条思念消息吧！</Text>
            </View>
          )}
        </View>

        {/* 小熊猫贴士 */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>🐼 小熊猫的小贴士</Text>
          <Text style={styles.tipsText}>
            思念是一种很奇妙的感觉，就像小熊猫想念竹子一样。记得经常表达你的爱意，让感情更加甜蜜～
          </Text>
        </View>
      </ScrollView>

      {/* 浮动爱心 */}
      {floatingHearts.map((heart) => (
        <Animated.View
          key={heart.id}
          style={[
            styles.floatingHeart,
            {
              left: heart.x,
              top: heart.y,
              transform: [{ scale: heart.scale }],
              opacity: heart.opacity,
            },
          ]}
        >
          <Text style={styles.floatingHeartEmoji}>💕</Text>
        </Animated.View>
      ))}

      {/* 快速操作模态框 */}
      <Modal
        visible={showQuickActions}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowQuickActions(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowQuickActions(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.quickActionsModal}>
              <Text style={styles.modalTitle}>选择思念方式</Text>
              <View style={styles.quickActionsModalGrid}>
                {quickActions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={[styles.quickActionModalButton, { backgroundColor: action.color }]}
                    onPress={() => sendQuickAction(action)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.quickActionModalEmoji}>{action.emoji}</Text>
                    <Text style={styles.quickActionModalText}>{action.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowQuickActions(false)}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* 自定义消息模态框 */}
      <Modal
        visible={showSendModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSendModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.messageModal}>
            <Text style={styles.modalTitle}>发送思念消息</Text>
            
            <TextInput
              style={styles.messageInput}
              placeholder="写下你想说的话..."
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={200}
            />
            
            <Text style={styles.characterCount}>{message.length}/200</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowSendModal(false)}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.sendButton]}
                onPress={() => {
                  if (message.trim()) {
                    sendPinMessage(message.trim(), 'custom');
                    setMessage('');
                    setShowSendModal(false);
                  } else {
                    Alert.alert('提示', '请输入消息内容');
                  }
                }}
              >
                <Text style={styles.sendButtonText}>发送</Text>
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
    color: '#A0522D',
  },
  heartContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  heartButton: {
    alignItems: 'center',
    padding: 20,
  },
  heartIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFE4B5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 16,
  },
  heartEmoji: {
    fontSize: 48,
  },
  heartText: {
    fontSize: 18,
    color: '#8B4513',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  quickActionButton: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  customMessageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DEB887',
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  customMessageText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#8B4513',
    fontWeight: '600',
  },
  messagesSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#A0522D',
    padding: 20,
  },
  messageCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  messageIcon: {
    fontSize: 24,
  },
  messageTime: {
    fontSize: 12,
    color: '#A0522D',
  },
  messageText: {
    fontSize: 16,
    color: '#2D3436',
    lineHeight: 22,
    marginBottom: 12,
  },
  messageFooter: {
    alignItems: 'flex-end',
  },
  messageStatus: {
    fontSize: 12,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#8B4513',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#A0522D',
    textAlign: 'center',
  },
  tipsCard: {
    backgroundColor: '#FFE4B5',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFB347',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#A0522D',
    lineHeight: 20,
  },
  floatingHeart: {
    position: 'absolute',
    zIndex: 1000,
  },
  floatingHeartEmoji: {
    fontSize: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionsModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 20,
    textAlign: 'center',
  },
  quickActionsModalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickActionModalButton: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionModalEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  quickActionModalText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#636E72',
    fontSize: 16,
    fontWeight: '500',
  },
  messageModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#DEB887',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    backgroundColor: '#FFF8F0',
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  characterCount: {
    fontSize: 12,
    color: '#A0522D',
    textAlign: 'right',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  sendButton: {
    backgroundColor: '#FF6B6B',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
