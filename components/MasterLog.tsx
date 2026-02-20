import { Circle } from 'lucide-react';
import { masterLog } from '../lib/mock';

interface MasterLogProps {
  selectedPriority: string | null;
}

export default function MasterLog({ selectedPriority }: MasterLogProps) {
  const filteredLogs = selectedPriority
    ? masterLog.filter(log => log.priority === selectedPriority)
    : masterLog;

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
      <h2 className="text-xl font-semibold mb-4">Master Log</h2>
      <div className="space-y-4">
        {filteredLogs.map((log, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 bg-gray-800 rounded"
          >
            <Circle
              className={`h-4 w-4 mt-1 text-${log.priority}-500`}
              fill="currentColor"
            />
            <div>
              <div className="flex gap-2 text-sm text-gray-400 mb-1">
                <span>{new Date(log.timestamp).toLocaleString()}</span>
                <span>•</span>
                <span>{log.agent}</span>
                <span>•</span>
                <span>{log.actionType}</span>
              </div>
              <div>{log.summary}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}