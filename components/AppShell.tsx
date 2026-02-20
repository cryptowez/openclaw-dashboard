'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar
        selectedPriority={selectedPriority}
        onSelectPriority={setSelectedPriority}
      />
      <div className="flex-1">
        <Topbar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}