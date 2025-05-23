// app/chat.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
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

export default function CommunityChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await apiGet(API_ENDPOINTS.FORUM_MESSAGES);
    if (error) {
      setError(error);
      console.log('API Hatası:', error);
      setLoading(false);
      return;
    }
    if (
      data &&
      typeof data === 'object' &&
      !Array.isArray(data) &&
      'id' in data &&
      'content' in data &&
      'user' in data &&
      'created_at' in data &&
      'updated_at' in data
    ) {
      setMessages(prev => [...prev, data as ForumMessage]);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (inputText.trim().length === 0) return;

    const { data, error } = await apiPost(API_ENDPOINTS.FORUM_MESSAGES, {
      content: inputText.trim(),
    });
    if (error) {
      setError(error);
      console.log('API Hatası:', error);
      return;
    }
    if (
      data &&
      typeof data === 'object' &&
      !Array.isArray(data) &&
      'id' in data &&
      'content' in data &&
      'user' in data &&
      'created_at' in data &&
      'updated_at' in data
    ) {
      setMessages(prev => [...prev, data as ForumMessage]);
    }
    setInputText('');
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
        keyExtractor={(item, index) => (item && item.id ? item.id.toString() : index.toString())}
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
    justifyContent: 'flex-end',
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
  },
});
