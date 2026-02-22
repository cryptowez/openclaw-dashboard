'use client';

import { useState } from 'react';
import { GitPullRequest, Upload, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface GitFile {
  path: string;
  sha: string;
  size?: number;
}

interface GitOpsPanelProps {
  owner: string;
  repo: string;
  branch?: string;
  /** Optional pre-loaded content to push (e.g. from the code editor) */
  pendingChanges?: { path: string; content: string }[];
  onPullComplete?: (files: GitFile[]) => void;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function GitOpsPanel({
  owner,
  repo,
  branch = 'main',
  pendingChanges = [],
  onPullComplete,
}: GitOpsPanelProps) {
  const [pullStatus, setPullStatus] = useState<Status>('idle');
  const [pushStatus, setPushStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [commitMsg, setCommitMsg] = useState('');
  const [files, setFiles] = useState<GitFile[]>([]);

  const handlePull = async () => {
    setPullStatus('loading');
    setMessage('');
    try {
      const res = await fetch(
        `/api/git?action=list&owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&branch=${encodeURIComponent(branch)}&githubToken=${encodeURIComponent(typeof window !== 'undefined' ? localStorage.getItem('vault_github_token') ?? '' : '')}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Pull failed');
      setFiles(data.files);
      onPullComplete?.(data.files);
      setMessage(`✓ Fetched ${data.files.length} files${data.truncated ? ' (truncated)' : ''}`);
      setPullStatus('success');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Pull failed');
      setPullStatus('error');
    }
  };

  const handlePush = async () => {
    if (!commitMsg.trim()) {
      setMessage('Please enter a commit message.');
      return;
    }
    if (pendingChanges.length === 0) {
      setMessage('No pending changes to push.');
      return;
    }

    setPushStatus('loading');
    setMessage('');
    try {
      // Push each changed file sequentially
      for (const change of pendingChanges) {
        // Look up existing sha so GitHub accepts the update
        const existingFile = files.find((f) => f.path === change.path);
        const res = await fetch('/api/git', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'push',
            owner,
            repo,
            path: change.path,
            content: change.content,
            message: commitMsg,
            branch,
            sha: existingFile?.sha,
            githubToken: typeof window !== 'undefined' ? localStorage.getItem('vault_github_token') ?? '' : '',
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Push failed');
      }
      setMessage(`✓ Pushed ${pendingChanges.length} file(s) — commit: ${commitMsg}`);
      setCommitMsg('');
      setPushStatus('success');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Push failed');
      setPushStatus('error');
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2">
        <GitPullRequest className="h-5 w-5 text-blue-400" />
        <h3 className="font-semibold text-sm">
          Git Operations —{' '}
          <span className="font-mono text-gray-300">
            {owner}/{repo}
          </span>{' '}
          <span className="text-gray-500">({branch})</span>
        </h3>
      </div>

      {/* Pull */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePull}
          disabled={pullStatus === 'loading'}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded text-sm"
        >
          <RefreshCw className={`h-4 w-4 ${pullStatus === 'loading' ? 'animate-spin' : ''}`} />
          {pullStatus === 'loading' ? 'Pulling…' : 'Pull / Sync'}
        </button>
        {files.length > 0 && (
          <span className="text-xs text-gray-400">{files.length} files in tree</span>
        )}
      </div>

      {/* Push */}
      <div className="space-y-2">
        <input
          type="text"
          value={commitMsg}
          onChange={(e) => setCommitMsg(e.target.value)}
          placeholder="Commit message…"
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          disabled={pushStatus === 'loading'}
        />
        <button
          onClick={handlePush}
          disabled={pushStatus === 'loading' || pendingChanges.length === 0}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 rounded text-sm"
        >
          <Upload className={`h-4 w-4 ${pushStatus === 'loading' ? 'animate-pulse' : ''}`} />
          {pushStatus === 'loading'
            ? 'Pushing…'
            : `Push${pendingChanges.length > 0 ? ` (${pendingChanges.length})` : ''}`}
        </button>
      </div>

      {/* Status message */}
      {message && (
        <div
          className={`flex items-start gap-2 text-xs rounded px-3 py-2 ${
            pullStatus === 'error' || pushStatus === 'error'
              ? 'bg-red-900/50 text-red-300'
              : 'bg-green-900/50 text-green-300'
          }`}
        >
          {pullStatus === 'error' || pushStatus === 'error' ? (
            <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          ) : (
            <CheckCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          )}
          {message}
        </div>
      )}
    </div>
  );
}
