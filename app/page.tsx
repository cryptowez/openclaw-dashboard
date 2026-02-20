'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import AppShell from '@/components/AppShell';
import ImportGitModal from '@/components/ImportGitModal';
import AICommandBox from '@/components/AICommandBox';
import CodePreviewModal from '@/components/CodePreviewModal';

interface Project {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'blocked' | 'completed';
  lastAction: string;
  updated: string;
  priority: 'red' | 'orange' | 'blue' | 'green';
}

const DEMO_PROJECTS: Project[] = [
  {
    id: 'alpha',
    name: 'Project Alpha',
    status: 'active',
    lastAction: 'Deploy to production',
    updated: '2/20/2026, 6:30:00 AM',
    priority: 'red',
  },
  {
    id: 'beta',
    name: 'Project Beta',
    status: 'pending',
    lastAction: 'Code review',
    updated: '2/20/2026, 6:15:00 AM',
    priority: 'orange',
  },
  {
    id: 'gamma',
    name: 'Project Gamma',
    status: 'blocked',
    lastAction: 'Waiting for approval',
    updated: '2/20/2026, 6:00:00 AM',
    priority: 'blue',
  },
  {
    id: 'delta',
    name: 'Project Delta',
    status: 'completed',
    lastAction: 'Release v1.0.0',
    updated: '2/20/2026, 5:45:00 AM',
    priority: 'green',
  },
];

export default function Home() {
  const [projects, setProjects] = useState<Project[]>(DEMO_PROJECTS);
  const [importOpen, setImportOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [codePreviewOpen, setCodePreviewOpen] = useState(false);

  const handleImportProject = (repo: { owner: string; name: string }) => {
    const newProject: Project = {
      id: repo.name.toLowerCase(),
      name: repo.name,
      status: 'pending',
      lastAction: 'Imported from GitHub',
      updated: new Date().toLocaleString(),
      priority: 'blue',
    };
    setProjects([...projects, newProject]);
    setImportOpen(false);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setCodePreviewOpen(true);
  };

  const demoFiles = [
    {
      name: 'package.json',
      language: 'json',
      content: `{ "name": "${selectedProject?.name || 'project'}", "version": "1.0.0", "dependencies": { "react": "^18.2.0", "next": "^14.0.0" } }`,
    },
    {
      name: 'app/page.tsx',
      language: 'typescript',
      content: `'use client'; import { useState } from 'react'; export default function Home() { const [count, setCount] = useState(0); return ( <div className="p-8"> <h1>Welcome to ${selectedProject?.name || 'your project'}</h1> <button onClick={() => setCount(count + 1)}> Count: {count} </button> </div> ); }`,
    },
    {
      name: 'README.md',
      language: 'markdown',
      content: `# ${selectedProject?.name || 'Project'} This is your project dashboard. ## Features - AI-powered code generation - GitHub integration - Real-time collaboration ## Getting Started \`\`\`bash npm install npm run dev \`\`\``,
    },
  ];

  return (
    <AppShell>
      <div className="p-6">
        {/* Top Section */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-400">Usage</p>
            <p className="text-2xl font-bold">23.5K</p>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-400">Budget</p>
            <p className="text-2xl font-bold">100K</p>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <button
              onClick={() => setImportOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
            >
              Import
            </button>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded">
              Deploy
            </button>
          </div>
        </div>

        {/* AI Command Box */}
        {selectedProject && (
          <div className="mb-6">
            <AICommandBox projectName={selectedProject.name} onCommand={() => {}} />
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => handleProjectClick(project)}
              className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">{project.name}</h3>
                <span
                  className={`px-3 py-1 rounded text-xs font-semibold ${
                    project.status === 'active'
                      ? 'bg-green-900 text-green-300'
                      : project.status === 'pending'
                      ? 'bg-yellow-900 text-yellow-300'
                      : project.status === 'blocked'
                      ? 'bg-red-900 text-red-300'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-2">Last action: {project.lastAction}</p>
              <p className="text-gray-500 text-xs">Updated: {project.updated}</p>
            </button>
          ))}
        </div>

        {/* Master Log */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Master Log</h3>
          <div className="space-y-3">
            {[
              {
                time: '2/20/2026, 6:30:00 AM',
                bot: 'deployment-bot',
                action: 'deploy',
                message: 'Production deployment completed',
                color: 'bg-red-500',
              },
              {
                time: '2/20/2026, 6:15:00 AM',
                bot: 'code-review-bot',
                action: 'review',
                message: 'Code review requested',
                color: 'bg-orange-500',
              },
              {
                time: '2/20/2026, 6:00:00 AM',
                bot: 'approval-bot',
                action: 'approval',
                message: 'Waiting for manager approval',
                color: 'bg-blue-500',
              },
            ].map((log, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className={`w-3 h-3 rounded-full ${log.color} mt-1.5 flex-shrink-0`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-400">{log.time}</p>
                  <p className="text-white text-sm">
                    <span className="text-gray-500">• {log.bot}</span>
                    <span className="text-gray-400 mx-2">•</span>
                    <span className="text-gray-500">{log.action}</span>
                  </p>
                  <p className="text-white text-sm font-medium">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ImportGitModal isOpen={importOpen} onClose={() => setImportOpen(false)} />
      <CodePreviewModal
        isOpen={codePreviewOpen}
        onClose={() => setCodePreviewOpen(false)}
        projectName={selectedProject?.name || 'Project'}
        files={demoFiles}
      />
    </AppShell>
  );
}