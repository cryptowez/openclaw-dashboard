'use client';

import { Copy } from 'lucide-react';

export default function Topbar() {
  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL || 'https://openclaw-dashboard-ioniq-ai.vercel.app/';
  const previewUrl = vercelUrl;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(previewUrl);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-8">
        <div>
          <div className="text-sm text-gray-400">Token Usage</div>
          <div className="font-mono">23.5K / 100K</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Last Command</div>
          <div className="font-mono">deploy --force</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="text-sm text-gray-400">Preview URL:</div>
        <div className="font-mono">{previewUrl}</div>
        <button
          onClick={copyToClipboard}
          className="p-2 hover:bg-gray-800 rounded"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}