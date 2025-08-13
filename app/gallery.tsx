import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../lib/auth-context';
import { DatabaseService } from '../lib/database';

export default function GalleryPage() {
  const { user } = useAuth();
  const [selectedAlbum, setSelectedAlbum] = useState('all');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    description: '',
    albumCategory: 'general',
  });

  const albums = [
    { id: 'all', name: '全部', icon: '📸', color: '#8B4513' },
    { id: 'date', name: '约会', icon: '💕', color: '#FF8E8E' },
    { id: 'travel', name: '旅行', icon: '✈️', color: '#4ECDC4' },
    { id: 'daily', name: '日常', icon: '🏠', color: '#FFB347' },
    { id: 'food', name: '美食', icon: '🍽️', color: '#A8E6CF' },
    { id: 'general', name: '其他', icon: '📷', color: '#6C5CE7' },
  ];

  useEffect(() => {
    if (user) {
      loadPhotos();
    }
  }, [user]);

  const loadPhotos = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await DatabaseService.getGalleryPhotos(user.id);
      setPhotos(data || []);
    } catch (error) {
      console.error('加载照片失败:', error);
      Alert.alert('错误', '加载照片失败');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPhotos();
    setRefreshing(false);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('权限', '需要相册权限来选择照片');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      // 这里应该上传到云存储，暂时使用本地URI
      const photoData = {
        title: newPhoto.title || '新照片',
        description: newPhoto.description || '',
        photo_url: result.assets[0].uri,
        album_category: newPhoto.albumCategory,
      };

      try {
        await DatabaseService.addGalleryPhoto(user.id, photoData);
        Alert.alert('成功', '照片添加成功！');
        setNewPhoto({ title: '', description: '', albumCategory: 'general' });
        setShowAddModal(false);
        loadPhotos();
      } catch (error) {
        console.error('添加照片失败:', error);
        Alert.alert('错误', '添加照片失败');
      }
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('权限', '需要相机权限来拍照');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const photoData = {
        title: newPhoto.title || '新照片',
        description: newPhoto.description || '',
        photo_url: result.assets[0].uri,
        album_category: newPhoto.albumCategory,
      };

      try {
        await DatabaseService.addGalleryPhoto(user.id, photoData);
        Alert.alert('成功', '照片添加成功！');
        setNewPhoto({ title: '', description: '', albumCategory: 'general' });
        setShowAddModal(false);
        loadPhotos();
      } catch (error) {
        console.error('添加照片失败:', error);
        Alert.alert('错误', '添加照片失败');
      }
    }
  };

  const togglePhotoFavorite = async (photoId: string, isFavorite: boolean) => {
    if (!user) return;

    try {
      await DatabaseService.togglePhotoFavorite(photoId, isFavorite);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      loadPhotos();
    } catch (error) {
      console.error('切换收藏失败:', error);
    }
  };

  const openPhotoDetail = async (photo: any) => {
    setSelectedPhoto(photo);
    setShowPhotoModal(true);
    
    // 加载评论
    try {
      const commentsData = await DatabaseService.getPhotoComments(photo.id);
      setComments(commentsData || []);
    } catch (error) {
      console.error('加载评论失败:', error);
    }
  };

  const addComment = async () => {
    if (!user || !selectedPhoto || !newComment.trim()) {
      Alert.alert('提示', '请输入评论内容');
      return;
    }

    try {
      await DatabaseService.addPhotoComment(selectedPhoto.id, user.id, newComment.trim());
      setNewComment('');
      
      // 重新加载评论
      const commentsData = await DatabaseService.getPhotoComments(selectedPhoto.id);
      setComments(commentsData || []);
      
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('添加评论失败:', error);
      Alert.alert('错误', '添加评论失败');
    }
  };

  const togglePhotoLike = async (photoId: string) => {
    if (!user) return;

    try {
      const isLiked = await DatabaseService.togglePhotoLike(photoId, user.id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      loadPhotos();
    } catch (error) {
      console.error('点赞失败:', error);
    }
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

  const getAlbumIcon = (albumId: string) => {
    const album = albums.find(a => a.id === albumId);
    return album ? album.icon : '📸';
  };

  const getAlbumName = (albumId: string) => {
    const album = albums.find(a => a.id === albumId);
    return album ? album.name : '其他';
  };

  const filteredPhotos = selectedAlbum === 'all' 
    ? photos 
    : photos.filter(photo => photo.album_category === selectedAlbum);

  const totalPhotos = photos.length;
  const favoritePhotos = photos.filter(p => p.is_favorite).length;
  const totalAlbums = albums.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 头部 */}
        <View style={styles.header}>
          <Text style={styles.title}>🐼 小熊猫的相册</Text>
          <Text style={styles.subtitle}>记录我们的美好时光</Text>
        </View>

        {/* 相册分类 */}
        <View style={styles.albumsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {albums.map((album) => (
              <TouchableOpacity
                key={album.id}
                style={[
                  styles.albumButton,
                  selectedAlbum === album.id && styles.selectedAlbum,
                  { backgroundColor: album.color }
                ]}
                onPress={() => setSelectedAlbum(album.id)}
              >
                <Text style={styles.albumIcon}>{album.icon}</Text>
                <Text style={[
                  styles.albumName,
                  selectedAlbum === album.id && styles.selectedAlbumText
                ]}>
                  {album.name}
                </Text>
                <Text style={[
                  styles.albumCount,
                  selectedAlbum === album.id && styles.selectedAlbumCount
                ]}>
                  {photos.filter(p => p.album_category === album.id).length}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 统计卡片 */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>📸</Text>
            <Text style={styles.statLabel}>总照片</Text>
            <Text style={styles.statValue}>{totalPhotos}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>💕</Text>
            <Text style={styles.statLabel}>收藏</Text>
            <Text style={styles.statValue}>{favoritePhotos}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>📅</Text>
            <Text style={styles.statLabel}>相册</Text>
            <Text style={styles.statValue}>{totalAlbums}</Text>
          </View>
        </View>

        {/* 照片网格 */}
        <View style={styles.photosContainer}>
          <Text style={styles.sectionTitle}>
            {selectedAlbum === 'all' ? '📸 所有照片' : `${getAlbumIcon(selectedAlbum)} ${getAlbumName(selectedAlbum)}相册`}
          </Text>
          {loading ? (
            <Text style={styles.loadingText}>加载中...</Text>
          ) : filteredPhotos.length > 0 ? (
            <View style={styles.photosGrid}>
              {filteredPhotos.map((photo) => (
                <TouchableOpacity
                  key={photo.id}
                  style={styles.photoCard}
                  onPress={() => openPhotoDetail(photo)}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: photo.photo_url }} style={styles.photoImage} />
                  <View style={styles.photoOverlay}>
                    <TouchableOpacity 
                      style={styles.favoriteButton}
                      onPress={() => togglePhotoFavorite(photo.id, !photo.is_favorite)}
                    >
                      <Ionicons 
                        name={photo.is_favorite ? "heart" : "heart-outline"} 
                        size={20} 
                        color={photo.is_favorite ? "#FF6B6B" : "white"} 
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.photoInfo}>
                    <Text style={styles.photoTitle}>{photo.title}</Text>
                    <Text style={styles.photoDate}>{getTimeAgo(photo.created_at)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📸</Text>
              <Text style={styles.emptyText}>还没有照片</Text>
              <Text style={styles.emptySubtext}>添加第一张照片吧！</Text>
            </View>
          )}
        </View>

        {/* 添加照片按钮 */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="camera" size={24} color="white" />
          <Text style={styles.addText}>拍照或添加照片</Text>
        </TouchableOpacity>

        {/* 小熊猫贴士 */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>🐼 小熊猫的小贴士</Text>
          <Text style={styles.tipsText}>
            多拍照记录美好时光，小熊猫建议定期整理照片，给重要的照片加上标签，这样以后回忆起来会更甜蜜哦！
          </Text>
        </View>
      </ScrollView>

      {/* 添加照片模态框 */}
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
          <View style={styles.addModal}>
            <Text style={styles.modalTitle}>添加新照片</Text>

            <TextInput
              style={styles.input}
              placeholder="照片标题"
              value={newPhoto.title}
              onChangeText={(text) => setNewPhoto({ ...newPhoto, title: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="照片描述（可选）"
              value={newPhoto.description}
              onChangeText={(text) => setNewPhoto({ ...newPhoto, description: text })}
              multiline
            />

            <View style={styles.albumSelector}>
              <Text style={styles.albumLabel}>选择相册：</Text>
              <View style={styles.albumOptions}>
                {albums.slice(1).map((album) => (
                  <TouchableOpacity
                    key={album.id}
                    style={[
                      styles.albumOption,
                      newPhoto.albumCategory === album.id && styles.albumOptionActive,
                      { backgroundColor: album.color }
                    ]}
                    onPress={() => setNewPhoto({ ...newPhoto, albumCategory: album.id })}
                  >
                    <Text style={styles.albumOptionText}>{album.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cameraButton]}
                onPress={takePhoto}
              >
                <Text style={styles.cameraButtonText}>拍照</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.galleryButton]}
                onPress={pickImage}
              >
                <Text style={styles.galleryButtonText}>相册</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* 照片详情模态框 */}
      <Modal
        visible={showPhotoModal}
        animationType="slide"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <View style={styles.photoModal}>
          <View style={styles.photoModalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPhotoModal(false)}
            >
              <Ionicons name="close" size={24} color="#8B4513" />
            </TouchableOpacity>
            <Text style={styles.photoModalTitle}>照片详情</Text>
            <View style={{ width: 24 }} />
          </View>

          {selectedPhoto && (
            <ScrollView style={styles.photoModalContent}>
              <Image source={{ uri: selectedPhoto.photo_url }} style={styles.photoModalImage} />
              
              <View style={styles.photoModalInfo}>
                <Text style={styles.photoModalTitle}>{selectedPhoto.title}</Text>
                {selectedPhoto.description && (
                  <Text style={styles.photoModalDescription}>{selectedPhoto.description}</Text>
                )}
                <Text style={styles.photoModalDate}>{getTimeAgo(selectedPhoto.created_at)}</Text>
              </View>

              {/* 点赞和收藏 */}
              <View style={styles.photoActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => togglePhotoLike(selectedPhoto.id)}
                >
                  <Ionicons name="heart-outline" size={20} color="#FF8E8E" />
                  <Text style={styles.actionText}>点赞</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => togglePhotoFavorite(selectedPhoto.id, !selectedPhoto.is_favorite)}
                >
                  <Ionicons 
                    name={selectedPhoto.is_favorite ? "bookmark" : "bookmark-outline"} 
                    size={20} 
                    color="#4ECDC4" 
                  />
                  <Text style={styles.actionText}>收藏</Text>
                </TouchableOpacity>
              </View>

              {/* 评论区域 */}
              <View style={styles.commentsSection}>
                <Text style={styles.commentsTitle}>💬 评论</Text>
                
                <View style={styles.addCommentContainer}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="添加评论..."
                    value={newComment}
                    onChangeText={setNewComment}
                    multiline
                  />
                  <TouchableOpacity
                    style={styles.addCommentButton}
                    onPress={addComment}
                  >
                    <Text style={styles.addCommentButtonText}>发送</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.commentsList}>
                  {comments.map((comment, index) => (
                    <View key={comment.id || index} style={styles.commentItem}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentAuthor}>
                          {comment.user_profiles?.username || '小熊猫'}
                        </Text>
                        <Text style={styles.commentTime}>
                          {getTimeAgo(comment.created_at)}
                        </Text>
                      </View>
                      <Text style={styles.commentText}>{comment.comment}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          )}
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
  albumsContainer: {
    marginBottom: 25,
  },
  albumButton: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    borderRadius: 16,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 70,
  },
  selectedAlbum: {
    transform: [{ scale: 1.05 }],
  },
  albumIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  albumName: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    marginBottom: 2,
  },
  selectedAlbumText: {
    fontWeight: 'bold',
  },
  albumCount: {
    fontSize: 10,
    color: 'white',
    opacity: 0.8,
  },
  selectedAlbumCount: {
    opacity: 1,
    fontWeight: 'bold',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statItem: {
    alignItems: 'center',
    marginBottom: 16,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#8B4513',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  photosContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 16,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photoImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  photoOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoInfo: {
    padding: 12,
  },
  photoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 4,
  },
  photoDate: {
    fontSize: 12,
    color: '#8B4513',
    opacity: 0.6,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#8B4513',
    marginTop: 40,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#8B4513',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8B4513',
    opacity: 0.6,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF8E8E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  addText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DEB887',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#8B4513',
    marginBottom: 16,
  },
  albumSelector: {
    marginBottom: 20,
  },
  albumLabel: {
    fontSize: 16,
    color: '#8B4513',
    marginBottom: 8,
  },
  albumOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  albumOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  albumOptionActive: {
    transform: [{ scale: 1.05 }],
  },
  albumOptionText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  cameraButton: {
    backgroundColor: '#4ECDC4',
  },
  galleryButton: {
    backgroundColor: '#FFB347',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#8B4513',
    fontWeight: '600',
  },
  cameraButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  galleryButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  photoModal: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  photoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#DEB887',
  },
  photoModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  closeButton: {
    padding: 8,
  },
  photoModalContent: {
    flex: 1,
  },
  photoModalImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  photoModalInfo: {
    padding: 20,
    backgroundColor: 'white',
  },
  photoModalDescription: {
    fontSize: 14,
    color: '#8B4513',
    opacity: 0.8,
    marginTop: 8,
    lineHeight: 20,
  },
  photoModalDate: {
    fontSize: 12,
    color: '#8B4513',
    opacity: 0.6,
    marginTop: 8,
  },
  photoActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#DEB887',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF8F0',
  },
  actionText: {
    fontSize: 14,
    color: '#8B4513',
    marginLeft: 6,
    fontWeight: '500',
  },
  commentsSection: {
    backgroundColor: 'white',
    padding: 20,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 16,
  },
  addCommentContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DEB887',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#8B4513',
    maxHeight: 80,
  },
  addCommentButton: {
    backgroundColor: '#FF8E8E',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  addCommentButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  commentsList: {
    gap: 12,
  },
  commentItem: {
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    padding: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
  },
  commentTime: {
    fontSize: 12,
    color: '#8B4513',
    opacity: 0.6,
  },
  commentText: {
    fontSize: 14,
    color: '#8B4513',
    lineHeight: 20,
  },
});
