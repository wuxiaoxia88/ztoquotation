/**
 * 认证状态管理
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { authApi } from '@/services';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (username: string, password: string) => {
        try {
          const response = await authApi.login({ username, password });
          const { access_token, user } = response;
          
          // 保存token
          localStorage.setItem('access_token', access_token);
          
          set({
            user,
            token: access_token,
            isAuthenticated: true,
          });
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('access_token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      refreshUser: async () => {
        try {
          const user = await authApi.getCurrentUser();
          set({ user });
        } catch (error) {
          // Token可能已过期
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
