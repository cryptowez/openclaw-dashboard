'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Code, Eye, Rocket, Info, Bot, Copy } from 'lucide-react';
import { Project } from '@/types';
import { ModelKey, OPENROUTER_MODELS } from '@/lib/openrouter';
import { Message } from './AppShell';

interface ProjectWorkspaceProps {
  project: Project;
  messages: Message[];
  onAddMessage: (msg: Message) => void;
  model: ModelKey;
  onModelChange: (m: ModelKey) => void;
}

function makeId() {
  return Math.random().toString(36).slice(2);
}

export default function ProjectWorkspace({
  project,
  messages,
  onAddMessage,
  model,
  onModelChange,
}: ProjectWorkspaceProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const userMsg: Message = {
      id: makeId(),
      role: 'user',
      content: prompt.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };
    onAddMessage(userMsg);
    const sentPrompt = prompt.trim();
    setPrompt('');
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: project.name,
          command: sentPrompt,
          model,
          apiKey: typeof window !== 'undefined' ? localStorage.getItem('vault_openrouter_key') ?? '' : '',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Request failed');
      }

      const data = await res.json();
      const agentMsg: Message = {
        id: makeId(),
        role: 'agent',
        content: data.result ?? '',
        timestamp: new Date().toLocaleTimeString(),
      };
      onAddMessage(agentMsg);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      {/* Action bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#0d0d0d]">
        <span className="text-xs text-gray-400 font-mono">{project.name}</span>
        <div className="flex items-center gap-1">
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-gray-800 rounded transition">
            <Info className="h-3.5 w-3.5" />
          </button>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-gray-800 rounded transition">
            <Code className="h-3.5 w-3.5" />
            Code
          </button>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-gray-800 rounded transition">
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-cyan-900/60 text-cyan-300 hover:bg-cyan-800/60 border border-cyan-800 rounded transition">
            <Rocket className="h-3.5 w-3.5" />
            Deploy
          </button>
        </div>
      </div>

      {/* Chat log */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="text-gray-700 text-sm mb-2">No messages yet</div>
            <div className="text-gray-600 text-xs">
              Describe what you want to build or change below
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'agent' && (
              <div className="flex-shrink-0 h-6 w-6 rounded bg-gray-800 flex items-center justify-center mt-0.5">
                <Bot className="h-3.5 w-3.5 text-cyan-400" />
              </div>
            )}

            <div
              className={`max-w-[75%] ${
                msg.role === 'user'
                  ? 'bg-gray-800 text-white rounded-md px-3 py-2'
                  : 'text-gray-200'
              }`}
            >
              {/* Message content */}
              {msg.role === 'agent' ? (
                <AgentMessage content={msg.content} />
              ) : (
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              )}

              {/* Timestamp + copy */}
              <div className={`flex items-center gap-2 mt-1 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                <span className="text-[10px] text-gray-600">{msg.timestamp}</span>
                <button
                  onClick={() => copyText(msg.content)}
                  className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-gray-400 transition"
                  title="Copy"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-700 flex items-center justify-center mt-0.5">
                <span className="text-[10px] font-medium text-gray-300">U</span>
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 h-6 w-6 rounded bg-gray-800 flex items-center justify-center">
              <Bot className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            </div>
            <div className="text-gray-500 text-sm py-1">Working…</div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Pinned prompt bar */}
      <div className="flex-shrink-0 border-t border-gray-800 bg-[#0d0d0d] px-4 py-3">
        {error && <p className="text-xs text-red-400 mb-2">{error}</p>}
        <form onSubmit={handleSend} className="flex flex-col gap-2">
          <textarea
            ref={textareaRef}
            className="w-full bg-[#111] border border-gray-800 rounded px-3 py-2 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-gray-600 min-h-[72px]"
            placeholder="Describe what you want to build or change…"
            rows={3}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            disabled={isLoading}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select
                value={model}
                onChange={e => onModelChange(e.target.value as ModelKey)}
                disabled={isLoading}
                className="bg-[#111] border border-gray-800 rounded px-2 py-1 text-xs text-gray-400 focus:outline-none"
              >
                {Object.keys(OPENROUTER_MODELS).map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
              <span className="text-[10px] text-gray-700">Ctrl+Enter to send</span>
            </div>
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-xs font-semibold rounded hover:bg-gray-100 disabled:opacity-40 transition"
            >
              <Send className="h-3 w-3" />
              {isLoading ? 'Working…' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Agent Message renderer ───────────────────────────────────────────────────
function AgentMessage({ content }: { content: string }) {
  // Detect terminal command blocks: lines starting with $ or ✓ $
  const lines = content.split('\n');
  const blocks: { type: 'text' | 'cmd'; value: string }[] = [];
  let textBuffer: string[] = [];

  for (const line of lines) {
    if (/^\s*(\$|✓\s+\$|>\s)/.test(line)) {
      if (textBuffer.length > 0) {
        blocks.push({ type: 'text', value: textBuffer.join('\n') });
        textBuffer = [];
      }
      blocks.push({ type: 'cmd', value: line.trim() });
    } else {
      textBuffer.push(line);
    }
  }
  if (textBuffer.length > 0) {
    blocks.push({ type: 'text', value: textBuffer.join('\n') });
  }

  return (
    <div className="space-y-2">
      {blocks.map((block, i) =>
        block.type === 'cmd' ? (
          <div
            key={i}
            className="bg-gray-900 border border-gray-800 rounded px-3 py-1.5 font-mono text-xs text-green-400"
          >
            {block.value}
          </div>
        ) : (
          <p key={i} className="text-sm text-gray-200 whitespace-pre-wrap">
            {block.value}
          </p>
        )
      )}
    </div>
  );
}
