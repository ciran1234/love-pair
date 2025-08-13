import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../lib/auth-context';
import { DatabaseService } from '../lib/database';

export default function WishlistPage() {
  const { user } = useAuth();
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWish, setNewWish] = useState({
    title: '',
    description: '',
    priority: 1,
    price: ''
  });

  const completedCount = wishes.filter(wish => wish.is_fulfilled).length;
  const totalCount = wishes.length;

  // 加载愿望清单
  useEffect(() => {
    if (user) {
      loadWishlist();
    }
  }, [user]);

  const loadWishlist = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userWishes = await DatabaseService.getWishlistItems(user.id);
      setWishes(userWishes || []);
    } catch (error) {
      console.error('加载愿望清单失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNewWish = async () => {
    if (!newWish.title.trim()) {
      Alert.alert('提示', '请输入愿望标题');
      return;
    }

    try {
      await DatabaseService.addWishlistItem(user.id, {
        title: newWish.title.trim(),
        description: newWish.description.trim(),
        priority: newWish.priority,
        price: newWish.price ? parseFloat(newWish.price) : null
      });
      
      setNewWish({ title: '', description: '', priority: 1, price: '' });
      setShowAddModal(false);
      Alert.alert('成功', '新愿望已添加！');
      loadWishlist();
    } catch (error) {
      Alert.alert('错误', '添加失败，请重试');
    }
  };

  const toggleWishFulfilled = async (wishId: string, isFulfilled: boolean) => {
    try {
      await DatabaseService.toggleWishlistFulfilled(wishId, isFulfilled);
      loadWishlist();
    } catch (error) {
      Alert.alert('错误', '操作失败，请重试');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>🐼 小熊猫的愿望清单</Text>
          <Text style={styles.subtitle}>记录想一起做的事情</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={24} color="#4ECDC4" />
            <Text style={styles.statLabel}>已完成</Text>
            <Text style={styles.statValue}>{completedCount}/{totalCount}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={24} color="#FF6B6B" />
            <Text style={styles.statLabel}>完成率</Text>
            <Text style={styles.statValue}>
              {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
            </Text>
          </View>
        </View>

        <View style={styles.wishList}>
          {loading ? (
            <Text style={styles.loadingText}>加载中...</Text>
          ) : wishes.length > 0 ? (
            wishes.map((wish) => (
              <TouchableOpacity
                key={wish.id}
                style={styles.wishCard}
                onPress={() => toggleWishFulfilled(wish.id, !wish.is_fulfilled)}
              >
                <View style={styles.wishHeader}>
                  <View style={styles.wishInfo}>
                    <View style={styles.categoryIcon}>
                      <Ionicons name="heart" size={20} color="#FF6B6B" />
                    </View>
                    <View style={styles.wishText}>
                      <Text style={styles.wishTitle}>{wish.title}</Text>
                      <Text style={styles.wishDescription}>{wish.description || '无描述'}</Text>
                      {wish.price && (
                        <Text style={styles.wishPrice}>💰 {wish.price}</Text>
                      )}
                    </View>
                  </View>
                  <Ionicons 
                    name={wish.is_fulfilled ? "checkmark-circle" : "ellipse-outline"} 
                    size={24} 
                    color={wish.is_fulfilled ? "#4ECDC4" : "#636E72"} 
                  />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>还没有愿望，快来添加第一个愿望吧！</Text>
          )}
        </View>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addText}>添加新愿望</Text>
        </TouchableOpacity>

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>💡 小贴士</Text>
          <Text style={styles.tipsText}>
            记录你们想一起做的事情，完成后勾选，让你们的爱情更有目标和期待！
          </Text>
        </View>
      </ScrollView>

      {/* 添加愿望模态框 */}
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>添加新愿望</Text>
            
            <TextInput
              style={styles.input}
              placeholder="愿望标题"
              value={newWish.title}
              onChangeText={(text) => setNewWish(prev => ({ ...prev, title: text }))}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="愿望描述（可选）"
              value={newWish.description}
              onChangeText={(text) => setNewWish(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            
            <TextInput
              style={styles.input}
              placeholder="价格（可选）"
              value={newWish.price}
              onChangeText={(text) => setNewWish(prev => ({ ...prev, price: text }))}
              keyboardType="numeric"
            />
            
            <View style={styles.prioritySection}>
              <Text style={styles.priorityLabel}>优先级：</Text>
              <View style={styles.priorityButtons}>
                {[1, 2, 3].map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityButton,
                      newWish.priority === priority && styles.priorityButtonActive
                    ]}
                    onPress={() => setNewWish(prev => ({ ...prev, priority }))}
                  >
                    <Text style={[
                      styles.priorityButtonText,
                      newWish.priority === priority && styles.priorityButtonTextActive
                    ]}>
                      {priority === 1 ? '高' : priority === 2 ? '中' : '低'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={addNewWish}
              >
                <Text style={styles.saveButtonText}>添加</Text>
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
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#636E72',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 16,
    color: '#636E72',
    marginLeft: 8,
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  wishList: {
    marginBottom: 20,
  },
  wishCard: {
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
  wishHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wishInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  wishText: {
    flex: 1,
  },
  wishTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 4,
  },
  wishDescription: {
    fontSize: 14,
    color: '#636E72',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C5CE7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  tips: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6C5CE7',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#636E72',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#636E72',
    padding: 20,
    fontStyle: 'italic',
  },
  wishPrice: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '500',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#F8F9FA',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  prioritySection: {
    marginBottom: 20,
  },
  priorityLabel: {
    fontSize: 16,
    color: '#2D3436',
    marginBottom: 12,
  },
  priorityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  priorityButtonText: {
    color: '#636E72',
    fontSize: 14,
    fontWeight: '500',
  },
  priorityButtonTextActive: {
    color: 'white',
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
  cancelButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
  },
  cancelButtonText: {
    color: '#636E72',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
