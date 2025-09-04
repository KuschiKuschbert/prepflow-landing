import { create } from 'zustand';
import authAPI, { User, LoginData, RegisterData } from '../api/auth';
import { tokenManager, userDataManager } from '../api/config';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (data: LoginData) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (data) => {
    set({ isLoading: true, error: null });
    
    const response = await authAPI.login(data);
    
    if (response.success && response.data) {
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      return true;
    } else {
      set({
        isLoading: false,
        error: response.error?.message || 'Login failed'
      });
      return false;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    
    const response = await authAPI.register(data);
    
    if (response.success && response.data) {
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      return true;
    } else {
      set({
        isLoading: false,
        error: response.error?.message || 'Registration failed'
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    
    await authAPI.logout();
    
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    
    const token = await tokenManager.getToken();
    
    if (token) {
      const user = await authAPI.getCurrentUser();
      
      if (user) {
        set({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } else {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  },

  clearError: () => set({ error: null })
}));

export default useAuthStore;
