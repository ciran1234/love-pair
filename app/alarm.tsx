import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AlarmPage() {
  const [alarms, setAlarms] = useState([
    {
      id: 1,
      title: '早安小熊猫',
      time: '07:00',
      days: ['周一', '周二', '周三', '周四', '周五'],
      message: '早安！小熊猫想你了～',
      enabled: true,
      type: 'morning'
    },
    {
      id: 2,
      title: '午休提醒',
      time: '12:30',
      days: ['周一', '周二', '周三', '周四', '周五'],
      message: '午休时间到，记得休息哦！',
      enabled: true,
      type: 'noon'
    },
    {
      id: 3,
      title: '晚安小熊猫',
      time: '22:30',
      days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      message: '晚安，做个好梦～',
      enabled: false,
      type: 'night'
    }
  ]);

  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: '喝水提醒',
      time: '每2小时',
      message: '记得多喝水哦～',
      enabled: true
    },
    {
      id: 2,
      title: '运动提醒',
      time: '每天18:00',
      message: '该运动了，一起健康生活！',
      enabled: true
    }
  ]);

  const toggleAlarm = (id: number) => {
    setAlarms(alarms.map(alarm => 
      alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
    ));
  };

  const toggleReminder = (id: number) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'morning': return '🌅';
      case 'noon': return '☀️';
      case 'night': return '🌙';
      default: return '⏰';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'morning': return '#FFB347';
      case 'noon': return '#FFD93D';
      case 'night': return '#6C5CE7';
      default: return '#FF8E8E';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.pandaEmoji}>🐼</Text>
          <Text style={styles.title}>小熊猫闹钟</Text>
          <Text style={styles.subtitle}>温馨提醒，让爱不迟到</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏰ 定时闹钟</Text>
          {alarms.map((alarm) => (
            <View key={alarm.id} style={styles.alarmCard}>
              <View style={styles.alarmHeader}>
                <View style={styles.alarmInfo}>
                  <Text style={styles.alarmTypeIcon}>{getTypeIcon(alarm.type)}</Text>
                  <View style={styles.alarmText}>
                    <Text style={styles.alarmTitle}>{alarm.title}</Text>
                    <Text style={styles.alarmTime}>{alarm.time}</Text>
                    <Text style={styles.alarmDays}>{alarm.days.join(' ')}</Text>
                  </View>
                </View>
                <Switch
                  value={alarm.enabled}
                  onValueChange={() => toggleAlarm(alarm.id)}
                  trackColor={{ false: '#E0E0E0', true: getTypeColor(alarm.type) }}
                  thumbColor={alarm.enabled ? '#FFF' : '#FFF'}
                />
              </View>
              <Text style={styles.alarmMessage}>{alarm.message}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💝 贴心提醒</Text>
          {reminders.map((reminder) => (
            <View key={reminder.id} style={styles.reminderCard}>
              <View style={styles.reminderHeader}>
                <View style={styles.reminderInfo}>
                  <Text style={styles.reminderIcon}>💕</Text>
                  <View style={styles.reminderText}>
                    <Text style={styles.reminderTitle}>{reminder.title}</Text>
                    <Text style={styles.reminderTime}>{reminder.time}</Text>
                  </View>
                </View>
                <Switch
                  value={reminder.enabled}
                  onValueChange={() => toggleReminder(reminder.id)}
                  trackColor={{ false: '#E0E0E0', true: '#FF8E8E' }}
                  thumbColor={reminder.enabled ? '#FFF' : '#FFF'}
                />
              </View>
              <Text style={styles.reminderMessage}>{reminder.message}</Text>
            </View>
          ))}
        </View>

        <View style={styles.addButton}>
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addText}>添加新闹钟</Text>
        </View>

        <View style={styles.pandaTip}>
          <Text style={styles.tipTitle}>🐼 小熊猫的小贴士</Text>
          <Text style={styles.tipText}>
            设置温馨的闹钟提醒，让对方感受到你的关心。小熊猫最喜欢准时的小主人了！
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
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 16,
  },
  alarmCard: {
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
  alarmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  alarmInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alarmTypeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  alarmText: {
    flex: 1,
  },
  alarmTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 4,
  },
  alarmTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8E8E',
    marginBottom: 2,
  },
  alarmDays: {
    fontSize: 12,
    color: '#636E72',
  },
  alarmMessage: {
    fontSize: 14,
    color: '#636E72',
    fontStyle: 'italic',
  },
  reminderCard: {
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
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reminderIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  reminderText: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 4,
  },
  reminderTime: {
    fontSize: 14,
    color: '#636E72',
  },
  reminderMessage: {
    fontSize: 14,
    color: '#636E72',
    fontStyle: 'italic',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFB347',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#FFB347',
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
