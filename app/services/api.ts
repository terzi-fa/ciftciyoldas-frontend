import { API_URL, API_ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ApiResponse<T> {
  data?: T;
  error?: string;

}

async function getAuthHeader(): Promise<{ [key: string]: string }> {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: { ...headers },
    });
    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

export async function apiPost<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

export async function apiPut<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

export async function apiDelete<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
} 