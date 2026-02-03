'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, Badge } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, initialized } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (initialized && !user) {
      router.push('/login');
    }
  }, [user, initialized, router]);

  if (!initialized) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Welcome, {user.name}! 👋</h1>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center space-x-4">
            <div className="text-4xl">👤</div>
            <div>
              <p className="text-gray-500 text-sm">Role</p>
              <Badge variant={user.role === 'ADMIN' ? 'danger' : 'success'}>{user.role}</Badge>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="text-4xl">🌍</div>
            <div>
              <p className="text-gray-500 text-sm">Country</p>
              <p className="text-xl font-bold">{user.country}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="text-4xl">📧</div>
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="text-sm font-mono">{user.email}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-bold mb-4">📋 Your Permissions</h2>
        <div className="space-y-2 text-sm">
          {user.role === 'ADMIN' && (
            <>
              <p>✅ View all restaurants in {user.country}</p>
              <p>✅ Create and manage orders</p>
              <p>✅ Checkout and pay for orders</p>
              <p>✅ Cancel orders</p>
              <p>✅ Manage payment methods</p>
            </>
          )}
          {user.role === 'MANAGER' && (
            <>
              <p>✅ View all restaurants in {user.country}</p>
              <p>✅ Create and manage orders</p>
              <p>✅ Checkout and pay for orders</p>
              <p>✅ Cancel orders</p>
              <p>❌ Cannot manage payment methods</p>
            </>
          )}
          {user.role === 'MEMBER' && (
            <>
              <p>✅ View all restaurants in {user.country}</p>
              <p>✅ Create orders</p>
              <p>❌ Cannot checkout (cannot pay)</p>
              <p>❌ Cannot cancel orders</p>
              <p>❌ Cannot manage payment methods</p>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
