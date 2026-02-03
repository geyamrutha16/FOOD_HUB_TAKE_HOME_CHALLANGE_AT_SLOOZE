'use client';

import { useAuth } from '@/hooks/useAuth';

export function SidebarSpacer() {
  const { user } = useAuth();

  if (!user) return null;

  return <div className="w-64" />;
}
