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

interface ForumMessage {
  id: number;
  content: string;
  userId: number;
  username: string;
  createdAt: string;
  updatedAt: string;
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
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.FORUM_MESSAGES}`);
      if (!response.ok) {
        throw new Error('Mesajlar yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim().length === 0) return;

    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.FORUM_MESSAGES}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: inputText.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Mesaj gönderilirken bir hata oluştu');
      }

      const sentMessage = await response.json();
      setMessages(prev => [sentMessage, ...prev]);
      setInputText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
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
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.messageText}>{item.content}</Text>
            <Text style={styles.time}>{new Date(item.createdAt).toLocaleString('tr-TR')}</Text>
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
