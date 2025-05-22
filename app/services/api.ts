import { API_URL, API_ENDPOINTS } from '../config/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function getAuthHeader() {
  const token = await AsyncStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers,
    });
    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error.message };
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
    return { error: error.message };
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
    return { error: error.message };
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
    return { error: error.message };
  }
} 