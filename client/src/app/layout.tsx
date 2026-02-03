'use client';

import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarSpacer } from '@/components/layout/SidebarSpacer';
import { ApolloWrapper } from '@/lib/apolloClient';
import { useAuth } from '@/hooks/useAuth';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { user, initialized } = useAuth();

  if (!initialized) return null;

  return (
    <html lang="en">
      <body>
        <ApolloWrapper>
          <Navbar />

          <div className="flex">
            {/* Sidebar ONLY when logged in */}
            {user && (
              <>
                <Sidebar />
                <SidebarSpacer />
              </>
            )}

            <main className="flex-1 pt-20 bg-gray-50 min-h-screen">
              {children}
              <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { fontSize: '14px' },
        }}
      />
            </main>
          </div>
        </ApolloWrapper>
      </body>
    </html>
  );
}
