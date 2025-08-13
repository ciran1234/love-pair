import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function CyclePage() {
  const [currentDate] = useState(new Date());
  const [cycleLength, setCycleLength] = useState(28);
  const [lastPeriod, setLastPeriod] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [records, setRecords] = useState([
    { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), type: 'period', note: '开始' },
  ]);

  const addPeriodRecord = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newRecord = {
      date: new Date(),
      type: 'period' as const,
      note: '开始'
    };
    setRecords([...records, newRecord]);
    setLastPeriod(new Date());
    Alert.alert('记录成功', '已记录今天的月经开始');
  };

  const getNextPeriodDate = () => {
    const nextDate = new Date(lastPeriod);
    nextDate.setDate(nextDate.getDate() + cycleLength);
    return nextDate;
  };

  const getDaysUntilNextPeriod = () => {
    const nextPeriod = getNextPeriodDate();
    const today = new Date();
    const diffTime = nextPeriod.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📅 月经周期</Text>
        <Text style={styles.subtitle}>关心她的健康</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={20} color="#4ECDC4" />
          <Text style={styles.infoLabel}>周期长度：</Text>
          <Text style={styles.infoValue}>{cycleLength} 天</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="time" size={20} color="#FF8E8E" />
          <Text style={styles.infoLabel}>下次预计：</Text>
          <Text style={styles.infoValue}>
            {getNextPeriodDate().toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="heart" size={20} color="#FF6B6B" />
          <Text style={styles.infoLabel}>还有：</Text>
          <Text style={styles.infoValue}>
            {getDaysUntilNextPeriod()} 天
          </Text>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.recordButton} onPress={addPeriodRecord}>
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.recordText}>记录今天开始</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tips}>
        <Text style={styles.tipsTitle}>💡 贴心提醒</Text>
        <Text style={styles.tipsText}>
          记得在月经期间多关心她，准备一些暖心的食物和用品。
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
  infoCard: {
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#636E72',
    marginLeft: 8,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  actionContainer: {
    marginBottom: 20,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  recordText: {
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
    borderLeftColor: '#4ECDC4',
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
