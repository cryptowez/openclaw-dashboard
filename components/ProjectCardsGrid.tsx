import Link from 'next/link';
import { projects } from '../lib/mock';

export default function ProjectCardsGrid() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {projects.map((project) => (
        <Link
          key={project.slug}
          href={`/projects/${project.slug}`}
          className="p-6 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-700"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold">{project.name}</h3>
            <div className={`px-2 py-1 rounded text-sm ${
              project.status === 'active' ? 'bg-green-900 text-green-300' :
              project.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
              project.status === 'blocked' ? 'bg-red-900 text-red-300' :
              'bg-gray-800 text-gray-300'
            }`}>
              {project.status}
            </div>
          </div>
          <div className="text-sm text-gray-400">Last action:</div>
          <div className="mb-4">{project.lastAction}</div>
          <div className="text-sm text-gray-400">
            Updated: {new Date(project.updatedAt).toLocaleString()}
          </div>
        </Link>
      ))}
    </div>
  );
}