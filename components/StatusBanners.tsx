import { Shield, Focus, CheckSquare } from 'lucide-react';

export default function StatusBanners() {
  return (
    <div className="flex gap-4">
      <div className="flex items-center gap-2 px-4 py-2 bg-blue-900/50 text-blue-300 rounded">
        <Shield className="h-4 w-4" />
        <span>No Scope Drift</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-green-900/50 text-green-300 rounded">
        <Focus className="h-4 w-4" />
        <span>Single Task Mode</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-yellow-900/50 text-yellow-300 rounded">
        <CheckSquare className="h-4 w-4" />
        <span>Approval Required</span>
      </div>
    </div>
  );
}