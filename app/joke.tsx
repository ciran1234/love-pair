import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../lib/auth-context';
import { jokeService } from '../lib/database';

export default function JokePage() {
  const { user } = useAuth();
  const [jokes, setJokes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newJoke, setNewJoke] = useState('');
  const [jokeCategory, setJokeCategory] = useState('general');

  // 预设的笑话
  const presetJokes = [
    {
      content: "为什么小熊猫总是很开心？因为它有你的爱！🐼",
      category: "romantic"
    },
    {
      content: "你知道什么比小熊猫更可爱吗？就是你！💕",
      category: "romantic"
    },
    {
      content: "小熊猫说：今天也要像你一样可爱哦！",
      category: "cute"
    },
    {
      content: "为什么我们这么配？因为我们都是小熊猫！",
      category: "romantic"
    }
  ];

  useEffect(() => {
    if (user) {
      loadJokes();
    }
  }, [user]);

  const loadJokes = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userJokes = await jokeService.getJokes(user.id);
      setJokes(userJokes || []);
    } catch (error) {
      console.error('加载笑话失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomJoke = () => {
    const randomJoke = presetJokes[Math.floor(Math.random() * presetJokes.length)];
    Alert.alert('🐼 小熊猫的笑话', randomJoke.content, [
      { text: '保存', onPress: () => saveJoke(randomJoke.content, randomJoke.category) },
      { text: '再生成一个', onPress: generateRandomJoke },
      { text: '关闭', style: 'cancel' }
    ]);
  };

  const saveJoke = async (content: string, category: string = 'general') => {
    if (!user) return;
    
    try {
      await jokeService.addJoke(user.id, content, category);
      Alert.alert('成功', '笑话已保存！');
      loadJokes(); // 重新加载笑话列表
    } catch (error) {
      Alert.alert('错误', '保存失败，请重试');
    }
  };

  const addCustomJoke = async () => {
    if (!newJoke.trim()) {
      Alert.alert('提示', '请输入笑话内容');
      return;
    }

    try {
      await jokeService.addJoke(user.id, newJoke.trim(), jokeCategory);
      setNewJoke('');
      setShowAddModal(false);
      Alert.alert('成功', '自定义笑话已保存！');
      loadJokes();
    } catch (error) {
      Alert.alert('错误', '保存失败，请重试');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'romantic': return '💕';
      case 'cute': return '🐼';
      case 'funny': return '😄';
      default: return '😊';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>😄 笑话生成器</Text>
        <Text style={styles.subtitle}>让小熊猫逗你开心</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.generateButton} onPress={generateRandomJoke}>
          <Ionicons name="refresh" size={24} color="white" />
          <Text style={styles.buttonText}>生成笑话</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.buttonText}>添加笑话</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.jokesList}>
        <Text style={styles.sectionTitle}>我的笑话收藏</Text>
        
        {loading ? (
          <Text style={styles.loadingText}>加载中...</Text>
        ) : jokes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>😊</Text>
            <Text style={styles.emptyText}>还没有保存的笑话</Text>
            <Text style={styles.emptySubtext}>点击"生成笑话"开始收集吧！</Text>
          </View>
        ) : (
          jokes.map((joke, index) => (
            <View key={joke.id || index} style={styles.jokeCard}>
              <View style={styles.jokeHeader}>
                <Text style={styles.categoryIcon}>
                  {getCategoryIcon(joke.category)}
                </Text>
                <Text style={styles.jokeCategory}>
                  {joke.category === 'romantic' ? '浪漫' : 
                   joke.category === 'cute' ? '可爱' : 
                   joke.category === 'funny' ? '搞笑' : '一般'}
                </Text>
              </View>
              <Text style={styles.jokeContent}>{joke.content}</Text>
              <Text style={styles.jokeDate}>
                {new Date(joke.created_at).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* 添加笑话模态框 */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContent}
            >
            <Text style={styles.modalTitle}>添加自定义笑话</Text>
            
            <Text style={styles.inputLabel}>笑话内容</Text>
            <TextInput
              style={styles.textInput}
              value={newJoke}
              onChangeText={setNewJoke}
              placeholder="输入你的笑话..."
              multiline
              numberOfLines={4}
              placeholderTextColor="#A0522D"
            />

            <Text style={styles.inputLabel}>分类</Text>
            <View style={styles.categoryButtons}>
              {[
                { key: 'romantic', label: '浪漫', icon: '💕' },
                { key: 'cute', label: '可爱', icon: '🐼' },
                { key: 'funny', label: '搞笑', icon: '😄' },
                { key: 'general', label: '一般', icon: '😊' }
              ].map(cat => (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.categoryButton,
                    jokeCategory === cat.key && styles.categoryButtonActive
                  ]}
                  onPress={() => setJokeCategory(cat.key)}
                >
                  <Text style={styles.categoryButtonIcon}>{cat.icon}</Text>
                  <Text style={styles.categoryButtonText}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={addCustomJoke}
              >
                <Text style={styles.saveButtonText}>保存</Text>
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
  actions: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  generateButton: {
    flex: 1,
    backgroundColor: '#FF8E8E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  jokesList: {
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
  jokeCard: {
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
  jokeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  jokeCategory: {
    fontSize: 12,
    color: '#A0522D',
    backgroundColor: '#FFF8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  jokeContent: {
    fontSize: 16,
    color: '#2D3436',
    lineHeight: 22,
    marginBottom: 8,
  },
  jokeDate: {
    fontSize: 12,
    color: '#A0522D',
    textAlign: 'right',
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
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  categoryButton: {
    flex: 1,
    minWidth: 80,
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryButtonActive: {
    borderColor: '#FF8E8E',
    backgroundColor: '#FFE4B5',
  },
  categoryButtonIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: '500',
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
  saveButton: {
    flex: 1,
    backgroundColor: '#FF8E8E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
