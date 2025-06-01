// app/chat.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, API_ENDPOINTS } from '../config/api';
import { apiGet, apiPost } from '../services/api';

interface ForumMessage {
  id: number;
  content: string;
  user: {
    id: number;
    full_name: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = '@chat_messages';

export default function CommunityChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Mesajları AsyncStorage'dan yükle
  const loadMessagesFromStorage = useCallback(async () => {
    try {
      const storedMessages = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (err) {
      console.error('Mesajlar yüklenirken hata:', err);
    }
  }, []);

  // Mesajları AsyncStorage'a kaydet
  const saveMessagesToStorage = useCallback(async (newMessages: ForumMessage[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
    } catch (err) {
      console.error('Mesajlar kaydedilirken hata:', err);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const { data, error } = await apiGet(API_ENDPOINTS.FORUM_MESSAGES);
      if (error) {
        setError(error);
        console.log('API Hatası:', error);
        return;
      }
      if (Array.isArray(data)) {
        const sortedMessages = data.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setMessages(sortedMessages);
        await saveMessagesToStorage(sortedMessages);
      }
    } catch (err) {
      setError('Mesajlar yüklenirken bir hata oluştu');
      console.error('Mesaj yükleme hatası:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [saveMessagesToStorage]);

  useEffect(() => {
    loadMessagesFromStorage();
    fetchMessages();
    // 10 saniyede bir mesajları güncelle
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [fetchMessages, loadMessagesFromStorage]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = async () => {
    if (inputText.trim().length === 0) return;

    try {
      const { data, error } = await apiPost(API_ENDPOINTS.FORUM_MESSAGES, {
        content: inputText.trim(),
      });
      if (error) {
        setError(error);
        console.log('API Hatası:', error);
        return;
      }
      if (data) {
        const newMessages = [data, ...messages];
        setMessages(newMessages);
        await saveMessagesToStorage(newMessages);
      }
      setInputText('');
    } catch (err) {
      setError('Mesaj gönderilirken bir hata oluştu');
      console.error('Mesaj gönderme hatası:', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#006400" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchMessages}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Kısım: Başlık */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Demlenme Vakti</Text>
      </View>

      {/* Açıklama */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          Çiftçi Yoldaşların dertleştiği, fikir alışverişi yaptığı ve birbirine omuz verdiği paylaşım alanı.
        </Text>
      </View>

      {/* Mesaj Listesi */}
      <FlatList
        data={messages}
        inverted
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.username}>{item?.user?.full_name || item?.user?.name || 'Kullanıcı'}</Text>
            <Text style={styles.messageText}>{item?.content || ''}</Text>
            <Text style={styles.time}>
              {item?.created_at ? new Date(item.created_at).toLocaleString('tr-TR') : ''}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.messagesList}
      />

      {/* Mesaj Giriş Alanı */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mesajınızı yazın..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Gönder</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 20,
    color: '#000000',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  descriptionContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  descriptionText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexGrow: 1,
  },
  messageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    marginVertical: 4,
    alignSelf: 'flex-start',
    maxWidth: '80%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#006400',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#000000',
  },
  time: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#006400',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#006400',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
