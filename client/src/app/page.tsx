'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, Button } from '@/components/ui';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Card className="w-full max-w-md text-center">
        <div className="text-6xl mb-4">🍔</div>
        <h1 className="text-4xl font-bold mb-2">FoodHub</h1>
        <p className="text-gray-600 mb-6">Modern Food Ordering Platform with Role-Based Access Control</p>
        <Button onClick={() => router.push('/login')} className="w-full">
          Get Started
        </Button>
      </Card>
    </div>
  );
}
