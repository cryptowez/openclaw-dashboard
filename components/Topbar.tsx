'use client';

import { LayoutGrid, X, Settings } from 'lucide-react';
import { Tab } from './AppShell';
import { ModelKey } from '@/lib/openrouter';
import { OPENROUTER_MODELS } from '@/lib/openrouter';

interface TopbarProps {
  tabs: Tab[];
  activeTab: string;
  onTabSelect: (id: string) => void;
  onTabClose: (id: string) => void;
  model: ModelKey;
  onModelChange: (m: ModelKey) => void;
  onSettingsClick: () => void;
}

export default function Topbar({
  tabs,
  activeTab,
  onTabSelect,
  onTabClose,
  model,
  onModelChange,
  onSettingsClick,
}: TopbarProps) {
  return (
    <div className="h-10 flex-shrink-0 flex items-center bg-[#0d0d0d] border-b border-gray-800 px-2 gap-1 z-10">
      {/* Home tab */}
      <button
        onClick={() => onTabSelect('home')}
        className={`flex items-center gap-1.5 h-7 px-2.5 rounded text-xs transition ${
          activeTab === 'home'
            ? 'bg-gray-800 text-white border-b-2 border-cyan-400'
            : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
        }`}
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        <span className="font-medium">Home</span>
      </button>

      {/* Separator */}
      {tabs.length > 0 && <div className="w-px h-4 bg-gray-800 mx-1" />}

      {/* Project tabs */}
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`flex items-center gap-1.5 h-7 px-2.5 rounded text-xs cursor-pointer transition group ${
            activeTab === tab.id
              ? 'bg-gray-800 text-white border-b-2 border-cyan-400'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
          }`}
          onClick={() => onTabSelect(tab.id)}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
              activeTab === tab.id ? 'bg-cyan-400' : 'bg-gray-500'
            }`}
          />
          <span className="font-medium max-w-[120px] truncate">{tab.name}</span>
          <button
            onClick={e => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
            className="ml-0.5 opacity-0 group-hover:opacity-100 hover:text-white text-gray-500 transition"
            title="Close tab"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Model selector */}
      <select
        value={model}
        onChange={e => onModelChange(e.target.value as ModelKey)}
        className="bg-[#0d0d0d] border border-gray-800 rounded px-2 py-1 text-xs text-gray-300 focus:outline-none hover:border-gray-600 transition"
        title="Select AI model"
      >
        {Object.keys(OPENROUTER_MODELS).map(k => (
          <option key={k} value={k}>{k}</option>
        ))}
      </select>

      {/* Settings */}
      <button onClick={onSettingsClick} className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition" title="Settings">
        <Settings className="h-4 w-4" />
      </button>
    </div>
  );
}
