import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../lib/auth-context';
import { DatabaseService } from '../lib/database';

export default function CyclePage() {
  const { user } = useAuth();
  const [cycleRecords, setCycleRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [currentDate] = useState(new Date());
  
  // 设置状态
  const [settings, setSettings] = useState({
    averageCycleLength: 28,
    averagePeriodLength: 5,
    reminderDays: 3,
    enableReminders: true,
    enableSymptoms: true,
  });

  // 新记录状态
  const [newRecord, setNewRecord] = useState({
    cycleStartDate: new Date(),
    periodLength: 5,
    flow: 'medium', // light, medium, heavy
    symptoms: [],
    notes: '',
    mood: 'normal', // happy, normal, sad, irritable, anxious
  });

  // 症状选项
  const symptomOptions = [
    { id: 'cramps', name: '痛经', emoji: '😣', color: '#FF6B6B' },
    { id: 'bloating', name: '腹胀', emoji: '🤰', color: '#FFB347' },
    { id: 'fatigue', name: '疲劳', emoji: '😴', color: '#A8E6CF' },
    { id: 'headache', name: '头痛', emoji: '🤕', color: '#6C5CE7' },
    { id: 'backache', name: '腰痛', emoji: '🤸', color: '#4ECDC4' },
    { id: 'breast_tenderness', name: '乳房胀痛', emoji: '💕', color: '#FF8E8E' },
    { id: 'acne', name: '痘痘', emoji: '😤', color: '#FF6B6B' },
    { id: 'food_craving', name: '食欲变化', emoji: '🍫', color: '#FFD93D' },
  ];

  // 心情选项
  const moodOptions = [
    { id: 'happy', name: '开心', emoji: '😊', color: '#FFD93D' },
    { id: 'normal', name: '正常', emoji: '😐', color: '#4ECDC4' },
    { id: 'sad', name: '低落', emoji: '😔', color: '#6C5CE7' },
    { id: 'irritable', name: '易怒', emoji: '😤', color: '#FF6B6B' },
    { id: 'anxious', name: '焦虑', emoji: '😰', color: '#FFB347' },
  ];

  // 流量选项
  const flowOptions = [
    { id: 'light', name: '轻微', emoji: '💧', color: '#4ECDC4' },
    { id: 'medium', name: '中等', emoji: '💧💧', color: '#FFB347' },
    { id: 'heavy', name: '大量', emoji: '💧💧💧', color: '#FF6B6B' },
  ];

  useEffect(() => {
    if (user) {
      loadCycleRecords();
    }
  }, [user]);

  const loadCycleRecords = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const records = await DatabaseService.getCycleRecords(user.id);
      setCycleRecords(records || []);
    } catch (error) {
      console.error('加载月经记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCycleRecord = async () => {
    if (!user) return;

    try {
      await DatabaseService.addCycleRecord(user.id, {
        cycle_start_date: newRecord.cycleStartDate.toISOString().split('T')[0],
        cycle_length: settings.averageCycleLength,
        symptoms: newRecord.symptoms,
        notes: newRecord.notes,
      });

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Alert.alert('记录成功', '月经记录已保存！');
      setNewRecord({
        cycleStartDate: new Date(),
        periodLength: 5,
        flow: 'medium',
        symptoms: [],
        notes: '',
        mood: 'normal',
      });
      setShowAddModal(false);
      loadCycleRecords();
    } catch (error) {
      Alert.alert('错误', '保存失败，请重试');
    }
  };

  const toggleSymptom = (symptomId: string) => {
    setNewRecord(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptomId)
        ? prev.symptoms.filter(id => id !== symptomId)
        : [...prev.symptoms, symptomId]
    }));
  };

  // 计算统计数据
  const getStatistics = () => {
    if (cycleRecords.length < 2) return null;

    const sortedRecords = [...cycleRecords].sort((a, b) => 
      new Date(a.cycle_start_date).getTime() - new Date(b.cycle_start_date).getTime()
    );

    // 计算平均周期长度
    let totalCycleLength = 0;
    let cycleCount = 0;
    
    for (let i = 1; i < sortedRecords.length; i++) {
      const prevDate = new Date(sortedRecords[i-1].cycle_start_date);
      const currDate = new Date(sortedRecords[i].cycle_start_date);
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      totalCycleLength += diffDays;
      cycleCount++;
    }

    const averageCycleLength = Math.round(totalCycleLength / cycleCount);
    
    // 预测下次月经
    const lastRecord = sortedRecords[sortedRecords.length - 1];
    const lastDate = new Date(lastRecord.cycle_start_date);
    const nextPredictedDate = new Date(lastDate);
    nextPredictedDate.setDate(lastDate.getDate() + averageCycleLength);

    // 计算距离下次月经的天数
    const today = new Date();
    const daysUntilNext = Math.ceil((nextPredictedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return {
      averageCycleLength,
      nextPredictedDate,
      daysUntilNext,
      totalRecords: cycleRecords.length,
      isCurrentlyOnPeriod: daysUntilNext <= 0 && daysUntilNext > -7, // 假设月经持续7天
    };
  };

  const statistics = getStatistics();

  // 获取贴心提醒
  const getCareTips = () => {
    if (!statistics) return '开始记录你的月经周期，小熊猫会为你提供贴心的健康建议～';

    if (statistics.isCurrentlyOnPeriod) {
      return '月经期间要好好照顾自己哦！多喝温水，注意保暖，适当休息。小熊猫会一直陪着你～';
    }

    if (statistics.daysUntilNext <= 3 && statistics.daysUntilNext > 0) {
      return '月经即将来临，记得准备卫生用品，保持心情愉快，小熊猫会给你温暖的拥抱～';
    }

    if (statistics.daysUntilNext > 0 && statistics.daysUntilNext <= 14) {
      return '现在是排卵期，注意避孕措施。保持健康的生活方式，小熊猫为你加油～';
    }

    return '现在是安全期，但也要注意身体健康。规律作息，均衡饮食，小熊猫会一直关心你～';
  };

  const getPhaseInfo = () => {
    if (!statistics) return { phase: 'unknown', name: '未知', emoji: '❓', color: '#636E72' };

    const cycleDay = statistics.daysUntilNext > 0 ? 
      settings.averageCycleLength - statistics.daysUntilNext : 
      Math.abs(statistics.daysUntilNext);

    if (statistics.isCurrentlyOnPeriod) {
      return { phase: 'period', name: '月经期', emoji: '🩸', color: '#FF6B6B' };
    } else if (cycleDay >= 11 && cycleDay <= 17) {
      return { phase: 'ovulation', name: '排卵期', emoji: '🥚', color: '#FFD93D' };
    } else if (cycleDay >= 18 && cycleDay <= 28) {
      return { phase: 'luteal', name: '黄体期', emoji: '🌙', color: '#6C5CE7' };
    } else {
      return { phase: 'follicular', name: '卵泡期', emoji: '🌸', color: '#4ECDC4' };
    }
  };

  const phaseInfo = getPhaseInfo();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>🐼 小熊猫的生理周期</Text>
          <Text style={styles.subtitle}>关心她的健康</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => setShowSettingsModal(true)}
          >
            <Ionicons name="settings-outline" size={24} color="#636E72" />
          </TouchableOpacity>
        </View>

        {/* 当前状态卡片 */}
        <View style={styles.statusCard}>
          <View style={styles.phaseInfo}>
            <Text style={styles.phaseEmoji}>{phaseInfo.emoji}</Text>
            <View style={styles.phaseText}>
              <Text style={styles.phaseName}>{phaseInfo.name}</Text>
              <Text style={styles.phaseDescription}>
                {statistics ? `第${settings.averageCycleLength - statistics.daysUntilNext}天` : '开始记录'}
              </Text>
            </View>
          </View>
          
          {statistics && (
            <View style={styles.nextPeriodInfo}>
              <Text style={styles.nextPeriodLabel}>下次预计：</Text>
              <Text style={styles.nextPeriodDate}>
                {statistics.nextPredictedDate.toLocaleDateString()}
              </Text>
              <Text style={styles.daysUntilText}>
                {statistics.daysUntilNext > 0 ? `还有 ${statistics.daysUntilNext} 天` : '正在进行中'}
              </Text>
            </View>
          )}
        </View>

        {/* 统计信息 */}
        {statistics && (
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Ionicons name="calendar" size={20} color="#4ECDC4" />
              <Text style={styles.statLabel}>平均周期</Text>
              <Text style={styles.statValue}>{statistics.averageCycleLength} 天</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="analytics" size={20} color="#FF8E8E" />
              <Text style={styles.statLabel}>记录次数</Text>
              <Text style={styles.statValue}>{statistics.totalRecords} 次</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="trending-up" size={20} color="#6C5CE7" />
              <Text style={styles.statLabel}>规律性</Text>
              <Text style={styles.statValue}>
                {statistics.totalRecords >= 3 ? '良好' : '需要更多数据'}
              </Text>
            </View>
          </View>
        )}

        {/* 贴心提醒 */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💕 小熊猫的贴心提醒</Text>
          <Text style={styles.tipsText}>{getCareTips()}</Text>
        </View>

        {/* 快速记录按钮 */}
        <TouchableOpacity 
          style={styles.recordButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.recordText}>记录月经开始</Text>
        </TouchableOpacity>

        {/* 历史记录 */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>历史记录</Text>
          {loading ? (
            <Text style={styles.loadingText}>加载中...</Text>
          ) : cycleRecords.length > 0 ? (
            cycleRecords.slice(0, 5).map((record, index) => (
              <View key={record.id || index} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyDate}>
                    {new Date(record.cycle_start_date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.historyCycle}>
                    周期 {record.cycle_length} 天
                  </Text>
                </View>
                {record.symptoms && record.symptoms.length > 0 && (
                  <View style={styles.symptomsList}>
                    {record.symptoms.map((symptom, idx) => {
                      const symptomOption = symptomOptions.find(s => s.id === symptom);
                      return symptomOption ? (
                        <Text key={idx} style={styles.symptomTag}>
                          {symptomOption.emoji} {symptomOption.name}
                        </Text>
                      ) : null;
                    })}
                  </View>
                )}
                {record.notes && (
                  <Text style={styles.historyNotes}>{record.notes}</Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>还没有月经记录，快来记录第一次吧！</Text>
          )}
        </View>
      </ScrollView>

      {/* 添加记录模态框 */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>记录月经开始</Text>
            
            {/* 日期选择 */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>开始日期</Text>
              <Text style={styles.dateDisplay}>
                {newRecord.cycleStartDate.toLocaleDateString()}
              </Text>
            </View>

            {/* 流量选择 */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>流量</Text>
              <View style={styles.flowOptions}>
                {flowOptions.map(flow => (
                  <TouchableOpacity
                    key={flow.id}
                    style={[
                      styles.flowOption,
                      newRecord.flow === flow.id && styles.flowOptionActive
                    ]}
                    onPress={() => setNewRecord(prev => ({ ...prev, flow: flow.id }))}
                  >
                    <Text style={styles.flowEmoji}>{flow.emoji}</Text>
                    <Text style={styles.flowName}>{flow.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 症状选择 */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>症状（可选）</Text>
              <View style={styles.symptomsGrid}>
                {symptomOptions.map(symptom => (
                  <TouchableOpacity
                    key={symptom.id}
                    style={[
                      styles.symptomOption,
                      newRecord.symptoms.includes(symptom.id) && styles.symptomOptionActive
                    ]}
                    onPress={() => toggleSymptom(symptom.id)}
                  >
                    <Text style={styles.symptomEmoji}>{symptom.emoji}</Text>
                    <Text style={styles.symptomName}>{symptom.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 备注 */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>备注（可选）</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="记录一下感受..."
                value={newRecord.notes}
                onChangeText={(text) => setNewRecord(prev => ({ ...prev, notes: text }))}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={addCycleRecord}
              >
                <Text style={styles.saveButtonText}>保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* 设置模态框 */}
      <Modal
        visible={showSettingsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>设置</Text>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>平均周期长度</Text>
              <TextInput
                style={styles.settingInput}
                value={settings.averageCycleLength.toString()}
                onChangeText={(text) => setSettings(prev => ({ 
                  ...prev, 
                  averageCycleLength: parseInt(text) || 28 
                }))}
                keyboardType="numeric"
              />
              <Text style={styles.settingUnit}>天</Text>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>平均月经长度</Text>
              <TextInput
                style={styles.settingInput}
                value={settings.averagePeriodLength.toString()}
                onChangeText={(text) => setSettings(prev => ({ 
                  ...prev, 
                  averagePeriodLength: parseInt(text) || 5 
                }))}
                keyboardType="numeric"
              />
              <Text style={styles.settingUnit}>天</Text>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>提前提醒天数</Text>
              <TextInput
                style={styles.settingInput}
                value={settings.reminderDays.toString()}
                onChangeText={(text) => setSettings(prev => ({ 
                  ...prev, 
                  reminderDays: parseInt(text) || 3 
                }))}
                keyboardType="numeric"
              />
              <Text style={styles.settingUnit}>天</Text>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>启用提醒</Text>
              <Switch
                value={settings.enableReminders}
                onValueChange={(value) => setSettings(prev => ({ 
                  ...prev, 
                  enableReminders: value 
                }))}
                trackColor={{ false: '#E9ECEF', true: '#FF6B6B' }}
                thumbColor={settings.enableReminders ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>记录症状</Text>
              <Switch
                value={settings.enableSymptoms}
                onValueChange={(value) => setSettings(prev => ({ 
                  ...prev, 
                  enableSymptoms: value 
                }))}
                trackColor={{ false: '#E9ECEF', true: '#4ECDC4' }}
                thumbColor={settings.enableSymptoms ? '#fff' : '#f4f3f4'}
              />
            </View>

            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={() => setShowSettingsModal(false)}
            >
              <Text style={styles.saveButtonText}>确定</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  subtitle: {
    fontSize: 16,
    color: '#636E72',
  },
  settingsButton: {
    padding: 8,
  },
  statusCard: {
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
  phaseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  phaseEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  phaseText: {
    flex: 1,
  },
  phaseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
  },
  phaseDescription: {
    fontSize: 14,
    color: '#636E72',
  },
  nextPeriodInfo: {
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    paddingTop: 16,
  },
  nextPeriodLabel: {
    fontSize: 14,
    color: '#636E72',
  },
  nextPeriodDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  daysUntilText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '500',
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
  tipsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
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
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#FF6B6B',
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
  historySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 16,
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
  historyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  historyCycle: {
    fontSize: 14,
    color: '#636E72',
  },
  symptomsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  symptomTag: {
    fontSize: 12,
    color: '#636E72',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  historyNotes: {
    fontSize: 14,
    color: '#636E72',
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
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
  },
  dateDisplay: {
    fontSize: 16,
    color: '#636E72',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  flowOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flowOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  flowOptionActive: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFE5E5',
  },
  flowEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  flowName: {
    fontSize: 12,
    color: '#636E72',
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  symptomOption: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  symptomOptionActive: {
    borderColor: '#4ECDC4',
    backgroundColor: '#E5F9F6',
  },
  symptomEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  symptomName: {
    fontSize: 14,
    color: '#636E72',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    backgroundColor: '#F8F9FA',
    textAlignVertical: 'top',
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: '#2D3436',
    flex: 1,
  },
  settingInput: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    width: 60,
    textAlign: 'center',
    marginRight: 8,
  },
  settingUnit: {
    fontSize: 16,
    color: '#636E72',
  },
});
