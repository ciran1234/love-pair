import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Switch,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { useAuth } from '../lib/auth-context';
import { DatabaseService } from '../lib/database';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function LocationPage() {
  const { user } = useAuth();
  const [location, setLocation] = useState(null);
  const [partnerLocation, setPartnerLocation] = useState(null);
  const [isSharing, setIsSharing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    if (user) {
      checkLocationPermission();
      loadLocationData();
    }
  }, [user]);

  const checkLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status === 'granted');
    
    if (status !== 'granted') {
      Alert.alert(
        '位置权限',
        '需要位置权限来共享你的位置，请在设置中开启位置权限。',
        [
          { text: '取消', style: 'cancel' },
          { text: '去设置', onPress: () => Location.requestForegroundPermissionsAsync() }
        ]
      );
    }
  };

  const loadLocationData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // 获取自己的位置数据
      const myLocation = await DatabaseService.getPartnerLocation(user.id);
      if (myLocation) {
        setLocation(myLocation);
        setIsSharing(myLocation.is_sharing);
      }

      // 获取伴侣的位置数据（这里暂时用同一个用户ID，实际应该获取伴侣的ID）
      const partnerLoc = await DatabaseService.getPartnerLocation(user.id);
      if (partnerLoc) {
        setPartnerLocation(partnerLoc);
      }
    } catch (error) {
      console.error('加载位置数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMyLocation = async () => {
    if (!user || !locationPermission) {
      Alert.alert('提示', '请先开启位置权限');
      return;
    }

    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const locationData = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        location_name: '当前位置',
        is_sharing: isSharing,
      };

      await DatabaseService.updateLocation(user.id, locationData);
      setLocation(locationData);

      // 触觉反馈
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      Alert.alert('成功', '位置已更新！');
    } catch (error) {
      console.error('更新位置失败:', error);
      Alert.alert('错误', '更新位置失败，请重试');
    }
  };

  const toggleLocationSharing = async (value: boolean) => {
    if (!user) return;

    try {
      await DatabaseService.toggleLocationSharing(user.id, value);
      setIsSharing(value);
      
      // 触觉反馈
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      Alert.alert(
        '位置共享',
        value ? '已开启位置共享' : '已关闭位置共享'
      );
    } catch (error) {
      console.error('切换位置共享失败:', error);
      Alert.alert('错误', '操作失败，请重试');
    }
  };

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // 地球半径（公里）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return '刚刚';
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小时前`;
    return `${Math.floor(diffInMinutes / 1440)}天前`;
  };

  const getLocationStatus = () => {
    if (!location) return '未设置位置';
    if (!isSharing) return '位置共享已关闭';
    return '位置共享中';
  };

  const getPartnerStatus = () => {
    if (!partnerLocation) return '伴侣未设置位置';
    if (!partnerLocation.is_sharing) return '伴侣已关闭位置共享';
    return '伴侣位置可见';
  };

  const distance = location && partnerLocation && isSharing && partnerLocation.is_sharing
    ? getDistance(
        location.latitude, location.longitude,
        partnerLocation.latitude, partnerLocation.longitude
      )
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 头部 */}
        <View style={styles.header}>
          <Text style={styles.title}>🐼 小熊猫的位置共享</Text>
          <Text style={styles.subtitle}>安全的位置追踪</Text>
        </View>

        {/* 位置共享开关 */}
        <View style={styles.sharingCard}>
          <View style={styles.sharingHeader}>
            <Ionicons name="location" size={24} color="#8B4513" />
            <Text style={styles.sharingTitle}>位置共享</Text>
          </View>
          <View style={styles.sharingContent}>
            <Text style={styles.sharingStatus}>{getLocationStatus()}</Text>
            <Switch
              value={isSharing}
              onValueChange={toggleLocationSharing}
              trackColor={{ false: '#DEB887', true: '#FF8E8E' }}
              thumbColor={isSharing ? '#8B4513' : '#8B4513'}
            />
          </View>
        </View>

        {/* 我的位置 */}
        <View style={styles.locationCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="person" size={20} color="#8B4513" />
            <Text style={styles.cardTitle}>我的位置</Text>
          </View>
          {location ? (
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>
                纬度: {location.latitude.toFixed(6)}
              </Text>
              <Text style={styles.locationText}>
                经度: {location.longitude.toFixed(6)}
              </Text>
              <Text style={styles.locationText}>
                位置: {location.location_name || '当前位置'}
              </Text>
              <Text style={styles.locationText}>
                更新时间: {getTimeAgo(location.last_updated)}
              </Text>
            </View>
          ) : (
            <Text style={styles.noLocationText}>暂无位置信息</Text>
          )}
          <TouchableOpacity
            style={styles.updateButton}
            onPress={updateMyLocation}
            disabled={!locationPermission}
          >
            <Ionicons name="refresh" size={16} color="white" />
            <Text style={styles.updateButtonText}>更新位置</Text>
          </TouchableOpacity>
        </View>

        {/* 伴侣位置 */}
        <View style={styles.locationCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="heart" size={20} color="#8B4513" />
            <Text style={styles.cardTitle}>伴侣位置</Text>
          </View>
          {partnerLocation ? (
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>
                纬度: {partnerLocation.latitude.toFixed(6)}
              </Text>
              <Text style={styles.locationText}>
                经度: {partnerLocation.longitude.toFixed(6)}
              </Text>
              <Text style={styles.locationText}>
                位置: {partnerLocation.location_name || '当前位置'}
              </Text>
              <Text style={styles.locationText}>
                更新时间: {getTimeAgo(partnerLocation.last_updated)}
              </Text>
              {distance !== null && (
                <Text style={styles.distanceText}>
                  距离: {distance.toFixed(2)} 公里
                </Text>
              )}
            </View>
          ) : (
            <Text style={styles.noLocationText}>{getPartnerStatus()}</Text>
          )}
        </View>

        {/* 距离信息 */}
        {distance !== null && (
          <View style={styles.distanceCard}>
            <Text style={styles.distanceTitle}>💕 你们之间的距离</Text>
            <Text style={styles.distanceValue}>{distance.toFixed(2)} 公里</Text>
            <Text style={styles.distanceDescription}>
              {distance < 1 ? '你们很近呢！' : 
               distance < 10 ? '距离适中，可以经常见面～' : 
               '虽然距离有点远，但心是相连的！'}
            </Text>
          </View>
        )}

        {/* 地图预览 */}
        <TouchableOpacity
          style={styles.mapPreview}
          onPress={() => setShowMapModal(true)}
          activeOpacity={0.8}
        >
          <View style={styles.mapPreviewHeader}>
            <Ionicons name="map" size={24} color="#8B4513" />
            <Text style={styles.mapPreviewTitle}>查看地图</Text>
          </View>
          <Text style={styles.mapPreviewText}>
            点击查看详细地图和路线
          </Text>
        </TouchableOpacity>

        {/* 安全提示 */}
        <View style={styles.safetyCard}>
          <Text style={styles.safetyTitle}>🔒 安全提示</Text>
          <Text style={styles.safetyText}>
            • 位置共享仅对伴侣可见{'\n'}
            • 可以随时关闭位置共享{'\n'}
            • 位置数据经过加密保护{'\n'}
            • 建议在安全环境下使用
          </Text>
        </View>

        {/* 小熊猫贴士 */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>🐼 小熊猫的小贴士</Text>
          <Text style={styles.tipsText}>
            位置共享让你们更安心，但记得尊重彼此的隐私哦！小熊猫建议在需要的时候才开启位置共享～
          </Text>
        </View>
      </ScrollView>

      {/* 地图模态框 */}
      <Modal
        visible={showMapModal}
        animationType="slide"
        onRequestClose={() => setShowMapModal(false)}
      >
        <View style={styles.mapModal}>
          <View style={styles.mapModalHeader}>
            <Text style={styles.mapModalTitle}>位置地图</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowMapModal(false)}
            >
              <Ionicons name="close" size={24} color="#8B4513" />
            </TouchableOpacity>
          </View>
          <View style={styles.mapContainer}>
            <Text style={styles.mapPlaceholder}>
              🗺️ 地图功能开发中...{'\n'}
              这里将显示详细的地图视图
            </Text>
          </View>
        </View>
      </Modal>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B4513',
    opacity: 0.8,
  },
  sharingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sharingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sharingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B4513',
    marginLeft: 12,
  },
  sharingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sharingStatus: {
    fontSize: 16,
    color: '#8B4513',
  },
  locationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B4513',
    marginLeft: 12,
  },
  locationInfo: {
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#8B4513',
    marginBottom: 4,
  },
  noLocationText: {
    fontSize: 14,
    color: '#8B4513',
    opacity: 0.6,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF8E8E',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  updateButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    marginLeft: 6,
  },
  distanceText: {
    fontSize: 16,
    color: '#FF8E8E',
    fontWeight: '600',
    marginTop: 8,
  },
  distanceCard: {
    backgroundColor: '#FFE4B5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  distanceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 8,
  },
  distanceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF8E8E',
    marginBottom: 8,
  },
  distanceDescription: {
    fontSize: 14,
    color: '#8B4513',
    textAlign: 'center',
    lineHeight: 20,
  },
  mapPreview: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mapPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mapPreviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B4513',
    marginLeft: 12,
  },
  mapPreviewText: {
    fontSize: 14,
    color: '#8B4513',
    opacity: 0.6,
  },
  safetyCard: {
    backgroundColor: '#DEB887',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 8,
  },
  safetyText: {
    fontSize: 14,
    color: '#8B4513',
    lineHeight: 20,
  },
  tipsCard: {
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
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#8B4513',
    lineHeight: 20,
  },
  mapModal: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  mapModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#DEB887',
  },
  mapModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  closeButton: {
    padding: 8,
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  mapPlaceholder: {
    fontSize: 18,
    color: '#8B4513',
    textAlign: 'center',
    lineHeight: 28,
  },
});
