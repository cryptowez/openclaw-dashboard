// Updated AICommandBox.tsx

import React from 'react';

interface AICommandBoxProps {
  projectName: string;
  onCommand: (command: string, response: string) => void;
}

const AICommandBox: React.FC<AICommandBoxProps> = ({ projectName, onCommand }) => {
  const [selectedModel, setSelectedModel] = React.useState<string>('');
  const [input, setInput] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('https://api.example.com/data');
      const data = await response.json();
      onCommand(input, data);
      setInput('');
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <div className="flex gap-2 mb-3">
        <label className="text-sm text-gray-400">Model:</label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
        >
          <option value="model1">Model 1</option>
          <option value="model2">Model 2</option>
        </select>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Talk to AI for ${projectName}... (e.g., "Add dark mode", "Refactor this component")`}
          className="flex-1 bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-700"
        >
          {isLoading ? 'Loading...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default AICommandBox;