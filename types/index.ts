export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: 'active' | 'pending' | 'blocked' | 'completed';
  lastAction: string;
  updated: string;
  priority: 'red' | 'orange' | 'blue' | 'green';
  type: 'new' | 'git';
  gitUrl?: string;
  files?: Array<{
    name: string;
    path: string;
    type: 'file' | 'directory';
    content?: string;
  }>;
  previewUrl?: string;
}