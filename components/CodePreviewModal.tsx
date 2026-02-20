'use client';

import { useState } from 'react';
import { X, Copy, Download } from 'lucide-react';

interface CodePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  files: { name: string; content: string; language: string }[];
}

export default function CodePreviewModal({ isOpen, onClose, projectName, files }: CodePreviewModalProps) {
  const [selectedFile, setSelectedFile] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen || files.length === 0) return null;

  const currentFile = files[selectedFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(currentFile.content));
    element.setAttribute('download', currentFile.name);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-lg w-[90%] h-[90%] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-700 p-4">
          <h2 className="text-xl font-semibold">{projectName} - Code Preview</h2>
          <button onClick={onClose} className="hover:bg-gray-800 p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          {/* File Tree */}
          <div className="w-64 border-r border-gray-700 bg-gray-950 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-semibold mb-3 text-gray-300">Files</h3>
              {files.map((file, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedFile(idx)}
                  className={`block w-full text-left px-3 py-2 rounded mb-1 text-sm truncate ${
                    selectedFile === idx ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  {file.name}
                </button>
              ))}
            </div>
          </div>
          {/* Code Editor */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="flex gap-2 border-b border-gray-700 p-4 bg-gray-800">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
              >
                <Copy className="h-4 w-4" /> {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
              >
                <Download className="h-4 w-4" /> Download
              </button>
              <span className="ml-auto text-xs text-gray-400">{currentFile.language}</span>
            </div>
            {/* Code Content */}
            <div className="flex-1 overflow-auto bg-gray-900 p-4">
              <pre className="text-gray-300 text-xs font-mono whitespace-pre-wrap break-words">
                <code>{currentFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}