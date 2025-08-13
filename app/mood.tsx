import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../lib/auth-context';
import { DatabaseService } from '../lib/database';

export default function MoodPage() {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [todayMood, setTodayMood] = useState<string | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [recentMoods, setRecentMoods] = useState([]);
  const [loading, setLoading] = useState(false);

  const moods = [
    { id: 'happy', emoji: '😊', name: '开心', color: '#FFD93D' },
    { id: 'love', emoji: '🥰', name: '甜蜜', color: '#FF6B6B' },
    { id: 'excited', emoji: '🤩', name: '兴奋', color: '#FF8E8E' },
    { id: 'calm', emoji: '😌', name: '平静', color: '#4ECDC4' },
    { id: 'sad', emoji: '😔', name: '难过', color: '#6C5CE7' },
    { id: 'angry', emoji: '😤', name: '生气', color: '#FF6B6B' },
    { id: 'tired', emoji: '😴', name: '疲惫', color: '#A8E6CF' },
    { id: 'surprised', emoji: '😲', name: '惊讶', color: '#FFB347' }
  ];

  // 加载心情记录
  useEffect(() => {
    if (user) {
      loadMoodDiaries();
    }
  }, [user]);

  const loadMoodDiaries = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const diaries = await DatabaseService.getMoodDiaries(user.id);
      setRecentMoods(diaries || []);
    } catch (error) {
      console.error('加载心情记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectMood = (moodId: string) => {
    setSelectedMood(moodId);
    setTodayMood(moodId);
    setShowNoteModal(true);
  };

  const saveMood = async () => {
    if (!user || !selectedMood) return;
    
    try {
      const moodScore = getMoodScore(selectedMood);
      await DatabaseService.addMoodDiary(user.id, {
        mood_score: moodScore,
        mood_description: selectedMood,
        notes: moodNote,
        activities: []
      });
      
      Alert.alert('成功', '心情已记录！');
      setMoodNote('');
      setSelectedMood(null);
      setTodayMood(null);
      setShowNoteModal(false);
      loadMoodDiaries();
    } catch (error) {
      Alert.alert('错误', '保存失败，请重试');
    }
  };

  const getMoodScore = (moodId: string) => {
    const moodScores = {
      'happy': 9,
      'love': 10,
      'excited': 8,
      'calm': 7,
      'sad': 3,
      'angry': 2,
      'tired': 4,
      'surprised': 6
    };
    return moodScores[moodId] || 5;
  };

  const getMoodName = (moodId: string) => {
    const mood = moods.find(m => m.id === moodId);
    return mood ? mood.name : '';
  };

  const getMoodEmoji = (moodId: string) => {
    const mood = moods.find(m => m.id === moodId);
    return mood ? mood.emoji : '';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>🐼 小熊猫的心情日记</Text>
          <Text style={styles.subtitle}>记录每天的心情</Text>
        </View>

        <View style={styles.todaySection}>
          <Text style={styles.sectionTitle}>今天的心情</Text>
          <View style={styles.moodGrid}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodItem,
                  selectedMood === mood.id && styles.selectedMood
                ]}
                onPress={() => selectMood(mood.id)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={styles.moodName}>{mood.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {todayMood && (
          <View style={styles.noteSection}>
            <Text style={styles.noteTitle}>添加备注</Text>
            <TouchableOpacity 
              style={styles.notePlaceholder}
              onPress={() => setShowNoteModal(true)}
            >
              <Ionicons name="create" size={20} color="#636E72" />
              <Text style={styles.notePlaceholderText}>
                {moodNote || '记录一下今天的心情...'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>最近的心情</Text>
          {loading ? (
            <Text style={styles.loadingText}>加载中...</Text>
          ) : recentMoods.length > 0 ? (
            recentMoods.map((item, index) => (
              <View key={index} style={styles.moodCard}>
                <View style={styles.moodCardHeader}>
                  <Text style={styles.moodCardDate}>
                    {new Date(item.created_at).toLocaleDateString('zh-CN')}
                  </Text>
                  <Text style={styles.moodCardEmoji}>
                    {getMoodEmoji(item.mood_description)}
                  </Text>
                </View>
                <Text style={styles.moodCardNote}>{item.notes || '无备注'}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>还没有心情记录，快来记录今天的心情吧！</Text>
          )}
        </View>

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>💡 小贴士</Text>
          <Text style={styles.tipsText}>
            记录每天的心情可以帮助你们更好地了解彼此，分享快乐，分担烦恼。
          </Text>
        </View>
      </ScrollView>

      {/* 备注输入模态框 */}
      <Modal
        visible={showNoteModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNoteModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>记录今天的心情</Text>
            <Text style={styles.modalSubtitle}>
              选择的心情: {moods.find(m => m.id === selectedMood)?.name}
            </Text>
            
            <TextInput
              style={styles.noteInput}
              placeholder="写下今天的心情感受..."
              value={moodNote}
              onChangeText={setMoodNote}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowNoteModal(false)}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveMood}
              >
                <Text style={styles.saveButtonText}>保存</Text>
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
  },
  scrollContent: {
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
  todaySection: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 16,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodItem: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedMood: {
    backgroundColor: '#FFE5E5',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodName: {
    fontSize: 12,
    color: '#636E72',
    fontWeight: '500',
  },
  noteSection: {
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
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 16,
  },
  notePlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderStyle: 'dashed',
  },
  notePlaceholderText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#636E72',
  },
  recentSection: {
    marginBottom: 20,
  },
  moodCard: {
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
  moodCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moodCardDate: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '500',
  },
  moodCardEmoji: {
    fontSize: 20,
  },
  moodCardNote: {
    fontSize: 16,
    color: '#2D3436',
    lineHeight: 22,
  },
  tips: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD93D',
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
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#636E72',
    marginBottom: 20,
    textAlign: 'center',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    marginBottom: 24,
    backgroundColor: '#F8F9FA',
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
