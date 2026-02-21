'use client';

import { OPENROUTER_MODELS, ModelKey, DEFAULT_MODEL } from '@/lib/openrouter';

interface ModelSelectorProps {
  value: ModelKey;
  onChange: (model: ModelKey) => void;
  disabled?: boolean;
}

// Grouped for a readable dropdown
const MODEL_GROUPS: { label: string; keys: ModelKey[] }[] = [
  {
    label: 'Fast / Low-cost',
    keys: ['claude-3-haiku', 'claude-3.5-haiku', 'gpt-4o-mini', 'gemini-flash-1.5'],
  },
  {
    label: 'Balanced',
    keys: ['claude-3.5-sonnet', 'gpt-4o', 'gemini-pro-1.5'],
  },
  {
    label: 'Powerful / Complex',
    keys: ['claude-3-opus', 'o3-mini', 'deepseek-r1', 'llama-3.1-70b'],
  },
];

export default function ModelSelector({ value, onChange, disabled }: ModelSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ModelKey)}
      disabled={disabled}
      className="bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500 disabled:opacity-50"
      title="Select AI model"
    >
      {MODEL_GROUPS.map((group) => (
        <optgroup key={group.label} label={group.label}>
          {group.keys.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
