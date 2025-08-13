import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [todayMood, setTodayMood] = useState<string | null>(null);

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

  const recentMoods = [
    { date: '今天', mood: 'happy', note: '今天很开心，因为和你在一起' },
    { date: '昨天', mood: 'love', note: '想你了' },
    { date: '前天', mood: 'calm', note: '平静的一天' }
  ];

  const selectMood = (moodId: string) => {
    setSelectedMood(moodId);
    setTodayMood(moodId);
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
          <Text style={styles.title}>😊 心情日记</Text>
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
            <View style={styles.notePlaceholder}>
              <Ionicons name="create" size={20} color="#636E72" />
              <Text style={styles.notePlaceholderText}>
                记录一下今天的心情...
              </Text>
            </View>
          </View>
        )}

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>最近的心情</Text>
          {recentMoods.map((item, index) => (
            <View key={index} style={styles.moodCard}>
              <View style={styles.moodCardHeader}>
                <Text style={styles.moodCardDate}>{item.date}</Text>
                <Text style={styles.moodCardEmoji}>{getMoodEmoji(item.mood)}</Text>
              </View>
              <Text style={styles.moodCardNote}>{item.note}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>💡 小贴士</Text>
          <Text style={styles.tipsText}>
            记录每天的心情可以帮助你们更好地了解彼此，分享快乐，分担烦恼。
          </Text>
        </View>
      </ScrollView>
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
});
