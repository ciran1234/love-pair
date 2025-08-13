import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../lib/auth-context';

export default function HomePage() {
  const { user, signOut } = useAuth();

  const features = [
    { name: '留言板', icon: 'chatbubbles', route: '/message-board', color: '#FF6B6B', emoji: '📋' },
    { name: '位置共享', icon: 'location', route: '/location', color: '#4ECDC4', emoji: '📍' },
    { name: '思念传递', icon: 'heart', route: '/pin', color: '#FF8E8E', emoji: '💕' },
    { name: '小熊猫相册', icon: 'images', route: '/gallery', color: '#6C5CE7', emoji: '📸' },
    { name: '月经周期', icon: 'calendar', route: '/cycle', color: '#A8E6CF', emoji: '📅' },
    { name: '心情日记', icon: 'sunny', route: '/mood', color: '#FFD93D', emoji: '😊' },
    { name: '纪念日', icon: 'gift', route: '/anniversary', color: '#FFB347', emoji: '🎉' },
    { name: '愿望清单', icon: 'list', route: '/wishlist', color: '#A8E6CF', emoji: '📝' },
    { name: '笑话生成器', icon: 'happy', route: '/joke', color: '#FF6B6B', emoji: '😄' },
    { name: '小熊猫闹钟', icon: 'alarm', route: '/alarm', color: '#4ECDC4', emoji: '⏰' },
    { name: '情侣记账', icon: 'card', route: '/budget', color: '#6C5CE7', emoji: '💰' },
    { name: '约会建议', icon: 'restaurant', route: '/date-ideas', color: '#FF8E8E', emoji: '🍽️' },
  ];

  const handleSignOut = () => {
    Alert.alert(
      '退出登录',
      '确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          style: 'destructive',
          onPress: () => signOut()
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 用户信息头部 */}
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Text style={styles.avatarEmoji}>🐼</Text>
            </View>
            <View style={styles.userText}>
              <Text style={styles.userName}>{user?.username || '小熊猫'}</Text>
              <Text style={styles.userStatus}>
                {user?.is_partner ? '你的小可爱' : '你的小主人'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color="#8B4513" />
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <Text style={styles.pandaEmoji}>🐼</Text>
          <Text style={styles.title}>小熊猫的恋爱日记</Text>
          <Text style={styles.subtitle}>我们的专属空间</Text>
        </View>

        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Link key={index} href={feature.route} asChild>
              <TouchableOpacity style={[styles.featureCard, { backgroundColor: feature.color }]}>
                <Text style={styles.featureEmoji}>{feature.emoji}</Text>
                <Text style={styles.featureText}>{feature.name}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>🐼 小熊猫的快速操作</Text>
          <View style={styles.actionButtons}>
            <Link href="/message-board" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionEmoji}>💬</Text>
                <Text style={styles.actionText}>留言板</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/location" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionEmoji}>📍</Text>
                <Text style={styles.actionText}>位置共享</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/gallery" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionEmoji}>📸</Text>
                <Text style={styles.actionText}>相册</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <View style={styles.pandaTip}>
          <Text style={styles.tipTitle}>🐼 小熊猫的小贴士</Text>
          <Text style={styles.tipText}>
            今天也要像小熊猫一样可爱，记得多关心对方哦！小熊猫最喜欢抱抱了～
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
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFE4B5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#DEB887',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  userText: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 14,
    color: '#A0522D',
  },
  signOutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFF8F0',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  pandaEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#A0522D',
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  featureCard: {
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
  featureEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  quickActions: {
    backgroundColor: '#FFE4B5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 16,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '500',
    textAlign: 'center',
  },
  pandaTip: {
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
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#8B4513',
    lineHeight: 20,
  },
});
