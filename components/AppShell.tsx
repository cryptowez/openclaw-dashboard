'use client';

import { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <div className="flex-1">{children}</div>
    </div>
  );
}