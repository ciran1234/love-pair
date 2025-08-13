import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function GalleryPage() {
  const [selectedAlbum, setSelectedAlbum] = useState('all');

  const albums = [
    { id: 'all', name: '全部', icon: '📸', count: 24 },
    { id: 'date', name: '约会', icon: '💕', count: 8 },
    { id: 'travel', name: '旅行', icon: '✈️', count: 6 },
    { id: 'daily', name: '日常', icon: '🏠', count: 10 }
  ];

  const photos = [
    {
      id: 1,
      url: 'https://via.placeholder.com/150x150/FFE4B5/8B4513?text=💕',
      title: '第一次约会',
      date: '2024-01-15',
      album: 'date',
      favorite: true
    },
    {
      id: 2,
      url: 'https://via.placeholder.com/150x150/FFE4B5/8B4513?text=🐼',
      title: '小熊猫咖啡厅',
      date: '2024-01-20',
      album: 'date',
      favorite: false
    },
    {
      id: 3,
      url: 'https://via.placeholder.com/150x150/FFE4B5/8B4513?text=🌅',
      title: '海边日出',
      date: '2024-01-25',
      album: 'travel',
      favorite: true
    },
    {
      id: 4,
      url: 'https://via.placeholder.com/150x150/FFE4B5/8B4513?text=🍽️',
      title: '一起做饭',
      date: '2024-01-30',
      album: 'daily',
      favorite: false
    },
    {
      id: 5,
      url: 'https://via.placeholder.com/150x150/FFE4B5/8B4513?text=🎬',
      title: '电影时光',
      date: '2024-02-05',
      album: 'date',
      favorite: false
    },
    {
      id: 6,
      url: 'https://via.placeholder.com/150x150/FFE4B5/8B4513?text=🎨',
      title: 'DIY手工',
      date: '2024-02-10',
      album: 'daily',
      favorite: true
    }
  ];

  const filteredPhotos = selectedAlbum === 'all' 
    ? photos 
    : photos.filter(photo => photo.album === selectedAlbum);

  const getAlbumIcon = (albumId: string) => {
    const album = albums.find(a => a.id === albumId);
    return album ? album.icon : '📸';
  };

  const getAlbumName = (albumId: string) => {
    const album = albums.find(a => a.id === albumId);
    return album ? album.name : '其他';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.pandaEmoji}>🐼</Text>
          <Text style={styles.title}>小熊猫相册</Text>
          <Text style={styles.subtitle}>记录我们的美好时光</Text>
        </View>

        <View style={styles.albumsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {albums.map((album) => (
              <TouchableOpacity
                key={album.id}
                style={[
                  styles.albumButton,
                  selectedAlbum === album.id && styles.selectedAlbum
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
                  {album.count}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>📸</Text>
            <Text style={styles.statLabel}>总照片</Text>
            <Text style={styles.statValue}>{photos.length}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>💕</Text>
            <Text style={styles.statLabel}>收藏</Text>
            <Text style={styles.statValue}>{photos.filter(p => p.favorite).length}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>📅</Text>
            <Text style={styles.statLabel}>相册</Text>
            <Text style={styles.statValue}>{albums.length - 1}</Text>
          </View>
        </View>

        <View style={styles.photosContainer}>
          <Text style={styles.sectionTitle}>
            {selectedAlbum === 'all' ? '📸 所有照片' : `${getAlbumIcon(selectedAlbum)} ${getAlbumName(selectedAlbum)}相册`}
          </Text>
          <View style={styles.photosGrid}>
            {filteredPhotos.map((photo) => (
              <View key={photo.id} style={styles.photoCard}>
                <Image source={{ uri: photo.url }} style={styles.photoImage} />
                <View style={styles.photoOverlay}>
                  <TouchableOpacity style={styles.favoriteButton}>
                    <Ionicons 
                      name={photo.favorite ? "heart" : "heart-outline"} 
                      size={20} 
                      color={photo.favorite ? "#FF6B6B" : "white"} 
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.photoInfo}>
                  <Text style={styles.photoTitle}>{photo.title}</Text>
                  <Text style={styles.photoDate}>{photo.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="camera" size={24} color="white" />
          <Text style={styles.addText}>拍照或添加照片</Text>
        </TouchableOpacity>

        <View style={styles.pandaTip}>
          <Text style={styles.tipTitle}>🐼 小熊猫的小贴士</Text>
          <Text style={styles.tipText}>
            多拍照记录美好时光，小熊猫建议定期整理照片，给重要的照片加上标签，这样以后回忆起来会更甜蜜哦！
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
  albumsContainer: {
    marginBottom: 25,
  },
  albumButton: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginRight: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 80,
  },
  selectedAlbum: {
    backgroundColor: '#FFE4B5',
    borderWidth: 2,
    borderColor: '#DEB887',
  },
  albumIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  albumName: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '500',
    marginBottom: 4,
  },
  selectedAlbumText: {
    color: '#8B4513',
    fontWeight: '600',
  },
  albumCount: {
    fontSize: 12,
    color: '#636E72',
  },
  selectedAlbumCount: {
    color: '#8B4513',
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
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
    color: '#636E72',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
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
    shadowColor: '#000',
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
    color: '#2D3436',
    marginBottom: 4,
  },
  photoDate: {
    fontSize: 12,
    color: '#636E72',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C5CE7',
    borderRadius: 16,
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
