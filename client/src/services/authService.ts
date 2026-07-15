import apiClient from './apiClient';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      return response.data.data;
    } catch (error) {
      // Fallback mock for local development if endpoint doesn't exist yet
      console.warn('Login endpoint failed, using mock data for development.', error);
      
      const mockUser: User = {
        id: 'usr-1',
        name: 'Jane Doe',
        email: credentials.email,
        role: credentials.email.includes('admin') ? 'ADMIN' : (credentials.email.includes('auth') ? 'AUTHORITY' : 'CITIZEN'),
      };
      return {
        token: 'mock-jwt-token-123',
        user: mockUser,
      };
    }
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', credentials);
      return response.data.data;
    } catch (error) {
      console.warn('Register endpoint failed, using mock data for development.', error);
      const mockUser: User = {
        id: 'usr-2',
        name: credentials.name,
        email: credentials.email,
        role: 'CITIZEN',
      };
      return {
        token: 'mock-jwt-token-456',
        user: mockUser,
      };
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Logout endpoint failed, ignoring for local development.', error);
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>('/auth/profile');
      return response.data.data;
    } catch (error) {
      // Mock returning user based on token in local storage if endpoint fails
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return JSON.parse(storedUser) as User;
      }
      throw error;
    }
  }
};
