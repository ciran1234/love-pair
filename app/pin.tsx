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
  Animated,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../lib/auth-context';
import { pinService } from '../lib/database';

export default function PinPage() {
  const { user } = useAuth();
  const [pinMessages, setPinMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [message, setMessage] = useState('');
  const [scaleValue] = useState(new Animated.Value(1));

  useEffect(() => {
    if (user) {
      loadPinMessages();
    }
  }, [user]);

  const loadPinMessages = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const messages = await pinService.getReceivedPins(user.id);
      setPinMessages(messages || []);
    } catch (error) {
      console.error('加载Pin消息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendPin = async () => {
    if (!message.trim()) {
      Alert.alert('提示', '请输入消息内容');
      return;
    }

    if (!user) return;

    try {
      // 这里暂时发送给自己，后续可以实现伴侣配对
      await pinService.sendPin(user.id, user.id, message.trim());
      setMessage('');
      setShowSendModal(false);
      Alert.alert('成功', 'Pin消息已发送！');
      loadPinMessages();
    } catch (error) {
      console.error('发送Pin失败:', error);
      Alert.alert('错误', '发送失败，请重试');
    }
  };

  const handlePinPress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    Alert.alert('💕 Pin一下', '你想Pin什么消息呢？', [
      { text: '发送Pin', onPress: () => setShowSendModal(true) },
      { text: '查看消息', onPress: () => {} },
      { text: '取消', style: 'cancel' }
    ]);
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💕 互相Pin</Text>
        <Text style={styles.subtitle}>表达你的思念</Text>
      </View>

      <View style={styles.pinContainer}>
        <Animated.View style={[styles.pinButton, { transform: [{ scale: scaleValue }] }]}>
          <TouchableOpacity style={styles.pinTouchable} onPress={handlePinPress}>
            <Ionicons name="heart" size={48} color="#FF8E8E" />
            <Text style={styles.pinText}>Pin一下</Text>
            <Text style={styles.pinSubtext}>表达你的爱意</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <ScrollView style={styles.messagesList}>
        <Text style={styles.sectionTitle}>收到的Pin消息</Text>
        
        {loading ? (
          <Text style={styles.loadingText}>加载中...</Text>
        ) : pinMessages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💕</Text>
            <Text style={styles.emptyText}>还没有Pin消息</Text>
            <Text style={styles.emptySubtext}>点击上面的心形发送第一个Pin吧！</Text>
          </View>
        ) : (
          pinMessages.map((msg, index) => (
            <View key={msg.id || index} style={styles.messageCard}>
              <View style={styles.messageHeader}>
                <Ionicons name="heart" size={20} color="#FF8E8E" />
                <Text style={styles.messageTime}>
                  {getTimeAgo(msg.created_at)}
                </Text>
              </View>
              <Text style={styles.messageContent}>{msg.message}</Text>
              {!msg.is_read && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>新</Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* 发送Pin消息模态框 */}
      <Modal
        visible={showSendModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSendModal(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContent}
            >
              <Text style={styles.modalTitle}>发送Pin消息</Text>
              
              <Text style={styles.inputLabel}>消息内容</Text>
              <TextInput
                style={styles.textInput}
                value={message}
                onChangeText={setMessage}
                placeholder="输入你想说的话..."
                multiline
                numberOfLines={4}
                placeholderTextColor="#A0522D"
              />

              <View style={styles.quickMessages}>
                <Text style={styles.quickTitle}>快速消息</Text>
                <View style={styles.quickButtons}>
                  {[
                    '我想你了 💕',
                    '我爱你 🥰',
                    '今天也要开心哦 😊',
                    '小熊猫想你啦 🐼'
                  ].map((quickMsg, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.quickButton}
                      onPress={() => setMessage(quickMsg)}
                    >
                      <Text style={styles.quickButtonText}>{quickMsg}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowSendModal(false)}
                >
                  <Text style={styles.cancelButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={sendPin}
                >
                  <Text style={styles.sendButtonText}>发送</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFE4B5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0522D',
  },
  pinContainer: {
    alignItems: 'center',
    padding: 40,
  },
  pinButton: {
    shadowColor: '#FF8E8E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  pinTouchable: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 30,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FF8E8E',
  },
  pinText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginTop: 12,
  },
  pinSubtext: {
    fontSize: 14,
    color: '#A0522D',
    marginTop: 4,
  },
  messagesList: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 15,
  },
  loadingText: {
    textAlign: 'center',
    color: '#A0522D',
    fontSize: 16,
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
    borderLeftWidth: 4,
    borderLeftColor: '#FF8E8E',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageTime: {
    fontSize: 12,
    color: '#A0522D',
    marginLeft: 8,
  },
  messageContent: {
    fontSize: 16,
    color: '#2D3436',
    lineHeight: 22,
  },
  unreadBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF8E8E',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unreadText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2D3436',
    borderWidth: 1,
    borderColor: '#DEB887',
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  quickMessages: {
    marginBottom: 24,
  },
  quickTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 12,
  },
  quickButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickButton: {
    backgroundColor: '#FFF8F0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#DEB887',
  },
  quickButtonText: {
    fontSize: 14,
    color: '#8B4513',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  sendButton: {
    flex: 1,
    backgroundColor: '#FF8E8E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
