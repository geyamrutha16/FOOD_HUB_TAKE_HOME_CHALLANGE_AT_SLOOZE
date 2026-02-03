'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export function Sidebar() {
  const { user, initialized } = useAuth();

  if (!initialized || !user) return null;

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-16 pt-6">
      <nav className="space-y-2 px-4">
        <Link href="/dashboard" className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition">
          Dashboard
        </Link>
        <Link href="/restaurants" className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition">
          Restaurants
        </Link>
        <Link href="/orders" className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition">
          My Orders
        </Link>

        {user.role === 'ADMIN' && (
          <Link href="/admin/payments" className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition text-red-400">
            💳 Payment Methods (Admin)
          </Link>
        )}
      </nav>
    </aside>
  );
}
