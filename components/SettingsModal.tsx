'use client';

import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Check, Key } from 'lucide-react';

const FIELDS = [
  { id: 'vault_openrouter_key', label: 'OpenRouter API Key', placeholder: 'sk-or-...' },
  { id: 'vault_github_token', label: 'GitHub Personal Access Token', placeholder: 'ghp_...' },
];

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [show, setShow] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loaded: Record<string, string> = {};
    FIELDS.forEach(f => {
      loaded[f.id] = localStorage.getItem(f.id) ?? '';
    });
    setValues(loaded);
  }, []);

  const handleSave = () => {
    FIELDS.forEach(f => {
      if (values[f.id]) localStorage.setItem(f.id, values[f.id]);
      else localStorage.removeItem(f.id);
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#111] border border-gray-800 rounded-lg w-full max-w-md mx-4 p-6 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold text-base flex items-center gap-2">
            <Key className="h-4 w-4 text-gray-400" /> API Keys / Vault
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          {FIELDS.map(f => (
            <div key={f.id}>
              <div className="flex items-center gap-2 mb-1.5">
                <label className="text-xs text-gray-400">{f.label}</label>
                {values[f.id] && <span className="h-1.5 w-1.5 rounded-full bg-green-500" />}
              </div>
              <div className="flex gap-2">
                <input
                  type={show[f.id] ? 'text' : 'password'}
                  value={values[f.id] ?? ''}
                  onChange={e => setValues(v => ({ ...v, [f.id]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="flex-1 bg-[#0a0a0a] border border-gray-800 rounded px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-gray-600 min-w-0"
                />
                <button
                  onClick={() => setShow(s => ({ ...s, [f.id]: !s[f.id] }))}
                  className="p-1.5 text-gray-500 hover:text-white transition"
                  title={show[f.id] ? 'Hide' : 'Show'}
                >
                  {show[f.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="mt-6 w-full flex items-center justify-center gap-2 py-2 bg-white text-black text-xs font-semibold rounded hover:bg-gray-100 transition"
        >
          {saved ? <><Check className="h-3.5 w-3.5 text-green-600" /> Saved!</> : 'Save Keys'}
        </button>
      </div>
    </div>
  );
}
