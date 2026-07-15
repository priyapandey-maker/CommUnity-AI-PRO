export enum Role {
  CITIZEN = 'CITIZEN',
  AUTHORITY = 'AUTHORITY',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}
