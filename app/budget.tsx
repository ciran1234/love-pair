import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BudgetPage() {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      title: '电影票',
      amount: 120,
      category: 'entertainment',
      date: '2024-01-15',
      paidBy: '我',
      shared: true
    },
    {
      id: 2,
      title: '晚餐',
      amount: 200,
      category: 'food',
      date: '2024-01-14',
      paidBy: '她',
      shared: true
    },
    {
      id: 3,
      title: '打车费',
      amount: 50,
      category: 'transport',
      date: '2024-01-13',
      paidBy: '我',
      shared: true
    }
  ]);

  const [budget, setBudget] = useState({
    monthly: 2000,
    spent: 370,
    remaining: 1630
  });

  const categories = [
    { id: 'food', name: '餐饮', icon: '🍽️', color: '#FF8E8E' },
    { id: 'entertainment', name: '娱乐', icon: '🎬', color: '#6C5CE7' },
    { id: 'transport', name: '交通', icon: '🚗', color: '#4ECDC4' },
    { id: 'shopping', name: '购物', icon: '🛍️', color: '#FFD93D' },
    { id: 'gift', name: '礼物', icon: '🎁', color: '#FF6B6B' },
    { id: 'other', name: '其他', icon: '💡', color: '#A8E6CF' }
  ];

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : '💡';
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : '#A8E6CF';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : '其他';
  };

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const mySpent = transactions.filter(t => t.paidBy === '我').reduce((sum, t) => sum + t.amount, 0);
  const herSpent = transactions.filter(t => t.paidBy === '她').reduce((sum, t) => sum + t.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.pandaEmoji}>🐼</Text>
          <Text style={styles.title}>小熊猫记账本</Text>
          <Text style={styles.subtitle}>一起管理我们的爱情基金</Text>
        </View>

        <View style={styles.budgetCard}>
          <Text style={styles.budgetTitle}>💰 本月预算</Text>
          <View style={styles.budgetRow}>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>总预算</Text>
              <Text style={styles.budgetAmount}>¥{budget.monthly}</Text>
            </View>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>已花费</Text>
              <Text style={styles.budgetAmount}>¥{budget.spent}</Text>
            </View>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>剩余</Text>
              <Text style={styles.budgetAmount}>¥{budget.remaining}</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(budget.spent / budget.monthly) * 100}%` }]} />
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📊 支出统计</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>总支出</Text>
              <Text style={styles.summaryAmount}>¥{totalSpent}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>我支付</Text>
              <Text style={styles.summaryAmount}>¥{mySpent}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>她支付</Text>
              <Text style={styles.summaryAmount}>¥{herSpent}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 最近记录</Text>
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionHeader}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionIcon}>{getCategoryIcon(transaction.category)}</Text>
                  <View style={styles.transactionText}>
                    <Text style={styles.transactionTitle}>{transaction.title}</Text>
                    <Text style={styles.transactionCategory}>{getCategoryName(transaction.category)}</Text>
                    <Text style={styles.transactionDate}>{transaction.date}</Text>
                  </View>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={styles.amountText}>¥{transaction.amount}</Text>
                  <Text style={styles.paidByText}>{transaction.paidBy}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addText}>添加新记录</Text>
        </TouchableOpacity>

        <View style={styles.pandaTip}>
          <Text style={styles.tipTitle}>🐼 小熊猫的小贴士</Text>
          <Text style={styles.tipText}>
            一起记账可以让你们更好地规划未来，小熊猫建议AA制或者轮流支付，这样更公平哦！
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
  budgetCard: {
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
  budgetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 16,
    textAlign: 'center',
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  budgetItem: {
    alignItems: 'center',
    flex: 1,
  },
  budgetLabel: {
    fontSize: 12,
    color: '#636E72',
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 4,
  },
  summaryCard: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#636E72',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 16,
  },
  transactionCard: {
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
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  transactionText: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 12,
    color: '#636E72',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#636E72',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8E8E',
    marginBottom: 4,
  },
  paidByText: {
    fontSize: 12,
    color: '#636E72',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4ECDC4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#4ECDC4',
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
