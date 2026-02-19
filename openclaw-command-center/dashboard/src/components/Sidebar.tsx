import React from 'react';

export function Sidebar({ active, onSelect }) {
  return (
    <nav className="sidebar">
      <button className={active === 'overview' ? 'active' : ''} onClick={() => onSelect('overview')}>Overview</button>
      <button className={active === 'projects' ? 'active' : ''} onClick={() => onSelect('projects')}>Projects</button>
      <button className={active === 'agents' ? 'active' : ''} onClick={() => onSelect('agents')}>Agents</button>
      <button className={active === 'automation' ? 'active' : ''} onClick={() => onSelect('automation')}>Automation</button>
      <button className={active === 'files' ? 'active' : ''} onClick={() => onSelect('files')}>Files</button>
    </nav>
  );
}