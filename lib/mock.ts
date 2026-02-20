export const projects = [
  {
    slug: 'project-alpha',
    name: 'Project Alpha',
    status: 'active',
    lastAction: 'Deploy to production',
    updatedAt: '2026-02-20T06:30:00Z'
  },
  {
    slug: 'project-beta',
    name: 'Project Beta',
    status: 'pending',
    lastAction: 'Code review',
    updatedAt: '2026-02-20T06:15:00Z'
  },
  {
    slug: 'project-gamma',
    name: 'Project Gamma',
    status: 'blocked',
    lastAction: 'Waiting for approval',
    updatedAt: '2026-02-20T06:00:00Z'
  },
  {
    slug: 'project-delta',
    name: 'Project Delta',
    status: 'completed',
    lastAction: 'Release v1.0.0',
    updatedAt: '2026-02-20T05:45:00Z'
  }
];

export const masterLog = [
  {
    timestamp: '2026-02-20T06:30:00Z',
    agent: 'deployment-bot',
    actionType: 'deploy',
    priority: 'red',
    summary: 'Production deployment completed',
    projectSlug: 'project-alpha'
  },
  {
    timestamp: '2026-02-20T06:15:00Z',
    agent: 'code-review-bot',
    actionType: 'review',
    priority: 'orange',
    summary: 'Code review requested',
    projectSlug: 'project-beta'
  },
  {
    timestamp: '2026-02-20T06:00:00Z',
    agent: 'approval-bot',
    actionType: 'approval',
    priority: 'blue',
    summary: 'Waiting for manager approval',
    projectSlug: 'project-gamma'
  },
  {
    timestamp: '2026-02-20T05:45:00Z',
    agent: 'release-bot',
    actionType: 'release',
    priority: 'green',
    summary: 'Version 1.0.0 released',
    projectSlug: 'project-delta'
  }
];

export const vaultKeys = [
  {
    key: 'GITHUB_TOKEN',
    present: true,
    source: 'environment',
    maskedValue: '••••'
  },
  {
    key: 'AWS_ACCESS_KEY',
    present: true,
    source: 'vault',
    maskedValue: '••••'
  },
  {
    key: 'DATABASE_URL',
    present: true,
    source: 'environment',
    maskedValue: '••••'
  }
];

export const protocolOutput = {
  lines: [
    'Analyzing deployment requirements...',
    'Validating configuration...',
    'Ready to proceed with deployment'
  ],
  json: {
    status: 'ready',
    checks: {
      config: true,
      dependencies: true,
      permissions: true
    },
    nextAction: 'deploy'
  }
};