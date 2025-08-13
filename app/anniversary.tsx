import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AnniversaryPage() {
  const [anniversaries] = useState([
    {
      id: 1,
      title: '恋爱纪念日',
      date: new Date('2024-01-01'),
      type: 'love',
      description: '我们在一起的第一天'
    },
    {
      id: 2,
      title: '第一次约会',
      date: new Date('2024-01-15'),
      type: 'date',
      description: '第一次正式约会'
    }
  ]);

  const getDaysUntil = (date: Date) => {
    const today = new Date();
    const targetDate = new Date(date);
    targetDate.setFullYear(today.getFullYear());
    
    if (targetDate < today) {
      targetDate.setFullYear(today.getFullYear() + 1);
    }
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysSince = (date: Date) => {
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎉 纪念日</Text>
        <Text style={styles.subtitle}>记录我们的美好时光</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Ionicons name="heart" size={24} color="#FF6B6B" />
          <Text style={styles.statLabel}>恋爱天数</Text>
          <Text style={styles.statValue}>
            {getDaysSince(new Date('2024-01-01'))} 天
          </Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="calendar" size={24} color="#4ECDC4" />
          <Text style={styles.statLabel}>纪念日数量</Text>
          <Text style={styles.statValue}>{anniversaries.length} 个</Text>
        </View>
      </View>

      <View style={styles.anniversaryList}>
        {anniversaries.map((anniversary) => (
          <View key={anniversary.id} style={styles.anniversaryCard}>
            <View style={styles.anniversaryHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="heart" size={24} color="#FF6B6B" />
              </View>
              <View style={styles.anniversaryInfo}>
                <Text style={styles.anniversaryTitle}>{anniversary.title}</Text>
                <Text style={styles.anniversaryDate}>
                  {anniversary.date.toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.daysContainer}>
                <Text style={styles.daysText}>
                  {getDaysUntil(anniversary.date)}天
                </Text>
                <Text style={styles.daysLabel}>后</Text>
              </View>
            </View>
            <Text style={styles.anniversaryDescription}>
              {anniversary.description}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.addText}>添加纪念日</Text>
      </TouchableOpacity>

      <View style={styles.tips}>
        <Text style={styles.tipsTitle}>💡 小贴士</Text>
        <Text style={styles.tipsText}>
          记录重要的日子，比如第一次见面、第一次约会、表白日等。
        </Text>
      </View>
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
  anniversaryList: {
    marginBottom: 20,
  },
  anniversaryCard: {
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
  anniversaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  anniversaryInfo: {
    flex: 1,
  },
  anniversaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 4,
  },
  anniversaryDate: {
    fontSize: 14,
    color: '#636E72',
  },
  daysContainer: {
    alignItems: 'center',
  },
  daysText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  daysLabel: {
    fontSize: 12,
    color: '#636E72',
  },
  anniversaryDescription: {
    fontSize: 14,
    color: '#636E72',
    fontStyle: 'italic',
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
});
