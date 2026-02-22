'use client';

import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Check } from 'lucide-react';

const FIELDS = [
  { id: 'vault_openrouter_key', label: 'OpenRouter API Key', placeholder: 'sk-or-...' },
  { id: 'vault_github_token', label: 'GitHub Token', placeholder: 'ghp_...' },
];

export default function VaultSection() {
  const [open, setOpen] = useState(false);
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
    <div className="border-t border-gray-800">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2 text-xs text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
      >
        <span className="flex items-center gap-2"><Key className="h-3 w-3" /> Vault</span>
        <span>{open ? '▾' : '▸'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          {FIELDS.map(f => (
            <div key={f.id}>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs text-gray-400">{f.label}</span>
                {values[f.id] && <span className="h-1.5 w-1.5 rounded-full bg-green-500 ml-1" />}
              </div>
              <div className="flex gap-1">
                <input
                  type={show[f.id] ? 'text' : 'password'}
                  value={values[f.id] ?? ''}
                  onChange={e => setValues(v => ({ ...v, [f.id]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none focus:border-gray-500 min-w-0"
                />
                <button
                  onClick={() => setShow(s => ({ ...s, [f.id]: !s[f.id] }))}
                  className="p-1 text-gray-500 hover:text-white"
                >
                  {show[f.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-1 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs text-white rounded transition-colors"
          >
            {saved ? <><Check className="h-3 w-3 text-green-400" /> Saved</> : 'Save All'}
          </button>
        </div>
      )}
    </div>
  );
}
