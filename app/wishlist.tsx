import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WishlistPage() {
  const [wishes] = useState([
    {
      id: 1,
      title: '一起看日出',
      description: '在海边看美丽的日出',
      category: 'travel',
      completed: false,
      priority: 'high'
    },
    {
      id: 2,
      title: '一起做饭',
      description: '一起做一顿浪漫的晚餐',
      category: 'food',
      completed: false,
      priority: 'medium'
    },
    {
      id: 3,
      title: '一起旅行',
      description: '去一个我们都想去的地方',
      category: 'travel',
      completed: true,
      priority: 'high'
    }
  ]);

  const completedCount = wishes.filter(wish => wish.completed).length;
  const totalCount = wishes.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📝 愿望清单</Text>
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
        {wishes.map((wish) => (
          <View key={wish.id} style={styles.wishCard}>
            <View style={styles.wishHeader}>
              <View style={styles.wishInfo}>
                <View style={styles.categoryIcon}>
                  <Ionicons name="heart" size={20} color="#FF6B6B" />
                </View>
                <View style={styles.wishText}>
                  <Text style={styles.wishTitle}>{wish.title}</Text>
                  <Text style={styles.wishDescription}>{wish.description}</Text>
                </View>
              </View>
              <Ionicons 
                name={wish.completed ? "checkmark-circle" : "ellipse-outline"} 
                size={24} 
                color={wish.completed ? "#4ECDC4" : "#636E72"} 
              />
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.addText}>添加新愿望</Text>
      </TouchableOpacity>

      <View style={styles.tips}>
        <Text style={styles.tipsTitle}>💡 小贴士</Text>
        <Text style={styles.tipsText}>
          记录你们想一起做的事情，完成后勾选，让你们的爱情更有目标和期待！
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
});
