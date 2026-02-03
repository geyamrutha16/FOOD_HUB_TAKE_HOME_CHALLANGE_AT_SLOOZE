'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm fixed">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">🍔 FoodHub</span>
          </Link>

          {user && (
            <div className="flex items-center space-x-8">
              <Link 
                href="/dashboard" 
                className={`font-medium transition ${isActive('/dashboard') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Dashboard
              </Link>
              <Link 
                href="/restaurants" 
                className={`font-medium transition ${isActive('/restaurants') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Restaurants
              </Link>
              <Link 
                href="/orders" 
                className={`font-medium transition ${isActive('/orders') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Orders
              </Link>
              {user.role === 'ADMIN' && (
                <Link 
                  href="/admin/payments" 
                  className={`font-medium transition ${isActive('/admin/payments') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Payments
                </Link>
              )}
            </div>
          )}

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="flex items-center space-x-2">
                  <Badge variant={user.role === 'ADMIN' ? 'danger' : user.role === 'MANAGER' ? 'success' : 'default'}>
                    {user.role}
                  </Badge>
                  <Badge variant="secondary">{user.country || 'GLOBAL'}</Badge>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 font-medium transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
