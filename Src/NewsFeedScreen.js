import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fontSize, { moderateScale } from './utils/metrix';

export default function NewsFeedScreen() {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [skeleton, setSkeleton] = useState(true);

  const API_KEY = '37ba564d6cc14a0e87b851d193951f00';
  const BASE_URL = `https://newsapi.org/v2/everything?domains=techcrunch.com&sortBy=publishedAt&apiKey=${API_KEY}`;

  const fetchArticles = async (pageNum = 1, isRefresh = false) => {
    setLoading(true);
    const query = search.trim().length >= 3 ? `&q=${search.trim()}` : '';
    const url = `${BASE_URL}${query}&page=${pageNum}&pageSize=10`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const fresh = data.articles || [];
      if (fresh.length === 0 && search.trim()) {
        Alert.alert('No results found', 'Try a different keyword.');
      }
      const updated = isRefresh ? fresh : [...articles, ...fresh];
      setArticles(updated);
      await AsyncStorage.setItem('@articles', JSON.stringify(updated));
      setSkeleton(false);
    } catch (err) {
      const cached = await AsyncStorage.getItem('@articles');
      if (cached) {
        setArticles(JSON.parse(cached));
        Alert.alert('Offline Mode', 'You are offline. Showing cached articles.');
      } else {
        Alert.alert('Error', 'Unable to load articles.');
      }
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const loadMore = () => {
    if (!loading) {
      const next = page + 1;
      setPage(next);
      fetchArticles(next);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchArticles(1, true);
  };

  const onSearch = () => {
    setPage(1);
    setSkeleton(true);
    fetchArticles(1, true);
  };

  const openLink = (url) => {
    Linking.openURL(url).catch((err) =>
      Alert.alert('Failed to open URL', err.message)
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openLink(item.url)}>
      {item.urlToImage && (
        <Image source={{ uri: item.urlToImage }} style={styles.image} />
      )}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.author}>{item.author}</Text>
      <Text style={styles.desc} numberOfLines={3}>
        {item.description}
      </Text>
      <Text style={styles.readMore}>Tap to Read Full Article</Text>
    </TouchableOpacity>
  );

  const skeletonItem = () => (
    <View style={styles.card}>
      <View style={[styles.image, { backgroundColor: '#ccc' }]} />
      <View style={[styles.line, { backgroundColor: '#ddd' }]} />
      <View style={[styles.lineSmall, { backgroundColor: '#eee' }]} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Smart News Feed</Text>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search in TechCrunch..."
          value={search}
          onChangeText={setSearch}
          style={[styles.searchBox, { flex: 1, marginRight: moderateScale(8) }]}
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {skeleton ? (
        Array.from({ length: 5 }).map((_, i) => (
          <View key={i}>{skeletonItem()}</View>
        ))
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={
            loading && <ActivityIndicator size="large" color="#0000ff" />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(10),
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: fontSize(24),
    fontWeight: 'bold',
    marginBottom: moderateScale(12),
    textAlign: 'center',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: moderateScale(10),
  },
  searchBox: {
    borderWidth: 1,
    padding: moderateScale(12),
    borderRadius: moderateScale(10),
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: 'black',
    width: moderateScale(100),
    height: moderateScale(45),
    borderRadius: moderateScale(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: fontSize(16),
  },
  card: {
    marginBottom: moderateScale(15),
    padding: moderateScale(12),
    borderRadius: moderateScale(12),
    backgroundColor: '#fff',
    elevation: 3,
  },
  image: {
    height: moderateScale(200),
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(10),
    backgroundColor: '#eee',
  },
  title: {
    fontWeight: 'bold',
    fontSize: fontSize(16),
    marginBottom: moderateScale(4),
    color: '#1a1a1a',
  },
  author: {
    fontSize: fontSize(12),
    color: '#666',
    marginBottom: moderateScale(5),
  },
  desc: {
    fontSize: fontSize(14),
    color: '#444',
    marginBottom: moderateScale(8),
  },
  readMore: {
    fontSize: fontSize(14),
    color: '#1e90ff',
    fontWeight: '500',
    textAlign: 'right',
  },
  line: {
    height: moderateScale(20),
    marginTop: moderateScale(10),
    borderRadius: moderateScale(5),
  },
  lineSmall: {
    height: moderateScale(15),
    width: '70%',
    marginTop: moderateScale(5),
    borderRadius: moderateScale(5),
  },
});
