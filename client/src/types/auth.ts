export type Role = 'CITIZEN' | 'AUTHORITY' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  department?: string; // For AUTHORITY users
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password?: string;
}
