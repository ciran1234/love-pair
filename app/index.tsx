import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../lib/auth-context';

export default function HomePage() {
  const { user, signOut } = useAuth();

  const features = [
    { name: '笑话生成器', icon: 'happy', route: '/joke', color: '#FF6B6B', emoji: '😄' },
    { name: '月经周期', icon: 'calendar', route: '/cycle', color: '#4ECDC4', emoji: '📅' },
    { name: '互相Pin', icon: 'heart', route: '/pin', color: '#FF8E8E', emoji: '💕' },
    { name: '纪念日', icon: 'gift', route: '/anniversary', color: '#A8E6CF', emoji: '🎉' },
    { name: '心情日记', icon: 'sunny', route: '/mood', color: '#FFD93D', emoji: '😊' },
    { name: '愿望清单', icon: 'list', route: '/wishlist', color: '#6C5CE7', emoji: '📝' },
    { name: '小熊猫闹钟', icon: 'alarm', route: '/alarm', color: '#FFB347', emoji: '⏰' },
    { name: '情侣记账', icon: 'card', route: '/budget', color: '#A8E6CF', emoji: '💰' },
    { name: '约会建议', icon: 'restaurant', route: '/date-ideas', color: '#FF8E8E', emoji: '🍽️' },
    { name: '小熊猫相册', icon: 'images', route: '/gallery', color: '#6C5CE7', emoji: '📸' },
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
            <Text style={styles.userAvatar}>🐼</Text>
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
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionEmoji}>💕</Text>
              <Text style={styles.actionText}>我想你了</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionEmoji}>📸</Text>
              <Text style={styles.actionText}>拍照分享</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionEmoji}>🎵</Text>
              <Text style={styles.actionText}>分享音乐</Text>
            </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    fontSize: 32,
    marginRight: 12,
  },
  userText: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 14,
    color: '#A0522D',
  },
  signOutButton: {
    padding: 8,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#A0522D',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  featureCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  featureEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  featureText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  quickActions: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF8F0',
    borderRadius: 16,
    minWidth: 80,
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: '500',
    textAlign: 'center',
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
