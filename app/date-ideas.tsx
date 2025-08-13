import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DateIdeasPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: '全部', icon: '🌟' },
    { id: 'outdoor', name: '户外', icon: '🌳' },
    { id: 'indoor', name: '室内', icon: '🏠' },
    { id: 'food', name: '美食', icon: '🍽️' },
    { id: 'creative', name: '创意', icon: '🎨' },
    { id: 'romantic', name: '浪漫', icon: '💕' }
  ];

  const dateIdeas = [
    {
      id: 1,
      title: '一起看日出',
      description: '在海边或山顶一起看美丽的日出，感受新的一天的开始',
      category: 'outdoor',
      cost: '免费',
      duration: '2-3小时',
      difficulty: '简单',
      tags: ['浪漫', '自然', '拍照']
    },
    {
      id: 2,
      title: '一起做饭',
      description: '一起准备食材，做一顿浪漫的晚餐，享受烹饪的乐趣',
      category: 'indoor',
      cost: '100-200元',
      duration: '3-4小时',
      difficulty: '中等',
      tags: ['温馨', '美食', '互动']
    },
    {
      id: 3,
      title: 'DIY手工',
      description: '一起做陶艺、绘画或手工，创造属于你们的艺术品',
      category: 'creative',
      cost: '150-300元',
      duration: '2-3小时',
      difficulty: '简单',
      tags: ['创意', '艺术', '纪念']
    },
    {
      id: 4,
      title: '星空露营',
      description: '在郊外搭帐篷，一起看星星，享受宁静的夜晚',
      category: 'outdoor',
      cost: '200-400元',
      duration: '12小时',
      difficulty: '困难',
      tags: ['冒险', '自然', '浪漫']
    },
    {
      id: 5,
      title: '城市探索',
      description: '一起探索城市的小巷和隐藏景点，发现新的惊喜',
      category: 'outdoor',
      cost: '50-150元',
      duration: '4-6小时',
      difficulty: '简单',
      tags: ['探索', '城市', '发现']
    },
    {
      id: 6,
      title: '电影马拉松',
      description: '选择一系列电影，一起窝在沙发上度过温馨时光',
      category: 'indoor',
      cost: '50-100元',
      duration: '6-8小时',
      difficulty: '简单',
      tags: ['温馨', '放松', '娱乐']
    },
    {
      id: 7,
      title: '美食探店',
      description: '一起去尝试新的餐厅，品尝各种美食',
      category: 'food',
      cost: '200-500元',
      duration: '2-3小时',
      difficulty: '简单',
      tags: ['美食', '探索', '享受']
    },
    {
      id: 8,
      title: '温泉之旅',
      description: '一起去温泉度假村，放松身心，享受二人世界',
      category: 'romantic',
      cost: '500-1000元',
      duration: '24小时',
      difficulty: '中等',
      tags: ['放松', '浪漫', '奢华']
    }
  ];

  const filteredIdeas = selectedCategory === 'all' 
    ? dateIdeas 
    : dateIdeas.filter(idea => idea.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '简单': return '#4ECDC4';
      case '中等': return '#FFD93D';
      case '困难': return '#FF6B6B';
      default: return '#636E72';
    }
  };

  const getCostColor = (cost: string) => {
    if (cost === '免费') return '#4ECDC4';
    if (cost.includes('100')) return '#FFD93D';
    if (cost.includes('500')) return '#FF8E8E';
    return '#FF6B6B';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.pandaEmoji}>🐼</Text>
          <Text style={styles.title}>小熊猫的约会建议</Text>
          <Text style={styles.subtitle}>让每次约会都充满惊喜</Text>
        </View>

        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.selectedCategory
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryName,
                  selectedCategory === category.id && styles.selectedCategoryText
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.ideasContainer}>
          {filteredIdeas.map((idea) => (
            <View key={idea.id} style={styles.ideaCard}>
              <View style={styles.ideaHeader}>
                <Text style={styles.ideaTitle}>{idea.title}</Text>
                <View style={styles.ideaMeta}>
                  <View style={[styles.metaTag, { backgroundColor: getCostColor(idea.cost) }]}>
                    <Text style={styles.metaText}>{idea.cost}</Text>
                  </View>
                  <View style={[styles.metaTag, { backgroundColor: getDifficultyColor(idea.difficulty) }]}>
                    <Text style={styles.metaText}>{idea.difficulty}</Text>
                  </View>
                </View>
              </View>
              
              <Text style={styles.ideaDescription}>{idea.description}</Text>
              
              <View style={styles.ideaDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>⏰</Text>
                  <Text style={styles.detailText}>{idea.duration}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>🏷️</Text>
                  <Text style={styles.detailText}>{idea.tags.join(' · ')}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.likeButton}>
                <Ionicons name="heart-outline" size={20} color="#FF6B6B" />
                <Text style={styles.likeText}>喜欢这个想法</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.pandaTip}>
          <Text style={styles.tipTitle}>🐼 小熊猫的小贴士</Text>
          <Text style={styles.tipText}>
            选择约会活动时，要考虑对方的喜好和当天的天气。小熊猫建议从简单的开始，慢慢尝试更有挑战性的活动！
          </Text>
        </View>
      </ScrollView>
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
  pandaEmoji: {
    fontSize: 48,
    marginBottom: 16,
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
  categoriesContainer: {
    marginBottom: 25,
  },
  categoryButton: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCategory: {
    backgroundColor: '#FFE4B5',
    borderWidth: 2,
    borderColor: '#DEB887',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    color: '#636E72',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#8B4513',
    fontWeight: '600',
  },
  ideasContainer: {
    marginBottom: 20,
  },
  ideaCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  ideaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ideaTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    flex: 1,
    marginRight: 12,
  },
  ideaMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  metaTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metaText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  ideaDescription: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
    marginBottom: 16,
  },
  ideaDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#636E72',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  likeText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  pandaTip: {
    backgroundColor: '#FFE4B5',
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#DEB887',
    borderStyle: 'dashed',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 8,
    textAlign: 'center',
  },
  tipText: {
    fontSize: 14,
    color: '#A0522D',
    lineHeight: 20,
    textAlign: 'center',
  },
});
