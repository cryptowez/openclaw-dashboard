'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}