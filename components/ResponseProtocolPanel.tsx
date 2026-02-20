import { protocolOutput } from '../lib/mock';

export default function ResponseProtocolPanel() {
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
      <h2 className="text-xl font-semibold mb-6">Response Protocol</h2>
      <div className="space-y-6">
        <div className="space-y-2">
          {protocolOutput.lines.map((line, index) => (
            <div key={index} className="text-gray-300">{line}</div>
          ))}
        </div>
        <div className="font-mono bg-gray-800 p-4 rounded overflow-x-auto">
          <pre className="text-sm">
            {JSON.stringify(protocolOutput.json, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}