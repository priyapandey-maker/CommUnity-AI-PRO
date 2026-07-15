import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { users } from '../models/UserStore';
import { Role, User, UserResponse, AuthResponse } from '@community-ai/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = '1h';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    if (!Object.values(Role).includes(role)) {
      res.status(400).json({ error: 'Invalid role' });
      return;
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: uuidv4(),
      name,
      email,
      passwordHash,
      role: role as Role,
      createdAt: new Date(),
    };

    users.push(newUser);

    const userResponse: UserResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    const token = jwt.sign(userResponse, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const response: AuthResponse = { user: userResponse, token };
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error during registration' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Missing email or password' });
      return;
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const userResponse: UserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    const token = jwt.sign(userResponse, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const response: AuthResponse = { user: userResponse, token };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error during login' });
  }
};

export const logout = (req: Request, res: Response): void => {
  // In a stateless JWT setup, client handles removing the token.
  // We can just return success. If needed, a token blacklist could be implemented.
  res.status(200).json({ message: 'Logged out successfully' });
};

export const me = (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  res.status(200).json({ user: req.user });
};
