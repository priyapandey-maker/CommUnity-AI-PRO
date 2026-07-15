import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { Button, Input } from '../../components';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ name, email, password });
      navigate('/');
    } catch (err) {
      // Error is handled in context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow border border-slate-200 dark:border-slate-700">
        <div>
          <div className="flex justify-center">
             <span className="w-10 h-10 rounded-md bg-primary-600 flex items-center justify-center shrink-0">
               <svg className="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm3 9a1 1 0 00-.707 1.707l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L11 12.586l-1.293-1.293A1 1 0 009 11z" clipRule="evenodd" />
               </svg>
             </span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <Input
              label="Full Name"
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="John Doe"
            />
            <Input
              label="Email Address"
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
