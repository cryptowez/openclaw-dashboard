import { vaultKeys } from '../lib/mock';

export default function VaultPanel() {
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
      <h2 className="text-xl font-semibold mb-6">Environment Variables</h2>
      <div className="space-y-4">
        {vaultKeys.map((key) => (
          <div
            key={key.key}
            className="flex items-center justify-between p-4 bg-gray-800 rounded"
          >
            <div>
              <div className="font-mono mb-1">{key.key}</div>
              <div className="text-sm text-gray-400">Source: {key.source}</div>
            </div>
            <div className="font-mono text-gray-400">{key.maskedValue}</div>
          </div>
        ))}
      </div>
    </div>
  );
}