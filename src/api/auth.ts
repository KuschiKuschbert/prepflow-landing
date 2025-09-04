import apiClient from './client';
import { tokenManager, userDataManager } from './config';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  businessType?: 'restaurant' | 'pub' | 'cafe' | 'food_truck';
  country?: string;
  currency?: string;
  taxSystem?: 'GST' | 'VAT' | 'Sales_Tax';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  businessType?: string;
  country: string;
  currency: string;
  taxSystem: string;
  isAdmin: boolean;
  emailVerified: boolean;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

const authAPI = {
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      
      if (response.data.success && response.data.data) {
        // Save token and user data
        await tokenManager.setToken(response.data.data.token);
        await userDataManager.setUserData(response.data.data.user);
      }
      
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || {
          code: 'NETWORK_ERROR',
          message: error.message || 'Network error occurred'
        }
      };
    }
  },

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', data);
      
      if (response.data.success && response.data.data) {
        // Save token and user data
        await tokenManager.setToken(response.data.data.token);
        await userDataManager.setUserData(response.data.data.user);
      }
      
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || {
          code: 'NETWORK_ERROR',
          message: error.message || 'Network error occurred'
        }
      };
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless
      await tokenManager.removeToken();
      await userDataManager.removeUserData();
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<AuthResponse>('/auth/me');
      
      if (response.data.success && response.data.data) {
        const user = response.data.data.user;
        await userDataManager.setUserData(user);
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }
};

export default authAPI;
