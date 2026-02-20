import { useState } from 'react';
import { projects } from '../../../lib/mock';
import Tabs from '../../../components/Tabs';
import StatusBanners from '../../../components/StatusBanners';
import ResponseProtocolPanel from '../../../components/ResponseProtocolPanel';

interface Props {
  params: {
    slug: string;
  };
}

export default function ProjectPage({ params }: Props) {
  const project = projects.find(p => p.slug === params.slug);
  const tabs = ['Overview', 'Activity', 'Actions', 'Settings'];
  
  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="space-y-6">
      <StatusBanners />
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
        <h1 className="text-2xl font-bold mb-6">{project.name}</h1>
        <Tabs
          tabs={tabs}
          activeTab={tabs[0]}
          onTabChange={() => {}}
        />
        <div className="mt-6">
          <ResponseProtocolPanel />
        </div>
      </div>
    </div>
  );
}