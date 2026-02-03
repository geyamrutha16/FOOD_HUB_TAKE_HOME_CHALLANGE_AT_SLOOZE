'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('nick.fury@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  const handleLogin = async () => {
    setLoading(true); 
    try {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `mutation { login(email: "${email}", password: "${password}") { accessToken user { id email role country name } } }`,
        }),
      });

      const data = await response.json();

      if (data.errors) {
        setError(data.errors[0]?.message || 'Invalid credentials');
        return;
      }

      if (data.data && data.data.login) {
        login(data.data.login);
        toast.success(`Welcome back, ${data.data.login.user.name}! 🎉`);
        router.push('/dashboard');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (err) {
      toast.error('Login failed. Is the server running?');
    }finally {
    setLoading(false);       
  }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">🍔 FoodHub Login</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
          </div>

          {error && <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm">{error}</div>}

          <Button onClick={handleLogin} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600 space-y-1">
          <p>
            <strong>Test Accounts (all use password "password"):</strong>
          </p>
          <p><strong>Admin:</strong> nick.fury@example.com</p>
          <p><strong>Manager (India):</strong> captain.marvel@example.com</p>
          <p><strong>Manager (America):</strong> captain.america@example.com</p>
          <p><strong>Member (India):</strong> thanos@example.com, thor@example.com</p>
          <p><strong>Member (America):</strong> travis@example.com</p>
        </div>
      </Card>
    </div>
  );
}
